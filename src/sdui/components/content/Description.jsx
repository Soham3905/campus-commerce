import React from "react";

export const Description = ({ data = {}, style }) => (
  <p
    style={{
      fontSize: "13px",
      color: "#555",
      display: "-webkit-box",
      WebkitLineClamp: data.maxLines ?? 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      margin: "4px 0",
      ...style,
    }}
  >
    {data.text}
  </p>
);
