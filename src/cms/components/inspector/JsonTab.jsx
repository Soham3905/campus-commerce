import React, { useState, useEffect } from "react";
import { colors, commonStyles } from "../../theme";

/**
 * JsonTab — allows direct JSON editing of the selected component node.
 * On Apply, the entire node object is replaced (preserving the existing id).
 */
export const JsonTab = ({ node, onUpdate }) => {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (node) {
      setText(JSON.stringify(node, null, 2));
      setErr("");
    }
  }, [node]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(text);
      // Always preserve the original ID to avoid breaking the tree
      parsed.id = node.id;
      onUpdate(node.id, parsed);
      setErr("");
    } catch (e) {
      setErr(`JSON Syntax Error: ${e.message}`);
    }
  };

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, 2));
      setErr("");
    } catch (e) {
      setErr(`Cannot format — ${e.message}`);
    }
  };

  return (
    <div style={{ padding: "12px", display: "flex", flexDirection: "column", height: "100%", gap: "8px", boxSizing: "border-box" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: colors.textMuted }}>Node JSON — edit &amp; Apply</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "11px", padding: "3px 8px" }}
            onClick={handleFormat}
          >
            Format
          </button>
          <button
            style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "11px", padding: "3px 8px" }}
            onClick={handleCopy}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button
            style={{ ...commonStyles.btn, ...commonStyles.btnPrimary, fontSize: "11px", padding: "3px 10px" }}
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>

      {err && (
        <div
          style={{
            background: colors.dangerBg,
            color: "#fca5a5",
            padding: "6px 10px",
            borderRadius: "4px",
            fontSize: "11px",
            lineHeight: "1.4",
          }}
        >
          {err}
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          ...commonStyles.input,
          flex: 1,
          minHeight: "260px",
          fontFamily: colors.fontMono,
          fontSize: "11px",
          lineHeight: "1.5",
          color: "#89dceb",
          resize: "none",
        }}
        spellCheck="false"
      />

      <div style={{ fontSize: "10px", color: colors.textMuted, lineHeight: "1.4" }}>
        ⚠️ The <code>id</code> field is protected and will not change.
      </div>
    </div>
  );
};
