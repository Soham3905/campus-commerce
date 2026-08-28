/**
 * Validation & Contract Engine for SDUI Components
 * Enforces parent-child constraints, allowed parents, placement bounds, unique IDs,
 * and produces actionable human-friendly rejection reasons.
 */

import { ComponentRegistry } from "../../registry/componentRegistry";

/**
 * Gets the list of allowed child types for a given parent type.
 * @param {string} parentType
 * @returns {Array<string>|null} List of allowed types or null if any child is allowed
 */
export function getAllowedChildren(parentType) {
  const def = ComponentRegistry[parentType];
  if (!def || def.canHaveChildren === false) return [];
  return def.allowedChildren || null;
}

/**
 * Checks whether a child component type or node can be added to a parent component.
 * Generic single-source-of-truth validation rule.
 *
 * @param {string|Object} parent - Parent type string or node object (pass the full node,
 *   not just its type, to get accurate maxChildren enforcement)
 * @param {string|Object} child - Child type string or node object
 * @param {Object} [options]
 * @param {string} [options.excludeChildId] - When checking a move within the same parent
 *   (reordering), exclude this existing child ID from the maxChildren count so the item
 *   being moved doesn't count against its own capacity.
 * @returns {{ valid: boolean, reason?: string }}
 */
export function canAddChild(parent, child, options = {}) {
  const parentNode = typeof parent === "object" && parent ? parent : null;
  const parentType = parentNode ? parentNode.type : parent;
  const childType = typeof child === "object" && child ? child.type : child;
  const { excludeChildId = null } = options;

  if (!parentType || !childType) {
    return { valid: false, reason: "Parent and child component types must be specified." };
  }

  const parentDef = ComponentRegistry[parentType];
  const childDef = ComponentRegistry[childType];

  if (!parentDef) {
    return { valid: false, reason: `Unknown parent component type "${parentType}".` };
  }
  if (!childDef) {
    return { valid: false, reason: `Unknown child component type "${childType}".` };
  }

  // 1. Check if parent can accept children at all
  if (parentDef.canHaveChildren === false) {
    return {
      valid: false,
      reason: `"${parentDef.label || parentType}" cannot contain child components.`,
    };
  }

  // 2. Check parent's allowedChildren list (if restricted)
  if (Array.isArray(parentDef.allowedChildren) && parentDef.allowedChildren.length > 0) {
    if (!parentDef.allowedChildren.includes(childType)) {
      return {
        valid: false,
        reason: `${childDef.label || childType} is not an allowed child of ${parentDef.label || parentType}.`,
      };
    }
  }

  // 3. Check parent's forbiddenChildren list (explicit exclusions, even when allowedChildren is permissive)
  if (Array.isArray(parentDef.forbiddenChildren) && parentDef.forbiddenChildren.includes(childType)) {
    return {
      valid: false,
      reason: `${childDef.label || childType} cannot be placed inside ${parentDef.label || parentType}.`,
    };
  }

  // 4. Check child's allowedParents list (if restricted)
  if (Array.isArray(childDef.allowedParents) && childDef.allowedParents.length > 0) {
    if (!childDef.allowedParents.includes(parentType)) {
      return {
        valid: false,
        reason: `${childDef.label || childType} can only be placed inside: [${childDef.allowedParents.join(", ")}].`,
      };
    }
  }

  // 5. Check parent's maxChildren capacity (only enforceable when the actual parent node,
  // with its current children, is passed rather than a bare type string)
  if (typeof parentDef.maxChildren === "number" && parentNode && Array.isArray(parentNode.children)) {
    const currentCount = parentNode.children.filter((c) => c.id !== excludeChildId).length;
    if (currentCount >= parentDef.maxChildren) {
      return {
        valid: false,
        reason: `${parentDef.label || parentType} can contain at most ${parentDef.maxChildren} item${parentDef.maxChildren === 1 ? "" : "s"} (already has ${currentCount}).`,
      };
    }
  }

  return { valid: true };
}

/**
 * Checks whether a drop operation is valid.
 * @param {string} draggedType - Type of component being dragged
 * @param {string} targetParentType - Type of parent receiving the drop
 * @param {'before'|'after'|'inside'} mode - Drop mode
 * @returns {{ valid: boolean, reason?: string }}
 */
export function canDrop(draggedType, targetParentType, mode = "inside") {
  return canAddChild(targetParentType, draggedType);
}

/**
 * Recursively finds the parent of a node by ID in a schema tree.
 */
function findParent(tree, id) {
  if (!tree || !id || tree.id === id) return null;
  if (Array.isArray(tree.children)) {
    const idx = tree.children.findIndex((c) => c.id === id);
    if (idx !== -1) return { parent: tree, index: idx };
    for (const child of tree.children) {
      const res = findParent(child, id);
      if (res) return res;
    }
  }
  return null;
}

/**
 * Intelligently resolves the optimal drop target and slot for dragging any component
 * onto the canvas or over an existing node.
 *
 * If dropping inside the target is valid, chooses 'inside'.
 * If dropping before/after the target is valid within its immediate parent, chooses that.
 * If the immediate parent cannot accept the child (e.g., hovering over Title inside ProductCard
 * while dragging a HeroBanner), automatically bubbles up the ancestor tree to find the nearest
 * valid parent (e.g. Page or Box), enabling smooth drag-and-drop anywhere without false rejections.
 *
 * @param {Object} rootTree - Full root schema tree
 * @param {Object} targetNode - The node directly hovered over
 * @param {string} draggedType - Type of component being dragged
 * @param {number} clientY - Cursor Y coordinate
 * @param {DOMRect} rect - Bounding rectangle of target element
 * @param {Object} [options] - Optional settings ({ excludeChildId })
 * @returns {{
 *   isValid: boolean,
 *   dropMode: 'before'|'inside'|'after',
 *   parentId: string,
 *   parentType: string,
 *   targetNodeId: string,
 *   afterIndex: number,
 *   label: string,
 *   reason?: string
 * }}
 */
export function resolveDropTarget(rootTree, targetNode, draggedType, clientY, rect, options = {}) {
  if (!targetNode || !draggedType) {
    return {
      isValid: false,
      dropMode: "inside",
      parentId: null,
      parentType: null,
      targetNodeId: null,
      afterIndex: 0,
      label: "Cannot drop here",
    };
  }

  const targetDef = ComponentRegistry[targetNode.type];
  const draggedDef = ComponentRegistry[draggedType];
  const draggedLabel = draggedDef?.label || draggedType;
  const targetLabel = targetDef?.label || targetNode.type;

  const height = rect?.height || 50;
  const offsetY = rect ? clientY - rect.top : height * 0.5;

  // 1. Can it be placed INSIDE the target node itself?
  const canGoInside =
    targetDef?.canHaveChildren !== false &&
    canAddChild(targetNode, draggedType, options).valid;

  // If inside is supported and cursor is within the central container zone
  if (canGoInside) {
    const isInsideZone =
      targetNode.type === "Home" ||
      targetNode.type === "Page" ||
      (offsetY >= height * 0.15 && offsetY <= height * 0.85);

    if (isInsideZone) {
      return {
        isValid: true,
        dropMode: "inside",
        parentId: targetNode.id,
        parentType: targetNode.type,
        targetNodeId: targetNode.id,
        afterIndex: (targetNode.children?.length || 0) - 1,
        label: `↳ Drop inside ${targetLabel}`,
      };
    }
  }

  // 2. Relative insertion (BEFORE or AFTER)
  const isBefore = offsetY < height * 0.5;
  const relativeMode = isBefore ? "before" : "after";

  // If targetNode is root (Home / Page) and cannot insert relative to root
  if (targetNode.type === "Home" || targetNode.type === "Page") {
    return {
      isValid: canGoInside,
      dropMode: "inside",
      parentId: targetNode.id,
      parentType: targetNode.type,
      targetNodeId: targetNode.id,
      afterIndex: (targetNode.children?.length || 0) - 1,
      label: canGoInside ? `↳ Drop inside ${targetLabel}` : `🚫 Cannot place ${draggedLabel} here`,
      reason: canGoInside ? null : `Cannot place ${draggedLabel} inside ${targetLabel}`,
    };
  }

  // Find parent in the schema tree
  let parentInfo = findParent(rootTree, targetNode.id);
  if (!parentInfo) {
    return {
      isValid: canGoInside,
      dropMode: "inside",
      parentId: targetNode.id,
      parentType: targetNode.type,
      targetNodeId: targetNode.id,
      afterIndex: (targetNode.children?.length || 0) - 1,
      label: canGoInside ? `↳ Drop inside ${targetLabel}` : `🚫 Cannot place ${draggedLabel} here`,
    };
  }

  let currentParent = parentInfo.parent;
  let refNode = targetNode;
  let refIndex = parentInfo.index;

  // Bubble up if currentParent cannot accept draggedType
  while (currentParent && !canAddChild(currentParent, draggedType, options).valid) {
    const higherInfo = findParent(rootTree, currentParent.id);
    if (higherInfo) {
      refNode = currentParent;
      refIndex = higherInfo.index;
      currentParent = higherInfo.parent;
    } else {
      break;
    }
  }

  if (currentParent && canAddChild(currentParent, draggedType, options).valid) {
    const afterIndex = isBefore ? refIndex - 1 : refIndex;
    const refDef = ComponentRegistry[refNode.type];
    const refLabel = refDef?.label || refNode.type;
    return {
      isValid: true,
      dropMode: relativeMode,
      parentId: currentParent.id,
      parentType: currentParent.type,
      targetNodeId: refNode.id,
      afterIndex,
      label: isBefore ? `↑ Insert before ${refLabel}` : `↓ Insert after ${refLabel}`,
    };
  }

  // Fallback if no ancestor accepts it
  const fallbackCheck = canAddChild(parentInfo.parent, draggedType, options);
  return {
    isValid: false,
    dropMode: relativeMode,
    parentId: parentInfo.parent.id,
    parentType: parentInfo.parent.type,
    targetNodeId: targetNode.id,
    afterIndex: isBefore ? parentInfo.index - 1 : parentInfo.index,
    reason: fallbackCheck.reason || `${draggedLabel} cannot be placed here.`,
    label: `🚫 ${fallbackCheck.reason || "Cannot drop here"}`,
  };
}

/**
 * Calculates drop mode (BEFORE, INSIDE, AFTER) based on pointer position relative to bounding rectangle.
 *
 * @param {number} clientY - Pointer Y coordinate
 * @param {DOMRect} rect - Target element DOMRect
 * @param {string} targetType - Target component type
 * @param {string} [draggedType=null] - Dragged component type
 * @param {Object} [targetNode=null] - Full target node (enables accurate maxChildren checks)
 * @returns {'before'|'inside'|'after'}
 */
export function getDropMode(clientY, rect, targetType, draggedType = null, targetNode = null) {
  if (!rect || rect.height <= 0) return "inside";

  const offsetY = clientY - rect.top;
  const height = rect.height;
  const targetDef = ComponentRegistry[targetType];

  const canAcceptInside =
    targetDef?.canHaveChildren !== false &&
    (!draggedType || canAddChild(targetNode || targetType, draggedType).valid);

  // If container can accept this child inside
  if (canAcceptInside) {
    // Top 20% -> before, Middle 60% -> inside, Bottom 20% -> after
    if (offsetY < height * 0.2) {
      return "before";
    } else if (offsetY > height * 0.8) {
      return "after";
    } else {
      return "inside";
    }
  }

  // Leaf component or container that cannot accept this child inside: split 50/50
  return offsetY < height * 0.5 ? "before" : "after";
}

/**
 * Checks whether a node can be moved into a target parent node.
 * @param {Object} node - Component node to move
 * @param {Object} targetParent - Target parent node
 * @returns {{ valid: boolean, reason?: string }}
 */
export function canMoveNode(node, targetParent) {
  if (!node || !targetParent) {
    return { valid: false, reason: "Source node and target parent must be valid." };
  }

  if (node.id === targetParent.id) {
    return { valid: false, reason: "Cannot move a component inside itself." };
  }

  return canAddChild(targetParent, node, { excludeChildId: node.id });
}

/**
 * Validates a single component node for schema integrity.
 * @param {Object} node
 * @param {string} [path='root']
 * @param {string} [parentType=null]
 * @param {Set<string>} [seenIds=new Set()]
 * @returns {Array<string>} List of validation errors (if any)
 */
export function validateNode(node, path = "root", parentType = null, seenIds = new Set()) {
  const errors = [];

  if (!node || typeof node !== "object") {
    errors.push(`${path}: Component node must be an object.`);
    return errors;
  }

  if (!node.type || typeof node.type !== "string") {
    errors.push(`${path}: Missing required string property "type".`);
    return errors;
  }

  const definition = ComponentRegistry[node.type];
  if (!definition) {
    errors.push(`${path}: Unknown component type "${node.type}".`);
  }

  if (node.id) {
    if (seenIds.has(node.id)) {
      errors.push(`${path}: Duplicate component ID "${node.id}". Every component must have a unique ID.`);
    }
    seenIds.add(node.id);
  }

  if (parentType) {
    const check = canAddChild(parentType, node.type);
    if (!check.valid) {
      errors.push(`${path}: ${check.reason}`);
    }
  }

  if (Array.isArray(node.children)) {
    if (definition && definition.canHaveChildren === false && node.children.length > 0) {
      errors.push(`${path}: Component "${node.type}" has "canHaveChildren: false" but contains ${node.children.length} children.`);
    }
    node.children.forEach((child, index) => {
      errors.push(...validateNode(child, `${path}.children[${index}] (${child?.type || "unknown"})`, node.type, seenIds));
    });
  }

  return errors;
}

/**
 * Validates an SDUI JSON string or object for structural, typing, and nesting errors.
 * @param {string|Object} input - Schema string or parsed object
 * @returns {{ isValid: boolean, errors: string[], parsedSchema: Object|null }}
 */
export function validateSchema(input) {
  const errors = [];
  let parsedSchema = null;

  if (typeof input === "string") {
    try {
      parsedSchema = JSON.parse(input);
    } catch (e) {
      const message = e.message || "Invalid JSON syntax";
      errors.push(`JSON Syntax Error: ${message}`);
      return { isValid: false, errors, parsedSchema: null };
    }
  } else if (typeof input === "object" && input !== null) {
    parsedSchema = input;
  } else {
    errors.push("Invalid input: Expected JSON string or object.");
    return { isValid: false, errors, parsedSchema: null };
  }

  const seenIds = new Set();
  const nodeErrors = validateNode(parsedSchema, "root", null, seenIds);
  errors.push(...nodeErrors);

  return {
    isValid: errors.length === 0,
    errors,
    parsedSchema,
  };
}

export default {
  getAllowedChildren,
  canAddChild,
  canDrop,
  getDropMode,
  canMoveNode,
  validateNode,
  validateSchema,
};
