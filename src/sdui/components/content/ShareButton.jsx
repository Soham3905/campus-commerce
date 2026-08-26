import React from "react";

export const ShareButton = ({ data = {}, style }) => {
  const { position, top, bottom, left, right, zIndex, ...innerStyle } = style || {};
  return (
    <button
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #E4E7E4",
        padding: "0",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        backgroundColor: "#ffffff",
        color: "#101F26",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        boxShadow: "0 1px 2px rgba(16,31,38,0.05)",
        ...innerStyle,
      }}
    >
      {data?.icon || "↗"}{data?.label ? ` ${data.label}` : ""}
    </button>
  );
};
