import React from "react";

export const HeaderButton = ({ data, style }) => {
  const isDarkBg =
    style?.backgroundColor === "#4f46e5" ||
    style?.backgroundColor === "#0f172a" ||
    style?.backgroundColor === "#1e293b" ||
    style?.backgroundColor === "#0D3540";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.15s ease",
        color: style?.color || (isDarkBg ? "#ffffff" : "#0f172a"),
        backgroundColor: style?.backgroundColor || (style?.background ? undefined : "transparent"),
        border: style?.border || (style?.borderColor ? `1px solid ${style.borderColor}` : "none"),
        ...style,
      }}
    >
      <span
        style={{
          fontWeight: style?.fontWeight || 600,
          fontSize: style?.fontSize || 13,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "inherit",
        }}
      >
        {data?.icon && <span>{data.icon}</span>}
        {data?.label && <span>{data.label}</span>}
        {data?.count !== undefined && (
          <span
            style={{
              marginLeft: 4,
              background: isDarkBg ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.08)",
              color: "inherit",
              padding: "1px 6px",
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: 700,
            }}
          >
            {data.count}
          </span>
        )}
      </span>
    </div>
  );
};

export default HeaderButton;
