/**
 * ID generator and normalizer utility for SDUI schemas
 */

let idCounter = 1;

/**
 * Generate a clean, unique component identifier
 * @param {string} [type='node'] - Component type prefix
 * @returns {string}
 */
export function generateId(type = "node") {
  const prefix = String(type).toLowerCase().replace(/[^a-z0-9]/g, "");
  const rand = Math.random().toString(36).substring(2, 7);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}

/**
 * Recursively ensures that every node in an SDUI schema tree has a stable, unique id.
 * Preserves existing ids if present; generates new unique ones if missing or duplicate.
 * @param {Object} schema - The SDUI component tree
 * @param {Set<string>} [seenIds] - Set of already seen IDs to guarantee uniqueness
 * @returns {Object} A cloned schema with guaranteed unique IDs
 */
export function ensureStableIds(schema, seenIds = new Set()) {
  if (!schema || typeof schema !== "object") return schema;

  const clone = { ...schema };

  let id = clone.id;
  if (!id || typeof id !== "string" || seenIds.has(id)) {
    id = generateId(clone.type || "node");
  }
  seenIds.add(id);
  clone.id = id;

  if (Array.isArray(clone.children)) {
    clone.children = clone.children.map((child) =>
      ensureStableIds(child, seenIds)
    );
  }

  return clone;
}
