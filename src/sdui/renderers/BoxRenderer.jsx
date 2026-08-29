export default function BoxRenderer({ children, style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", boxSizing: "border-box", ...style }}>
      {children}
    </div>
  );
}