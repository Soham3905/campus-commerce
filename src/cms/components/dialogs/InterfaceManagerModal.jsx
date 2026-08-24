import React, { useState } from "react";
import { InterfaceRepository } from "../../services/interfaceRepository";
import { colors, commonStyles } from "../../theme";

export const InterfaceManagerModal = ({
  isOpen,
  onClose,
  activeInterfaceId,
  onApplyInterface,
}) => {
  const [interfaces, setInterfaces] = useState(() => InterfaceRepository.getAll());

  if (!isOpen) return null;

  const refreshList = () => {
    setInterfaces(InterfaceRepository.getAll());
  };

  const handleDuplicate = (id) => {
    InterfaceRepository.duplicate(id);
    refreshList();
  };

  return (
    <div style={commonStyles.modalBackdrop} onClick={onClose}>
      <div style={commonStyles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: colors.bgPanelHeader,
            borderBottom: `1px solid ${colors.borderSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "14px",
            fontWeight: "600",
            color: colors.textPrimary,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📐</span>
            <span>Interface Blueprints</span>
          </div>
          <button
            style={{ ...commonStyles.btnIcon, width: "28px", height: "28px", fontSize: "16px" }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "12px", color: colors.textMuted }}>
            An Interface is a reusable structural blueprint for building SDUI pages. Selecting an interface applies its component hierarchy to the current canvas.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
            {interfaces.map((item) => {
              const isSelected = activeInterfaceId === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    background: isSelected ? colors.accentPrimaryLight : colors.bgCard,
                    border: "1px solid",
                    borderColor: isSelected ? colors.accentPrimary : colors.borderSubtle,
                    borderRadius: "10px",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1, minWidth: "200px" }}>
                    <span style={{ fontSize: "22px", marginTop: "2px", flexShrink: 0 }}>{item.icon || "📄"}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: colors.textPrimary }}>
                        {item.name}
                        <span
                          style={{
                            marginLeft: "6px",
                            fontSize: "10px",
                            background: colors.bgPanel,
                            color: colors.textMuted,
                            padding: "1px 6px",
                            borderRadius: "10px",
                          }}
                        >
                          {item.category || "Blueprint"}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "3px", lineHeight: "1.4" }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                    <button
                      style={{ ...commonStyles.btnIcon }}
                      onClick={() => handleDuplicate(item.id)}
                      title="Duplicate Blueprint"
                    >
                      ⧉
                    </button>
                    <button
                      style={{ ...commonStyles.btn, ...commonStyles.btnPrimary, padding: "5px 10px", fontSize: "11px" }}
                      onClick={() => {
                        if (confirm(`Apply "${item.name}" blueprint to current canvas? This will replace the canvas layout.`)) {
                          onApplyInterface(item.id);
                          onClose();
                        }
                      }}
                    >
                      Use Blueprint
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
