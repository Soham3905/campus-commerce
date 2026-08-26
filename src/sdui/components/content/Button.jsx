import React from "react";

export const Button = ({ data = {}, style }) => {
  const {
    width,
    minWidth,
    maxWidth,
    alignSelf,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    ...buttonStyle
  } = style || {};

  return (
    <button
      style={{
        width: "100%",
        height: "100%",
        padding: "0 16px",
        background: "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
        color: "#ffffff",
        border: "none",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        boxShadow: "0 2px 10px rgba(196,24,95,0.24)",
        ...buttonStyle,
      }}
    >
      {data?.label || "Button"}
    </button>
  );
};
