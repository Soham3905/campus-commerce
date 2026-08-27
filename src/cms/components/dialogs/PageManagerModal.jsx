import React, { useState } from "react";
import { defaultInterfaces } from "../../../schema/defaultInterfaces";
import { ensureStableIds } from "../../utils/idUtils";
import { cloneTree } from "../../utils/treeUtils";
import { colors, commonStyles } from "../../theme";

export const PageManagerModal = ({
  isOpen,
  onClose,
  pages = [],
  activePageId,
  onSwitchPage,
  onCreatePage,
  onDuplicatePage,
  onRenamePage,
  onDeletePage,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [selectedInterfaceId, setSelectedInterfaceId] = useState("ecommerce-home");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPageName.trim() || isBusy) return;

    const blueprint = defaultInterfaces.find((i) => i.id === selectedInterfaceId);
    const newPage = {
      name: newPageName.trim(),
      route: newPageName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      interfaceId: selectedInterfaceId,
      schema: ensureStableIds(cloneTree(blueprint?.schema || {})),
    };

    setIsBusy(true);
    try {
      const saved = await onCreatePage(newPage);
      setIsCreating(false);
      setNewPageName("");
      if (saved) {
        onSwitchPage(saved.id);
        onClose();
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleDuplicate = async (page) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      await onDuplicatePage(page);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async (id) => {
    if (pages.length <= 1) {
      alert("You cannot delete the only remaining page.");
      return;
    }
    if (confirm("Are you sure you want to delete this page?")) {
      setIsBusy(true);
      try {
        await onDeletePage(id);
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleStartRename = (page) => {
    setEditingId(page.id);
    setEditingName(page.name);
  };

  const handleSaveRename = async (page) => {
    if (editingName.trim() && editingName.trim() !== page.name) {
      setIsBusy(true);
      try {
        await onRenamePage(page, editingName.trim());
      } finally {
        setIsBusy(false);
      }
    }
    setEditingId(null);
  };

  return (
    <div style={commonStyles.modalBackdrop} onClick={onClose}>
      <div style={commonStyles.modalBox} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
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
            <span>📄</span>
            <span>Page Management</span>
          </div>
          <button
            style={{ ...commonStyles.btnIcon, width: "28px", height: "28px", fontSize: "16px" }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Create New Page Section */}
          {isCreating ? (
            <form
              onSubmit={handleCreate}
              style={{
                background: colors.bgCard,
                border: `1px solid ${colors.accentPrimary}`,
                borderRadius: "10px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "700", color: colors.textPrimary }}>
                Create New SDUI Page
              </div>

              <div>
                <label style={commonStyles.label}>Page Name</label>
                <input
                  type="text"
                  style={commonStyles.input}
                  placeholder="e.g. Flash Deals Page"
                  autoFocus
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                />
              </div>

              <div>
                <label style={commonStyles.label}>Starting Interface Blueprint</label>
                <select
                  style={commonStyles.input}
                  value={selectedInterfaceId}
                  onChange={(e) => setSelectedInterfaceId(e.target.value)}
                >
                  {defaultInterfaces.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.icon} {item.name} ({item.category})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                <button
                  type="button"
                  style={{ ...commonStyles.btn, ...commonStyles.btnSecondary }}
                  onClick={() => setIsCreating(false)}
                  disabled={isBusy}
                >
                  Cancel
                </button>
                <button type="submit" style={{ ...commonStyles.btn, ...commonStyles.btnPrimary }} disabled={isBusy}>
                  {isBusy ? "Creating..." : "Create Page"}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: colors.textMuted }}>
                {pages.length} saved pages
              </span>
              <button
                style={{ ...commonStyles.btn, ...commonStyles.btnPrimary }}
                onClick={() => setIsCreating(true)}
              >
                + New Page
              </button>
            </div>
          )}

          {/* Pages List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {pages.map((page) => {
              const isActive = activePageId === page.id;
              const iface = defaultInterfaces.find((i) => i.id === page.interfaceId);

              return (
                <div
                  key={page.id}
                  style={{
                    background: isActive ? colors.accentPrimaryLight : colors.bgCard,
                    border: "1px solid",
                    borderColor: isActive ? colors.accentPrimary : colors.borderSubtle,
                    borderRadius: "6px",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "180px" }}>
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>{iface?.icon || "📄"}</span>
                    <div style={{ minWidth: 0 }}>
                      {editingId === page.id ? (
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="text"
                            style={{ ...commonStyles.input, padding: "4px 8px", fontSize: "12px" }}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                          />
                          <button
                            style={{ ...commonStyles.btn, ...commonStyles.btnPrimary, padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => handleSaveRename(page)}
                            disabled={isBusy}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: colors.textPrimary }}>
                            {page.name}
                            {isActive && (
                              <span
                                style={{
                                  marginLeft: "6px",
                                  fontSize: "10px",
                                  background: colors.accentPrimary,
                                  color: "#fff",
                                  padding: "1px 6px",
                                  borderRadius: "10px",
                                }}
                              >
                                Active
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "2px" }}>
                            Route: <code style={{ color: colors.textAccent }}>/{page.route || "page"}</code> • {iface?.name || page.interfaceId}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
                    {!isActive && (
                      <button
                        style={{ ...commonStyles.btn, ...commonStyles.btnPrimary, padding: "4px 10px", fontSize: "11px" }}
                        onClick={() => {
                          onSwitchPage(page.id);
                          onClose();
                        }}
                      >
                        Open
                      </button>
                    )}
                    <button
                      style={{ ...commonStyles.btnIcon, width: "28px", height: "28px" }}
                      onClick={() => handleStartRename(page)}
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button
                      style={{ ...commonStyles.btnIcon, width: "28px", height: "28px" }}
                      onClick={() => handleDuplicate(page)}
                      title="Duplicate"
                      disabled={isBusy}
                    >
                      ⧉
                    </button>
                    <button
                      style={{ ...commonStyles.btnIcon, width: "28px", height: "28px", color: colors.danger }}
                      onClick={() => handleDelete(page.id)}
                      title="Delete"
                      disabled={isBusy}
                    >
                      🗑️
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
