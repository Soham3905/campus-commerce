/**
 * Drag Session Manager — Handles real-time temporary preview calculations,
 * drop mode resolution, footprint placeholders, and contract validations during drag.
 */

import { canAddChild } from "../utils/validation";
import { findNodeById, insertNodeAtIndex, moveNodeToSlot, canMoveNodeToSlot } from "../utils/treeUtils";
import { createComponent } from "../utils/componentFactory";

/**
 * Computes a temporary preview tree for live visual reflow during drag.
 * Does NOT mutate the permanent schema.
 *
 * @param {Object} baseSchema - The stable permanent schema
 * @param {Object} source - Drag source { type, nodeId, isNew, label }
 * @param {Object} slot - Target slot { parentId, parentType, afterIndex, dropMode }
 * @returns {Object|null} Temporary preview tree with placeholder/reflowed positions
 */
export function computePreviewTree(baseSchema, source, slot) {
  if (!baseSchema || !source || !slot || !slot.parentId) {
    return baseSchema;
  }

  const parentNode = findNodeById(baseSchema, slot.parentId);
  if (!parentNode) return baseSchema;

  const insertIndex = Math.max(0, slot.afterIndex >= 0 ? slot.afterIndex + 1 : 0);

  if (source.isNew) {
    // Check validation
    const check = canAddChild(parentNode, source.type);
    if (!check.valid) return baseSchema;

    // Create a realistic ghost blueprint for live preview
    const ghostNode = createComponent(source.type, {
      id: `__drag_ghost_${source.type}`,
    });
    ghostNode.__isDragGhost = true;

    return insertNodeAtIndex(baseSchema, slot.parentId, ghostNode, insertIndex);
  } else if (source.nodeId) {
    // Moving an existing node
    const check = canMoveNodeToSlot(baseSchema, source.nodeId, slot.parentId);
    if (!check.valid) return baseSchema;

    const movedTree = moveNodeToSlot(baseSchema, source.nodeId, slot.parentId, insertIndex);
    return movedTree || baseSchema;
  }

  return baseSchema;
}

export default {
  computePreviewTree,
};
