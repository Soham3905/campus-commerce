import React, { useState, useEffect } from "react";
import { validateSchema } from "../../utils/validation";
import { colors, commonStyles } from "../../theme";

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
    <div style={commonStyles.modalBackdrop} onClick={onClose}>
      <div
        style={{ ...commonStyles.modalBox, maxWidth: "800px", height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: colors.bgPanelHeader,
            borderBottom: `1px solid ${colors.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <span>{`{ }`}</span>
            <span>JSON Schema Editor</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto", flexWrap: "wrap" }}>
            <button
              style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "11px", padding: "4px 8px" }}
              onClick={handleFormat}
            >
              Format
            </button>
            <button
              style={{ ...commonStyles.btn, ...commonStyles.btnSecondary, fontSize: "11px", padding: "4px 8px" }}
              onClick={handleCopy}
            >
              Copy
            </button>
            <button
              style={{
                ...commonStyles.btn,
                ...commonStyles.btnPrimary,
                fontSize: "11px",
                padding: "4px 12px",
                opacity: isValid ? 1 : 0.5,
              }}
              onClick={handleApply}
              disabled={!isValid}
            >
              Apply
            </button>
            <button
              style={{ ...commonStyles.btnIcon, width: "26px", height: "26px", fontSize: "15px" }}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Validation Errors Banner */}
        {errors.length > 0 && (
          <div
            style={{
              background: colors.dangerBg,
              borderBottom: `1px solid ${colors.danger}`,
              padding: "8px 14px",
              color: "#fca5a5",
              fontSize: "11px",
              maxHeight: "90px",
              overflowY: "auto",
            }}
          >
            <div style={{ fontWeight: "700", marginBottom: "3px" }}>⚠️ Validation Issues:</div>
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* JSON Editor Textarea */}
        <div style={{ flex: 1, padding: "10px", display: "flex", overflow: "hidden" }}>
          <textarea
            value={jsonText}
            onChange={handleTextChange}
            style={{
              ...commonStyles.input,
              flex: 1,
              height: "100%",
              resize: "none",
              fontFamily: colors.fontMono,
              fontSize: "12px",
              lineHeight: "1.45",
              color: "#89dceb",
              padding: "10px",
            }}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};
