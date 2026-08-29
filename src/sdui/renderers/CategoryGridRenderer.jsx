export default function CategoryGridRenderer({ children, style = {} }) {
  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        gap: "12px",
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflowX: "auto",
        scrollbarWidth: "none",
        ...style
      }}
    >
      {children}
    </div>
  );
}