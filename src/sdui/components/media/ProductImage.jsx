import React from "react";

export const ProductImage = ({ data = {}, style }) => (
  <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", overflow: "hidden" }}>
    <img
      src={data.imageUrl}
      alt={data.altText || "Product"}
      style={{
        width: "100%",
        height: style?.height || "180px",
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  </div>
);
