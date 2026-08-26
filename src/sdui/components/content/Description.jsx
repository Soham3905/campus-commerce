import React from "react";

export const Description = ({ data = {}, style }) => (
  <p
    style={{
      fontSize: "14px",
      lineHeight: "20px",
      color: "#101F26",
      display: "-webkit-box",
      WebkitLineClamp: data.maxLines ?? 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {data.text}
  </p>
);
