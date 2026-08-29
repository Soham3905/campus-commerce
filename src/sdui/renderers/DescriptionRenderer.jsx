export default function DescriptionRenderer({ data = {}, style = {} }) {
  return (
    <p
      style={{
        fontSize: "13px",
        color: "#555",
        margin: 0,
        display: "-webkit-box",
        WebkitLineClamp: data?.maxLines ?? 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        ...style
      }}
    >
      {data?.text}
    </p>
  );
}