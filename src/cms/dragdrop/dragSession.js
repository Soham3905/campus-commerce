/**
 * Drag Session Manager — Handles real-time temporary preview calculations,
 * drop mode resolution, footprint placeholders, and contract validations during drag.
 */

import { canAddChild, getDropMode } from "../utils/validation";
import { findNodeById, findParentById, insertNodeAtIndex, moveNodeToSlot, canMoveNodeToSlot, removeNode, cloneTree } from "../utils/treeUtils";
import { createComponent } from "../utils/componentFactory";
import { GridEngine } from "../layout/gridEngine";

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
    const check = canAddChild(parentNode.type, source.type);
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

/**
 * Resolves drop slot details from a DOM dragover event on a target node.
 *
 * @param {Object} params
 * @param {MouseEvent|DragEvent} params.event
 * @param {DOMRect} params.rect
 * @param {Object} params.targetNode
 * @param {Object} params.fullSchema
 * @param {Object} params.dragSource
 * @returns {Object} Target slot object with mode, parentId, parentType, afterIndex, isValid, reason
 */
export function resolveDropSlot({ event, rect, targetNode, fullSchema, dragSource }) {
  if (!targetNode || !dragSource) {
    return null;
  }

  const draggedType = dragSource.type;
  const dropMode = getDropMode(event.clientY, rect, targetNode.type, draggedType);

  if (dropMode === "inside") {
    const check = canAddChild(targetNode.type, draggedType);
    const childrenCount = targetNode.children?.length || 0;

    return {
      parentId: targetNode.id,
      parentType: targetNode.type,
      targetNodeId: targetNode.id,
      dropMode: "inside",
      afterIndex: childrenCount - 1, // Append at end of children or start (-1)
      isValid: check.valid,
      reason: check.reason || null,
      label: `Drop inside ${targetNode.type}`,
    };
  }

  // Before or After: target is the parent of targetNode
  const parentInfo = findParentById(fullSchema, targetNode.id);
  if (!parentInfo) {
    // If targetNode is root
    return {
      parentId: targetNode.id,
      parentType: targetNode.type,
      targetNodeId: targetNode.id,
      dropMode: "inside",
      afterIndex: (targetNode.children?.length || 1) - 1,
      isValid: true,
      reason: null,
      label: `Drop inside ${targetNode.type}`,
    };
  }

  const parent = parentInfo.parent;
  const index = parentInfo.index;
  const check = canAddChild(parent.type, draggedType);
  const afterIndex = dropMode === "before" ? index - 1 : index;

  return {
    parentId: parent.id,
    parentType: parent.type,
    targetNodeId: targetNode.id,
    dropMode,
    afterIndex,
    isValid: check.valid,
    reason: check.reason || null,
    label: dropMode === "before" ? `Insert before ${targetNode.type}` : `Insert after ${targetNode.type}`,
  };
}

export default {
  computePreviewTree,
  resolveDropSlot,
};
