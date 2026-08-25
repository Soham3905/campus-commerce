/**
 * Validation & Contract Engine for SDUI Components
 * Enforces parent-child constraints, allowed parents, placement bounds, unique IDs,
 * and produces actionable human-friendly rejection reasons.
 */

import { ComponentRegistry } from "../../registry/componentRegistry";

/**
 * Checks whether a child component type or node can be added to a parent component.
 * Generic single-source-of-truth validation rule.
 *
 * @param {string|Object} parent - Parent type string or node object
 * @param {string|Object} child - Child type string or node object
 * @returns {{ valid: boolean, reason?: string }}
 */
export function canAddChild(parent, child) {
  const parentType = typeof parent === "object" && parent ? parent.type : parent;
  const childType = typeof child === "object" && child ? child.type : child;

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
      reason: `"${parentDef.label || parentType}" is a leaf component and cannot contain child components.`,
    };
  }

  // 2. Check parent's allowedChildren list (if restricted)
  if (Array.isArray(parentDef.allowedChildren) && parentDef.allowedChildren.length > 0) {
    if (!parentDef.allowedChildren.includes(childType)) {
      return {
        valid: false,
        reason: `Cannot place ${childDef.label || childType} inside ${parentDef.label || parentType}. Allowed children: [${parentDef.allowedChildren.join(", ")}].`,
      };
    }
  }

  // 3. Check child's allowedParents list (if restricted)
  if (Array.isArray(childDef.allowedParents) && childDef.allowedParents.length > 0) {
    if (!childDef.allowedParents.includes(parentType)) {
      return {
        valid: false,
        reason: `Cannot place ${childDef.label || childType} inside ${parentDef.label || parentType}. It is only allowed inside: [${childDef.allowedParents.join(", ")}].`,
      };
    }
  }

  return { valid: true };
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

  return canAddChild(targetParent, node);
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
  canAddChild,
  canMoveNode,
  validateNode,
  validateSchema,
};
