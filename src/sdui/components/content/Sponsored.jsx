import React from "react";

export const Sponsored = ({ data = {}, style }) => (
  <span
    style={{
      color: "#888",
      fontSize: "11px",
      fontWeight: "600",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      ...style,
    }}
  >
    {data.text}
  </span>
);
