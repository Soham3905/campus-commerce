import React from "react";

export const ReviewCount = ({ data = {}, style }) => (
  <span
    style={{
      fontSize: "11px",
      color: "#5E6E72",
      fontWeight: "500",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      ...style,
    }}
  >
    ({data.text} reviews)
  </span>
);
