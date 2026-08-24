import React, { useState, useRef, useCallback } from "react";
import { SDUIRenderer } from "../../../sdui/SDUIRenderer";
import { ContextMenu } from "../../../sdui/components/overlays/ContextMenu";
import { BottomSheet } from "../../../sdui/components/overlays/BottomSheet";
import { ImagePreviewModal } from "../../../sdui/components/overlays/ImagePreviewModal";
import { executeOptionAction } from "../../../sdui/actions/actionExecutor";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { findParentById } from "../../../cms/utils/treeUtils";

/**
 * VisualCanvas — renders the SDUI page inside a responsive device frame.
 * Supports Edit Mode (click to select, drag/drop reordering) and Live Preview mode.
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
  onOpenInspector,
}) => {
  const [menu, setMenu] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [isInteractive, setIsInteractive] = useState(false); // default: Edit Mode
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
  const handleCanvasOverlayClick = useCallback(
    (e) => {
      if (isInteractive) return;

      let el = e.target;
      while (el && el !== e.currentTarget) {
        const id = el.getAttribute("data-sdui-id");
        if (id) {
          onSelectComponent(id);
          return;
        }
        el = el.parentElement;
      }
      onSelectComponent(null);
    },
    [isInteractive, onSelectComponent]
  );

  const selectedDef = selectedNode ? ComponentRegistry[selectedNode.type] : null;

  return (
    <div className="cms-canvas-container">
      {/* Canvas Top Bar */}
      <div
        style={{
          padding: "8px 12px",
          background: "var(--cms-bg-panel)",
          borderBottom: "1px solid var(--cms-border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
          flexShrink: 0,
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--cms-text-muted)" }}>Viewport:</span>
          <span style={{ fontWeight: "700", color: "var(--cms-text-primary)", textTransform: "capitalize" }}>
            {activeDevice} ({getDeviceWidth()})
          </span>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: "flex", alignItems: "center" }}>
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
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            zIndex: 999,
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span
              style={{
                background: "var(--cms-accent-primary)",
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              {selectedDef?.icon} {selectedDef?.label || selectedNode.type}
            </span>
            <span style={{ fontSize: "10px", color: "var(--cms-text-muted)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              #{selectedNode.id}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              className="cms-btn-icon"
              onClick={() => onMoveComponent(selectedNode.id, "up")}
              title="Move Up"
              style={{ width: "26px", height: "26px", fontSize: "13px" }}
            >
              ↑
            </button>
            <button
              className="cms-btn-icon"
              onClick={() => onMoveComponent(selectedNode.id, "down")}
              title="Move Down"
              style={{ width: "26px", height: "26px", fontSize: "13px" }}
            >
              ↓
            </button>
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
            {onOpenInspector && (
              <button
                className="cms-btn cms-btn-primary"
                onClick={onOpenInspector}
                style={{ padding: "3px 8px", fontSize: "11px", marginLeft: "4px" }}
              >
                ⚙️ Configure
              </button>
            )}
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
              onSelect={undefined}
            />
          </div>

          {/* Overlays */}
          <ContextMenu data={menu} onClose={closeMenu} onSelect={handleOptionSelect} />
          <BottomSheet isOpen={!!sheetData} data={sheetData} onClose={closeSheet} onSelect={handleOptionSelect} />
          <ImagePreviewModal data={imageModal} onClose={closeImageModal} />
        </div>
      </div>

      {/* Mobile Floating Action Button to configure selected component */}
      {selectedNode && onOpenInspector && !isInteractive && (
        <button
          className="cms-mobile-edit-fab"
          onClick={onOpenInspector}
          title={`Configure ${selectedDef?.label || selectedNode.type}`}
        >
          <span>⚙️</span>
          <span>Edit {selectedDef?.label || selectedNode.type} →</span>
        </button>
      )}
    </div>
  );
};
