import React from "react";

export const ContextMenu = ({ data, onClose, onSelect }) => {
  if (!data) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "200px",
          overflow: "hidden",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "12px 15px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "13px",
            color: "#111",
          }}
        >
          {data.title || "Actions"}
        </div>
        {data.options?.map((opt, i) => (
          <div
            key={i}
            style={{
              padding: "12px 15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderBottom:
                i === data.options.length - 1 ? "none" : "1px solid #f0f0f0",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9f9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            onClick={() => {
              if (onSelect) onSelect(opt);
              if (onClose) onClose();
            }}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span style={{ fontSize: "13px", color: "#333" }}>{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
