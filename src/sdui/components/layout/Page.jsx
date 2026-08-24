import React from "react";

export const Page = ({ children, style }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(100, 1fr)",
      gridTemplateRows: "repeat(200, 10px)",
      gap: "0px",
      padding: "5px",
      height: "100%",
      ...style,
    }}
  >
    {children}
  </div>
);
