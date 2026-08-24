import React from "react";

export const Score = ({ data = {}, style }) => (
  <span
    style={{
      fontSize: "10px",
      color: "#e77600",
      fontWeight: "bold",
      background: "rgba(231,118,0,0.1)",
      padding: "2px 6px",
      borderRadius: "8px",
      ...style,
    }}
  >
    ★ {data.text}
    {data["out of"] && (
      <span style={{ color: "#888", fontWeight: "bold", fontSize: "10px" }}>
        {" "}
        / {data["out of"]}
      </span>
    )}
  </span>
);
