import React from "react";

export const DeliveryInfo = ({ data, style }) => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data?.daysOffset ?? 7));
  const formatted = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return (
    <p style={{ fontSize: "12px", color: "#5E6E72", margin: 0, padding: 0, boxSizing: "border-box", ...style }}>
      🚚 <span style={{ fontWeight: "700" }}>{data?.prefix ?? "FREE delivery"}</span> {formatted}
    </p>
  );
};
