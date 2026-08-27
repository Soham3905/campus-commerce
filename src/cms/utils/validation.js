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
