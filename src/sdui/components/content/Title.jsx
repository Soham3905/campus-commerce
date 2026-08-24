import React from "react";

export const Title = ({ data = {}, style }) => (
  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "4px 0", ...style }}>
    {data.text}
  </h3>
);
