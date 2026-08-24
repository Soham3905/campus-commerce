import React from "react";

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
          background: "var(--cms-bg-card)",
          border: "1px solid var(--cms-border-medium)",
          borderRadius: "var(--cms-radius-sm)",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "12px",
        }}
      >
        <span style={{ color: "var(--cms-text-muted)" }}>Editing Coordinates for:</span>
        <span style={{ fontWeight: "700", color: "var(--cms-accent-primary)", textTransform: "capitalize" }}>
          {activeDevice} View
        </span>
      </div>

      {/* Grid Coordinates Inputs */}
      <div>
        <label className="cms-label">Columns (1 to 100)</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "10px", color: "var(--cms-text-muted)" }}>Col Start</span>
            <input
              type="number"
              className="cms-input"
              min={1}
              max={100}
              value={currentPlacement.colStart ?? 1}
              onChange={(e) => handleCoordinateChange("colStart", e.target.value)}
            />
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "var(--cms-text-muted)" }}>Col End</span>
            <input
              type="number"
              className="cms-input"
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
        <label className="cms-label">Quick Column Presets</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
          <button
            className="cms-btn cms-btn-secondary"
            onClick={() => applyPreset(1, 100)}
            style={{ fontSize: "10px", padding: "4px 2px" }}
          >
            Full (100)
          </button>
          <button
            className="cms-btn cms-btn-secondary"
            onClick={() => applyPreset(1, 50)}
            style={{ fontSize: "10px", padding: "4px 2px" }}
          >
            Left 50%
          </button>
          <button
            className="cms-btn cms-btn-secondary"
            onClick={() => applyPreset(51, 100)}
            style={{ fontSize: "10px", padding: "4px 2px" }}
          >
            Right 50%
          </button>
          <button
            className="cms-btn cms-btn-secondary"
            onClick={() => applyPreset(15, 85)}
            style={{ fontSize: "10px", padding: "4px 2px" }}
          >
            Center 70%
          </button>
        </div>
      </div>

      {/* Rows Coordinates */}
      <div>
        <label className="cms-label">Rows (Grid Heights: 10px / unit)</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <span style={{ fontSize: "10px", color: "var(--cms-text-muted)" }}>Row Start</span>
            <input
              type="number"
              className="cms-input"
              min={1}
              max={200}
              value={currentPlacement.rowStart ?? 1}
              onChange={(e) => handleCoordinateChange("rowStart", e.target.value)}
            />
          </div>
          <div>
            <span style={{ fontSize: "10px", color: "var(--cms-text-muted)" }}>Row End</span>
            <input
              type="number"
              className="cms-input"
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
