import React from "react";

export const Icon = ({ data = {}, style }) => (
  <img
    src={
      data.imageUrl ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png"
    }
    alt={data.altText || "icon"}
    style={{
      width: "14px",
      height: "14px",
      opacity: 0.4,
      cursor: "pointer",
      ...style,
    }}
  />
);
