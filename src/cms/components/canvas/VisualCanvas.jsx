import React, { useState } from "react";
import { SDUIRenderer } from "../../../sdui/SDUIRenderer";
import { ComponentRow } from "./ComponentRow";
import { DropSlot } from "./DropSlot";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { useDragDrop } from "../../dragdrop/DragDropContext";
import { findParentById } from "../../utils/treeUtils";

/**
 * VisualCanvas — the center editor panel.
 *
 * THREE MODES:
 *  1. "visual" (default) — Live SDUI Grid renderer with selection outlines,
 *                          floating action pills (Move Up/Down, Duplicate, Delete),
 *                          and drag-and-drop insertion markers.
 *  2. "list"             — Hierarchical component tree for structural editing.
 *  3. "clean"            — Pure customer live preview.
 */

// ─── Device Frame Chrome ───────────────────────────────────────────────────────
const DeviceFrame = ({ device, children }) => {
  if (device === "mobile") {
    return (
      <div style={{
        width: "390px",
        borderRadius: "48px",
        border: "10px solid #1e293b",
        boxShadow: "0 24px 48px rgba(0,0,0,0.3), 0 0 0 2px #334155 inset",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        flexShrink: 0,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "800px",
        maxHeight: "calc(100vh - 140px)",
      }}>
        {/* Status bar */}
        <div style={{ height: "26px", backgroundColor: "#1e293b", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, userSelect: "none" }}>
          <span style={{ color: "#ffffff", fontSize: "10px", fontWeight: "700" }}>9:41</span>
          <div style={{ width: "70px", height: "14px", backgroundColor: "#334155", borderRadius: "7px" }} />
          <span style={{ color: "#ffffff", fontSize: "10px" }}>▲ ■</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#ffffff" }}>
          {children}
        </div>
        {/* Home indicator */}
        <div style={{ height: "18px", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: "100px", height: "4px", backgroundColor: "#cbd5e1", borderRadius: "2px" }} />
        </div>
      </div>
    );
  }

  if (device === "tablet") {
    return (
      <div style={{
        width: "min(768px, 100%)",
        borderRadius: "28px",
        border: "8px solid #1e293b",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        height: "820px",
        maxHeight: "calc(100vh - 140px)",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div style={{ width: "100%", backgroundColor: "#ffffff", flex: 1, overflowY: "auto" }}>
      {children}
    </div>
  );
};

// ─── List-style tree view (recursive) ─────────────────────────────────────────
const ListNodeTree = ({
  nodes, parentId, parentType, depth = 0,
  selectedId, expandedIds, onSelect, onDelete, onDuplicate, onToggleExpand,
  onRowDragStart, onRowDragEnd,
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
  onDropItem,
  onInvalidDrop,
  editingContext = null,
  onNavigate,
}) => {
  const [mode, setMode] = useState("visual"); // 'visual' | 'list' | 'clean'
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const { startDrag, endDrag, isDragging, dragSource } = useDragDrop();

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

  // Drop onto a node in live visual mode
  const handleDropAtNode = ({ targetNode, position }) => {
    if (!targetNode || !dragSource) return;

    const parentInfo = findParentById(schema, targetNode.id);
    if (!parentInfo) return;

    const afterIndex = position === "before" ? parentInfo.index - 1 : parentInfo.index;

    onDropItem?.({
      source: dragSource,
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

  const modes = [
    { id: "visual", label: "✏️ Visual Editor" },
    { id: "list",   label: "☰ List View" },
    { id: "clean",  label: "👁 Preview" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden" }}>

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div style={{
        height: "44px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", padding: "0 16px", gap: "8px",
        flexShrink: 0,
      }}>
        {/* Mode Toggle */}
        <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: "8px", padding: "2px", gap: "1px" }}>
          {modes.map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding: "4px 12px", borderRadius: "6px", border: "none",
              fontSize: "11px", fontWeight: "600", cursor: "pointer",
              backgroundColor: mode === m.id ? "#ffffff" : "transparent",
              color: mode === m.id ? "#0f172a" : "#64748b",
              boxShadow: mode === m.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.12s ease", whiteSpace: "nowrap",
            }}>{m.label}</button>
          ))}
        </div>

        {/* Context label */}
        {editingContext && (
          <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", backgroundColor: "rgba(79,70,229,0.1)", color: "#4f46e5" }}>
            🏷️ {editingContext} Studio
          </span>
        )}

        {/* Hint */}
        {mode === "visual" && (
          <span style={{ marginLeft: "auto", fontSize: "10px", color: "#94a3b8", whiteSpace: "nowrap" }}>
            Click component to inspect • Use ▲ ▼ or drag to reorder
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
        style={{
          flex: 1,
          overflowY: mode === "visual" ? "hidden" : "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: mode === "visual" ? "center" : "stretch",
          justifyContent: mode === "visual" ? "center" : undefined,
          backgroundColor: mode === "visual" ? "#e2e8f0" : "#ffffff",
          padding: mode === "visual" ? "16px" : "0",
          position: "relative",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onSelectComponent?.(null);
        }}
      >

        {/* ══ VISUAL EDITOR MODE (100% Native SDUI Grid + Interactive Overlays) ══ */}
        {mode === "visual" && (
          <DeviceFrame device={activeDevice}>
            {schema ? (
              <SDUIRenderer
                schema={schema}
                deviceType={activeDevice}
                selectedId={selectedId}
                onSelect={onSelectComponent}
                isEditable={true}
                onDelete={onDeleteComponent}
                onDuplicate={onDuplicateComponent}
                onMoveUp={(id) => onMoveComponent?.(id, "up")}
                onMoveDown={(id) => onMoveComponent?.(id, "down")}
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
                isDragging={isDragging}
                dragSource={dragSource}
                onNavigate={onNavigate}
              />
            ) : (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>📱</div>
                <div>No schema loaded</div>
              </div>
            )}
          </DeviceFrame>
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
          <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "16px", backgroundColor: "#e2e8f0" }}>
            <DeviceFrame device={activeDevice}>
              {schema ? (
                <SDUIRenderer
                  schema={schema}
                  deviceType={activeDevice}
                  onNavigate={onNavigate}
                />
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>No schema loaded</div>
              )}
            </DeviceFrame>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualCanvas;
