import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { canAddChild } from "../utils/validation";
import { findNodeById } from "../utils/treeUtils";
import { computePreviewTree } from "./dragSession";

const DragDropCtx = createContext(null);

/**
 * Universal Drag & Drop Provider.
 * Tracks drag sessions, computes real-time preview trees with reflowed placeholders,
 * and ensures single-atomic-commit history upon drop.
 */
export const DragDropProvider = ({ children, schema, onDropItem, onInvalidDrop }) => {
  // Drag source: { type, nodeId, isNew, label, sourceParentId }
  const [dragSource, setDragSource] = useState(null);
  // Active drop slot: { parentId, parentType, targetNodeId, dropMode, afterIndex, isValid, reason, label }
  const [dropSlot, setDropSlot] = useState(null);
  // Temporary preview tree during drag
  const [previewTree, setPreviewTree] = useState(null);
  // Live cursor position while dragging, for the DragOverlay to follow
  const [pointerPosition, setPointerPosition] = useState(null);

  const dropSlotRef = useRef(null);
  const dragSourceRef = useRef(null);
  const schemaRef = useRef(schema);

  useEffect(() => {
    schemaRef.current = schema;
  }, [schema]);

  // Track the pointer during an active drag so the overlay can follow it.
  // Registered on the capture phase: per-node handlers call stopPropagation()
  // on dragover (to keep their own hover-zone logic isolated), which would
  // otherwise prevent a bubble-phase window listener from ever firing.
  useEffect(() => {
    if (!dragSource) {
      setPointerPosition(null);
      return;
    }
    const handleWindowDragOver = (e) => {
      setPointerPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("dragover", handleWindowDragOver, true);
    return () => window.removeEventListener("dragover", handleWindowDragOver, true);
  }, [dragSource]);

  const startDrag = useCallback((item) => {
    const src = {
      type: item.type,
      nodeId: item.nodeId || null,
      isNew: item.isNew !== false,
      label: item.label || item.type,
      sourceParentId: item.sourceParentId || null,
    };
    setDragSource(src);
    dragSourceRef.current = src;
    setDropSlot(null);
    dropSlotRef.current = null;
    setPreviewTree(null);
  }, []);

  /**
   * Updates current drop target slot and computes the temporary preview layout.
   */
  const updateDropSlot = useCallback((slot) => {
    const src = dragSourceRef.current;
    if (!src || !slot) return;

    let resolved;
    if (typeof slot.isValid === "boolean") {
      // Caller already ran an accurate, node-aware validity check (e.g. the live
      // per-node hover resolution in SDUIRenderer) — trust it rather than
      // re-deriving from a bare parent type string below, which can't see the
      // parent's current children and would silently ignore maxChildren.
      resolved = { ...slot };
    } else {
      const parentType = slot.parentType || "Page";
      const parentNode = findNodeById(schemaRef.current, slot.parentId) || parentType;
      const childType = src.type;
      const check = canAddChild(parentNode, childType, src.nodeId ? { excludeChildId: src.nodeId } : undefined);
      resolved = {
        ...slot,
        isValid: check.valid,
        reason: check.reason || null,
      };
    }

    setDropSlot(resolved);
    dropSlotRef.current = resolved;

    if (resolved.isValid && schemaRef.current) {
      try {
        const preview = computePreviewTree(schemaRef.current, src, resolved);
        setPreviewTree(preview);
      } catch (err) {
        console.warn("[DragDropContext] Failed to compute preview tree:", err);
      }
    } else {
      setPreviewTree(null);
    }
  }, []);

  const clearDropSlot = useCallback(() => {
    setDropSlot(null);
    dropSlotRef.current = null;
    setPreviewTree(null);
  }, []);

  const endDrag = useCallback(
    (dropped = false) => {
      const slot = dropSlotRef.current;
      const src = dragSourceRef.current;

      if (dropped && slot && src) {
        if (slot.isValid) {
          onDropItem?.({
            source: src,
            slot: slot,
          });
        } else {
          onInvalidDrop?.({
            source: src,
            slot: slot,
            reason: slot.reason || `Cannot place ${src.label || src.type} here.`,
          });
        }
      }

      setDragSource(null);
      setDropSlot(null);
      setPreviewTree(null);
      dragSourceRef.current = null;
      dropSlotRef.current = null;
    },
    [onDropItem, onInvalidDrop]
  );

  // Global Escape key listener to cancel active drag
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && dragSourceRef.current) {
        endDrag(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [endDrag]);

  return (
    <DragDropCtx.Provider
      value={{
        isDragging: !!dragSource,
        dragSource,
        dropSlot,
        previewTree,
        pointerPosition,
        startDrag,
        updateDropSlot,
        clearDropSlot,
        endDrag,
      }}
    >
      {children}
    </DragDropCtx.Provider>
  );
};

export const useDragDrop = () => {
  const ctx = useContext(DragDropCtx);
  if (!ctx) throw new Error("useDragDrop must be used inside DragDropProvider");
  return ctx;
};

export default DragDropCtx;
