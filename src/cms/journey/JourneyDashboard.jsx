import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Plus,
  Search,
  LogOut,
  RefreshCw,
  Play,
  CheckCircle2,
  Layers,
  GitBranch,
  FileCode,
  History,
  User,
  Sparkles,
  Package,
  ArrowRight,
  SlidersHorizontal,
  ExternalLink,
  Edit3,
} from "lucide-react";
import { createJourney } from "../../store/slices/journeySlice";
import { FoundationRepository } from "../services/foundationRepository";
import { ComponentRegistry } from "../../registry/componentRegistry";
import { BranchModal } from "../branch/BranchModal";
import { PullRequestModal } from "../pr/PullRequestModal";
import { SDUIRenderer } from "../../sdui/SDUIRenderer";
import { createComponent } from "../utils/componentFactory";

// ─── Shared Styles ────────────────────────────────────────────────────────────
const btn = (primary = false) => ({
  padding: "7px 14px",
  borderRadius: "8px",
  border: primary ? "none" : "1px solid #e2e8f0",
  backgroundColor: primary ? "#4f46e5" : "#ffffff",
  color: primary ? "#ffffff" : "#374151",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  whiteSpace: "nowrap",
  transition: "all 0.15s ease",
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
  const [mode, setMode] = useState("fresh");
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
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "600px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(79,70,229,0.1)", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✈️</div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>New Journey</h2>
              <span style={{ ...tag("rgba(79,70,229,0.1)", "#4f46e5"), fontSize: "10px" }}>qamapping.json Engine</span>
            </div>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#64748b" }}>Start fresh or duplicate an existing journey.</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", color: "#94a3b8", lineHeight: 1 }}>✕</button>
        </div>

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
                    padding: "16px", borderRadius: "10px", cursor: "pointer",
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
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Product Checkout Flow" style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Description</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe what this journey covers..." rows={3} style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
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

        <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between" }}>
          <button onClick={onClose} style={btn(false)}>Cancel</button>
          <div style={{ display: "flex", gap: "8px" }}>
            {step > 1 && <button onClick={() => setStep((s) => s - 1)} style={btn(false)}>← Back</button>}
            {step < 4 ? (
              <button onClick={() => setStep((s) => s + 1)} style={btn(true)}>Continue →</button>
            ) : (
              <button onClick={handleCreate} disabled={!name.trim()} style={{ ...btn(true), opacity: name.trim() ? 1 : 0.5 }}>🚀 Create Journey</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Page Card ────────────────────────────────────────────────────────────────
const PageCard = ({ page, pageIndex, activeBranchId, onEdit, onHistory }) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "250px",
        flex: "1",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.18s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.08)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
          📄
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ ...tag("#e0f2fe", "#0369a1"), fontSize: "10px" }}>Seq {pageIndex + 1}</span>
          <span style={{ ...tag(activeBranchId === "main" ? "#dcfce7" : "#fef9c3", activeBranchId === "main" ? "#16a34a" : "#92400e"), fontSize: "10px" }}>
            {activeBranchId === "main" ? "BRE Enabled" : "BRE OFF"}
          </span>
        </div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>{page.name}</h3>
        <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>
          {page.description || `Configured fields for ${page.name.toLowerCase()} step`}
        </p>
      </div>

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

      <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #f1f5f9" }}>
        <button onClick={onHistory} style={btn(false)}>
          <History size={13} />
          <span>History</span>
        </button>
        <button onClick={() => onEdit(page.id)} style={btn(true)}>
          <Edit3 size={13} />
          <span>Edit Main</span>
        </button>
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
  const defaultThemeId = FoundationRepository.getDefaultThemeId(type);

  const previewSchema = React.useMemo(() => {
    try {
      return createComponent(type);
    } catch (e) {
      return null;
    }
  }, [type]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        border: `1.5px solid ${hovered ? "#4f46e5" : "#e2e8f0"}`,
        borderRadius: "14px",
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: hovered ? "0 8px 20px rgba(79,70,229,0.12)" : "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      onClick={() => onOpen(type)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(79,70,229,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
            {def.icon || "📦"}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{def.label}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>{def.category}</div>
          </div>
        </div>
        {defaultThemeId && (
          <span style={{ fontSize: "10px", fontWeight: "600", padding: "2px 6px", borderRadius: "4px", backgroundColor: "#f1f5f9", color: "#64748b" }}>
            ✓ {defaultThemeId.replace(`${type.toLowerCase()}-`, "").replace(/-/g, " ")}
          </span>
        )}
      </div>

      {previewSchema && (
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: "10px",
            padding: "8px",
            border: "1px solid #f1f5f9",
            overflow: "hidden",
            maxHeight: "180px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <div style={{ transform: type === "ProductCard" ? "scale(0.6)" : "scale(0.85)", transformOrigin: "top center", width: "100%", pointerEvents: "none", userSelect: "none" }}>
            <SDUIRenderer schema={previewSchema} deviceType="mobile" isEditable={false} />
          </div>
        </div>
      )}

      {def.description && (
        <p style={{ margin: 0, fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>{def.description}</p>
      )}

      <div style={{ ...btn(hovered), justifyContent: "center", fontSize: "11px", marginTop: "auto" }}>
        {hovered ? "→ Open Studio" : "🖊 Edit Component"}
      </div>
    </div>
  );
};

// ─── Main JourneyDashboard ───────────────────────────────────────────────────
export const JourneyDashboard = ({
  activeJourneyId = "journey-campus-commerce",
  activeBranchId = "main",
  onSelectJourney,
  onOpenPageEditor,
  onOpenComponentEditor,
  onSwitchBranch,
  onLogout,
  user,
}) => {
  const dispatch = useDispatch();
  const journeys = useSelector((state) => state.journeys.list);
  const pages = useSelector((state) => state.pages.list);
  const branches = useSelector((state) => state.branches.list);
  const pullRequests = useSelector((state) => state.pullRequests.list);

  const currentJourney = journeys.find((j) => j.id === activeJourneyId) || journeys[0];
  const [selectedJourneyId, setSelectedJourneyId] = useState(currentJourney?.id || null);

  // Expand / Collapse States
  const [isJourneysSectionExpanded, setIsJourneysSectionExpanded] = useState(true);
  const [expandedJourneyIds, setExpandedJourneyIds] = useState(() => new Set([currentJourney?.id || "journey-campus-commerce"]));

  const [activeTab, setActiveTab] = useState("pages");
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [selectedPr, setSelectedPr] = useState(null);
  const [isNewJourneyOpen, setIsNewJourneyOpen] = useState(false);
  const [journeySearch, setJourneySearch] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(false);

  const majorComponents = Object.keys(ComponentRegistry).filter((t) =>
    ["ProductCard", "Header", "SearchBar", "HeroBanner", "Carousel", "CategoryGrid",
     "CouponCode", "CountDownTimer", "Button", "Footer", "NavBar", "StoryRow",
     "Box", "Text", "IFrame", "PriceBlock", "Badge"].includes(t)
  );

  const handleSelectJourney = (id) => {
    setSelectedJourneyId(id);
    onSelectJourney?.({ id });
    setExpandedJourneyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Toggle collapse
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllJourneys = () => {
    setIsJourneysSectionExpanded((prev) => !prev);
  };

  const handleCreateJourney = async ({ name, description }) => {
    await dispatch(createJourney({ name, description, pages: [] })).unwrap();
  };

  const handleDataSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice(true);
      setTimeout(() => setSyncNotice(false), 2500);
    }, 600);
  };

  const handleRunQaJourney = () => {
    if (pages.length > 0) {
      onOpenPageEditor(pages[0].id);
    }
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

  const userName = user?.name || "Ayush Kumbhare";
  const userEmail = user?.email || "admin@campuscommerce.edu";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "#f8fafc", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflow: "hidden" }}>

      {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
      <aside style={{ width: "256px", backgroundColor: "#ffffff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>

        {/* Brand */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", color: "#ffffff", boxShadow: "0 2px 6px rgba(79,70,229,0.3)" }}>
            🎓
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>CampusCommerce</div>
            <div style={{ fontSize: "10px", color: "#94a3b8" }}>Journey CMS & QA</div>
          </div>
        </div>

        {/* Tools */}
        <div style={{ padding: "10px 12px 6px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8", marginBottom: "6px", paddingLeft: "4px" }}>TOOLS</div>
          <button
            onClick={handleDataSync}
            disabled={isSyncing}
            style={{
              ...btn(false),
              width: "100%",
              justifyContent: "flex-start",
              fontSize: "12px",
              padding: "8px 10px",
              backgroundColor: syncNotice ? "rgba(16,185,129,0.08)" : "#f8fafc",
              borderColor: syncNotice ? "#10b981" : "#e2e8f0",
              color: syncNotice ? "#059669" : "#374151",
            }}
          >
            <RefreshCw size={13} className={isSyncing ? "spin-animation" : ""} style={{ animation: isSyncing ? "spin 0.8s linear infinite" : "none" }} />
            <span>{syncNotice ? "Synced with Server ✓" : isSyncing ? "Syncing..." : "QA Data Sync"}</span>
          </button>
        </div>

        {/* Search Journeys */}
        <div style={{ padding: "6px 12px" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={13} style={{ position: "absolute", left: "9px", color: "#94a3b8", pointerEvents: "none" }} />
            <input
              value={journeySearch}
              onChange={(e) => setJourneySearch(e.target.value)}
              placeholder="Search journeys..."
              style={{
                width: "100%",
                padding: "7px 10px 7px 28px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "12px",
                outline: "none",
                boxSizing: "border-box",
                color: "#374151",
                backgroundColor: "#f8fafc",
              }}
            />
          </div>
        </div>

        {/* Journeys Section Header with Expand / Collapse */}
        <div style={{ padding: "10px 14px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            onClick={toggleAllJourneys}
            style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", userSelect: "none" }}
            title={isJourneysSectionExpanded ? "Collapse Journeys" : "Expand Journeys"}
          >
            {isJourneysSectionExpanded ? <ChevronDown size={13} color="#94a3b8" /> : <ChevronRight size={13} color="#94a3b8" />}
            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>
              JOURNEYS ({filteredJourneys.length})
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={toggleAllJourneys}
              title="Expand / Collapse Journeys Section"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b", padding: "2px 4px", borderRadius: "4px" }}
            >
              <ChevronsUpDown size={14} />
            </button>
            <button
              onClick={() => setIsNewJourneyOpen(true)}
              title="Create New Journey"
              style={{ background: "rgba(79,70,229,0.08)", border: "none", cursor: "pointer", color: "#4f46e5", padding: "2px 6px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Journey List */}
        {isJourneysSectionExpanded && (
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
            {filteredJourneys.map((journey) => {
              const isSelected = selectedJourneyId === journey.id;
              const isExpanded = expandedJourneyIds.has(journey.id);

              return (
                <div key={journey.id} style={{ marginBottom: "2px" }}>
                  <button
                    onClick={() => handleSelectJourney(journey.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: isSelected ? "rgba(79,70,229,0.07)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderLeft: isSelected ? "3px solid #4f46e5" : "3px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{journey.icon || "✈️"}</span>
                    <span style={{ fontSize: "13px", fontWeight: isSelected ? "700" : "500", color: isSelected ? "#4f46e5" : "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {journey.name}
                    </span>
                    <span style={{ color: "#94a3b8", display: "flex", alignItems: "center" }}>
                      {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </span>
                  </button>

                  {/* Sub-Tree Tabs */}
                  {isExpanded && (
                    <div style={{ paddingLeft: "32px", borderLeft: "2px solid #e2e8f0", marginLeft: "18px", marginTop: "2px", marginBottom: "4px" }}>
                      {[
                        { label: "Pages", id: "pages", icon: FileCode },
                        { label: "Branches", id: "branches", icon: GitBranch },
                        { label: "Pull Requests", id: "prs", icon: ChevronsUpDown },
                        { label: "History", id: "history", icon: History },
                      ].map((sub) => {
                        const Icon = sub.icon;
                        const isSubActive = isSelected && activeTab === sub.id;

                        return (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setSelectedJourneyId(journey.id);
                              setActiveTab(sub.id);
                            }}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "5px 8px",
                              background: isSubActive ? "rgba(79,70,229,0.06)" : "transparent",
                              borderRadius: "6px",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              color: isSubActive ? "#4f46e5" : "#64748b",
                              fontWeight: isSubActive ? "600" : "400",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Icon size={12} />
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* User Profile & Sign Out Footer */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: "700" }}>
              {userInitial}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </div>
              <div style={{ fontSize: "10px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userEmail}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              ...btn(false),
              width: "100%",
              justifyContent: "center",
              fontSize: "12px",
              color: "#dc2626",
              borderColor: "#fecaca",
              backgroundColor: "rgba(239, 68, 68, 0.04)",
            }}
            title="Sign out and return to login"
          >
            <LogOut size={13} />
            <span>Sign out</span>
          </button>
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
              <button onClick={handleRunQaJourney} style={btn(true)}>
                <Play size={13} fill="#ffffff" />
                <span>Run QA Journey</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div style={{ display: "flex", gap: "0" }}>
            {topTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  background: "transparent",
                  borderBottom: activeTab === t.id ? "2px solid #4f46e5" : "2px solid transparent",
                  color: activeTab === t.id ? "#4f46e5" : "#64748b",
                  fontSize: "13px",
                  fontWeight: activeTab === t.id ? "700" : "500",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
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
                    <PageCard
                      key={page.id}
                      page={page}
                      pageIndex={i}
                      activeBranchId={activeBranchId}
                      onEdit={onOpenPageEditor}
                      onHistory={() => setActiveTab("history")}
                    />
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
                <button onClick={() => setIsBranchModalOpen(true)} style={btn(true)}>
                  <Plus size={14} />
                  <span>Create Branch</span>
                </button>
              </div>

              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>
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
                <div>
                  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Pull Requests</h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Review and merge journey branches</p>
                </div>
                <button onClick={() => setIsPrModalOpen(true)} style={btn(true)}>
                  <Plus size={14} />
                  <span>Create Pull Request</span>
                </button>
              </div>

              <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
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
              <div style={{ fontSize: "12px" }}>No activity recorded yet. Changes are tracked after your first save in the visual editor.</div>
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      {isNewJourneyOpen && (
        <NewJourneyModal onClose={() => setIsNewJourneyOpen(false)} onCreate={handleCreateJourney} />
      )}

      {isBranchModalOpen && (
        <BranchModal
          isOpen
          journeyId={activeJourneyId}
          onClose={() => setIsBranchModalOpen(false)}
          onBranchCreated={(branch) => setIsBranchModalOpen(false)}
        />
      )}

      {isPrModalOpen && (
        <PullRequestModal
          isOpen
          journeyId={activeJourneyId}
          activeBranchId={activeBranchId}
          selectedPr={selectedPr}
          onClose={() => { setIsPrModalOpen(false); setSelectedPr(null); }}
        />
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default JourneyDashboard;
