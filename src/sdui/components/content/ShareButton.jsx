import React from "react";

export const ShareButton = ({ data = {}, style }) => {
  return (
    <button
      style={{
        border: "1px solid #ddd",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        cursor: "pointer",
        background: "#fff",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        ...style,
      }}
    >
      {data?.icon} {data.label}
    </button>
  );
};
