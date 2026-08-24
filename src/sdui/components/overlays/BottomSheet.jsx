import React from "react";

export const BottomSheet = ({ data, isOpen, onClose, onSelect }) => {
  if (!isOpen || !data) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          backgroundColor: "#fff",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          padding: "16px",
          animation: "slideUp 0.3s ease-out",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "4px",
            backgroundColor: "#ddd",
            borderRadius: "2px",
            margin: "0 auto 12px",
          }}
        />
        <h3
          style={{
            textAlign: "center",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#111",
            fontWeight: "700",
          }}
        >
          {data.title || "Share via"}
        </h3>

        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {data.options?.map((option, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (onSelect) onSelect(option);
                if (onClose) onClose();
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  background: "#f0f0f0",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {option.icon}
              </div>
              <span style={{ fontSize: "11px", color: "#444" }}>
                {option.label}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "10px",
            border: "none",
            background: "#eee",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "13px",
            cursor: "pointer",
            color: "#333",
          }}
        >
          Cancel
        </button>
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
