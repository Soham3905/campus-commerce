import React, { useState, useEffect } from "react";

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
      // Call onUpdate with the full parsed node — useCmsState.updateComponent
      // detects a complete node object and does a full replacement.
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
        <span style={{ fontSize: "11px", color: "var(--cms-text-muted)" }}>Node JSON — edit &amp; Apply</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            className="cms-btn cms-btn-secondary"
            onClick={handleFormat}
            style={{ fontSize: "11px", padding: "3px 8px" }}
          >
            Format
          </button>
          <button
            className="cms-btn cms-btn-secondary"
            onClick={handleCopy}
            style={{ fontSize: "11px", padding: "3px 8px" }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button
            className="cms-btn cms-btn-primary"
            onClick={handleApply}
            style={{ fontSize: "11px", padding: "3px 10px" }}
          >
            Apply
          </button>
        </div>
      </div>

      {err && (
        <div
          style={{
            background: "var(--cms-danger-bg)",
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
        className="cms-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          flex: 1,
          minHeight: "260px",
          fontFamily: "var(--cms-font-mono)",
          fontSize: "11px",
          lineHeight: "1.5",
          color: "#89dceb",
          resize: "none",
        }}
        spellCheck="false"
      />

      <div style={{ fontSize: "10px", color: "var(--cms-text-muted)", lineHeight: "1.4" }}>
        ⚠️ The <code>id</code> field is protected and will not change.
      </div>
    </div>
  );
};
