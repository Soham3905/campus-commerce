import React, { useState } from "react";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { useDragDrop } from "../../dragdrop/DragDropContext";
import { suppressNativeDragImage } from "../../dragdrop/dragImage";
import { colors } from "../../theme";

/**
 * ComponentRow — a single draggable component row in the list-style canvas editor.
 * Shows: drag handle | icon | label | content preview | actions
 */
export const ComponentRow = ({
  node,
  depth = 0,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleChildren,
  childrenExpanded,
  hasChildren,
  // DragDrop
  onRowDragStart,
  onRowDragEnd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const def = ComponentRegistry[node.type];
  const { isDragging, dragSource } = useDragDrop();

  const isBeingDragged = isDragging && dragSource?.nodeId === node.id;

  // Generate a short content preview
  const getContentPreview = () => {
    const d = node.data || {};
    if (d.title) return d.title;
    if (d.label) return d.label;
    if (d.text) return d.text.slice(0, 40);
    if (d.placeholder) return d.placeholder;
    if (d.imageUrl) return "📷 Image";
    if (d.items?.length) return `${d.items.length} items`;
    return null;
  };

  const preview = getContentPreview();

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", node.id);
        suppressNativeDragImage(e.dataTransfer);
        onRowDragStart?.(node);
      }}
      onDragEnd={() => onRowDragEnd?.()}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: `8px 12px 8px ${depth * 20 + 12}px`,
        backgroundColor: isSelected
          ? "rgba(79, 70, 229, 0.08)"
          : isHovered
          ? "#f8fafc"
          : "#ffffff",
        borderLeft: isSelected
          ? "3px solid #4f46e5"
          : "3px solid transparent",
        borderBottom: "1px solid #f1f5f9",
        cursor: "grab",
        transition: "background 0.1s ease",
        opacity: isBeingDragged ? 0.4 : 1,
        userSelect: "none",
        minHeight: "44px",
      }}
    >
      {/* Drag Handle */}
      <span
        style={{
          fontSize: "14px",
          color: isHovered ? "#94a3b8" : "#e2e8f0",
          cursor: "grab",
          flexShrink: 0,
          lineHeight: 1,
        }}
        title="Drag to reorder"
      >
        ⠿
      </span>

      {/* Expand/Collapse Toggle */}
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleChildren?.(node.id);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "9px",
            color: "#64748b",
            padding: "2px",
            width: "14px",
            flexShrink: 0,
          }}
        >
          {childrenExpanded ? "▼" : "▶"}
        </button>
      ) : (
        <div style={{ width: "14px", flexShrink: 0 }} />
      )}

      {/* Icon */}
      <span style={{ fontSize: "16px", flexShrink: 0 }}>{def?.icon || "📦"}</span>

      {/* Label + Preview */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: isSelected ? "700" : "500",
            color: isSelected ? "#4f46e5" : "#0f172a",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {def?.label || node.type}
        </div>
        {preview && (
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {preview}
          </div>
        )}
      </div>

      {/* Type Badge */}
      <span
        style={{
          fontSize: "10px",
          fontWeight: "600",
          padding: "2px 6px",
          borderRadius: "4px",
          backgroundColor: "#f1f5f9",
          color: "#64748b",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {node.type}
      </span>

      {/* Action Buttons (visible on hover or selected) */}
      {(isHovered || isSelected) && (
        <div
          style={{ display: "flex", gap: "4px", flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onDuplicate?.(node.id)}
            title="Duplicate"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              cursor: "pointer",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
            }}
          >
            ⧉
          </button>
          <button
            onClick={() => onDelete?.(node.id)}
            title="Delete"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              border: "1px solid #fecaca",
              background: "#fff5f5",
              cursor: "pointer",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ef4444",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ComponentRow;
