import React, { useState, useEffect } from "react";
import { validateSchema } from "../../utils/validation";

export const JsonEditorModal = ({ isOpen, onClose, schema, onApplyJson }) => {
  const [jsonText, setJsonText] = useState("");
  const [errors, setErrors] = useState([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (schema) {
      setJsonText(JSON.stringify(schema, null, 2));
      setErrors([]);
      setIsValid(true);
    }
  }, [schema, isOpen]);

  if (!isOpen) return null;

  const handleValidate = (textToValidate) => {
    const result = validateSchema(textToValidate);
    setIsValid(result.isValid);
    setErrors(result.errors);
    return result;
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setJsonText(val);
    handleValidate(val);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setErrors([]);
      setIsValid(true);
    } catch (e) {
      setErrors([`Cannot format invalid JSON: ${e.message}`]);
      setIsValid(false);
    }
  };

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonText);
    }
  };

  const handleApply = () => {
    const result = handleValidate(jsonText);
    if (!result.isValid) return;

    try {
      onApplyJson(jsonText);
      onClose();
    } catch (e) {
      setErrors([e.message || "Failed to apply schema"]);
      setIsValid(false);
    }
  };

  return (
    <div className="cms-modal-backdrop" onClick={onClose}>
      <div
        className="cms-modal-box"
        style={{ maxWidth: "800px", height: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cms-panel-header" style={{ padding: "12px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <span>{`{ }`}</span>
            <span>Advanced SDUI JSON Schema Editor</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button className="cms-btn cms-btn-secondary" onClick={handleFormat} style={{ fontSize: "11px", padding: "4px 10px" }}>
              Format JSON
            </button>
            <button className="cms-btn cms-btn-secondary" onClick={handleCopy} style={{ fontSize: "11px", padding: "4px 10px" }}>
              Copy
            </button>
            <button
              className="cms-btn cms-btn-primary"
              onClick={handleApply}
              disabled={!isValid}
              style={{ fontSize: "11px", padding: "4px 14px", opacity: isValid ? 1 : 0.5 }}
            >
              Apply Schema
            </button>
            <button
              className="cms-btn-icon"
              onClick={onClose}
              style={{ width: "28px", height: "28px", fontSize: "16px", marginLeft: "6px" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Validation Errors Banner */}
        {errors.length > 0 && (
          <div
            style={{
              background: "var(--cms-danger-bg)",
              borderBottom: "1px solid var(--cms-danger)",
              padding: "10px 16px",
              color: "#fca5a5",
              fontSize: "12px",
              maxHeight: "100px",
              overflowY: "auto",
            }}
          >
            <div style={{ fontWeight: "700", marginBottom: "4px" }}>⚠️ Schema Validation Issues:</div>
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* JSON Editor Textarea */}
        <div style={{ flex: 1, padding: "12px", display: "flex", overflow: "hidden" }}>
          <textarea
            className="cms-textarea"
            value={jsonText}
            onChange={handleTextChange}
            style={{
              flex: 1,
              height: "100%",
              resize: "none",
              fontFamily: "var(--cms-font-mono)",
              fontSize: "12px",
              lineHeight: "1.5",
              color: "#89dceb",
              background: "var(--cms-bg-input)",
              padding: "12px",
            }}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};
