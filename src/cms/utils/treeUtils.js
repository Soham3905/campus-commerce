import { generateId, ensureStableIds } from "./idUtils";

/**
 * Deep clones any JSON-serializable schema tree
 * @param {Object} tree
 * @returns {Object}
 */
export function cloneTree(tree) {
  if (!tree) return tree;
  return JSON.parse(JSON.stringify(tree));
}

/**
 * Recursively searches an SDUI tree for a node matching the given ID.
 * @param {Object} tree - Root SDUI component node
 * @param {string} id - Target component ID
 * @returns {Object|null} The matching component node or null
 */
export function findNodeById(tree, id) {
  if (!tree || !id) return null;
  if (tree.id === id) return tree;

  if (Array.isArray(tree.children)) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Recursively finds the parent node and index of a target component ID.
 * @param {Object} tree - Root SDUI component node
 * @param {string} id - Target component ID
 * @returns {{ parent: Object, index: number } | null}
 */
export function findParentById(tree, id) {
  if (!tree || !id || tree.id === id) return null;

  if (Array.isArray(tree.children)) {
    const index = tree.children.findIndex((child) => child.id === id);
    if (index !== -1) {
      return { parent: tree, index };
    }

    for (const child of tree.children) {
      const result = findParentById(child, id);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Immutably updates a specific node in the SDUI tree.
 * @param {Object} tree - Root SDUI component node
 * @param {string} id - Target component ID
 * @param {Object|Function} updater - Partial properties to merge or function (node) => updatedNode
 * @returns {Object} A new tree with the node updated
 */
export function updateNode(tree, id, updater) {
  if (!tree) return tree;

  if (tree.id === id) {
    const changes = typeof updater === "function" ? updater(tree) : updater;
    return {
      ...tree,
      ...changes,
      data: {
        ...(tree.data || {}),
        ...(changes.data || {}),
      },
      containerStyle: {
        ...(tree.containerStyle || {}),
        ...(changes.containerStyle || {}),
      },
      placement: {
        ...(tree.placement || {}),
        ...(changes.placement || {}),
      },
      actions: {
        ...(tree.actions || {}),
        ...(changes.actions || {}),
      },
    };
  }

  if (Array.isArray(tree.children)) {
    return {
      ...tree,
      children: tree.children.map((child) => updateNode(child, id, updater)),
    };
  }

  return tree;
}

/**
 * Immutably inserts a new node relative to a target node.
 * @param {Object} tree - Root SDUI component node
 * @param {string} targetId - ID of reference node
 * @param {Object} newNode - Node to insert
 * @param {'inside'|'before'|'after'} [position='inside'] - Insertion position
 * @returns {Object} New tree with the node inserted
 */
export function insertNode(tree, targetId, newNode, position = "inside") {
  if (!tree || !newNode) return tree;

  const preparedNode = ensureStableIds(cloneTree(newNode));

  // If inserting into root or target matches directly
  if (position === "inside" && tree.id === targetId) {
    return {
      ...tree,
      children: [...(tree.children || []), preparedNode],
    };
  }

  const parentInfo = findParentById(tree, targetId);
  if (!parentInfo) {
    // If target not found and tree is root, append to root children
    if (position === "inside") {
      return {
        ...tree,
        children: [...(tree.children || []), preparedNode],
      };
    }
    return tree;
  }

  const { parent, index } = parentInfo;

  return updateNode(tree, parent.id, (parentNode) => {
    const children = [...(parentNode.children || [])];
    if (position === "before") {
      children.splice(index, 0, preparedNode);
    } else if (position === "after") {
      children.splice(index + 1, 0, preparedNode);
    } else if (position === "inside") {
      const targetChild = children[index];
      children[index] = {
        ...targetChild,
        children: [...(targetChild.children || []), preparedNode],
      };
    }
    return { ...parentNode, children };
  });
}

/**
 * Immutably removes a node by ID from the schema tree.
 * @param {Object} tree - Root SDUI component node
 * @param {string} id - Target component ID to delete
 * @returns {Object} New tree with the node removed
 */
export function removeNode(tree, id) {
  if (!tree || tree.id === id) return null;

  if (Array.isArray(tree.children)) {
    const newChildren = tree.children
      .filter((child) => child.id !== id)
      .map((child) => removeNode(child, id))
      .filter(Boolean); // remove any nulls from deeper recursion
    return { ...tree, children: newChildren };
  }

  return tree;
}

/**
 * Immutably moves a node up or down among its siblings.
 * @param {Object} tree - Root SDUI component node
 * @param {string} id - Target component ID
 * @param {'up'|'down'} direction - Move direction
 * @returns {Object}
 */
export function moveNode(tree, id, direction) {
  const parentInfo = findParentById(tree, id);
  if (!parentInfo) return tree;

  const { parent, index } = parentInfo;
  const newIndex = direction === "up" ? index - 1 : index + 1;

  if (newIndex < 0 || newIndex >= parent.children.length) {
    return tree; // Already at edge
  }

  return updateNode(tree, parent.id, (parentNode) => {
    const children = [...parentNode.children];
    const [moved] = children.splice(index, 1);
    children.splice(newIndex, 0, moved);
    return { ...parentNode, children };
  });
}

/**
 * Immutably duplicates a node with fresh unique IDs and inserts it directly after the original.
 * @param {Object} tree - Root SDUI component node
 * @param {string} id - Target component ID to duplicate
 * @returns {Object}
 */
export function duplicateNode(tree, id) {
  const target = findNodeById(tree, id);
  if (!target) return tree;

  // Deep clone and regenerate all IDs in the duplicated subtree
  const duplicated = ensureStableIds(cloneTree(target), new Set());
  // Append copy indicator to label or title if present
  if (duplicated.data?.title) {
    duplicated.data.title = `${duplicated.data.title} (Copy)`;
  } else if (duplicated.data?.label) {
    duplicated.data.label = `${duplicated.data.label} (Copy)`;
  }

  return insertNode(tree, id, duplicated, "after");
}

/**
 * Replaces a node by ID with a new node.
 * @param {Object} tree
 * @param {string} id
 * @param {Object} newNode
 * @returns {Object}
 */
export function replaceNode(tree, id, newNode) {
  if (!tree) return tree;
  if (tree.id === id) return ensureStableIds(cloneTree(newNode));

  if (Array.isArray(tree.children)) {
    return {
      ...tree,
      children: tree.children.map((child) =>
        child.id === id
          ? ensureStableIds(cloneTree(newNode))
          : replaceNode(child, id, newNode)
      ),
    };
  }
  return tree;
}
