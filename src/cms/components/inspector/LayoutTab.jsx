import React from "react";
import { colors, commonStyles } from "../../theme";
import { SlidersHorizontal, Maximize2, LayoutGrid } from "lucide-react";

export const LayoutTab = ({ node, activeDevice, onUpdate }) => {
  if (!node) return null;

  const placement = node.placement || {};
  const currentPlacement = placement[activeDevice] || {
    colStart: 1,
    colEnd: 101,
    rowStart: 1,
    rowEnd: 10,
  };

  const colStart = currentPlacement.colStart ?? 1;
  const colEnd = currentPlacement.colEnd ?? 101;
  const rowStart = currentPlacement.rowStart ?? 1;
  const rowEnd = currentPlacement.rowEnd ?? 10;

  const colSpan = Math.max(1, colEnd - colStart);
  const rowSpan = Math.max(1, rowEnd - rowStart);
  const widthPercent = Math.min(100, Math.round(colSpan));

  const handleCoordinateChange = (key, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = key.startsWith("col") ? 1 : 1;

    if (key === "colStart") num = Math.max(1, Math.min(100, num));
    if (key === "colEnd") num = Math.max(colStart + 1, Math.min(101, num));
    if (key === "rowStart") num = Math.max(1, Math.min(500, num));
    if (key === "rowEnd") num = Math.max(rowStart + 1, Math.min(500, num));

    onUpdate(node.id, {
      placement: {
        ...placement,
        [activeDevice]: {
          ...currentPlacement,
          colStart,
          colEnd,
          rowStart,
          rowEnd,
          [key]: num,
        },
      },
    });
  };

  const applyPreset = (newColStart, newColEnd) => {
    onUpdate(node.id, {
      placement: {
        ...placement,
        [activeDevice]: {
          ...currentPlacement,
          colStart: newColStart,
          colEnd: newColEnd,
        },
      },
    });
  };

  return (
    <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Device Indicator Banner */}
      <div
        style={{
          background: "#f8fafc",
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: "8px",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
        }}
      >
        <span style={{ color: "#64748b" }}>Active Viewport:</span>
        <span style={{ fontWeight: "700", color: "#4f46e5", textTransform: "capitalize" }}>
          {activeDevice} Grid
        </span>
      </div>

      {/* Grid Width (Columns 1 to 101) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ ...commonStyles.label, margin: 0 }}>Column Grid (1 to 101)</label>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#4f46e5" }}>
            {widthPercent}% Width ({colSpan} cols)
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted, display: "block", marginBottom: "3px" }}>Col Start</span>
            <input
              type="number"
              style={commonStyles.input}
              min={1}
              max={100}
              value={colStart}
              onChange={(e) => handleCoordinateChange("colStart", e.target.value)}
            />
          </div>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted, display: "block", marginBottom: "3px" }}>Col End</span>
            <input
              type="number"
              style={commonStyles.input}
              min={2}
              max={101}
              value={colEnd}
              onChange={(e) => handleCoordinateChange("colEnd", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Column Width Quick Presets */}
      <div>
        <label style={commonStyles.label}>Quick Width Presets</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
          <button
            type="button"
            style={{
              ...commonStyles.btn,
              ...commonStyles.btnSecondary,
              fontSize: "11px",
              padding: "6px 4px",
              justifyContent: "center",
              backgroundColor: colStart === 1 && colEnd >= 100 ? "rgba(79,70,229,0.1)" : "#ffffff",
              borderColor: colStart === 1 && colEnd >= 100 ? "#4f46e5" : "#e2e8f0",
              color: colStart === 1 && colEnd >= 100 ? "#4f46e5" : "#334155",
            }}
            onClick={() => applyPreset(1, 101)}
          >
            100% Full
          </button>
          <button
            type="button"
            style={{
              ...commonStyles.btn,
              ...commonStyles.btnSecondary,
              fontSize: "11px",
              padding: "6px 4px",
              justifyContent: "center",
              backgroundColor: colStart === 1 && colEnd === 51 ? "rgba(79,70,229,0.1)" : "#ffffff",
              borderColor: colStart === 1 && colEnd === 51 ? "#4f46e5" : "#e2e8f0",
              color: colStart === 1 && colEnd === 51 ? "#4f46e5" : "#334155",
            }}
            onClick={() => applyPreset(1, 51)}
          >
            Left 50%
          </button>
          <button
            type="button"
            style={{
              ...commonStyles.btn,
              ...commonStyles.btnSecondary,
              fontSize: "11px",
              padding: "6px 4px",
              justifyContent: "center",
              backgroundColor: colStart === 51 && colEnd === 101 ? "rgba(79,70,229,0.1)" : "#ffffff",
              borderColor: colStart === 51 && colEnd === 101 ? "#4f46e5" : "#e2e8f0",
              color: colStart === 51 && colEnd === 101 ? "#4f46e5" : "#334155",
            }}
            onClick={() => applyPreset(51, 101)}
          >
            Right 50%
          </button>
          <button
            type="button"
            style={{
              ...commonStyles.btn,
              ...commonStyles.btnSecondary,
              fontSize: "11px",
              padding: "6px 4px",
              justifyContent: "center",
              backgroundColor: colStart === 15 && colEnd === 86 ? "rgba(79,70,229,0.1)" : "#ffffff",
              borderColor: colStart === 15 && colEnd === 86 ? "#4f46e5" : "#e2e8f0",
              color: colStart === 15 && colEnd === 86 ? "#4f46e5" : "#334155",
            }}
            onClick={() => applyPreset(15, 86)}
          >
            Center 70%
          </button>
        </div>
      </div>

      {/* Row Height Coordinates */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ ...commonStyles.label, margin: 0 }}>Row Grid (10px / Unit)</label>
          <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748b" }}>
            {rowSpan * 10}px Height ({rowSpan} rows)
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted, display: "block", marginBottom: "3px" }}>Row Start</span>
            <input
              type="number"
              style={commonStyles.input}
              min={1}
              max={500}
              value={rowStart}
              onChange={(e) => handleCoordinateChange("rowStart", e.target.value)}
            />
          </div>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted, display: "block", marginBottom: "3px" }}>Row End</span>
            <input
              type="number"
              style={commonStyles.input}
              min={2}
              max={500}
              value={rowEnd}
              onChange={(e) => handleCoordinateChange("rowEnd", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutTab;
