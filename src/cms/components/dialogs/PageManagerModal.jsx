import React, { useState } from "react";
import { PageRepository } from "../../services/pageRepository";
import { defaultInterfaces } from "../../../schema/defaultInterfaces";
import { ensureStableIds } from "../../utils/idUtils";
import { cloneTree } from "../../utils/treeUtils";

export const PageManagerModal = ({
  isOpen,
  onClose,
  activePageId,
  onSwitchPage,
  onRefresh,
}) => {
  const [pages, setPages] = useState(() => PageRepository.getAll());
  const [isCreating, setIsCreating] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [selectedInterfaceId, setSelectedInterfaceId] = useState("ecommerce-home");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  if (!isOpen) return null;

  const refreshList = () => {
    const list = PageRepository.getAll();
    setPages(list);
    if (onRefresh) onRefresh();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    const blueprint = defaultInterfaces.find((i) => i.id === selectedInterfaceId);
    const newPage = {
      name: newPageName.trim(),
      route: newPageName.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      interfaceId: selectedInterfaceId,
      schema: ensureStableIds(cloneTree(blueprint?.schema || {})),
    };

    const saved = PageRepository.save(newPage);
    refreshList();
    setIsCreating(false);
    setNewPageName("");
    if (saved) {
      onSwitchPage(saved.id);
      onClose();
    }
  };

  const handleDuplicate = (id) => {
    PageRepository.duplicate(id);
    refreshList();
  };

  const handleDelete = (id) => {
    if (pages.length <= 1) {
      alert("You cannot delete the only remaining page.");
      return;
    }
    if (confirm("Are you sure you want to delete this page?")) {
      PageRepository.delete(id);
      refreshList();
      if (activePageId === id) {
        const remaining = PageRepository.getAll();
        if (remaining[0]) {
          onSwitchPage(remaining[0].id);
        }
      }
    }
  };

  const handleStartRename = (page) => {
    setEditingId(page.id);
    setEditingName(page.name);
  };

  const handleSaveRename = (id) => {
    if (editingName.trim()) {
      PageRepository.rename(id, editingName.trim());
      refreshList();
    }
    setEditingId(null);
  };

  return (
    <div className="cms-modal-backdrop" onClick={onClose}>
      <div className="cms-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cms-panel-header" style={{ padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
            <span>📄</span>
            <span>Page Management</span>
          </div>
          <button
            className="cms-btn-icon"
            onClick={onClose}
            style={{ width: "28px", height: "28px", fontSize: "16px" }}
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
                background: "var(--cms-bg-card)",
                border: "1px solid var(--cms-accent-primary)",
                borderRadius: "var(--cms-radius-md)",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--cms-text-primary)" }}>
                Create New SDUI Page
              </div>

              <div className="cms-form-group">
                <label className="cms-label">Page Name</label>
                <input
                  type="text"
                  className="cms-input"
                  placeholder="e.g. Flash Deals Page"
                  autoFocus
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                />
              </div>

              <div className="cms-form-group">
                <label className="cms-label">Starting Interface Blueprint</label>
                <select
                  className="cms-select"
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
                  className="cms-btn cms-btn-secondary"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="cms-btn cms-btn-primary">
                  Create Page
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "var(--cms-text-muted)" }}>
                {pages.length} saved pages
              </span>
              <button
                className="cms-btn cms-btn-primary"
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
                    background: isActive ? "var(--cms-accent-primary-light)" : "var(--cms-bg-card)",
                    border: "1px solid",
                    borderColor: isActive ? "var(--cms-accent-primary)" : "var(--cms-border-subtle)",
                    borderRadius: "var(--cms-radius-sm)",
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
                            className="cms-input"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                            autoFocus
                          />
                          <button
                            className="cms-btn cms-btn-primary"
                            onClick={() => handleSaveRename(page.id)}
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--cms-text-primary)" }}>
                            {page.name}
                            {isActive && (
                              <span
                                style={{
                                  marginLeft: "6px",
                                  fontSize: "10px",
                                  background: "var(--cms-accent-primary)",
                                  color: "#fff",
                                  padding: "1px 6px",
                                  borderRadius: "10px",
                                }}
                              >
                                Active
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--cms-text-muted)", marginTop: "2px" }}>
                            Route: <code style={{ color: "var(--cms-text-accent)" }}>/{page.route || "page"}</code> • {iface?.name || page.interfaceId}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
                    {!isActive && (
                      <button
                        className="cms-btn cms-btn-primary"
                        onClick={() => {
                          onSwitchPage(page.id);
                          onClose();
                        }}
                        style={{ padding: "4px 10px", fontSize: "11px" }}
                      >
                        Open
                      </button>
                    )}
                    <button
                      className="cms-btn-icon"
                      onClick={() => handleStartRename(page)}
                      title="Rename"
                      style={{ width: "28px", height: "28px" }}
                    >
                      ✏️
                    </button>
                    <button
                      className="cms-btn-icon"
                      onClick={() => handleDuplicate(page.id)}
                      title="Duplicate"
                      style={{ width: "28px", height: "28px" }}
                    >
                      ⧉
                    </button>
                    <button
                      className="cms-btn-icon"
                      onClick={() => handleDelete(page.id)}
                      title="Delete"
                      style={{ width: "28px", height: "28px", color: "var(--cms-danger)" }}
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
