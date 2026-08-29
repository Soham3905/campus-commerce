export default function TitleRenderer({ data = {}, style = {} }) {
  return (
    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: 0, ...style }}>
      {data?.text}
    </h3>
  );
}