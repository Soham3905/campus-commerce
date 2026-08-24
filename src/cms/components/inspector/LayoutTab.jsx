import React from "react";
import { colors, commonStyles } from "../../theme";

export const LayoutTab = ({ node, activeDevice, onUpdate }) => {
  if (!node) return null;

  const placement = node.placement || {};
  const currentPlacement = placement[activeDevice] || {
    colStart: 1,
    colEnd: 100,
    rowStart: 1,
    rowEnd: 10,
  };

  const handleCoordinateChange = (key, value) => {
    const num = Number(value);
    onUpdate(node.id, {
      placement: {
        ...placement,
        [activeDevice]: {
          ...currentPlacement,
          [key]: isNaN(num) ? 1 : num,
        },
      },
    });
  };

  const applyPreset = (colStart, colEnd) => {
    onUpdate(node.id, {
      placement: {
        ...placement,
        [activeDevice]: {
          ...currentPlacement,
          colStart,
          colEnd,
        },
      },
    });
  };

  return (
    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Device Indicator Banner */}
      <div
        style={{
          background: colors.bgCard,
          border: `1px solid ${colors.borderMedium}`,
          borderRadius: "6px",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
        }}
      >
        <span style={{ color: colors.textMuted }}>Editing Coordinates for:</span>
        <span style={{ fontWeight: "700", color: colors.accentPrimary, textTransform: "capitalize" }}>
          {activeDevice} View
        </span>
      </div>

      {/* Grid Coordinates Inputs */}
      <div>
        <label style={commonStyles.label}>Columns (1 to 100)</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted }}>Col Start</span>
            <input
              type="number"
              style={commonStyles.input}
              min={1}
              max={100}
              value={currentPlacement.colStart ?? 1}
              onChange={(e) => handleCoordinateChange("colStart", e.target.value)}
            />
          </div>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted }}>Col End</span>
            <input
              type="number"
              style={commonStyles.input}
              min={2}
              max={101}
              value={currentPlacement.colEnd ?? 100}
              onChange={(e) => handleCoordinateChange("colEnd", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Column Width Presets */}
      <div>
        <label style={commonStyles.label}>Quick Column Presets</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
          <button
            style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "10px", padding: "4px 2px" }}
            onClick={() => applyPreset(1, 100)}
          >
            Full (100)
          </button>
          <button
            style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "10px", padding: "4px 2px" }}
            onClick={() => applyPreset(1, 50)}
          >
            Left 50%
          </button>
          <button
            style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "10px", padding: "4px 2px" }}
            onClick={() => applyPreset(51, 100)}
          >
            Right 50%
          </button>
          <button
            style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "10px", padding: "4px 2px" }}
            onClick={() => applyPreset(15, 85)}
          >
            Center 70%
          </button>
        </div>
      </div>

      {/* Rows Coordinates */}
      <div>
        <label style={commonStyles.label}>Rows (Grid Heights: 10px / unit)</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted }}>Row Start</span>
            <input
              type="number"
              style={commonStyles.input}
              min={1}
              max={200}
              value={currentPlacement.rowStart ?? 1}
              onChange={(e) => handleCoordinateChange("rowStart", e.target.value)}
            />
          </div>
          <div>
            <span style={{ fontSize: "10px", color: colors.textMuted }}>Row End</span>
            <input
              type="number"
              style={commonStyles.input}
              min={2}
              max={200}
              value={currentPlacement.rowEnd ?? 10}
              onChange={(e) => handleCoordinateChange("rowEnd", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
