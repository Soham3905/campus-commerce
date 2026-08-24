import React from "react";

export const Badge = ({ data = {}, style }) => (
  <span
    style={{
      backgroundColor: "#cc0c39",
      color: "white",
      padding: "4px 10px",
      fontSize: "11px",
      fontWeight: "bold",
      borderRadius: "16px",
      display: "inline-block",
      ...style,
    }}
  >
    {data?.text}
  </span>
);
