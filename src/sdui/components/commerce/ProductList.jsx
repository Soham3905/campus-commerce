import React from "react";

export const ProductList = ({ children, style }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "8px",
        width: "max-content",
        ...style,
      }}
    >
      {React.Children.map(children, (child) => (
        <div style={{ display: "flex" }}>{child}</div>
      ))}
    </div>
  );
};
