import React from "react";
import { defaultInterfaces } from "../../../schema/defaultInterfaces";
import { colors, commonStyles } from "../../theme";

export const CmsHeader = ({
  activePage,
  activeInterfaceId,
  activeDevice,
  activeBranch = "main",
  editingContext = null,
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
  onBackToDashboard,
}) => {
  const currentInterface = defaultInterfaces.find((i) => i.id === activeInterfaceId);

  return (
    <header
      style={{
        height: "54px",
        backgroundColor: "#ffffff",
        borderBottom: `1px solid ${colors.borderSubtle}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        zIndex: 50,
        gap: "10px",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Left: Brand, Dashboard Return & Page / Component Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#334155",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            title="Return to Journey Workspace Dashboard"
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: 700,
            fontSize: "12px",
            color: "#ffffff",
            padding: "4px 10px",
            background: "#4f46e5",
            borderRadius: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <span>⚡</span>
          <span>{editingContext ? `${editingContext} Studio` : "Page Studio"}</span>
        </div>

        {!editingContext && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#ffffff",
              border: `1px solid ${colors.borderMedium}`,
              padding: "5px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              color: colors.textPrimary,
              cursor: "pointer",
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
        )}

        {/* Branch Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "3px 8px",
            borderRadius: "6px",
            backgroundColor: "rgba(79, 70, 229, 0.08)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
            fontSize: "11px",
            fontWeight: "600",
            color: "#4f46e5",
          }}
          title={`Active working branch: ${activeBranch}`}
        >
          <span>🌿</span>
          <span>{activeBranch}</span>
        </div>
      </div>

      {/* Center: Device Viewport Controls & Undo/Redo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            gap: "2px",
            background: "#f1f5f9",
            padding: "2px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <button
            style={{
              ...commonStyles.btnIcon,
              border: "none",
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
              border: "none",
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
            background: "#f1f5f9",
            padding: "2px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <button
            style={{
              ...commonStyles.btnIcon,
              border: "none",
              background: activeDevice === "mobile" ? "#ffffff" : "transparent",
              color: activeDevice === "mobile" ? colors.accentPrimary : colors.textSecondary,
              boxShadow: activeDevice === "mobile" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
            onClick={() => onDeviceChange("mobile")}
            title="Mobile View (375px)"
          >
            📱
          </button>
          <button
            style={{
              ...commonStyles.btnIcon,
              border: "none",
              background: activeDevice === "tablet" ? "#ffffff" : "transparent",
              color: activeDevice === "tablet" ? colors.accentPrimary : colors.textSecondary,
              boxShadow: activeDevice === "tablet" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
            onClick={() => onDeviceChange("tablet")}
            title="Tablet View (768px)"
          >
            📟
          </button>
          <button
            style={{
              ...commonStyles.btnIcon,
              border: "none",
              background: activeDevice === "desktop" ? "#ffffff" : "transparent",
              color: activeDevice === "desktop" ? colors.accentPrimary : colors.textSecondary,
              boxShadow: activeDevice === "desktop" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
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
            border: "1px solid #cbd5e1",
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
            padding: "6px 14px",
          }}
          onClick={onSave}
          title="Save Changes to Page / Component"
        >
          <span>💾</span>
          <span>Save</span>
        </button>
      </div>
    </header>
  );
};

export default CmsHeader;
