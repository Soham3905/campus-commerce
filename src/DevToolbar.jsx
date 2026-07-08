import { useState, useCallback, useEffect, Component } from "react";
import SDUIRenderer from "./SDUIRenderer";
import defaultSchema from "./landingSchema.json";
import "./DevToolbar.css";

/* ─────────────────────────────────────────────
   Viewport configurations
───────────────────────────────────────────── */
const VIEWPORTS = [
  {
    id: "mobile",
    label: "Mobile",
    icon: "📱",
    width: 375,
    hint: "375px",
  },
  {
    id: "tablet",
    label: "Tablet",
    icon: "💻",
    width: 768,
    hint: "768px",
  },
  {
    id: "desktop",
    label: "Desktop",
    icon: "🖥",
    width: null, // full width
    hint: "Full width",
  },
];

/* ─────────────────────────────────────────────
   Main DevToolbar component
───────────────────────────────────────────── */
export default function DevToolbar() {
  const [viewport, setViewport] = useState("desktop");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Live schema state — starts from the JSON file
  const [liveSchema, setLiveSchema] = useState(defaultSchema);
  const [jsonText, setJsonText] = useState(
    () => JSON.stringify(defaultSchema, null, 2)
  );
  const [jsonError, setJsonError] = useState(null);
  const [successFlash, setSuccessFlash] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Apply JSON handler ── */
  const handleApply = useCallback(() => {
    setJsonError(null);
    setSuccessFlash(false);

    try {
      const parsed = JSON.parse(jsonText);
      setLiveSchema(parsed);
      setSuccessFlash(true);
      setTimeout(() => setSuccessFlash(false), 2500);
    } catch (err) {
      setJsonError(err.message);
    }
  }, [jsonText]);

  /* ── Reset to original JSON ── */
  const handleReset = useCallback(() => {
    const original = JSON.stringify(defaultSchema, null, 2);
    setJsonText(original);
    setLiveSchema(defaultSchema);
    setJsonError(null);
    setSuccessFlash(false);
  }, []);

  /* ── Keyboard shortcut: Ctrl+Enter / Cmd+Enter inside textarea ── */
  const handleTextareaKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  const activeViewport = VIEWPORTS.find((v) => v.id === viewport);

  return (
    <div className="dt-shell">
      {/* ════════════════════════════════════
          NAVBAR
      ════════════════════════════════════ */}
      <nav className="dt-navbar">
        {/* Logo */}
        <div className="dt-logo">
          <div className="dt-logo-badge">⚡</div>
          <div>
            <div className="dt-logo-text">CampusCommerce</div>
            <div className="dt-logo-sub">Dev Preview</div>
          </div>
        </div>

        <div className="dt-divider" />

        {/* ── Option 1: Viewport Switcher ── */}
        <div className="dt-section">
          <span className="dt-section-label">View</span>
          <div className="dt-viewport-group" role="group" aria-label="Viewport mode">
            {VIEWPORTS.map((vp) => (
              <button
                key={vp.id}
                className={`dt-vp-btn${viewport === vp.id ? " active" : ""}`}
                onClick={() => setViewport(vp.id)}
                title={`${vp.label} (${vp.hint})`}
                aria-pressed={viewport === vp.id}
              >
                <span className="dt-vp-icon">{vp.icon}</span>
                <span className="dt-vp-label">{vp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Option 2: JSON Editor button ── */}
        <button
          className={`dt-json-btn${drawerOpen ? " open" : ""}`}
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-expanded={drawerOpen}
          aria-controls="dt-json-drawer"
        >
          <span className="dt-json-btn-dot" />
          {drawerOpen ? "Close Editor" : "JSON Editor"}
        </button>
      </nav>

      {/* ════════════════════════════════════
          CONTENT
      ════════════════════════════════════ */}
      <div className="dt-content">
        {/* ── Preview Area ── */}
        <div className="dt-preview-area">
          <div
            className={`dt-preview-frame${activeViewport.width === null ? " full" : ""}`}
            style={
              activeViewport.width !== null
                ? { width: activeViewport.width + "px" }
                : undefined
            }
          >
            {/* Error boundary wrapper */}
            <SchemaErrorBoundary key={JSON.stringify(liveSchema)}>
              <SDUIRenderer schema={liveSchema} />
            </SchemaErrorBoundary>
          </div>

          {/* Device label badge for non-desktop modes */}
          {activeViewport.width !== null && (
            <div
              style={{
                position: "fixed",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "20px",
                background: "rgba(10, 10, 20, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.8px",
                pointerEvents: "none",
                zIndex: 500,
              }}
            >
              {activeViewport.icon} {activeViewport.label} — {activeViewport.hint}
            </div>
          )}
        </div>

        {/* ════════════════════════════════════
            JSON EDITOR DRAWER
        ════════════════════════════════════ */}
        <div className="dt-drawer-overlay" aria-hidden={!drawerOpen}>
          <aside
            id="dt-json-drawer"
            className={`dt-drawer${drawerOpen ? " open" : ""}`}
            role="complementary"
            aria-label="JSON Schema Editor"
          >
            {/* Drawer Header */}
            <div className="dt-drawer-header">
              <div className="dt-drawer-title">
                <h3>JSON Schema Editor</h3>
                <p>Edit the schema and click Apply to re-render. (Ctrl+Enter)</p>
              </div>
              <button
                className="dt-drawer-close"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close editor"
              >
                ✕
              </button>
            </div>

            {/* Error Banner */}
            {jsonError && (
              <div className="dt-error-banner" role="alert">
                <span className="dt-error-icon">⚠️</span>
                <div className="dt-error-text">
                  <strong>Sorry, we are not able to handle this.</strong>
                  <code>{jsonError}</code>
                </div>
              </div>
            )}

            {/* Success Banner */}
            {successFlash && !jsonError && (
              <div className="dt-success-banner" role="status">
                <span>✅</span>
                <span>Schema applied — page re-rendered!</span>
              </div>
            )}

            {/* Editor Area */}
            <div className="dt-editor-area">
              <span className="dt-editor-label">schema.json</span>
              <textarea
                className={`dt-textarea${jsonError ? " error" : ""}`}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  // Clear error as user types
                  if (jsonError) setJsonError(null);
                }}
                onKeyDown={handleTextareaKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                aria-label="JSON schema editor"
                aria-describedby={jsonError ? "dt-json-error" : undefined}
              />
            </div>

            {/* Footer Actions */}
            <div className="dt-drawer-footer">
              <button
                className="dt-btn-reset"
                onClick={handleReset}
                title="Reset to original schema"
              >
                ↺ Reset
              </button>
              <button
                className="dt-btn-apply"
                onClick={handleApply}
              >
                <span>⚡</span>
                Apply & Refresh
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Error Boundary — catches render crashes from
   bad schemas gracefully
───────────────────────────────────────────── */

class SchemaErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error, info) {
    console.error("[DevToolbar] Schema render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            padding: "40px 24px",
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
            background: "#fff8f8",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "16px",
              filter: "grayscale(0.2)",
            }}
          >
            💥
          </div>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: "18px",
              fontWeight: 700,
              color: "#991b1b",
            }}
          >
            Sorry, we are not able to handle this.
          </h2>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: "13px",
              color: "#6b7280",
              maxWidth: "360px",
              lineHeight: 1.6,
            }}
          >
            The page crashed while rendering your schema. Check the JSON editor
            and fix any issues, then apply again.
          </p>
          <code
            style={{
              display: "block",
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#b91c1c",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
              maxWidth: "400px",
              wordBreak: "break-all",
              lineHeight: 1.5,
            }}
          >
            {this.state.errorMsg}
          </code>
        </div>
      );
    }

    return this.props.children;
  }
}
