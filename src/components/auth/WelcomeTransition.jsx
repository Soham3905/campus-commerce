import React from "react";

export const WelcomeTransition = ({ onProceed }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "radial-gradient(circle at top left, rgba(79,70,229,0.10), transparent 32%), radial-gradient(circle at bottom right, rgba(14,165,233,0.08), transparent 30%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "980px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "24px",
          alignItems: "stretch",
          animation: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "22px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              width: "fit-content",
              padding: "6px 12px",
              borderRadius: "999px",
              backgroundColor: "rgba(79,70,229,0.08)",
              color: "#4338ca",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            CampusCommerce Studio
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 5vw, 54px)",
                fontWeight: "800",
                color: "#0f172a",
                letterSpacing: "-0.04em",
                lineHeight: 1.02,
              }}
            >
              Welcome to the component studio.
            </h1>
            <p
              style={{
                margin: "14px 0 0 0",
                fontSize: "16px",
                color: "#475569",
                lineHeight: 1.7,
                maxWidth: "56ch",
              }}
            >
              Start with a guided foundation, pick the components you need, choose a visual theme, and move into a clean CMS workspace built for drag-and-drop SDUI composition.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              "White studio UI",
              "Interface-driven CMS",
              "Dynamic drag and drop",
              "Theme presets",
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
            onClick={onProceed}
            style={{
              marginTop: "6px",
              padding: "14px 22px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #4f46e5, #0ea5e9)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 16px 30px -12px rgba(79,70,229,0.45)",
              width: "fit-content",
            }}
          >
            <span>Choose your foundation</span>
            <span>→</span>
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "16px", backgroundColor: "rgba(79,70,229,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
              ✨
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Step 1</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Choose the setup that matches your journey</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {[
              ["Components", "Start with the exact set of building blocks you want to expose."],
              ["Themes", "Pick clean presets or create your own visual language."],
              ["Workspace", "Move into a white, structured CMS with drag-and-drop editing."],
            ].map(([title, description]) => (
              <div key={title} style={{ padding: "14px", borderRadius: "16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{title}</div>
                <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.55 }}>{description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTransition;
