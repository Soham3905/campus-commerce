export default function ImageRenderer({ data = {}, style = {} }) {
  return (
    <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
      <img
        src={data?.imageUrl}
        alt={data?.altText}
        style={{ width: "100%", height: "180px", objectFit: "contain", ...style }}
      />
    </div>
  );
}