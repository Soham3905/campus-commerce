import React from 'react';

export default function ProductListRenderer({ children, style = {} }) {
  return (
    <div style={{ display: "flex", gap: "8px", padding: "8px", width: "max-content", ...style }}>
      {React.Children.map(children, (child, idx) => (
        <div key={idx} style={{ display: "flex" }}>
          {child}
        </div>
      ))}
    </div>
  );
}