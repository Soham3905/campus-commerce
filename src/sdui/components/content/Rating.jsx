import React from "react";

export const Rating = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>
    {children}
  </div>
);
