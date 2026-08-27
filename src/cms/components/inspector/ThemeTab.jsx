import React from "react";
import { ThemeRepository } from "../../services/themeRepository";
import { createComponent } from "../../utils/componentFactory";
import { colors } from "../../theme";

/**
 * ThemeTab — lets the user re-theme an already-placed component instance,
 * closing the gap where a component could only be themed at creation time
 * (via the onboarding wizard or default foundation choice) and never again
 * without deleting and re-adding it.
 *
 * Applying a theme fully replaces the node via the same createComponent
 * pipeline used for new components (so the result matches exactly what
 * placing a fresh themed instance would look like), preserving only the
 * node's id and grid placement so it doesn't jump position or lose its slot.
 */
export const ThemeTab = ({ node, onUpdate }) => {
  const themes = ThemeRepository.getByComponentType(node.type);

  if (themes.length === 0) {
    return (
      <div style={{ padding: "24px 16px", textAlign: "center", color: colors.textMuted, fontSize: "12px" }}>
        No alternate themes are available for "{node.type}" yet.
      </div>
    );
  }

  const handleApply = (theme) => {
    if (theme.id === node.themeId) return;
    const proceed = confirm(
      `Switch to the "${theme.name}" design?\n\nThis replaces this component's current content and style with that theme's defaults. Its position on the page is preserved.`
    );
    if (!proceed) return;

    const replacement = createComponent(node.type, {
      id: node.id,
      themeId: theme.id,
      placement: node.placement,
    });
    onUpdate(node.id, replacement);
  };

  return (
    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ fontSize: "11px", color: colors.textMuted, lineHeight: 1.4 }}>
        Choose a different visual design for this component. Applying a theme replaces its content and style with that theme's defaults — its position on the page stays the same.
      </div>
      {themes.map((theme) => {
        const isActive = node.themeId === theme.id;
        return (
          <button
            key={theme.id}
            onClick={() => handleApply(theme)}
            disabled={isActive}
            style={{
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: "8px",
              border: `1px solid ${isActive ? colors.accentPrimary : colors.borderSubtle}`,
              backgroundColor: isActive ? colors.accentPrimaryLight : colors.bgCard,
              cursor: isActive ? "default" : "pointer",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "700", color: colors.textPrimary, display: "flex", alignItems: "center", gap: "6px" }}>
              {theme.name}
              {isActive && (
                <span style={{ fontSize: "10px", background: colors.accentPrimary, color: "#fff", padding: "1px 6px", borderRadius: "10px" }}>
                  Active
                </span>
              )}
              {theme.isCustom && (
                <span style={{ fontSize: "10px", color: colors.textMuted }}>Custom</span>
              )}
            </div>
            {theme.description && (
              <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "3px", lineHeight: 1.4 }}>
                {theme.description}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ThemeTab;
