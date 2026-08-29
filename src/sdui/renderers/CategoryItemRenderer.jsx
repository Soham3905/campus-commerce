export default function CategoryItemRenderer({ data = {}, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        cursor: "pointer",
        ...style
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
          cursor: "pointer"
        }}
      >
        {data?.icon}
      </div>
      <span style={{ fontSize: "10px", fontWeight: "600", color: "#444", cursor: "pointer" }}>
        {data?.label}
      </span>
    </div>
  );
}