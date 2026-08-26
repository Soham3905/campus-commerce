import React from "react";

export const Badge = ({ data = {}, style }) => (
  <span
    style={{
      backgroundColor: "#cc0c39",
      color: "white",
      padding: "0 9px",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.01em",
      borderRadius: "999px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {data?.text}
  </span>
);
