export default function StoryRowRenderer({ children, style = {} }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "10px 4px",
        overflowX: "auto",
        backgroundColor: "#fff",
        scrollbarWidth: "none",
        borderBottom: "1px solid #efefef",
        borderRadius: "24px",
        ...style
      }}
    >
      {children}
    </div>
  );
}
