import React, { useState, useRef, useCallback } from "react";
import { SDUIRenderer } from "../../../sdui/SDUIRenderer";
import { ContextMenu } from "../../../sdui/components/overlays/ContextMenu";
import { BottomSheet } from "../../../sdui/components/overlays/BottomSheet";
import { ImagePreviewModal } from "../../../sdui/components/overlays/ImagePreviewModal";
import { executeOptionAction } from "../../../sdui/actions/actionExecutor";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { findNodeById, findParentById } from "../../../cms/utils/treeUtils";

/**
 * VisualCanvas — renders the SDUI page inside a device frame.
 *
 * CMS Edit Mode (isInteractive=false):
 *   Clicking any rendered component selects it in the CMS.
 *   Drag-and-drop reordering is enabled via a transparent overlay.
 *
 * Live Preview Mode (isInteractive=true):
 *   Clicking fires the SDUI component's own onTap/longPress actions.
 *   CMS selection is disabled.
 */
export const VisualCanvas = ({
  schema,
  activeDevice,
  selectedId,
  selectedNode,
  onSelectComponent,
  onDuplicateComponent,
  onDeleteComponent,
  onMoveComponent,
  onNavigate,
}) => {
  const [menu, setMenu] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [isInteractive, setIsInteractive] = useState(false); // default: CMS edit mode
  const [dragOverId, setDragOverId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragNodeRef = useRef(null);

  const getDeviceWidth = () => {
    if (activeDevice === "mobile") return "375px";
    if (activeDevice === "tablet") return "768px";
    return "100%";
  };

  const closeMenu = () => setMenu(null);
  const closeSheet = () => setSheetData(null);
  const closeImageModal = () => setImageModal(null);

  const handleOptionSelect = async (option) => {
    try {
      const action = option.action || {};
      if (action.type === "OPEN_BOTTOM_SHEET") {
        closeMenu();
        setSheetData({ title: action.data?.title, options: action.data?.options || [] });
        return;
      }
      if (action.type === "SHOW_IMAGE_MODAL" || action.type === "SHOW_IMAGE_PREVIEW") {
        closeMenu();
        closeSheet();
        setImageModal({ imageUrl: action.data?.imageUrl });
        return;
      }
      await executeOptionAction(option);
      closeMenu();
      closeSheet();
      closeImageModal();
    } catch (err) {
      console.error("[VisualCanvas] Action execution failed:", err);
    }
  };

  // ─── CMS Click Intercept ─────────────────────────────────────────────────
  // In edit mode, we capture clicks on the canvas overlay and translate them
  // to component selections using data-sdui-id attributes.
  const handleCanvasOverlayClick = useCallback(
    (e) => {
      if (isInteractive) return; // live mode: let events pass through

      // Walk up from click target to find the nearest data-sdui-id
      let el = e.target;
      while (el && el !== e.currentTarget) {
        const id = el.getAttribute("data-sdui-id");
        if (id) {
          onSelectComponent(id);
          return;
        }
        el = el.parentElement;
      }
      // Clicked empty canvas — deselect
      onSelectComponent(null);
    },
    [isInteractive, onSelectComponent]
  );

  // ─── Drag & Drop (HTML5 native, no external lib) ─────────────────────────
  const handleDragStart = useCallback((e, id) => {
    setDraggingId(id);
    dragNodeRef.current = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
    dragNodeRef.current = null;
  }, []);

  const handleDragOver = useCallback(
    (e, id) => {
      e.preventDefault();
      if (id !== draggingId) {
        setDragOverId(id);
      }
    },
    [draggingId]
  );

  const handleDrop = useCallback(
    (e, targetId) => {
      e.preventDefault();
      const sourceId = dragNodeRef.current || e.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetId) {
        setDragOverId(null);
        return;
      }

      // Check if source and target share the same parent (sibling reorder)
      const sourceParent = findParentById(schema, sourceId);
      const targetParent = findParentById(schema, targetId);

      if (sourceParent && targetParent && sourceParent.parent.id === targetParent.parent.id) {
        // Same parent → reorder. Move source before/after target based on index.
        const sourceIndex = sourceParent.index;
        const targetIndex = targetParent.index;
        const direction = targetIndex > sourceIndex ? "down" : "up";
        // Move step by step
        const steps = Math.abs(targetIndex - sourceIndex);
        for (let i = 0; i < steps; i++) {
          onMoveComponent(sourceId, direction);
        }
      }

      setDragOverId(null);
      setDraggingId(null);
    },
    [schema, onMoveComponent]
  );

  const selectedDef = selectedNode ? ComponentRegistry[selectedNode.type] : null;

  return (
    <div className="cms-canvas-container">
      {/* Canvas Top Bar */}
      <div
        style={{
          padding: "8px 16px",
          background: "var(--cms-bg-panel)",
          borderBottom: "1px solid var(--cms-border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "var(--cms-text-muted)" }}>Viewport:</span>
          <span style={{ fontWeight: "700", color: "var(--cms-text-primary)", textTransform: "capitalize" }}>
            {activeDevice} ({getDeviceWidth()})
          </span>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setIsInteractive(false)}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "600",
              background: !isInteractive ? "var(--cms-accent-primary)" : "var(--cms-bg-card)",
              color: !isInteractive ? "#fff" : "var(--cms-text-muted)",
              border: "1px solid",
              borderColor: !isInteractive ? "var(--cms-accent-primary)" : "var(--cms-border-medium)",
              borderRadius: "5px 0 0 5px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            title="Edit Mode: click to select components"
          >
            ✏️ Edit Mode
          </button>
          <button
            onClick={() => setIsInteractive(true)}
            style={{
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: "600",
              background: isInteractive ? "var(--cms-success)" : "var(--cms-bg-card)",
              color: isInteractive ? "#fff" : "var(--cms-text-muted)",
              border: "1px solid",
              borderColor: isInteractive ? "var(--cms-success)" : "var(--cms-border-medium)",
              borderRadius: "0 5px 5px 0",
              cursor: "pointer",
              transition: "all 0.15s",
              marginLeft: "-1px",
            }}
            title="Live Preview: component actions & gestures active"
          >
            ▶ Live Preview
          </button>
        </div>
      </div>

      {/* Selected Component Sticky Toolbar */}
      {selectedNode && !isInteractive && (
        <div
          style={{
            background: "rgba(22, 24, 36, 0.97)",
            backdropFilter: "blur(8px)",
            borderBottom: "2px solid var(--cms-accent-primary)",
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            zIndex: 999,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                background: "var(--cms-accent-primary)",
                color: "#fff",
                padding: "2px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "700",
              }}
            >
              {selectedDef?.icon} {selectedDef?.label || selectedNode.type}
            </span>
            <span style={{ fontSize: "10px", color: "var(--cms-text-muted)", fontFamily: "monospace" }}>
              #{selectedNode.id}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              className="cms-btn-icon"
              onClick={() => onMoveComponent(selectedNode.id, "up")}
              title="Move Up"
              style={{ width: "26px", height: "26px", fontSize: "14px" }}
            >
              ↑
            </button>
            <button
              className="cms-btn-icon"
              onClick={() => onMoveComponent(selectedNode.id, "down")}
              title="Move Down"
              style={{ width: "26px", height: "26px", fontSize: "14px" }}
            >
              ↓
            </button>
            <div style={{ width: "1px", height: "20px", background: "var(--cms-border-subtle)", margin: "0 4px" }} />
            <button
              className="cms-btn-icon"
              onClick={() => onDuplicateComponent(selectedNode.id)}
              title="Duplicate"
              style={{ width: "26px", height: "26px" }}
            >
              ⧉
            </button>
            <button
              className="cms-btn-icon"
              onClick={() => onDeleteComponent(selectedNode.id)}
              title="Delete"
              style={{ width: "26px", height: "26px", color: "var(--cms-danger)" }}
            >
              🗑️
            </button>
          </div>
        </div>
      )}

      {/* Viewport Canvas Frame */}
      <div className="cms-canvas-viewport">
        <div
          className="cms-device-frame"
          style={{
            width: getDeviceWidth(),
            maxWidth: "100%",
            position: "relative",
          }}
        >
          {/* Transparent click-intercept overlay for Edit Mode */}
          {!isInteractive && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                cursor: "default",
              }}
              onClick={handleCanvasOverlayClick}
            />
          )}

          {/* Actual SDUI Renderer */}
          <div style={{ minHeight: "100%", backgroundColor: "#f3f3f3", position: "relative" }}>
            <SDUIRenderer
              schema={schema}
              deviceType={activeDevice}
              openMenu={isInteractive ? setMenu : undefined}
              openSheet={isInteractive ? setSheetData : undefined}
              openImageModal={isInteractive ? setImageModal : undefined}
              onNavigate={onNavigate}
              selectedId={isInteractive ? undefined : selectedId}
              onSelect={undefined} // selection handled by overlay above
            />
          </div>

          {/* Overlays */}
          <ContextMenu data={menu} onClose={closeMenu} onSelect={handleOptionSelect} />
          <BottomSheet isOpen={!!sheetData} data={sheetData} onClose={closeSheet} onSelect={handleOptionSelect} />
          <ImagePreviewModal data={imageModal} onClose={closeImageModal} />
        </div>
      </div>

      {/* Drag & Drop Layer Hint (shows when dragging) */}
      {!isInteractive && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "11px",
            color: "var(--cms-text-muted)",
            background: "rgba(22,24,36,0.8)",
            padding: "4px 12px",
            borderRadius: "20px",
            pointerEvents: "none",
            opacity: 0.8,
          }}
        >
          ✏️ Edit Mode — Click to select · Layers tree supports drag-to-reorder
        </div>
      )}
    </div>
  );
};
