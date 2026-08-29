export default function RatingRenderer({ children, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>
      {children}
    </div>
  );
}
