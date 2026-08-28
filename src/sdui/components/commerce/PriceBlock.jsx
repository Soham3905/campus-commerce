import React from "react";

export const PriceBlock = ({ data, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      width: "100%",
      ...style,
      flex: undefined,
      overflow: "visible",
    }}
  >
    <span style={{ fontSize: "18px", fontWeight: "600", color: "#101F26", whiteSpace: "nowrap" }}>
      {data?.sellingPrice}
    </span>
    {data?.mrp && (
      <span style={{ fontSize: "11px", color: "#888", textDecoration: "line-through", whiteSpace: "nowrap" }}>
        M.R.P: {data.mrp}
      </span>
    )}
    {data?.discount && (
      <span
        style={{
          fontSize: "11px",
          color: "#16a34a",
          fontWeight: "700",
          background: "rgba(22,163,74,0.12)",
          padding: "2px 6px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
        }}
      >
        {typeof data.discount === "string" && data.discount.includes("OFF")
          ? data.discount
          : `${data.discount} OFF`}
      </span>
    )}
  </div>
);
