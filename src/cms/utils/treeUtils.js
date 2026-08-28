import { ensureStableIds } from "./idUtils";
import { GridEngine } from "../layout/gridEngine";
import { canAddChild } from "./validation";

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
 * Immutably inserts a new node relative to a target node with automatic grid reflow.
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
    const newChildren = [...(tree.children || []), preparedNode];
    return {
      ...tree,
      children: GridEngine.reflowChildren(newChildren, "all", { parentType: tree.type }),
    };
  }

  const parentInfo = findParentById(tree, targetId);
  if (!parentInfo) {
    // If target not found and tree is root, append to root children
    if (position === "inside") {
      const newChildren = [...(tree.children || []), preparedNode];
      return {
        ...tree,
        children: GridEngine.reflowChildren(newChildren, "all", { parentType: tree.type }),
      };
    }
    return tree;
  }

  const { parent, index } = parentInfo;

  return updateNode(tree, parent.id, (parentNode) => {
    let children = [...(parentNode.children || [])];
    if (position === "before") {
      children.splice(index, 0, preparedNode);
    } else if (position === "after") {
      children.splice(index + 1, 0, preparedNode);
    } else if (position === "inside") {
      const targetChild = children[index];
      const nestedChildren = [...(targetChild.children || []), preparedNode];
      children[index] = {
        ...targetChild,
        children: GridEngine.reflowChildren(nestedChildren, "all", { parentType: targetChild.type }),
      };
      return { ...parentNode, children };
    }
    const reflowed = GridEngine.reflowChildren(children, "all", { parentType: parentNode.type });
    return { ...parentNode, children: reflowed };
  });
}

/**
 * Inserts a node into a specific parent at a specific child index.
 * @param {Object} tree
 * @param {string} parentId
 * @param {Object} newNode
 * @param {number} insertIndex
 * @returns {Object}
 */
export function insertNodeAtIndex(tree, parentId, newNode, insertIndex = 0) {
  if (!tree || !newNode) return tree;

  const preparedNode = ensureStableIds(cloneTree(newNode));
  const resolvedParentId = parentId || tree.id;

  return updateNode(tree, resolvedParentId, (parentNode) => {
    const children = [...(parentNode.children || [])];
    const safeIndex = Math.max(0, Math.min(Number(insertIndex) || 0, children.length));
    children.splice(safeIndex, 0, preparedNode);
    return {
      ...parentNode,
      children: GridEngine.reflowChildren(children, "all", { parentType: parentNode.type }),
    };
  });
}

/**
 * Checks whether a node can be moved into a target parent while preserving tree integrity.
 * @param {Object} tree
 * @param {string} nodeId
 * @param {string} targetParentId
 * @returns {{ valid: boolean, reason?: string }}
 */
export function canMoveNodeToSlot(tree, nodeId, targetParentId) {
  if (!tree || !nodeId || !targetParentId) {
    return { valid: false, reason: "Source node and target parent must be valid." };
  }

  const sourceNode = findNodeById(tree, nodeId);
  const targetParent = findNodeById(tree, targetParentId);

  if (!sourceNode) {
    return { valid: false, reason: `Unable to find component "${nodeId}".` };
  }
  if (!targetParent) {
    return { valid: false, reason: `Unable to find drop target "${targetParentId}".` };
  }
  if (sourceNode.id === targetParent.id) {
    return { valid: false, reason: "A component cannot be dropped inside itself." };
  }
  if (findNodeById(sourceNode, targetParentId)) {
    return { valid: false, reason: "A component cannot be dropped into one of its own children." };
  }

  return canAddChild(targetParent, sourceNode, { excludeChildId: sourceNode.id });
}

/**
 * Moves an existing node into a specific parent at a specific child index.
 * @param {Object} tree
 * @param {string} nodeId
 * @param {string} targetParentId
 * @param {number} insertIndex
 * @returns {Object}
 */
export function moveNodeToSlot(tree, nodeId, targetParentId, insertIndex = 0) {
  if (!tree || !nodeId || !targetParentId) return tree;

  const sourceNode = findNodeById(tree, nodeId);
  const sourceInfo = findParentById(tree, nodeId);
  if (!sourceNode || !sourceInfo) return tree;

  if (sourceNode.id === targetParentId) return tree;
  if (findNodeById(sourceNode, targetParentId)) return tree;

  const targetValidation = canMoveNodeToSlot(tree, nodeId, targetParentId);
  if (!targetValidation.valid) return tree;

  let workingTree = removeNode(tree, nodeId);
  if (!workingTree) return tree;

  let resolvedIndex = Number(insertIndex) || 0;
  if (sourceInfo.parent.id === targetParentId && sourceInfo.index < resolvedIndex) {
    resolvedIndex -= 1;
  }

  return insertNodeAtIndex(workingTree, targetParentId, sourceNode, resolvedIndex);
}

/**
 * Immutably removes a node by ID from the schema tree with automatic grid reflow.
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
      .filter(Boolean);
    const reflowed = GridEngine.reflowChildren(newChildren, "all", { parentType: tree.type });
    return { ...tree, children: reflowed };
  }

  return tree;
}

/**
 * Immutably moves a component in 4 directions:
 *  - 'up' / 'down': reorders child in its parent or adjusts row order
 *  - 'left' / 'right': adjusts 100-col grid horizontal column bounds or swaps horizontal siblings
 *
 * @param {Object} tree - Root SDUI component node
 * @param {string} id - Target component ID
 * @param {'up'|'down'|'left'|'right'} direction - Move direction
 * @param {Object} [options] - Options ({ device, step })
 * @returns {Object} Updated schema tree
 */
export function moveNode(tree, id, direction, options = {}) {
  if (!tree || !id) return tree;

  const { device = "desktop", step = 5 } = options;
  const parentInfo = findParentById(tree, id);
  if (!parentInfo) return tree;

  const { parent, index } = parentInfo;
  const targetNode = parent.children?.[index];
  if (!targetNode) return tree;

  // ── 1. Vertical Up / Down Movement ──
  if (direction === "up" || direction === "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < parent.children.length) {
      return updateNode(tree, parent.id, (parentNode) => {
        const children = [...parentNode.children];
        const [moved] = children.splice(index, 1);
        children.splice(newIndex, 0, moved);
        const reflowed = GridEngine.reflowChildren(children, "all", { parentType: parentNode.type });
        return { ...parentNode, children: reflowed };
      });
    }

    // If at edge of a nested container, bubble out to parent container
    if (newIndex < 0 && parent.id !== tree.id) {
      const grandParentInfo = findParentById(tree, parent.id);
      if (grandParentInfo) {
        return moveNodeToSlot(tree, id, grandParentInfo.parent.id, grandParentInfo.index);
      }
    } else if (newIndex >= parent.children.length && parent.id !== tree.id) {
      const grandParentInfo = findParentById(tree, parent.id);
      if (grandParentInfo) {
        return moveNodeToSlot(tree, id, grandParentInfo.parent.id, grandParentInfo.index + 1);
      }
    }
    return tree;
  }

  // ── 2. Horizontal Left / Right Movement ──
  if (direction === "left" || direction === "right") {
    // If parent is a 100-column grid (Page or Home), adjust placement colStart / colEnd
    if (parent.type === "Page" || parent.type === "Home") {
      return updateNode(tree, id, (node) => {
        const placement = node.placement || {};
        const currentPlacement = placement[device] || {
          colStart: 1,
          colEnd: 101,
          rowStart: 1,
          rowEnd: 10,
        };

        let colStart = currentPlacement.colStart ?? 1;
        let colEnd = currentPlacement.colEnd ?? 101;
        let colSpan = Math.max(1, colEnd - colStart);

        // If currently full width (100%), shrink to 50% so it can move left/right
        if (colSpan >= 99) {
          colSpan = 50;
          if (direction === "left") {
            colStart = 1;
            colEnd = 51;
          } else {
            colStart = 51;
            colEnd = 101;
          }
        } else {
          const shift = Number(step) || 5;
          if (direction === "left") {
            colStart = Math.max(1, colStart - shift);
            colEnd = Math.min(101, colStart + colSpan);
          } else {
            colEnd = Math.min(101, colEnd + shift);
            colStart = Math.max(1, colEnd - colSpan);
          }
        }

        const updatedPlacement = {
          ...placement,
          [device]: {
            ...currentPlacement,
            colStart,
            colEnd,
          },
        };

        return {
          ...node,
          placement: updatedPlacement,
        };
      });
    }

    // In a flex/horizontal list, swap with previous/next sibling
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < parent.children.length) {
      return updateNode(tree, parent.id, (parentNode) => {
        const children = [...parentNode.children];
        const [moved] = children.splice(index, 1);
        children.splice(newIndex, 0, moved);
        return { ...parentNode, children };
      });
    }
  }

  return tree;
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
