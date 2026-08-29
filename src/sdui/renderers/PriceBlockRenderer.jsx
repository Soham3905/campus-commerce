export default function PriceBlockRenderer({ data = {}, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", ...style }}>
      <span style={{ fontSize: "20px", fontWeight: "800", color: style.color || "#111" }}>
        {data?.sellingPrice}
      </span>
      {data?.mrp && (
        <span style={{ fontSize: "10px", color: "#888", textDecoration: "line-through" }}>
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
            borderRadius: "4px"
          }}
        >
          {data.discount} OFF
        </span>
      )}
    </div>
  );
}
