import React, { useState, useCallback, useRef, useEffect } from "react";
import { SDUIRenderer } from "../../../sdui/SDUIRenderer";
import { ComponentRow } from "./ComponentRow";
import { DropSlot } from "./DropSlot";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { useDragDrop } from "../../dragdrop/DragDropContext";
import { findParentById } from "../../utils/treeUtils";
import { canAddChild, getDropMode } from "../../utils/validation";

/**
 * VisualCanvas — the center editor panel.
 *
 * THREE MODES:
 *  1. "visual" (default) — Live SDUI Grid renderer with selection outlines,
 *                          dynamic reflow preview, and live insertion markers.
 *  2. "list"             — Hierarchical component tree for structural editing.
 *  3. "clean"            — Pure customer live preview.
 */

import { IFrameDeviceFrame } from "./IFrameDeviceFrame";

// ─── List-style tree view (recursive) ─────────────────────────────────────────
const ListNodeTree = ({
  nodes,
  parentId,
  parentType,
  depth = 0,
  selectedId,
  expandedIds,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleExpand,
  onRowDragStart,
  onRowDragEnd,
}) => {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return (
      <>
        <DropSlot parentId={parentId} parentType={parentType} afterIndex={-1} isFirst />
        {depth === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>🧩</div>
            <div>Drag components here to start building</div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <DropSlot parentId={parentId} parentType={parentType} afterIndex={-1} isFirst />
      {nodes.map((node, index) => {
        const def = ComponentRegistry[node.type];
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;
        const isExpanded = expandedIds?.has(node.id);

        return (
          <React.Fragment key={node.id}>
            <ComponentRow
              node={node}
              depth={depth}
              isSelected={selectedId === node.id}
              onSelect={onSelect}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onToggleChildren={onToggleExpand}
              childrenExpanded={isExpanded}
              hasChildren={hasChildren || def?.canHaveChildren !== false}
              onRowDragStart={onRowDragStart}
              onRowDragEnd={onRowDragEnd}
            />
            {isExpanded && (
              <div style={{ borderLeft: "2px solid #e2e8f0", marginLeft: `${depth * 20 + 24}px` }}>
                <ListNodeTree
                  nodes={node.children || []}
                  parentId={node.id}
                  parentType={node.type}
                  depth={depth + 1}
                  selectedId={selectedId}
                  expandedIds={expandedIds}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onToggleExpand={onToggleExpand}
                  onRowDragStart={onRowDragStart}
                  onRowDragEnd={onRowDragEnd}
                />
              </div>
            )}
            <DropSlot parentId={parentId} parentType={parentType} afterIndex={index} />
          </React.Fragment>
        );
      })}
    </>
  );
};

// ─── VisualCanvas ──────────────────────────────────────────────────────────────
export const VisualCanvas = ({
  schema,
  activeDevice = "mobile",
  selectedId,
  selectedNode,
  onSelectComponent,
  onDuplicateComponent,
  onDeleteComponent,
  onMoveComponent,
  onApplyWidthPreset,
  onWrapInContainer,
  onResizePlacement,
  onInsertBlockAtSlot,
  onInsertNodesAtSlot,
  onDropItem,
  onInvalidDrop,
  editingContext = null,
  onNavigate,
}) => {
  const [mode, setMode] = useState("visual"); // 'visual' | 'list' | 'clean'
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const {
    startDrag,
    endDrag,
    isDragging,
    dragSource,
    dropSlot,
    previewTree,
    updateDropSlot,
    clearDropSlot,
    pointerPosition,
  } = useDragDrop();

  const canvasBodyRef = useRef(null);

  // Auto-scroll the canvas when dragging near its top/bottom edge, so long
  // pages remain reachable without the drag ever losing its drop target.
  useEffect(() => {
    if (!isDragging || !pointerPosition) return;
    const container = canvasBodyRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const EDGE = 60;
    const MAX_SPEED = 18;
    const distTop = pointerPosition.y - rect.top;
    const distBottom = rect.bottom - pointerPosition.y;

    let delta = 0;
    if (distTop >= 0 && distTop < EDGE) {
      delta = -MAX_SPEED * (1 - distTop / EDGE);
    } else if (distBottom >= 0 && distBottom < EDGE) {
      delta = MAX_SPEED * (1 - distBottom / EDGE);
    }
    if (delta !== 0) {
      container.scrollTop += delta;
    }
  }, [pointerPosition, isDragging]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleRowDragStart = (node) => {
    startDrag({
      type: node.type,
      nodeId: node.id,
      isNew: false,
      label: ComponentRegistry[node.type]?.label || node.type,
      sourceParentId: null,
    });
  };

  // Called when hovering over a node in visual mode
  const handleUpdateDropSlotFromRenderer = useCallback(
    (slotData) => {
      if (!dragSource || !slotData) return;
      updateDropSlot(slotData);
    },
    [dragSource, updateDropSlot]
  );

  // Drop onto a node in live visual mode
  const handleDropAtNode = ({ targetNode, position, resolvedSlot, draggedType, draggedId }) => {
    const src =
      dragSource ||
      (draggedId
        ? { nodeId: draggedId, isNew: false }
        : draggedType
        ? { type: draggedType, isNew: true }
        : null);

    if (!src) return;

    // 1. If resolvedSlot is provided and valid, execute drop at that exact target parent & slot
    if (resolvedSlot && resolvedSlot.isValid && resolvedSlot.parentId) {
      onDropItem?.({
        source: src,
        slot: resolvedSlot,
      });
      endDrag(false);
      return;
    }

    if (!targetNode) return;

    // 2. Direct inside drop
    if (position === "inside") {
      const check = canAddChild(targetNode, src.type, src.nodeId ? { excludeChildId: src.nodeId } : undefined);
      if (!check.valid) {
        onInvalidDrop?.({
          source: src,
          slot: { parentId: targetNode.id, parentType: targetNode.type },
          reason: check.reason || `Cannot place ${src.type} inside ${targetNode.type}`,
        });
        endDrag(false);
        return;
      }

      onDropItem?.({
        source: src,
        slot: {
          parentId: targetNode.id,
          parentType: targetNode.type,
          afterIndex: (targetNode.children?.length || 0) - 1,
        },
      });
      endDrag(false);
      return;
    }

    // 3. Fallback relative insertion
    const parentInfo = findParentById(schema, targetNode.id);
    if (!parentInfo) return;

    const afterIndex = position === "before" ? parentInfo.index - 1 : parentInfo.index;

    onDropItem?.({
      source: src,
      slot: {
        parentId: parentInfo.parent.id,
        parentType: parentInfo.parent.type,
        afterIndex,
      },
    });

    endDrag(false);
  };

  const getEditNodes = () => {
    if (!schema) return { nodes: [], parentId: null, parentType: "Page" };
    if (schema.type === "Home" && Array.isArray(schema.children)) {
      const page = schema.children.find((c) => c.type === "Page");
      if (page) return { nodes: page.children || [], parentId: page.id, parentType: "Page" };
      return { nodes: schema.children, parentId: schema.id, parentType: "Home" };
    }
    return { nodes: schema.children || [], parentId: schema.id, parentType: schema.type };
  };

  const { nodes, parentId, parentType } = getEditNodes();

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const draggedType = e.dataTransfer.getData("application/sdui-type") || dragSource?.type;
    const draggedId = e.dataTransfer.getData("application/sdui-id") || dragSource?.nodeId;
    const src =
      dragSource ||
      (draggedId
        ? { nodeId: draggedId, isNew: false }
        : draggedType
        ? { type: draggedType, isNew: true }
        : null);

    if (src && parentId) {
      onDropItem?.({
        source: src,
        slot: {
          parentId,
          parentType,
          afterIndex: nodes.length - 1,
        },
      });
      endDrag(false);
    }
  };

  const modes = [
    { id: "visual", label: "✏️ Visual Editor" },
    { id: "list", label: "☰ List View" },
    { id: "clean", label: "👁 Preview" },
  ];

  // Active schema rendered in canvas: use live preview tree when dragging
  const renderedSchema = isDragging && previewTree ? previewTree : schema;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}
      onDragOver={handleCanvasDragOver}
      onDrop={handleCanvasDrop}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          height: "44px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        {/* Mode Toggle */}
        <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: "8px", padding: "2px", gap: "1px" }}>
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                border: "none",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: mode === m.id ? "#ffffff" : "transparent",
                color: mode === m.id ? "#0f172a" : "#64748b",
                boxShadow: mode === m.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.12s ease",
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Context label */}
        {editingContext && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              padding: "3px 8px",
              borderRadius: "4px",
              backgroundColor: "rgba(79,70,229,0.1)",
              color: "#4f46e5",
            }}
          >
            🏷️ {editingContext} Studio
          </span>
        )}

        {/* Hint */}
        {mode === "visual" && (
          <span style={{ marginLeft: "auto", fontSize: "11px", color: "#64748b", fontWeight: "500", whiteSpace: "nowrap" }}>
            Drag & drop components anywhere • Grid automatically calculates & adjusts
          </span>
        )}
        {mode !== "visual" && (
          <span style={{ marginLeft: "auto", fontSize: "11px", color: "#94a3b8" }}>
            {nodes.length} component{nodes.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Canvas Body ─────────────────────────────────────────────────── */}
      <div
        ref={canvasBodyRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: mode === "visual" ? "#f1f5f9" : "#ffffff",
          padding: mode === "visual" ? "16px" : "0",
          position: "relative",
          height: "100%",
        }}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        onClick={(e) => {
          if (e.target === e.currentTarget) onSelectComponent?.(null);
        }}
      >
        {/* ══ VISUAL EDITOR MODE (100% Native SDUI Grid + Interactive Overlays + Live Reflow) ══ */}
        {mode === "visual" && (
          <IFrameDeviceFrame
            device={activeDevice}
            onCanvasDrop={handleCanvasDrop}
            onCanvasDragOver={handleCanvasDragOver}
            onSelectComponent={onSelectComponent}
            isolate={false}
          >
            {renderedSchema ? (
              <SDUIRenderer
                schema={renderedSchema}
                rootSchema={renderedSchema}
                deviceType={activeDevice}
                selectedId={selectedId}
                onSelect={onSelectComponent}
                isEditable={true}
                onDelete={onDeleteComponent}
                onDuplicate={onDuplicateComponent}
                onMoveUp={(id) => onMoveComponent?.(id, "up")}
                onMoveDown={(id) => onMoveComponent?.(id, "down")}
                onMoveLeft={(id) => onMoveComponent?.(id, "left")}
                onMoveRight={(id) => onMoveComponent?.(id, "right")}
                onMoveComponent={onMoveComponent}
                onDropAtNode={handleDropAtNode}
                onDragStartNode={(node) =>
                  startDrag({
                    type: node.type,
                    nodeId: node.id,
                    isNew: false,
                    label: ComponentRegistry[node.type]?.label || node.type,
                  })
                }
                onDragEndNode={() => endDrag(false)}
                onApplyWidthPreset={onApplyWidthPreset}
                onWrapInContainer={onWrapInContainer}
                onResizePlacement={onResizePlacement}
                isDragging={isDragging}
                dragSource={dragSource}
                dropSlot={dropSlot}
                onUpdateDropSlot={handleUpdateDropSlotFromRenderer}
                onClearDropSlot={clearDropSlot}
                onNavigate={onNavigate}
              />
            ) : (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📱</div>
                <div>No schema loaded</div>
              </div>
            )}
          </IFrameDeviceFrame>
        )}

        {/* ══ LIST VIEW MODE ════════════════════════════════════════════════ */}
        {mode === "list" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "8px 16px 6px", borderBottom: "1px solid #f1f5f9", backgroundColor: "#fafbfc" }}>
              <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {parentType} · {nodes.length} component{nodes.length !== 1 ? "s" : ""}
              </div>
            </div>
            <ListNodeTree
              nodes={nodes}
              parentId={parentId}
              parentType={parentType}
              depth={0}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelectComponent}
              onDelete={onDeleteComponent}
              onDuplicate={onDuplicateComponent}
              onToggleExpand={toggleExpand}
              onRowDragStart={handleRowDragStart}
              onRowDragEnd={() => endDrag(false)}
            />
          </div>
        )}

        {/* ══ CLEAN PREVIEW MODE ════════════════════════════════════════════ */}
        {mode === "clean" && (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "16px", backgroundColor: "#f1f5f9" }}>
            <IFrameDeviceFrame device={activeDevice}>
              {schema ? (
                <SDUIRenderer
                  schema={schema}
                  deviceType={activeDevice}
                  onNavigate={onNavigate}
                />
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No schema loaded</div>
              )}
            </IFrameDeviceFrame>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualCanvas;
