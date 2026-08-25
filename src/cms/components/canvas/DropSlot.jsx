import React from "react";
import { useDragDrop } from "../../dragdrop/DragDropContext";
import { colors } from "../../theme";

/**
 * DropSlot — a thin animated line that appears between canvas rows.
 * Shows green when valid, red when invalid.
 *
 * Props:
 *   parentId    {string}  ID of the parent component receiving the drop
 *   parentType  {string}  Type of the parent (for contract validation)
 *   afterIndex  {number}  Index after which to insert (-1 = prepend before first)
 *   isFirst     {bool}    True for the very first slot in a list
 */
export const DropSlot = ({ parentId, parentType, afterIndex, isFirst = false }) => {
  const { isDragging, dragSource, dropSlot, updateDropSlot, clearDropSlot, endDrag } = useDragDrop();

  if (!isDragging) return null;

  const isActive =
    dropSlot?.parentId === parentId && dropSlot?.afterIndex === afterIndex;

  const isValid = isActive ? dropSlot.isValid : true;
  const reason = isActive ? dropSlot.reason : null;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateDropSlot({ parentId, parentType, afterIndex });
  };

  const handleDragLeave = () => {
    clearDropSlot();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    endDrag(true);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        height: isActive ? "40px" : "8px",
        margin: isFirst ? "0 0 2px 0" : "2px 0",
        borderRadius: "6px",
        transition: "height 0.15s ease, background 0.1s ease",
        backgroundColor: isActive
          ? isValid
            ? "rgba(79, 70, 229, 0.1)"
            : "rgba(239, 68, 68, 0.1)"
          : "transparent",
        border: isActive
          ? `2px dashed ${isValid ? "#4f46e5" : "#ef4444"}`
          : "2px dashed transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "default",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: isValid ? "#4f46e5" : "#ef4444",
            pointerEvents: "none",
          }}
        >
          {isValid
            ? `📥 Drop ${dragSource?.label || dragSource?.type} here`
            : `🚫 ${reason || "Cannot drop here"}`}
        </span>
      )}
    </div>
  );
};

export default DropSlot;
