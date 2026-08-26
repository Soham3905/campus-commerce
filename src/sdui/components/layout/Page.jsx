import React from "react";

export const Page = ({ children, style }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(100, 1fr)",
      gridTemplateRows: "repeat(500, 10px)",
      gridAutoRows: "10px",
      gap: "0px",
      padding: "0px",
      margin: "0px",
      width: "100%",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);
