import React, { useState, useCallback } from "react";
import { SDUIRenderer } from "../../../sdui/SDUIRenderer";
import { ContextMenu } from "../../../sdui/components/overlays/ContextMenu";
import { BottomSheet } from "../../../sdui/components/overlays/BottomSheet";
import { ImagePreviewModal } from "../../../sdui/components/overlays/ImagePreviewModal";
import { executeOptionAction } from "../../../sdui/actions/actionExecutor";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { colors, commonStyles } from "../../theme";

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

  // Click intercept for selecting components on the visual canvas
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
    <div
      style={{
        flex: 1,
        background: `radial-gradient(circle at center, #1b1d2d 0%, ${colors.bgCanvas} 100%)`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Canvas Top Bar */}
      <div
        style={{
          padding: "8px 12px",
          background: colors.bgPanel,
          borderBottom: `1px solid ${colors.borderSubtle}`,
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
          <span style={{ color: colors.textMuted }}>Viewport:</span>
          <span style={{ fontWeight: "700", color: colors.textPrimary, textTransform: "capitalize" }}>
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
              background: !isInteractive ? colors.accentPrimary : colors.bgCard,
              color: !isInteractive ? "#fff" : colors.textMuted,
              border: "1px solid",
              borderColor: !isInteractive ? colors.accentPrimary : colors.borderMedium,
              borderRadius: "5px 0 0 5px",
              cursor: "pointer",
              transition: "all 0.15s",
              outline: "none",
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
              background: isInteractive ? colors.success : colors.bgCard,
              color: isInteractive ? "#fff" : colors.textMuted,
              border: "1px solid",
              borderColor: isInteractive ? colors.success : colors.borderMedium,
              borderRadius: "0 5px 5px 0",
              cursor: "pointer",
              transition: "all 0.15s",
              marginLeft: "-1px",
              outline: "none",
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
            borderBottom: `2px solid ${colors.accentPrimary}`,
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
                background: colors.accentPrimary,
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
            <span
              style={{
                fontSize: "10px",
                color: colors.textMuted,
                fontFamily: "monospace",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              #{selectedNode.id}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              style={{ ...commonStyles.btnIcon, width: "26px", height: "26px", fontSize: "13px" }}
              onClick={() => onMoveComponent(selectedNode.id, "up")}
              title="Move Up"
            >
              ↑
            </button>
            <button
              style={{ ...commonStyles.btnIcon, width: "26px", height: "26px", fontSize: "13px" }}
              onClick={() => onMoveComponent(selectedNode.id, "down")}
              title="Move Down"
            >
              ↓
            </button>
            <button
              style={{ ...commonStyles.btnIcon, width: "26px", height: "26px" }}
              onClick={() => onDuplicateComponent(selectedNode.id)}
              title="Duplicate"
            >
              ⧉
            </button>
            <button
              style={{ ...commonStyles.btnIcon, width: "26px", height: "26px", color: colors.danger }}
              onClick={() => onDeleteComponent(selectedNode.id)}
              title="Delete"
            >
              🗑️
            </button>
            {onOpenInspector && (
              <button
                style={{
                  ...commonStyles.btn,
                  ...commonStyles.btnPrimary,
                  padding: "3px 8px",
                  fontSize: "11px",
                  marginLeft: "4px",
                }}
                onClick={onOpenInspector}
              >
                ⚙️ Configure
              </button>
            )}
          </div>
        </div>
      )}

      {/* Viewport Canvas Frame */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "16px",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            width: getDeviceWidth(),
            maxWidth: "100%",
            position: "relative",
            background: "#ffffff",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px #363a54",
            borderRadius: "10px",
            overflow: "hidden",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: "100%",
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
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            background: `linear-gradient(135deg, ${colors.accentPrimary}, #4f46e5)`,
            color: "#ffffff",
            padding: "8px 14px",
            borderRadius: "24px",
            fontSize: "12px",
            fontWeight: 700,
            border: "none",
            boxShadow: "0 6px 18px rgba(99, 102, 241, 0.45)",
            cursor: "pointer",
            zIndex: 15,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            outline: "none",
          }}
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
