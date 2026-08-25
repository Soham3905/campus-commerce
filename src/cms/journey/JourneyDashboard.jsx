import React, { useState } from "react";
import { JourneyRepository } from "../services/journeyRepository";
import { PageRepository } from "../services/pageRepository";
import { BranchRepository } from "../services/branchRepository";
import { PullRequestRepository } from "../services/pullRequestRepository";
import { ComponentRegistry } from "../../registry/componentRegistry";
import { BranchModal } from "../branch/BranchModal";
import { PullRequestModal } from "../pr/PullRequestModal";

// ─── Shared Styles ────────────────────────────────────────────────────────────
const btn = (primary = false) => ({
  padding: "7px 14px",
  borderRadius: "6px",
  border: primary ? "none" : "1px solid #e2e8f0",
  backgroundColor: primary ? "#4f46e5" : "#ffffff",
  color: primary ? "#ffffff" : "#374151",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  whiteSpace: "nowrap",
});

const tag = (color = "#e2e8f0", text = "#374151") => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: "600",
  backgroundColor: color,
  color: text,
  whiteSpace: "nowrap",
});

// ─── New Journey Modal ─────────────────────────────────────────────────────────
const NewJourneyModal = ({ onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("fresh"); // 'fresh' | 'duplicate'
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate({ name, description: desc });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 5000,
        background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "600px", backgroundColor: "#ffffff", borderRadius: "12px",
          border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(79,70,229,0.1)", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✈️</div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>New Journey</h2>
              <span style={{ ...tag("rgba(79,70,229,0.1)", "#4f46e5"), fontSize: "10px" }}>qamapping.json Engine</span>
            </div>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#64748b" }}>Start fresh or duplicate an existing journey — your call.</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", color: "#94a3b8", lineHeight: 1 }}>✕</button>
        </div>

        {/* Step Tabs */}
        <div style={{ padding: "0 24px", display: "flex", gap: "0", borderBottom: "1px solid #e2e8f0", marginBottom: "20px" }}>
          {["1. Start", "2. Details", "3. Pages", "4. Review & Create"].map((s, i) => (
            <button key={s} onClick={() => setStep(i + 1)} style={{
              padding: "10px 16px", border: "none", background: "transparent",
              borderBottom: step === i + 1 ? "2px solid #4f46e5" : "2px solid transparent",
              color: step === i + 1 ? "#4f46e5" : "#64748b",
              fontSize: "12px", fontWeight: step === i + 1 ? "700" : "500", cursor: "pointer",
            }}>{s}</button>
          ))}
        </div>

        {/* Step Content */}
        <div style={{ padding: "0 24px 24px" }}>
          {step === 1 && (
            <>
              <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", marginBottom: "4px" }}>How do you want to start?</p>
              <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>Build a brand-new page flow, or clone one that already exists.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { id: "fresh", icon: "✈️", label: "Start fresh", desc: "Build a new page flow from scratch" },
                  { id: "duplicate", icon: "📋", label: "Duplicate existing journey", desc: "Clone pages & rules from another journey" },
                ].map((opt) => (
                  <div key={opt.id} onClick={() => setMode(opt.id)} style={{
                    padding: "16px", borderRadius: "8px", cursor: "pointer",
                    border: `2px solid ${mode === opt.id ? "#4f46e5" : "#e2e8f0"}`,
                    backgroundColor: mode === opt.id ? "rgba(79,70,229,0.04)" : "#ffffff",
                    transition: "all 0.15s ease",
                  }}>
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>{opt.icon}</div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>{opt.label}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{opt.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Journey Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Product Checkout Flow" style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Description</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe what this journey covers..." rows={3} style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
            </div>
          )}

          {(step === 3 || step === 4) && (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📄</div>
              <div style={{ fontSize: "13px" }}>Pages will be auto-created from your catalog selection.</div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
          <button onClick={onClose} style={btn(false)}>Cancel</button>
          <div style={{ display: "flex", gap: "8px" }}>
            {step > 1 && <button onClick={() => setStep(s => s - 1)} style={btn(false)}>← Back</button>}
            {step < 4
              ? <button onClick={() => setStep(s => s + 1)} style={btn(true)}>Continue →</button>
              : <button onClick={handleCreate} disabled={!name.trim()} style={{ ...btn(true), opacity: name.trim() ? 1 : 0.5 }}>🚀 Create Journey</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page Card ────────────────────────────────────────────────────────────────
const PageCard = ({ page, pageIndex, activeBranchId, onEdit }) => {
  const seqColor = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"][pageIndex % 5];

  return (
    <div style={{
      backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px",
      padding: "20px", display: "flex", flexDirection: "column", gap: "12px",
      minWidth: "240px", flex: "1",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.2s ease",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"}
    >
      {/* Card Top */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: "28px", color: "#94a3b8" }}>📄</div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ ...tag("#e0f2fe", "#0369a1"), fontSize: "10px" }}>Seq {pageIndex + 1}</span>
          <span style={{ ...tag(activeBranchId === "main" ? "#dcfce7" : "#fef9c3", activeBranchId === "main" ? "#16a34a" : "#92400e"), fontSize: "10px" }}>
            {activeBranchId === "main" ? "BRE Enabled" : "BRE OFF"}
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>{page.name}</h3>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
          {page.description || `Configured fields for ${page.name.toLowerCase()} step`}
        </p>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {[
          { label: "Route", value: page.route || `/${page.id}` },
          { label: "DB Page ID", value: page.id?.slice(-4) || "—" },
          { label: "Page Slug", value: page.id || "—" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
            <span style={{ color: "#94a3b8", width: "80px", flexShrink: 0 }}>{label}</span>
            <span style={{ color: "#475569", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "4px", borderTop: "1px solid #f1f5f9" }}>
        <button style={btn(false)}>📜 History</button>
        <button onClick={() => onEdit(page.id)} style={btn(true)}>✏️ Edit Main</button>
      </div>
    </div>
  );
};

// ─── Branch Row ───────────────────────────────────────────────────────────────
const BranchRow = ({ branch, onCreatePr, onEdit }) => (
  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{branch.name}</td>
    <td style={{ padding: "12px 16px" }}>
      <span style={tag(branch.name === "main" ? "#dcfce7" : "#f0f9ff", branch.name === "main" ? "#16a34a" : "#0369a1")}>
        {branch.name === "main" ? "active" : "dev"}
      </span>
    </td>
    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b" }}>
      {branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : "—"}
    </td>
    <td style={{ padding: "12px 16px" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => onCreatePr?.(branch)} style={btn(false)}>↕ Create PR</button>
        <button onClick={() => onEdit?.(branch)} style={btn(true)}>✏️ Edit Form</button>
      </div>
    </td>
  </tr>
);

// ─── PR Row ───────────────────────────────────────────────────────────────────
const PrRow = ({ pr, onReview }) => (
  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{pr.title}</td>
    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#64748b" }}>{pr.sourceBranch} → {pr.targetBranch}</td>
    <td style={{ padding: "12px 16px" }}>
      <span style={tag(
        pr.status === "open" ? "#dbeafe" : pr.status === "merged" ? "#dcfce7" : "#f1f5f9",
        pr.status === "open" ? "#1d4ed8" : pr.status === "merged" ? "#16a34a" : "#64748b"
      )}>{pr.status || "open"}</span>
    </td>
    <td style={{ padding: "12px 16px" }}>
      <button onClick={() => onReview?.(pr)} style={btn(pr.status === "open")} disabled={pr.status !== "open"}>
        {pr.status === "open" ? "👁 Review & Merge" : "✓ Merged"}
      </button>
    </td>
  </tr>
);

// ─── Component Editor Card ─────────────────────────────────────────────────────
const ComponentCard = ({ type, onOpen }) => {
  const def = ComponentRegistry[type];
  if (!def) return null;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff", border: `1px solid ${hovered ? "#4f46e5" : "#e2e8f0"}`,
        borderRadius: "10px", padding: "16px", cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: hovered ? "0 4px 12px rgba(79,70,229,0.12)" : "none",
        display: "flex", flexDirection: "column", gap: "10px",
      }}
      onClick={() => onOpen(type)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: "rgba(79,70,229,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
          {def.icon || "📦"}
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{def.label}</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{def.category}</div>
        </div>
      </div>
      {def.description && (
        <p style={{ margin: 0, fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>{def.description}</p>
      )}
      {def.allowedChildren?.length > 0 && (
        <div style={{ fontSize: "10px", color: "#94a3b8" }}>
          {def.allowedChildren.length} configurable field{def.allowedChildren.length !== 1 ? "s" : ""}
        </div>
      )}
      <div style={{ ...btn(hovered), justifyContent: "center", fontSize: "11px" }}>
        {hovered ? "→ Open Studio" : "🖊 Edit Component"}
      </div>
    </div>
  );
};

// ─── JourneyDashboard ─────────────────────────────────────────────────────────
export const JourneyDashboard = ({
  activeJourneyId = "journey-campus-commerce",
  activeBranchId = "main",
  onSelectJourney,
  onOpenPageEditor,
  onOpenComponentEditor,
  onSwitchBranch,
}) => {
  const journeys = JourneyRepository.getAll();
  const currentJourney = journeys.find((j) => j.id === activeJourneyId) || journeys[0];
  const [selectedJourneyId, setSelectedJourneyId] = useState(currentJourney?.id || null);
  const pages = PageRepository.getAll();
  const branches = BranchRepository.getAll();
  const pullRequests = PullRequestRepository.getAll();

  const [activeTab, setActiveTab] = useState("pages"); // 'pages' | 'branches' | 'prs' | 'history' | 'components'
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [selectedPr, setSelectedPr] = useState(null);
  const [isNewJourneyOpen, setIsNewJourneyOpen] = useState(false);
  const [journeySearch, setJourneySearch] = useState("");

  const majorComponents = Object.keys(ComponentRegistry).filter((t) =>
    ["ProductCard", "Header", "SearchBar", "HeroBanner", "Carousel", "CategoryGrid",
     "CouponCode", "CountDownTimer", "Button", "Footer", "NavBar", "StoryRow",
     "Box", "Text", "IFrame"].includes(t)
  );

  const handleSelectJourney = (id) => {
    setSelectedJourneyId(id);
    onSelectJourney?.({ id });
  };

  const handleCreateJourney = ({ name, description }) => {
    JourneyRepository.save({ name, description, pages: [] });
  };

  const filteredJourneys = journeys.filter((j) =>
    j.name?.toLowerCase().includes(journeySearch.toLowerCase())
  );

  const currentJourneyObj = journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

  const topTabs = [
    { id: "pages", label: "📄 Pages" },
    { id: "branches", label: "🌿 Manage Branches" },
    { id: "prs", label: "↕ Pull Requests" },
    { id: "components", label: "🧩 Components" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "#f8fafc", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflow: "hidden" }}>

      {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
      <aside style={{ width: "248px", backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>

        {/* Brand */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🎓</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>CampusCommerce</div>
            <div style={{ fontSize: "10px", color: "#94a3b8" }}>Journey CMS & QA</div>
          </div>
        </div>

        {/* Tools */}
        <div style={{ padding: "10px 12px 6px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", marginBottom: "6px", paddingLeft: "4px" }}>TOOLS</div>
          <button style={{ ...btn(false), width: "100%", justifyContent: "flex-start", fontSize: "12px", padding: "7px 10px" }}>📊 QA Data Sync</button>
        </div>

        {/* Search Journeys */}
        <div style={{ padding: "6px 12px" }}>
          <input
            value={journeySearch}
            onChange={(e) => setJourneySearch(e.target.value)}
            placeholder="Search journeys..."
            style={{ width: "100%", padding: "7px 10px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", outline: "none", boxSizing: "border-box", color: "#374151" }}
          />
        </div>

        {/* Journeys Section Header */}
        <div style={{ padding: "8px 16px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>
            JOURNEYS ({filteredJourneys.length})
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "13px", padding: "0 2px" }}>↕</button>
            <button onClick={() => setIsNewJourneyOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#4f46e5", fontSize: "16px", fontWeight: "700", lineHeight: 1 }}>+</button>
          </div>
        </div>

        {/* Journey List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredJourneys.map((journey) => {
            const isActive = selectedJourneyId === journey.id;
            return (
              <div key={journey.id}>
                <button
                  onClick={() => handleSelectJourney(journey.id)}
                  style={{
                    width: "100%", textAlign: "left", padding: "8px 16px",
                    display: "flex", alignItems: "center", gap: "8px",
                    background: isActive ? "rgba(79,70,229,0.06)" : "transparent",
                    border: "none", cursor: "pointer",
                    borderLeft: isActive ? "3px solid #4f46e5" : "3px solid transparent",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>{journey.icon || "✈️"}</span>
                  <span style={{ fontSize: "13px", fontWeight: isActive ? "700" : "500", color: isActive ? "#4f46e5" : "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {journey.name}
                  </span>
                  {isActive && <span style={{ marginLeft: "auto", fontSize: "12px", color: "#94a3b8" }}>▼</span>}
                </button>
                {isActive && (
                  <div style={{ paddingLeft: "36px", borderLeft: "2px solid #e2e8f0", marginLeft: "14px" }}>
                    {["Pages", "Branches", "Pull Requests", "History"].map((sub) => {
                      const tabId = sub === "Pages" ? "pages" : sub === "Branches" ? "branches" : sub === "Pull Requests" ? "prs" : "history";
                      return (
                        <button key={sub} onClick={() => setActiveTab(tabId)} style={{
                          width: "100%", textAlign: "left", padding: "5px 12px",
                          background: "transparent", border: "none", cursor: "pointer",
                          fontSize: "12px", color: activeTab === tabId ? "#4f46e5" : "#64748b",
                          fontWeight: activeTab === tabId ? "600" : "400",
                        }}>{sub}</button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: "700" }}>A</div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "600", color: "#0f172a" }}>Admin User</div>
              <div style={{ fontSize: "10px", color: "#94a3b8" }}>admin@campus.edu</div>
            </div>
          </div>
          <button style={{ marginTop: "8px", ...btn(false), width: "100%", justifyContent: "center", fontSize: "11px", color: "#ef4444", borderColor: "#fca5a5" }}>⎋ Sign out</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Journey Header */}
        <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "16px 28px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "22px" }}>{currentJourneyObj?.icon || "✈️"}</span>
                <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                  {currentJourneyObj?.name || "Select a Journey"}
                </h1>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                {pages.length} mapped pages in this journey · {activeBranchId === "main" ? "QA Configured" : `Branch: ${activeBranchId}`}
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={btn(true)}>▶ Run QA Journey</button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div style={{ display: "flex", gap: "0" }}>
            {topTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "10px 16px", border: "none", background: "transparent",
                  borderBottom: activeTab === t.id ? "2px solid #4f46e5" : "2px solid transparent",
                  color: activeTab === t.id ? "#4f46e5" : "#64748b",
                  fontSize: "13px", fontWeight: activeTab === t.id ? "700" : "500",
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >{t.label}</button>
            ))}
          </div>
        </header>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

          {/* ── PAGES TAB ── */}
          {activeTab === "pages" && (
            <div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {pages.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", width: "100%" }}>
                    <div style={{ fontSize: "40px", marginBottom: "12px" }}>📄</div>
                    <div>No pages yet. Create a page to get started.</div>
                  </div>
                ) : (
                  pages.map((page, i) => (
                    <PageCard key={page.id} page={page} pageIndex={i} activeBranchId={activeBranchId} onEdit={onOpenPageEditor} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── BRANCHES TAB ── */}
          {activeTab === "branches" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Branches</h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Explore and manage working branches for this journey</p>
                </div>
                <button onClick={() => setIsBranchModalOpen(true)} style={btn(true)}>+ Create Branch</button>
              </div>

              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", display: "grid", gridTemplateColumns: "3fr 1fr 2fr 2fr", gap: "8px" }}>
                  {["Branch Name", "Status", "Created", "Actions"].map((h) => (
                    <span key={h} style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" }}>{h}</span>
                  ))}
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {branches.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No branches yet. Create your first branch to start working.</td></tr>
                    ) : (
                      branches.map((b) => (
                        <BranchRow key={b.name} branch={b} onCreatePr={() => setIsBranchModalOpen(false)} onEdit={() => onSwitchBranch?.(b.name)} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PULL REQUESTS TAB ── */}
          {activeTab === "prs" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Pull Requests</h2>
                <button onClick={() => setIsPrModalOpen(true)} style={btn(true)}>+ Create Pull Request</button>
              </div>

              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Title", "Branches", "Status", "Action"].map((h) => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#94a3b8" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pullRequests.length === 0 ? (
                      <tr><td colSpan={4} style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No pull requests yet.</td></tr>
                    ) : (
                      pullRequests.map((pr) => (
                        <PrRow key={pr.id} pr={pr} onReview={(p) => { setSelectedPr(p); setIsPrModalOpen(true); }} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COMPONENTS TAB ── */}
          {activeTab === "components" && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <h2 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Component Definitions</h2>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Click any component to open its dedicated visual studio editor</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                {majorComponents.map((type) => (
                  <ComponentCard key={type} type={type} onOpen={onOpenComponentEditor} />
                ))}
              </div>
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === "history" && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📜</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>Activity & Release History</div>
              <div style={{ fontSize: "12px" }}>No activity recorded yet. Changes are tracked after your first save.</div>
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      {isNewJourneyOpen && (
        <NewJourneyModal onClose={() => setIsNewJourneyOpen(false)} onCreate={handleCreateJourney} />
      )}

      {isBranchModalOpen && (
        <BranchModal isOpen onClose={() => setIsBranchModalOpen(false)} currentBranch={activeBranchId} onSwitchBranch={onSwitchBranch} onCreateBranch={(name) => { BranchRepository.create(name, activeBranchId); setIsBranchModalOpen(false); }} />
      )}

      {isPrModalOpen && (
        <PullRequestModal isOpen pr={selectedPr} onClose={() => { setIsPrModalOpen(false); setSelectedPr(null); }} />
      )}
    </div>
  );
};

export default JourneyDashboard;
