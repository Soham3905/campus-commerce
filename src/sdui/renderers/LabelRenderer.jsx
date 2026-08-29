export default function LabelRenderer({ children, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", ...style }}>
      {children}
    </div>
  );
}