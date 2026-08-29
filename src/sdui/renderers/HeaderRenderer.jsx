export default function HeaderRenderer({ children, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, ...style }}>
      {children}
    </div>
  );
}
