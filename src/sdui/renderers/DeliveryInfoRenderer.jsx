export default function DeliveryInfoRenderer({ data = {}, style = {} }) {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data?.daysOffset ?? 7));
  const formatted = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });

  return (
    <p style={{ fontSize: "12px", color: "#333", ...style }}>
      🚚 <span style={{ fontWeight: "700" }}>{data?.prefix ?? "FREE delivery"}</span> {formatted}
    </p>
  );
}