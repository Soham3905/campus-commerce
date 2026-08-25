import React from "react";

export const ToastContainer = ({ toasts = [], onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "420px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        let bgColor = "#ffffff";
        let borderColor = "#e2e8f0";
        let icon = "ℹ️";
        let textColor = "#1e293b";

        if (toast.type === "success") {
          borderColor = "#10b981";
          icon = "✅";
        } else if (toast.type === "error") {
          borderColor = "#ef4444";
          icon = "🚫";
        } else if (toast.type === "warning") {
          borderColor = "#f59e0b";
          icon = "⚠️";
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              backgroundColor: bgColor,
              borderLeft: `4px solid ${borderColor}`,
              borderTop: "1px solid #e2e8f0",
              borderRight: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 10px -2px rgba(0,0,0,0.04)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>{icon}</span>
            <div style={{ flex: 1, fontSize: "13px", lineHeight: "1.4", color: textColor, fontWeight: "500" }}>
              {toast.message}
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(toast.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "0 2px",
                }}
              >
                ✕
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
