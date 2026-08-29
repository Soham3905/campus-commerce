export default function ReviewCountRenderer({ data = {}, style = {} }) {
  return (
    <span style={{ fontSize: "11px", color: "#007185", fontWeight: "500", ...style }}>
      ({data?.text} reviews)
    </span>
  );
}
