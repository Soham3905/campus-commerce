export default function OfferTextRenderer({ data = {}, style = {} }) {
  return (
    <p style={{ fontSize: "12px", color: "#007185", fontWeight: "500", margin: 0, display: "flex", alignItems: "center", ...style }}>
      🏷️ {data?.text}
    </p>
  );
}