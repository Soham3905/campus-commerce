import React from "react";

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
    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Background Color */}
      <div className="cms-form-group">
        <label className="cms-label">Background Color</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="color"
            value={style.backgroundColor || "#ffffff"}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            style={{ width: "32px", height: "32px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
          />
          <input
            type="text"
            className="cms-input"
            placeholder="#ffffff or transparent"
            value={style.backgroundColor || ""}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
          />
        </div>
      </div>

      {/* Text Color */}
      <div className="cms-form-group">
        <label className="cms-label">Text Color</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="color"
            value={style.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            style={{ width: "32px", height: "32px", padding: 0, border: "none", borderRadius: "4px", cursor: "pointer" }}
          />
          <input
            type="text"
            className="cms-input"
            placeholder="#111827"
            value={style.color || ""}
            onChange={(e) => handleStyleChange("color", e.target.value)}
          />
        </div>
      </div>

      {/* Padding & Border Radius */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div className="cms-form-group">
          <label className="cms-label">Padding</label>
          <input
            type="text"
            className="cms-input"
            placeholder="12px"
            value={style.padding || ""}
            onChange={(e) => handleStyleChange("padding", e.target.value)}
          />
        </div>
        <div className="cms-form-group">
          <label className="cms-label">Border Radius</label>
          <input
            type="text"
            className="cms-input"
            placeholder="12px"
            value={style.borderRadius || ""}
            onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
          />
        </div>
      </div>

      {/* Sticky Header Positioning */}
      <div className="cms-form-group">
        <label className="cms-label">Positioning</label>
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
            style={{ accentColor: "var(--cms-accent-primary)" }}
          />
          <span>Sticky (Stick to top during scroll)</span>
        </label>
      </div>
    </div>
  );
};
