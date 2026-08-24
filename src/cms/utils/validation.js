import { ComponentRegistry } from "../../registry/componentRegistry";

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
      // Extract line info if available
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

  function validateNode(node, path = "root", parentType = null) {
    if (!node || typeof node !== "object") {
      errors.push(`${path}: Component node must be an object.`);
      return;
    }

    // 1. Type validation
    if (!node.type || typeof node.type !== "string") {
      errors.push(`${path}: Missing required string property "type".`);
      return;
    }

    const definition = ComponentRegistry[node.type];
    if (!definition) {
      errors.push(`${path}: Unknown component type "${node.type}". Registered types include ${Object.keys(ComponentRegistry).slice(0, 8).join(", ")}...`);
    }

    // 2. ID uniqueness check
    if (node.id) {
      if (seenIds.has(node.id)) {
        errors.push(`${path}: Duplicate component ID "${node.id}". Every component must have a unique ID.`);
      }
      seenIds.add(node.id);
    }

    // 3. Parent-child nesting rules check
    if (parentType && ComponentRegistry[parentType]) {
      const parentDef = ComponentRegistry[parentType];
      if (parentDef.canHaveChildren === false) {
        errors.push(`${path}: Parent "${parentType}" cannot have child components, but contains "${node.type}".`);
      } else if (Array.isArray(parentDef.allowedChildren) && parentDef.allowedChildren.length > 0) {
        if (!parentDef.allowedChildren.includes(node.type)) {
          errors.push(
            `${path}: Component "${node.type}" is not an allowed child inside "${parentType}". Allowed children: [${parentDef.allowedChildren.join(", ")}].`
          );
        }
      }
    }

    // 4. Placement coordinate validation
    if (node.placement && typeof node.placement === "object") {
      ["mobile", "tablet", "desktop"].forEach((device) => {
        const coords = node.placement[device];
        if (coords) {
          const { colStart, colEnd, rowStart, rowEnd } = coords;
          if (typeof colStart === "number" && typeof colEnd === "number") {
            if (colStart < 1 || colEnd > 101 || colStart >= colEnd) {
              errors.push(`${path} [${device} placement]: Invalid columns (${colStart} to ${colEnd}). Must be between 1 and 100.`);
            }
          }
          if (typeof rowStart === "number" && typeof rowEnd === "number") {
            if (rowStart < 1 || rowStart >= rowEnd) {
              errors.push(`${path} [${device} placement]: Invalid rows (${rowStart} to ${rowEnd}). rowStart must be < rowEnd.`);
            }
          }
        }
      });
    }

    // 5. Recursive children validation
    if (Array.isArray(node.children)) {
      if (definition && definition.canHaveChildren === false && node.children.length > 0) {
        errors.push(`${path}: Component "${node.type}" has "canHaveChildren: false" but contains ${node.children.length} children.`);
      }
      node.children.forEach((child, index) => {
        validateNode(child, `${path}.children[${index}] (${child.type || "unknown"})`, node.type);
      });
    }
  }

  validateNode(parsedSchema);

  return {
    isValid: errors.length === 0,
    errors,
    parsedSchema,
  };
}
