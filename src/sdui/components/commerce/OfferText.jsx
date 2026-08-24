import React from "react";

export const OfferText = ({ data, style }) => (
  <p
    style={{
      fontSize: "12px",
      color: "#007185",
      fontWeight: "500",
      display: "flex",
      alignItems: "center",
      margin: "4px 0",
      ...style,
    }}
  >
    🏷️ {data?.text}
  </p>
);
