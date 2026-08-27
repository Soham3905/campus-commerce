import React from "react";
import { defaultInterfaces } from "../../../schema/defaultInterfaces";
import { colors, commonStyles } from "../../theme";
import {
  LayoutDashboard,
  Smartphone,
  Tablet,
  Monitor,
  Undo2,
  Redo2,
  Save,
  FileCode,
  Layers,
  ChevronDown,
  GitBranch,
  Sparkles,
} from "lucide-react";

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
  onOpenBranches,
  onBackToDashboard,
}) => {
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
        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      {/* Left: Brand, Dashboard Return, Context, Page & Branch Switchers */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#334155",
              fontSize: "12px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            title="Return to Journey Workspace Dashboard"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f1f5f9";
              e.currentTarget.style.borderColor = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
          >
            <LayoutDashboard size={14} color="#4f46e5" />
            <span>Dashboard</span>
          </button>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: 700,
            fontSize: "12px",
            color: "#ffffff",
            padding: "5px 10px",
            background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 4px rgba(79,70,229,0.25)",
          }}
        >
          <Sparkles size={13} />
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
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: colors.textPrimary,
              cursor: "pointer",
              whiteSpace: "nowrap",
              maxWidth: "200px",
              outline: "none",
              transition: "all 0.15s ease",
            }}
            onClick={onOpenPages}
            title="Manage & Switch Pages"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4f46e5";
              e.currentTarget.style.backgroundColor = "rgba(79,70,229,0.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.borderMedium;
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            <span>📄</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activePage?.name || "Select Page"}
            </span>
            <ChevronDown size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
          </button>
        )}

        {!editingContext && onOpenInterfaces && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#ffffff",
              border: `1px solid ${colors.borderMedium}`,
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: colors.textPrimary,
              cursor: "pointer",
              whiteSpace: "nowrap",
              outline: "none",
              transition: "all 0.15s ease",
            }}
            onClick={onOpenInterfaces}
            title="Apply a reusable interface blueprint"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4f46e5";
              e.currentTarget.style.backgroundColor = "rgba(79,70,229,0.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.borderMedium;
              e.currentTarget.style.backgroundColor = "#ffffff";
            }}
          >
            <span>📐</span>
            <span>{defaultInterfaces.find((i) => i.id === activeInterfaceId)?.name || "Blueprints"}</span>
          </button>
        )}

        {/* Clickable Branch Switcher Button */}
        <button
          onClick={onOpenBranches}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "5px 10px",
            borderRadius: "8px",
            backgroundColor: "rgba(79, 70, 229, 0.08)",
            border: "1px solid rgba(79, 70, 229, 0.25)",
            fontSize: "11px",
            fontWeight: "600",
            color: "#4f46e5",
            cursor: onOpenBranches ? "pointer" : "default",
            transition: "all 0.15s ease",
          }}
          title={`Active working branch: ${activeBranch}. Click to manage branches.`}
          onMouseEnter={(e) => {
            if (onOpenBranches) e.currentTarget.style.backgroundColor = "rgba(79, 70, 229, 0.16)";
          }}
          onMouseLeave={(e) => {
            if (onOpenBranches) e.currentTarget.style.backgroundColor = "rgba(79, 70, 229, 0.08)";
          }}
        >
          <GitBranch size={13} />
          <span>{activeBranch}</span>
          {onOpenBranches && <ChevronDown size={11} style={{ opacity: 0.7 }} />}
        </button>
      </div>

      {/* Center: Device Viewport Controls & Undo/Redo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            display: "flex",
            gap: "2px",
            background: "#f1f5f9",
            padding: "3px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <button
            style={{
              padding: "5px 8px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "transparent",
              opacity: canUndo ? 1 : 0.35,
              cursor: canUndo ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#334155",
            }}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            style={{
              padding: "5px 8px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "transparent",
              opacity: canRedo ? 1 : 0.35,
              cursor: canRedo ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#334155",
            }}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2px",
            background: "#f1f5f9",
            padding: "3px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <button
            style={{
              padding: "5px 9px",
              borderRadius: "6px",
              border: "none",
              background: activeDevice === "mobile" ? "#ffffff" : "transparent",
              color: activeDevice === "mobile" ? "#4f46e5" : "#64748b",
              boxShadow: activeDevice === "mobile" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "11px",
            }}
            onClick={() => onDeviceChange("mobile")}
            title="Mobile View (375px)"
          >
            <Smartphone size={14} />
          </button>
          <button
            style={{
              padding: "5px 9px",
              borderRadius: "6px",
              border: "none",
              background: activeDevice === "tablet" ? "#ffffff" : "transparent",
              color: activeDevice === "tablet" ? "#4f46e5" : "#64748b",
              boxShadow: activeDevice === "tablet" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "11px",
            }}
            onClick={() => onDeviceChange("tablet")}
            title="Tablet View (768px)"
          >
            <Tablet size={14} />
          </button>
          <button
            style={{
              padding: "5px 9px",
              borderRadius: "6px",
              border: "none",
              background: activeDevice === "desktop" ? "#ffffff" : "transparent",
              color: activeDevice === "desktop" ? "#4f46e5" : "#64748b",
              boxShadow: activeDevice === "desktop" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "11px",
            }}
            onClick={() => onDeviceChange("desktop")}
            title="Desktop View (Full Width)"
          >
            <Monitor size={14} />
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
            <span style={{ color: "#059669" }}>✓ Saved</span>
          )}
          {saveStatus === "idle" && isDirty && (
            <span style={{ color: "#d97706" }}>● Unsaved</span>
          )}
        </div>

        <button
          style={{
            ...btn(false),
            border: "1px solid #cbd5e1",
          }}
          onClick={onOpenJson}
          title="Advanced JSON Editor Modal"
        >
          <FileCode size={13} />
          <span>JSON</span>
        </button>

        <button
          style={{
            ...btn(true),
            padding: "7px 16px",
            backgroundColor: "#4f46e5",
          }}
          onClick={onSave}
          title="Save Changes to Page / Component (Ctrl+S)"
        >
          <Save size={14} />
          <span>Save</span>
        </button>
      </div>
    </header>
  );
};

const btn = (primary = false) => ({
  padding: "6px 12px",
  borderRadius: "8px",
  border: primary ? "none" : "1px solid #e2e8f0",
  backgroundColor: primary ? "#4f46e5" : "#ffffff",
  color: primary ? "#ffffff" : "#374151",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  whiteSpace: "nowrap",
  transition: "all 0.15s ease",
});

export default CmsHeader;
