import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPullRequest,
  mergePullRequest,
  fetchPullRequests,
} from "../../store/slices/pullRequestSlice";
import { fetchPages } from "../../store/slices/pageSlice";
import { fetchBranches } from "../../store/slices/branchSlice";

export const PullRequestModal = ({
  isOpen,
  onClose,
  journeyId = "journey-campus-commerce",
  activeBranchId = "main",
  selectedPr = null,
  onPrCreated,
  onPrMerged,
}) => {
  const dispatch = useDispatch();
  const allBranches = useSelector((state) => state.branches.list);
  const branches = allBranches.filter((b) => b.id !== "main" && b.name !== "main");

  const [activeTab, setActiveTab] = useState("diff"); // 'diff' | 'raw'
  const [sourceBranchId, setSourceBranchId] = useState(
    activeBranchId !== "main" ? activeBranchId : branches[0]?.id || ""
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mergeStatus, setMergeStatus] = useState(null);

  if (!isOpen) return null;

  const isReviewMode = !!selectedPr;

  const handleCreatePR = async (e) => {
    e.preventDefault();
    if (!sourceBranchId) {
      setError("Please select a source branch.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const created = await dispatch(
        createPullRequest({
          journeyId,
          sourceBranchId,
          targetBranchId: "main",
          title: title || `Merge ${sourceBranchId} into main`,
          description,
        })
      ).unwrap();

      if (onPrCreated) onPrCreated(created);
      onClose();
    } catch (err) {
      setError(err?.message || err || "Failed to create PR.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMerge = async () => {
    if (!selectedPr) return;
    setIsSubmitting(true);
    setError("");

    try {
      const result = await dispatch(mergePullRequest(selectedPr.id)).unwrap();
      if (result.success) {
        setMergeStatus("success");
        // Re-fetch pages & branches to immediately sync new mainline data from backend
        dispatch(fetchPages(journeyId));
        dispatch(fetchBranches(journeyId));
        dispatch(fetchPullRequests(journeyId));

        if (onPrMerged) onPrMerged(selectedPr);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setMergeStatus("error");
      setError(err?.message || err || "Merge blocked due to validation errors.");
    } finally {
      setIsSubmitting(false);
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
          maxWidth: "680px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85vh",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
            <span style={{ fontSize: "18px" }}>🔀</span>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              {isReviewMode ? `Review Pull Request: ${selectedPr.title}` : "Create Pull Request"}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "18px" }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ padding: "10px 16px", backgroundColor: "#fef2f2", borderBottom: "1px solid #fecaca", color: "#b91c1c", fontSize: "12px", whiteSpace: "pre-line" }}>
            {error}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {!isReviewMode ? (
            <form onSubmit={handleCreatePR} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", display: "block" }}>Source Branch</label>
                  <select
                    value={sourceBranchId}
                    onChange={(e) => setSourceBranchId(e.target.value)}
                    style={{ width: "100%", padding: "6px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", marginTop: "4px" }}
                  >
                    {branches.length === 0 ? (
                      <option value="">No feature branches available</option>
                    ) : (
                      branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <span style={{ fontSize: "18px", color: "#64748b", marginTop: "14px" }}>→</span>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#64748b", display: "block" }}>Target Branch</label>
                  <div style={{ padding: "8px", fontWeight: "600", fontSize: "13px", color: "#0f172a" }}>main (Production)</div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
                  PR Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modernize Product Card Component & Layout"
                  required
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#475569", marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of changes included in this PR"
                  rows={3}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "13px", resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#475569", fontSize: "12px", fontWeight: "600" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={branches.length === 0 || isSubmitting}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: isSubmitting ? "wait" : "pointer",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? "Opening..." : "Open Pull Request"}
                </button>
              </div>
            </form>
          ) : (
            // REVIEW MODE
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "6px", backgroundColor: selectedPr.status === "merged" ? "#d1fae5" : "#e0e7ff", color: selectedPr.status === "merged" ? "#065f46" : "#3730a3", fontWeight: "700" }}>
                    {selectedPr.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>
                    {selectedPr.sourceBranchName} → main
                  </span>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    onClick={() => setActiveTab("diff")}
                    style={{ padding: "4px 10px", borderRadius: "6px", border: "none", backgroundColor: activeTab === "diff" ? "#4f46e5" : "#f1f5f9", color: activeTab === "diff" ? "#fff" : "#475569", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Structured Diff
                  </button>
                  <button
                    onClick={() => setActiveTab("raw")}
                    style={{ padding: "4px 10px", borderRadius: "6px", border: "none", backgroundColor: activeTab === "raw" ? "#4f46e5" : "#f1f5f9", color: activeTab === "raw" ? "#fff" : "#475569", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Raw Details
                  </button>
                </div>
              </div>

              {activeTab === "diff" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>
                    Proposed Component Changes ({selectedPr.changes?.length || 0})
                  </span>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>
                    {(selectedPr.changes || []).map((ch, idx) => {
                      let tagColor = "#4f46e5";
                      let tagBg = "#e0e7ff";
                      let icon = "⚙️";

                      if (ch.type === "ADDED") {
                        tagColor = "#059669";
                        tagBg = "#d1fae5";
                        icon = "+";
                      } else if (ch.type === "DELETED" || ch.type === "REMOVED") {
                        tagColor = "#dc2626";
                        tagBg = "#fee2e2";
                        icon = "-";
                      } else if (ch.type === "THEME_CHANGE") {
                        tagColor = "#7c3aed";
                        tagBg = "#ede9fe";
                        icon = "🎨";
                      } else if (ch.type === "MOVED") {
                        tagColor = "#d97706";
                        tagBg = "#fef3c7";
                        icon = "↕";
                      }

                      return (
                        <div
                          key={idx}
                          style={{
                            padding: "10px 14px",
                            borderBottom: idx < selectedPr.changes.length - 1 ? "1px solid #f1f5f9" : "none",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor: tagBg,
                              color: tagColor,
                              minWidth: "24px",
                              textAlign: "center",
                            }}
                          >
                            {icon} {ch.type}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                              {ch.summary}
                            </div>
                            {ch.details && (
                              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                                {ch.details}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: "#0f172a", color: "#38bdf8", padding: "12px", borderRadius: "8px", fontFamily: "monospace", fontSize: "11px", maxHeight: "250px", overflowY: "auto" }}>
                  <pre style={{ margin: 0 }}>{JSON.stringify(selectedPr, null, 2)}</pre>
                </div>
              )}

              {/* Merge Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                {selectedPr.status === "open" ? (
                  <>
                    <button
                      onClick={onClose}
                      disabled={isSubmitting}
                      style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#ffffff", color: "#475569", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
                    >
                      Close
                    </button>
                    <button
                      onClick={handleMerge}
                      disabled={isSubmitting}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#10b981",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: isSubmitting ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: isSubmitting ? 0.7 : 1,
                      }}
                    >
                      <span>{isSubmitting ? "Merging..." : "✓ Approve & Merge into Main"}</span>
                    </button>
                  </>
                ) : (
                  <div style={{ color: "#059669", fontSize: "13px", fontWeight: "600" }}>
                    ✓ This Pull Request has been merged into main
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PullRequestModal;
