import React from "react";

export const ThankYouTransition = ({ onEnterDashboard }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "radial-gradient(circle at top right, rgba(16,185,129,0.10), transparent 28%), radial-gradient(circle at bottom left, rgba(79,70,229,0.08), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "740px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          animation: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "24px",
          padding: "44px 32px",
          boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            backgroundColor: "rgba(16, 185, 129, 0.10)",
            color: "#059669",
            fontSize: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✓
        </div>

        <div>
          <h1
            style={{
              margin: "0 0 8px 0",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: "800",
              color: "#0f172a",
              letterSpacing: "-0.03em",
            }}
          >
            Your workspace is ready.
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "15px",
              color: "#64748b",
              lineHeight: 1.6,
              textAlign: "center",
              maxWidth: "54ch",
            }}
          >
            Welcome to <strong>CampusCommerce Studio</strong>.
            <br />
            Your interface foundation, theme choices, and starter components are ready to shape.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginTop: "4px" }}>
          {[
            "Dashboard",
            "Pages",
            "Branches",
            "Pull requests",
          ].map((item) => (
            <span
              key={item}
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#334155",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {item}
            </span>
          ))}
        </div>

        <button
          onClick={onEnterDashboard}
          style={{
            marginTop: "8px",
            padding: "14px 24px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #0f766e, #4f46e5)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 16px 30px -12px rgba(79, 70, 229, 0.45)",
          }}
        >
          <span>Open CMS Dashboard</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default ThankYouTransition;
