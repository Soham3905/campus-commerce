/**
 * CMS Theme & Style Constants
 * Direct JS style objects for inline styling across all CMS components.
 */

export const colors = {
  bgCanvas: "#0f111a",
  bgPanel: "#161824",
  bgPanelHeader: "#1c1e2e",
  bgCard: "#202334",
  bgCardHover: "#292c42",
  bgInput: "#12141f",
  borderSubtle: "#272a3e",
  borderMedium: "#363a54",

  // Accents
  accentPrimary: "#6366f1",
  accentPrimaryHover: "#4f46e5",
  accentPrimaryLight: "rgba(99, 102, 241, 0.15)",
  accentSecondary: "#ec4899",

  // Text
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  textAccent: "#818cf8",

  // Status
  success: "#10b981",
  successBg: "rgba(16, 185, 129, 0.15)",
  warning: "#f59e0b",
  warningBg: "rgba(245, 158, 11, 0.15)",
  danger: "#ef4444",
  dangerBg: "rgba(239, 68, 68, 0.15)",

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
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    color: "#ffffff",
    border: "1px solid transparent",
  },
  btnSecondary: {
    background: colors.bgCard,
    borderColor: colors.borderMedium,
    color: colors.textPrimary,
  },
  btnIcon: {
    width: "30px",
    height: "30px",
    padding: "0",
    background: "transparent",
    border: "1px solid transparent",
    color: colors.textSecondary,
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.15s ease",
    flexShrink: 0,
    outline: "none",
  },
  input: {
    width: "100%",
    background: colors.bgInput,
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
    background: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(4px)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    animation: "fadeIn 0.2s ease-out",
  },
  modalBox: {
    background: colors.bgPanel,
    border: `1px solid ${colors.borderMedium}`,
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    width: "100%",
    maxWidth: "680px",
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};
