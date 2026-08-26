import React from "react";

export const Box = ({ children, style }) => (
  <div
    style={{
      width: "100%",
      minHeight: "36px",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

export default Box;
