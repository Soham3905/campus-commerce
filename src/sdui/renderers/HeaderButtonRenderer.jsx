export default function HeaderButtonRenderer({ data = {}, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        gap: 6,
        ...style
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 12 }}>
        {data?.icon} {data?.label}
      </span>
    </div>
  );
}
