import React from "react";
import { colors, commonStyles } from "../../theme";

export const ContentTab = ({ node, definition, onUpdate }) => {
  if (!node) return null;

  const fields = definition?.fields || [];
  const data = node.data || {};

  const handleFieldChange = (fieldName, value) => {
    onUpdate(node.id, {
      data: {
        ...data,
        [fieldName]: value,
      },
    });
  };

  if (fields.length === 0) {
    return (
      <div style={{ padding: "20px 10px", textAlign: "center", color: colors.textMuted, fontSize: "12px" }}>
        This component ({node.type}) has no configurable content fields. It manages children or layout.
      </div>
    );
  }

  return (
    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {fields.map((field) => {
        const val = data[field.name] !== undefined ? data[field.name] : field.defaultValue ?? "";

        return (
          <div key={field.name} style={{ marginBottom: "12px" }}>
            <label style={commonStyles.label}>{field.label}</label>

            {field.type === "text" && (
              <input
                type="text"
                style={commonStyles.input}
                value={val}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                style={commonStyles.input}
                value={val}
                onChange={(e) => handleFieldChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
              />
            )}

            {field.type === "textarea" && (
              <textarea
                style={{ ...commonStyles.input, resize: "vertical" }}
                rows={3}
                value={val}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
            )}

            {field.type === "image" && (
              <div>
                <input
                  type="text"
                  style={commonStyles.input}
                  placeholder="https://..."
                  value={val}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                />
                {val && (
                  <div
                    style={{
                      marginTop: "6px",
                      width: "100%",
                      height: "80px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      background: colors.bgInput,
                      border: `1px solid ${colors.borderSubtle}`,
                    }}
                  >
                    <img src={val} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                )}
              </div>
            )}

            {field.type === "url" && (
              <input
                type="url"
                style={commonStyles.input}
                value={val}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
            )}

            {field.type === "checkbox" && (
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "12px" }}>
                <input
                  type="checkbox"
                  checked={Boolean(val)}
                  onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                  style={{ accentColor: colors.accentPrimary }}
                />
                <span>Enable {field.label}</span>
              </label>
            )}

            {field.type === "select" && (
              <select
                style={commonStyles.input}
                value={val}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
};
