import React from "react";

export const HeaderButton = ({ data, style }) => (
  <div
    style={{
      padding: "8px 12px",
      borderRadius: 12,
      background: "#f8fafc",
      border: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      gap: 6,
      ...style,
    }}
  >
    <span style={{ fontWeight: 600, fontSize: 12 }}>
      {data?.icon ? `${data.icon} ` : ""}
      {data?.label}
      {data?.count !== undefined && (
        <span
          style={{
            marginLeft: 4,
            background: "rgba(255, 255, 255, 0.2)",
            padding: "1px 6px",
            borderRadius: "10px",
            fontSize: "11px",
          }}
        >
          {data.count}
        </span>
      )}
    </span>
  </div>
);
