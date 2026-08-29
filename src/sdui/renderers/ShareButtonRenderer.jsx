export default function ShareButtonRenderer({ data = {}, style = {}, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid #ddd",
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        ...style
      }}
    >
      {data?.icon && <span>{data.icon}</span>}
      {data?.label && <span>{data.label}</span>}
    </button>
  );
}