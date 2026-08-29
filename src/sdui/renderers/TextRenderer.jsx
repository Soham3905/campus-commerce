export default function TextRenderer({ data = {}, style = {} }) {
  return (
    <span style={{ fontSize: "14px", color: "#111", ...style }}>
      {data?.text}
    </span>
  );
}