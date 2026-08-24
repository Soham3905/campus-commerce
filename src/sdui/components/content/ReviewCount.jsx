import React from "react";

export const ReviewCount = ({ data = {}, style }) => (
  <span
    style={{
      fontSize: "11px",
      color: "#007185",
      fontWeight: "500",
      ...style,
    }}
  >
    ({data.text} reviews)
  </span>
);
