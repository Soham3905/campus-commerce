import React from "react";
import { defaultInterfaces } from "../../../schema/defaultInterfaces";
import { colors, commonStyles } from "../../theme";

export const CmsHeader = ({
  activePage,
  activeInterfaceId,
  activeDevice,
  isDirty,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onDeviceChange,
  onSave,
  onOpenPages,
  onOpenInterfaces,
  onOpenJson,
}) => {
  const currentInterface = defaultInterfaces.find((i) => i.id === activeInterfaceId);

  return (
    <header
      style={{
        height: "52px",
        backgroundColor: colors.bgPanel,
        borderBottom: `1px solid ${colors.borderSubtle}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 50,
        gap: "8px",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Left: Brand & Page Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.02em",
            color: "#fff",
            padding: "4px 10px",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            borderRadius: "6px",
            whiteSpace: "nowrap",
          }}
          title="SDUI Visual Component CMS"
        >
          <span>⚡</span>
          <span>SDUI CMS</span>
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: colors.bgCard,
            border: `1px solid ${colors.borderMedium}`,
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: colors.textPrimary,
            cursor: "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
            maxWidth: "180px",
            outline: "none",
          }}
          onClick={onOpenPages}
          title="Manage & Switch Pages"
        >
          <span>📄</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {activePage?.name || "Select Page"}
          </span>
          <span style={{ fontSize: "9px", opacity: 0.7 }}>▾</span>
        </button>

        {currentInterface && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: colors.bgCard,
              border: `1px solid ${colors.borderSubtle}`,
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              color: colors.textPrimary,
              cursor: "pointer",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
              maxWidth: "180px",
              opacity: 0.9,
              outline: "none",
            }}
            onClick={onOpenInterfaces}
            title={`Blueprint: ${currentInterface.name}`}
          >
            <span>{currentInterface.icon || "📐"}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentInterface.name}
            </span>
          </button>
        )}
      </div>

      {/* Center: Device Viewport Controls & Undo/Redo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            gap: "2px",
            background: colors.bgCard,
            padding: "2px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <button
            style={{
              ...commonStyles.btnIcon,
              opacity: canUndo ? 1 : 0.35,
              cursor: canUndo ? "pointer" : "default",
            }}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            ↩
          </button>
          <button
            style={{
              ...commonStyles.btnIcon,
              opacity: canRedo ? 1 : 0.35,
              cursor: canRedo ? "pointer" : "default",
            }}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            ↪
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2px",
            background: colors.bgCard,
            padding: "2px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <button
            style={{
              ...commonStyles.btnIcon,
              background: activeDevice === "mobile" ? colors.accentPrimaryLight : "transparent",
              color: activeDevice === "mobile" ? colors.textAccent : colors.textSecondary,
              borderColor: activeDevice === "mobile" ? colors.accentPrimary : "transparent",
            }}
            onClick={() => onDeviceChange("mobile")}
            title="Mobile View (375px)"
          >
            📱
          </button>
          <button
            style={{
              ...commonStyles.btnIcon,
              background: activeDevice === "tablet" ? colors.accentPrimaryLight : "transparent",
              color: activeDevice === "tablet" ? colors.textAccent : colors.textSecondary,
              borderColor: activeDevice === "tablet" ? colors.accentPrimary : "transparent",
            }}
            onClick={() => onDeviceChange("tablet")}
            title="Tablet View (768px)"
          >
            📟
          </button>
          <button
            style={{
              ...commonStyles.btnIcon,
              background: activeDevice === "desktop" ? colors.accentPrimaryLight : "transparent",
              color: activeDevice === "desktop" ? colors.textAccent : colors.textSecondary,
              borderColor: activeDevice === "desktop" ? colors.accentPrimary : "transparent",
            }}
            onClick={() => onDeviceChange("desktop")}
            title="Desktop View (Full Width)"
          >
            💻
          </button>
        </div>
      </div>

      {/* Right: Actions & Save State */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Status indicator */}
        <div style={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" }}>
          {saveStatus === "saving" && (
            <span style={{ color: colors.warning }}>⏳ Saving...</span>
          )}
          {saveStatus === "saved" && (
            <span style={{ color: colors.success }}>✓ Saved</span>
          )}
          {saveStatus === "idle" && isDirty && (
            <span style={{ color: colors.warning }}>● Unsaved</span>
          )}
        </div>

        <button
          style={{
            ...commonStyles.btn,
            ...commonStyles.btnSecondary,
          }}
          onClick={onOpenJson}
          title="Advanced JSON Editor"
        >
          <span>{`{ }`}</span>
          <span>JSON</span>
        </button>

        <button
          style={{
            ...commonStyles.btn,
            ...commonStyles.btnPrimary,
          }}
          onClick={onSave}
          title="Save Changes to Page"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
      </div>
    </header>
  );
};
