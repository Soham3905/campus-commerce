import React from "react";

export const Page = ({ children, style }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(100, 1fr)",
      gridAutoRows: "minmax(10px, auto)",
      gap: "0px",
      padding: "0px",
      margin: "0px",
      width: "100%",
      minHeight: "100%",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

export default Page;
