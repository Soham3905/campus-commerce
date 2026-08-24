import React, { useState } from "react";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { ContentTab } from "./ContentTab";
import { LayoutTab } from "./LayoutTab";
import { ActionTab } from "./ActionTab";
import { StyleTab } from "./StyleTab";
import { JsonTab } from "./JsonTab";

export const Inspector = ({
  selectedNode,
  activeDevice,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
}) => {
  const [activeTab, setActiveTab] = useState("content"); // 'content' | 'layout' | 'actions' | 'style' | 'json'

  if (!selectedNode) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        <div className="cms-panel-header">
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>⚙️</span>
            <span>Inspector</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
            color: "var(--cms-text-muted)",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.5 }}>🎯</div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--cms-text-primary)", marginBottom: "4px" }}>
            No Component Selected
          </div>
          <div style={{ fontSize: "11px", maxWidth: "220px", lineHeight: "1.4" }}>
            Click any component on the visual canvas or layers tree to configure its properties, placement, and actions.
          </div>
        </div>
      </div>
    );
  }

  const def = ComponentRegistry[selectedNode.type];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Inspector Header */}
      <div className="cms-panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          <span style={{ fontSize: "16px" }}>{def?.icon || "⚙️"}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--cms-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {def?.label || selectedNode.type}
            </div>
            <div style={{ fontSize: "10px", color: "var(--cms-text-muted)", fontFamily: "monospace" }}>
              #{selectedNode.id}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
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

      {/* Tabs Strip */}
      <div className="cms-tabs-strip">
        <button
          className={`cms-tab-btn ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          Content
        </button>
        <button
          className={`cms-tab-btn ${activeTab === "layout" ? "active" : ""}`}
          onClick={() => setActiveTab("layout")}
        >
          Layout
        </button>
        <button
          className={`cms-tab-btn ${activeTab === "actions" ? "active" : ""}`}
          onClick={() => setActiveTab("actions")}
        >
          Actions
        </button>
        <button
          className={`cms-tab-btn ${activeTab === "style" ? "active" : ""}`}
          onClick={() => setActiveTab("style")}
        >
          Style
        </button>
        <button
          className={`cms-tab-btn ${activeTab === "json" ? "active" : ""}`}
          onClick={() => setActiveTab("json")}
        >
          {`{ }`}
        </button>
      </div>

      {/* Tab Panels */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "content" && (
          <ContentTab
            node={selectedNode}
            definition={def}
            onUpdate={onUpdateComponent}
          />
        )}
        {activeTab === "layout" && (
          <LayoutTab
            node={selectedNode}
            activeDevice={activeDevice}
            onUpdate={onUpdateComponent}
          />
        )}
        {activeTab === "actions" && (
          <ActionTab
            node={selectedNode}
            definition={def}
            onUpdate={onUpdateComponent}
          />
        )}
        {activeTab === "style" && (
          <StyleTab
            node={selectedNode}
            onUpdate={onUpdateComponent}
          />
        )}
        {activeTab === "json" && (
          <JsonTab
            node={selectedNode}
            onUpdate={onUpdateComponent}
          />
        )}
      </div>
    </div>
  );
};
