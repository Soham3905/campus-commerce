import React from "react";
import { colors, commonStyles } from "../../theme";

export const StyleTab = ({ node, onUpdate }) => {
  if (!node) return null;

  const style = node.containerStyle || {};

  const handleStyleChange = (prop, value) => {
    onUpdate(node.id, {
      containerStyle: {
        ...style,
        [prop]: value,
      },
    });
  };

  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Background Color */}
      <div>
        <label style={commonStyles.label}>Background Color</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="color"
            value={style.backgroundColor || "#ffffff"}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            style={{ width: "32px", height: "32px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
          />
          <input
            type="text"
            style={commonStyles.input}
            placeholder="#ffffff or transparent"
            value={style.backgroundColor || ""}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
          />
        </div>
      </div>

      {/* Text Color */}
      <div>
        <label style={commonStyles.label}>Text Color</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="color"
            value={style.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            style={{ width: "32px", height: "32px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
          />
          <input
            type="text"
            style={commonStyles.input}
            placeholder="#111827"
            value={style.color || ""}
            onChange={(e) => handleStyleChange("color", e.target.value)}
          />
        </div>
      </div>

      {/* Width & Height */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div>
          <label style={commonStyles.label}>Width</label>
          <input
            type="text"
            style={commonStyles.input}
            placeholder="e.g. 300px, 100%, auto"
            value={style.width || ""}
            onChange={(e) => handleStyleChange("width", e.target.value)}
          />
        </div>
        <div>
          <label style={commonStyles.label}>Height</label>
          <input
            type="text"
            style={commonStyles.input}
            placeholder="e.g. 48px, auto"
            value={style.height || ""}
            onChange={(e) => handleStyleChange("height", e.target.value)}
          />
        </div>
      </div>

      {/* Padding & Border Radius */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div>
          <label style={commonStyles.label}>Padding</label>
          <input
            type="text"
            style={commonStyles.input}
            placeholder="12px"
            value={style.padding || ""}
            onChange={(e) => handleStyleChange("padding", e.target.value)}
          />
        </div>
        <div>
          <label style={commonStyles.label}>Border Radius</label>
          <input
            type="text"
            style={commonStyles.input}
            placeholder="12px"
            value={style.borderRadius || ""}
            onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
          />
        </div>
      </div>

      {/* Border & Shadow */}
      <div>
        <label style={commonStyles.label}>Border</label>
        <input
          type="text"
          style={commonStyles.input}
          placeholder="1px solid #e5e7eb"
          value={style.border || ""}
          onChange={(e) => handleStyleChange("border", e.target.value)}
        />
      </div>

      {/* Sticky Header Positioning */}
      <div>
        <label style={commonStyles.label}>Positioning</label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px" }}>
          <input
            type="checkbox"
            checked={style.position === "sticky"}
            onChange={(e) => {
              if (e.target.checked) {
                handleStyleChange("position", "sticky");
                handleStyleChange("top", "0px");
                handleStyleChange("zIndex", 100);
              } else {
                const updatedStyle = { ...style };
                delete updatedStyle.position;
                delete updatedStyle.top;
                delete updatedStyle.zIndex;
                onUpdate(node.id, { containerStyle: updatedStyle });
              }
            }}
            style={{ accentColor: colors.accentPrimary }}
          />
          <span>Sticky (Stick to top during scroll)</span>
        </label>
      </div>
    </div>
  );
};

export default StyleTab;
