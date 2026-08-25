import React, { useState } from "react";
import { ThemeRepository } from "../../cms/services/themeRepository";

export const CustomThemeModal = ({ isOpen, onClose, componentType = "ProductCard", onThemeCreated }) => {
  const [name, setName] = useState("Custom " + componentType + " Theme");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("#e2e8f0");
  const [borderWidth, setBorderWidth] = useState("1px");
  const [borderRadius, setBorderRadius] = useState("12px");
  const [padding, setPadding] = useState("12px");
  const [boxShadow, setBoxShadow] = useState("0 4px 12px rgba(0,0,0,0.06)");

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const newTheme = {
      componentType,
      name,
      description: `Custom ${componentType} theme created in Theme Studio`,
      tokens: {
        backgroundColor: bgColor,
        borderColor,
        borderWidth,
        borderRadius,
        padding,
        boxShadow,
      },
      styles: {
        backgroundColor: bgColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius,
        padding,
        boxShadow,
      },
    };

    const saved = ThemeRepository.save(newTheme);
    if (onThemeCreated) {
      onThemeCreated(saved);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              + Create Custom Theme for {componentType}
            </h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748b" }}>
              Define reusable styling tokens for this component
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
              Theme Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                color: "#0f172a",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
                Background Color
              </label>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: "32px", height: "32px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
                Border Color
              </label>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  style={{ width: "32px", height: "32px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                />
                <input
                  type="text"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
                Border Radius
              </label>
              <input
                type="text"
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
                Padding
              </label>
              <input
                type="text"
                value={padding}
                onChange={(e) => setPadding(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
                Border Width
              </label>
              <input
                type="text"
                value={borderWidth}
                onChange={(e) => setBorderWidth(e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px" }}
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div style={{ marginTop: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>
              Live Theme Preview
            </span>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderRadius: "10px",
                border: "1px dashed #cbd5e1",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "220px",
                  backgroundColor: bgColor,
                  border: `${borderWidth} solid ${borderColor}`,
                  borderRadius,
                  padding,
                  boxShadow,
                  color: "#0f172a",
                  fontSize: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div style={{ height: "60px", backgroundColor: "#e2e8f0", borderRadius: "6px" }} />
                <div style={{ fontWeight: "700" }}>{name}</div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>Theme Preview Sample</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#475569",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Save Custom Theme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomThemeModal;
