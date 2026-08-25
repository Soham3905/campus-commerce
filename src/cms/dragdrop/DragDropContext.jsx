import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { canAddChild } from "../utils/validation";

const DragDropCtx = createContext(null);

/**
 * Slot-based DragDrop Provider.
 * Tracks which item is being dragged and which drop slot is currently targeted.
 * Exposes helpers that any component can call from HTML5 drag event handlers.
 */
export const DragDropProvider = ({ children, onDropItem, onInvalidDrop }) => {
  // The item being dragged: { type, nodeId, isNew, label, sourceParentId }
  const [dragSource, setDragSource] = useState(null);
  // The active drop slot: { parentId, parentType, afterIndex, rect, isValid, reason }
  const [dropSlot, setDropSlot] = useState(null);
  // Keep a ref for use in callbacks that need latest value without re-render
  const dropSlotRef = useRef(null);
  const dragSourceRef = useRef(null);

  const startDrag = useCallback((item) => {
    const src = { type: item.type, nodeId: item.nodeId || null, isNew: item.isNew !== false, label: item.label || item.type, sourceParentId: item.sourceParentId || null };
    setDragSource(src);
    dragSourceRef.current = src;
    setDropSlot(null);
    dropSlotRef.current = null;
  }, []);

  /**
   * Called by DropSlot components on dragover.
   * parentType is needed for validation.
   */
  const updateDropSlot = useCallback((slot) => {
    if (!dragSourceRef.current) return;

    const parentType = slot.parentType || "Page";
    const childType = dragSourceRef.current.type;
    const check = canAddChild(parentType, childType);

    const resolved = {
      ...slot,
      isValid: check.valid,
      reason: check.reason || null,
    };
    setDropSlot(resolved);
    dropSlotRef.current = resolved;
  }, []);

  const clearDropSlot = useCallback(() => {
    setDropSlot(null);
    dropSlotRef.current = null;
  }, []);

  const endDrag = useCallback((dropped = false) => {
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
          reason: slot.reason || `Cannot place ${src.type} here.`,
        });
      }
    }

    setDragSource(null);
    setDropSlot(null);
    dragSourceRef.current = null;
    dropSlotRef.current = null;
  }, [onDropItem, onInvalidDrop]);

  return (
    <DragDropCtx.Provider
      value={{
        isDragging: !!dragSource,
        dragSource,
        dropSlot,
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
