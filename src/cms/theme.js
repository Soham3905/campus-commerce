/**
 * CMS Theme & Style Constants — Clean White / Light Professional Studio System
 * Tailored for high clarity, subtle gray borders, dark readable typography, and calm indigo accents.
 */

export const colors = {
  // Surfaces
  bgCanvas: "#f8fafc",
  bgPanel: "#ffffff",
  bgPanelHeader: "#ffffff",
  bgCard: "#ffffff",
  bgCardHover: "#f1f5f9",
  bgInput: "#ffffff",
  borderSubtle: "#e2e8f0",
  borderMedium: "#cbd5e1",

  // Accents
  accentPrimary: "#4f46e5",
  accentPrimaryHover: "#4338ca",
  accentPrimaryLight: "rgba(79, 70, 229, 0.08)",
  accentSecondary: "#0ea5e9",

  // Typography
  textPrimary: "#0f172a",
  textSecondary: "#475569",
  textMuted: "#64748b",
  textAccent: "#4f46e5",

  // Status Colors
  success: "#10b981",
  successBg: "rgba(16, 185, 129, 0.1)",
  warning: "#f59e0b",
  warningBg: "rgba(245, 158, 11, 0.1)",
  danger: "#ef4444",
  dangerBg: "rgba(239, 68, 68, 0.1)",

  fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
};

export const commonStyles = {
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    border: "1px solid transparent",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    outline: "none",
  },
  btnPrimary: {
    background: "#4f46e5",
    color: "#ffffff",
    border: "1px solid transparent",
  },
  btnSecondary: {
    background: "#ffffff",
    borderColor: "#cbd5e1",
    color: "#334155",
  },
  btnIcon: {
    width: "30px",
    height: "30px",
    padding: "0",
    background: "transparent",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.15s ease",
    flexShrink: 0,
    outline: "none",
  },
  input: {
    width: "100%",
    background: "#ffffff",
    border: `1px solid ${colors.borderMedium}`,
    color: colors.textPrimary,
    padding: "7px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    outline: "none",
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.textMuted,
    marginBottom: "6px",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(4px)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    animation: "fadeIn 0.2s ease-out",
  },
  modalBox: {
    background: "#ffffff",
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: "14px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
    width: "100%",
    maxWidth: "680px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};

export default {
  colors,
  commonStyles,
};
