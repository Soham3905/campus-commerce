export default function PageRenderer({ children, style = {} }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(100, 1fr)",
        gridTemplateRows: "repeat(200, 10px)",
        gap: "0px",
        padding: "5px",
        height: "100%",
        ...style
      }}
    >
      {children}
    </div>
  );
}