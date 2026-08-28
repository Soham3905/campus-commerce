import React, { useState } from "react";
import { colors, commonStyles } from "../../theme";
import { SlidersHorizontal, Maximize2, LayoutGrid, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Move } from "lucide-react";

export const LayoutTab = ({ node, activeDevice, onUpdate, onMoveComponent }) => {
  if (!node) return null;

  const [stepSize, setStepSize] = useState(5); // 5% | 10% | 25%

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

  const dpadBtnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "7px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "all 0.12s ease",
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

      {/* ── 4-Way Directional Movement D-Pad ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ ...commonStyles.label, margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
            <Move size={13} color="#4f46e5" />
            <span>4-Way Move & Nudge</span>
          </label>
          <div style={{ display: "flex", gap: "3px" }}>
            {[5, 10, 25].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStepSize(s)}
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: stepSize === s ? "#4f46e5" : "#e2e8f0",
                  backgroundColor: stepSize === s ? "rgba(79,70,229,0.1)" : "#ffffff",
                  color: stepSize === s ? "#4f46e5" : "#64748b",
                  fontSize: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {/* UP Button */}
          <button
            type="button"
            onClick={() => onMoveComponent?.(node.id, "up", { device: activeDevice, step: stepSize })}
            style={{ ...dpadBtnStyle, width: "120px" }}
            title="Move Up in order / row (Arrow Up)"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4f46e5";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "#4f46e5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#1e293b";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
          >
            <ArrowUp size={15} />
            <span>Move Up</span>
          </button>

          {/* LEFT & RIGHT Row */}
          <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => onMoveComponent?.(node.id, "left", { device: activeDevice, step: stepSize })}
              style={{ ...dpadBtnStyle, flex: 1, maxWidth: "120px" }}
              title={`Shift Left by ${stepSize}% (Arrow Left)`}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4f46e5";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#4f46e5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#1e293b";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
            >
              <ArrowLeft size={15} />
              <span>Left</span>
            </button>

            <button
              type="button"
              onClick={() => onMoveComponent?.(node.id, "right", { device: activeDevice, step: stepSize })}
              style={{ ...dpadBtnStyle, flex: 1, maxWidth: "120px" }}
              title={`Shift Right by ${stepSize}% (Arrow Right)`}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4f46e5";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#4f46e5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#1e293b";
                e.currentTarget.style.borderColor = "#cbd5e1";
              }}
            >
              <span>Right</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* DOWN Button */}
          <button
            type="button"
            onClick={() => onMoveComponent?.(node.id, "down", { device: activeDevice, step: stepSize })}
            style={{ ...dpadBtnStyle, width: "120px" }}
            title="Move Down in order / row (Arrow Down)"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4f46e5";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "#4f46e5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#1e293b";
              e.currentTarget.style.borderColor = "#cbd5e1";
            }}
          >
            <ArrowDown size={15} />
            <span>Move Down</span>
          </button>
        </div>
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
