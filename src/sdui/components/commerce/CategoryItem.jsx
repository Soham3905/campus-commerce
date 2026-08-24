import React from "react";

export const CategoryItem = ({ data, style }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "5px",
      flexShrink: 0,
      ...style,
    }}
  >
    <div
      style={{
        width: "35px",
        height: "35px",
        backgroundColor: "#f0f2f5",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        cursor: "pointer",
      }}
    >
      {data?.icon}
    </div>
    <span
      style={{
        fontSize: "10px",
        fontWeight: "600",
        color: "#444",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {data?.label}
    </span>
  </div>
);
