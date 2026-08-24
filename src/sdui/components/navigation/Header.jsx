import React from "react";

export const Header = ({ children, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      ...style,
    }}
  >
    {children}
  </div>
);
