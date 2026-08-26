import React from "react";

export const CategoryGrid = ({ children, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      gap: "12px",
      padding: "12px 16px",
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      overflowX: "auto",
      scrollbarWidth: "none",
      width: "100%",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);
