import React from "react";

export const Label = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "3px", ...style }}>
    {children}
  </div>
);
