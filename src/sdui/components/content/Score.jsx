import React from "react";

export const Score = ({ data = {}, style }) => (
  <span
    style={{
      fontSize: "11px",
      color: "#e77600",
      fontWeight: "700",
      background: "rgba(231,118,0,0.1)",
      padding: "2px 6px",
      borderRadius: "6px",
      margin: 0,
      display: "inline-flex",
      alignItems: "center",
      gap: "3px",
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...style,
    }}
  >
    <span>★</span>
    <span>{data.text}</span>
  </span>
);
