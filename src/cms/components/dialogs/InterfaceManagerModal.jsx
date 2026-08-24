import React, { useState } from "react";
import { InterfaceRepository } from "../../services/interfaceRepository";

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
    <div className="cms-modal-backdrop" onClick={onClose}>
      <div className="cms-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cms-panel-header" style={{ padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <span>📐</span>
            <span>Interface Blueprints</span>
          </div>
          <button
            className="cms-btn-icon"
            onClick={onClose}
            style={{ width: "28px", height: "28px", fontSize: "16px" }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "12px", color: "var(--cms-text-muted)" }}>
            An Interface is a reusable structural blueprint for building SDUI pages. Selecting an interface applies its component hierarchy to the current canvas.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
            {interfaces.map((item) => {
              const isSelected = activeInterfaceId === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    background: isSelected ? "var(--cms-accent-primary-light)" : "var(--cms-bg-card)",
                    border: "1px solid",
                    borderColor: isSelected ? "var(--cms-accent-primary)" : "var(--cms-border-subtle)",
                    borderRadius: "var(--cms-radius-md)",
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
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--cms-text-primary)" }}>
                        {item.name}
                        <span
                          style={{
                            marginLeft: "6px",
                            fontSize: "10px",
                            background: "var(--cms-bg-panel)",
                            color: "var(--cms-text-muted)",
                            padding: "1px 6px",
                            borderRadius: "10px",
                          }}
                        >
                          {item.category || "Blueprint"}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--cms-text-muted)", marginTop: "3px", lineHeight: "1.4" }}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
                    <button
                      className="cms-btn cms-btn-icon"
                      onClick={() => handleDuplicate(item.id)}
                      title="Duplicate Blueprint"
                    >
                      ⧉
                    </button>
                    <button
                      className="cms-btn cms-btn-primary"
                      onClick={() => {
                        if (confirm(`Apply "${item.name}" blueprint to current canvas? This will replace the canvas layout.`)) {
                          onApplyInterface(item.id);
                          onClose();
                        }
                      }}
                      style={{ padding: "5px 10px", fontSize: "11px" }}
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
