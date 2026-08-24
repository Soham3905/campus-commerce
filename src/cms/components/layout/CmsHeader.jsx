import React from "react";
import { defaultInterfaces } from "../../../schema/defaultInterfaces";

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
    <header className="cms-header">
      {/* Left: Brand & Page Selector */}
      <div className="cms-header-left">
        <div className="cms-logo-badge" title="SDUI Visual Component CMS">
          <span>⚡</span>
          <span>SDUI CMS</span>
        </div>

        <button
          className="cms-page-pill"
          onClick={onOpenPages}
          title="Manage & Switch Pages"
        >
          <span>📄</span>
          <span>{activePage?.name || "Select Page"}</span>
          <span style={{ fontSize: "9px", opacity: 0.7 }}>▾</span>
        </button>

        {currentInterface && (
          <button
            className="cms-page-pill"
            onClick={onOpenInterfaces}
            title={`Blueprint: ${currentInterface.name}`}
            style={{ opacity: 0.9, borderColor: "var(--cms-border-subtle)" }}
          >
            <span>{currentInterface.icon || "📐"}</span>
            <span>{currentInterface.name}</span>
          </button>
        )}
      </div>

      {/* Center: Device Viewport Controls & Undo/Redo */}
      <div className="cms-header-center">
        <div
          style={{
            display: "flex",
            gap: "2px",
            background: "var(--cms-bg-card)",
            padding: "2px",
            borderRadius: "8px",
            border: "1px solid var(--cms-border-subtle)",
          }}
        >
          <button
            className={`cms-btn-icon ${canUndo ? "" : "disabled"}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={{ opacity: canUndo ? 1 : 0.35 }}
          >
            ↩
          </button>
          <button
            className={`cms-btn-icon ${canRedo ? "" : "disabled"}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            style={{ opacity: canRedo ? 1 : 0.35 }}
          >
            ↪
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2px",
            background: "var(--cms-bg-card)",
            padding: "2px",
            borderRadius: "8px",
            border: "1px solid var(--cms-border-subtle)",
          }}
        >
          <button
            className={`cms-btn-icon ${activeDevice === "mobile" ? "active" : ""}`}
            onClick={() => onDeviceChange("mobile")}
            title="Mobile View (375px)"
          >
            📱
          </button>
          <button
            className={`cms-btn-icon ${activeDevice === "tablet" ? "active" : ""}`}
            onClick={() => onDeviceChange("tablet")}
            title="Tablet View (768px)"
          >
            📟
          </button>
          <button
            className={`cms-btn-icon ${activeDevice === "desktop" ? "active" : ""}`}
            onClick={() => onDeviceChange("desktop")}
            title="Desktop View (Full Width)"
          >
            💻
          </button>
        </div>
      </div>

      {/* Right: Actions & Save State */}
      <div className="cms-header-right">
        {/* Status indicator */}
        <div style={{ fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap" }}>
          {saveStatus === "saving" && (
            <span style={{ color: "var(--cms-warning)" }}>⏳ Saving...</span>
          )}
          {saveStatus === "saved" && (
            <span style={{ color: "var(--cms-success)" }}>✓ Saved</span>
          )}
          {saveStatus === "idle" && isDirty && (
            <span style={{ color: "var(--cms-warning)" }}>● Unsaved</span>
          )}
        </div>

        <button
          className="cms-btn cms-btn-secondary"
          onClick={onOpenJson}
          title="Advanced JSON Editor"
        >
          <span>{`{ }`}</span>
          <span>JSON</span>
        </button>

        <button
          className="cms-btn cms-btn-primary"
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
