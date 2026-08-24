import React, { useState, useRef } from "react";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { findParentById } from "../../../cms/utils/treeUtils";
import { colors, commonStyles } from "../../theme";

/**
 * LayerTreeNode — a single draggable row in the layers tree.
 */
const LayerTreeNode = ({
  node,
  schema,
  depth = 0,
  selectedId,
  onSelect,
  onDelete,
  onMove,
  dragState,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedId === node.id;
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const def = ComponentRegistry[node.type];
  const isDragging = dragState.draggingId === node.id;
  const isDragOver = dragState.dragOverId === node.id;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        draggable={depth > 0}
        onDragStart={(e) => depth > 0 && onDragStart(e, node.id)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(e, node.id);
        }}
        onDrop={(e) => onDrop(e, node.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "5px 8px",
          paddingLeft: `${depth * 14 + 8}px`,
          background: isDragOver
            ? colors.accentPrimaryLight
            : isSelected
            ? "rgba(99, 102, 241, 0.12)"
            : isHovered
            ? colors.bgCard
            : "transparent",
          borderLeft: isSelected
            ? `3px solid ${colors.accentPrimary}`
            : isDragOver
            ? `3px solid ${colors.accentPrimary}`
            : "3px solid transparent",
          cursor: depth > 0 ? "grab" : "default",
          borderRadius: "4px",
          gap: "6px",
          opacity: isDragging ? 0.4 : 1,
          transition: "background 0.12s ease, opacity 0.12s ease",
          outline: isDragOver ? `1px dashed ${colors.accentPrimary}` : "none",
          userSelect: "none",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        {/* Expand / Collapse Toggle */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            style={{
              background: "transparent",
              border: "none",
              color: colors.textMuted,
              fontSize: "9px",
              cursor: "pointer",
              padding: "0 2px",
              width: "14px",
              textAlign: "center",
              outline: "none",
            }}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <div style={{ width: "14px" }} />
        )}

        {/* Drag Handle Icon */}
        {depth > 0 && (
          <span
            style={{
              fontSize: "10px",
              color: colors.textMuted,
              opacity: 0.5,
              cursor: "grab",
            }}
            title="Drag to reorder"
          >
            ⠿
          </span>
        )}

        {/* Component Icon */}
        <span style={{ fontSize: "13px" }}>{def?.icon || "📄"}</span>

        {/* Label */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: "5px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: isSelected ? "700" : "500",
              color: isSelected ? colors.textAccent : colors.textPrimary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {def?.label || node.type}
          </span>
          {(node.data?.title || node.data?.label || node.data?.text || node.data?.placeholder) && (
            <span
              style={{
                fontSize: "10px",
                color: colors.textMuted,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "80px",
              }}
            >
              "{node.data?.title || node.data?.label || node.data?.text || node.data?.placeholder}"
            </span>
          )}
        </div>

        {/* Children Count */}
        {hasChildren && (
          <span
            style={{
              fontSize: "10px",
              background: colors.bgPanel,
              color: colors.textMuted,
              padding: "1px 5px",
              borderRadius: "10px",
              flexShrink: 0,
            }}
          >
            {node.children.length}
          </span>
        )}

        {/* Delete Button (visible on hover) */}
        {depth > 0 && isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
            title="Delete component"
            style={{
              width: "20px",
              height: "20px",
              padding: 0,
              fontSize: "11px",
              flexShrink: 0,
              color: colors.danger,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Recursive Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <LayerTreeNode
              key={child.id}
              node={child}
              schema={schema}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
              onMove={onMove}
              dragState={dragState}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const LayersPanel = ({
  schema,
  selectedId,
  onSelectComponent,
  onDeleteComponent,
  onMoveComponent,
}) => {
  const [dragState, setDragState] = useState({ draggingId: null, dragOverId: null });
  const draggingIdRef = useRef(null);

  const handleDragStart = (e, id) => {
    draggingIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setDragState((s) => ({ ...s, draggingId: id }));
  };

  const handleDragEnd = () => {
    draggingIdRef.current = null;
    setDragState({ draggingId: null, dragOverId: null });
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== draggingIdRef.current) {
      setDragState((s) => ({ ...s, dragOverId: id }));
    }
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const sourceId = draggingIdRef.current || e.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetId || !schema) {
      setDragState({ draggingId: null, dragOverId: null });
      return;
    }

    const sourceParent = findParentById(schema, sourceId);
    const targetParent = findParentById(schema, targetId);

    if (
      sourceParent &&
      targetParent &&
      sourceParent.parent.id === targetParent.parent.id
    ) {
      const sourceIndex = sourceParent.index;
      const targetIndex = targetParent.index;
      const diff = targetIndex - sourceIndex;
      const direction = diff > 0 ? "down" : "up";
      const steps = Math.abs(diff);
      for (let i = 0; i < steps; i++) {
        onMoveComponent(sourceId, direction);
      }
      onSelectComponent(sourceId);
    }

    setDragState({ draggingId: null, dragOverId: null });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: colors.bgPanelHeader,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "13px",
          fontWeight: "600",
          color: colors.textPrimary,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>📑</span>
          <span>Layers Tree</span>
        </div>
        <span style={{ fontSize: "10px", color: colors.textMuted }}>
          Drag rows to reorder
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "6px 4px" }}>
        {schema ? (
          <LayerTreeNode
            node={schema}
            schema={schema}
            depth={0}
            selectedId={selectedId}
            onSelect={onSelectComponent}
            onDelete={onDeleteComponent}
            onMove={onMoveComponent}
            dragState={dragState}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ) : (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: colors.textMuted,
              fontSize: "12px",
            }}
          >
            No component tree available.
          </div>
        )}
      </div>
    </div>
  );
};
