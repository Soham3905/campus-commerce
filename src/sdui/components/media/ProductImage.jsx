import React from "react";

export const ProductImage = ({ data = {}, style }) => {
  const {
    height = "176px",
    minHeight = height,
    maxHeight = height,
    objectFit = "contain",
    backgroundColor = "#FAFAF8",
    borderRadius = "10px",
    ...restStyle
  } = style || {};

  return (
    <div
      style={{
        width: "100%",
        height,
        minHeight,
        maxHeight,
        backgroundColor,
        borderRadius,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxSizing: "border-box",
        ...restStyle,
      }}
    >
      <img
        src={data.imageUrl}
        alt={data.altText || "Product"}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          display: "block",
        }}
      />
    </div>
  );
};
