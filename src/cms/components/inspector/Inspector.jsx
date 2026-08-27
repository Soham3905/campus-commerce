import React, { useState } from "react";
import { ComponentRegistry } from "../../../registry/componentRegistry";
import { ThemeRepository } from "../../services/themeRepository";
import { ContentTab } from "./ContentTab";
import { LayoutTab } from "./LayoutTab";
import { ActionTab } from "./ActionTab";
import { StyleTab } from "./StyleTab";
import { ThemeTab } from "./ThemeTab";
import { JsonTab } from "./JsonTab";
import { colors, commonStyles } from "../../theme";

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
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: colors.bgPanelHeader,
            borderBottom: `1px solid ${colors.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            fontWeight: "600",
            color: colors.textPrimary,
          }}
        >
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
            color: colors.textMuted,
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.5 }}>🎯</div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: colors.textPrimary, marginBottom: "4px" }}>
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
  const hasThemes = ThemeRepository.getByComponentType(selectedNode.type).length > 0;
  const tabKeys = hasThemes
    ? ["content", "layout", "actions", "style", "theme", "json"]
    : ["content", "layout", "actions", "style", "json"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Inspector Header */}
      <div
        style={{
          padding: "12px 16px",
          backgroundColor: colors.bgPanelHeader,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "13px",
          fontWeight: "600",
          color: colors.textPrimary,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          <span style={{ fontSize: "16px" }}>{def?.icon || "⚙️"}</span>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: colors.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {def?.label || selectedNode.type}
            </div>
            <div style={{ fontSize: "10px", color: colors.textMuted, fontFamily: "monospace" }}>
              #{selectedNode.id}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
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
        </div>
      </div>

      {/* Tabs Strip */}
      <div
        style={{
          display: "flex",
          backgroundColor: colors.bgPanel,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          padding: "0 4px",
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {tabKeys.map((tabKey) => {
          const labels = {
            content: "Content",
            layout: "Layout",
            actions: "Actions",
            style: "Style",
            theme: "Theme",
            json: "{ }",
          };
          const isActive = activeTab === tabKey;

          return (
            <button
              key={tabKey}
              style={{
                flex: 1,
                padding: "10px 6px",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? `2px solid ${colors.accentPrimary}` : "2px solid transparent",
                color: isActive ? colors.accentPrimary : colors.textMuted,
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                textAlign: "center",
                whiteSpace: "nowrap",
                outline: "none",
                textTransform: tabKey === "json" ? "none" : "capitalize",
              }}
              onClick={() => setActiveTab(tabKey)}
            >
              {labels[tabKey]}
            </button>
          );
        })}
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
        {activeTab === "theme" && hasThemes && (
          <ThemeTab
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
