import React from "react";

export const Button = ({ data = {}, style }) => (
  <button
    style={{
      width: "100%",
      padding: "8px",
      background: "linear-gradient(135deg, #ffa41c, #ff8f00)",
      color: "#111",
      border: "none",
      borderRadius: "24px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
      ...style,
    }}
  >
    {data.label}
  </button>
);
