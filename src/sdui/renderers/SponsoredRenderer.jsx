export default function SponsoredRenderer({ data = {}, style = {} }) {
  return (
    <span
      style={{
        color: "#888",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        ...style
      }}
    >
      {data?.text || 'Sponsored'}
    </span>
  );
}