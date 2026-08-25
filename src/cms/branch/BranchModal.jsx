import React, { useState } from "react";
import { BranchRepository } from "../services/branchRepository";

export const BranchModal = ({ isOpen, onClose, journeyId, onBranchCreated }) => {
  const branches = BranchRepository.getAll();
  const [sourceBranchId, setSourceBranchId] = useState("main");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Branch name is required.");
      return;
    }

    try {
      const created = BranchRepository.createBranch({
        journeyId,
        sourceBranchId,
        name,
        description,
      });
      if (onBranchCreated) {
        onBranchCreated(created);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create branch.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>🌿</span>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              Create Working Branch
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && (
            <div style={{ padding: "8px 12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#b91c1c", fontSize: "12px" }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
              Source Branch
            </label>
            <select
              value={sourceBranchId}
              onChange={(e) => setSourceBranchId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                color: "#0f172a",
                backgroundColor: "#ffffff",
                outline: "none",
              }}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.id === "main" ? "Production" : "Branch"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
              Branch Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. product-card-modern"
              required
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                color: "#0f172a",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What changes will this branch introduce?"
              rows={3}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "13px",
                color: "#0f172a",
                outline: "none",
                resize: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#475569",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create Branch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchModal;
