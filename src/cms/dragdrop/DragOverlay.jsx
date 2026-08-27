import React from "react";
import { useDragDrop } from "./DragDropContext";
import { ComponentRegistry } from "../../registry/componentRegistry";

/**
 * DragOverlay — a real, cursor-following preview of the component being
 * dragged, replacing the browser's native drag ghost (suppressed at each
 * drag source via a transparent setDragImage). Shows the actual component
 * icon/label and flips to a red "invalid" state the instant the hovered
 * drop target would reject it, so the user never has to guess.
 */
export const DragOverlay = () => {
  const { isDragging, dragSource, pointerPosition, dropSlot } = useDragDrop();

  if (!isDragging || !dragSource || !pointerPosition) return null;

  const def = ComponentRegistry[dragSource.type];
  const isValid = dropSlot ? dropSlot.isValid !== false : true;

  return (
    <div
      style={{
        position: "fixed",
        left: pointerPosition.x + 16,
        top: pointerPosition.y + 12,
        zIndex: 100000,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        border: `2px solid ${isValid ? "#4f46e5" : "#ef4444"}`,
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.2), 0 2px 6px rgba(15,23,42,0.1)",
        fontSize: "12px",
        fontWeight: 700,
        color: "#0f172a",
        transform: "rotate(-1.5deg)",
        maxWidth: "220px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <span style={{ fontSize: "16px", flexShrink: 0 }}>{def?.icon || "🧩"}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {dragSource.label || def?.label || dragSource.type}
      </span>
      {!isValid && <span style={{ fontSize: "13px", flexShrink: 0 }}>🚫</span>}
    </div>
  );
};

export default DragOverlay;
