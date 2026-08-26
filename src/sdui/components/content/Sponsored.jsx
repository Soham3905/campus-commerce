import React from "react";

export const Sponsored = ({ data = {}, style }) => (
  <span
    style={{
      color: "#8D9A9D",
      fontSize: "10px",
      fontWeight: "600",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {data.text}
  </span>
);
