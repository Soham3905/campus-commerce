import React from "react";

export const ProductCard = ({ children, style, isHovered }) => {
  return (
    <div
      style={{
        padding: "10px",
        width: "280px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}

      {/* Modern Floating Quick Add Pill over Image */}
      <div
        style={{
          position: "absolute",
          top: "145px",
          left: "14px",
          right: "14px",
          zIndex: 10,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            width: "100%",
            padding: "9px 14px",
            backgroundColor: "rgba(17, 24, 39, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "13px",
            letterSpacing: "0.02em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
            boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            fontFamily: "'Inter Tight', Inter, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#000000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(17, 24, 39, 0.92)";
          }}
        >
          <span style={{ fontSize: "13px" }}>⚡</span>
          <span>Quick Add</span>
        </button>
      </div>
    </div>
  );
};
