import React from "react";

export const OfferText = ({ data, style }) => (
  <p
    style={{
      fontSize: "12px",
      color: "#C4185F",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      ...style,
    }}
  >
    🏷️ {data?.text}
  </p>
);
