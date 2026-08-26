import React, { useState, useEffect, useCallback } from "react";
import { useCmsState } from "../../hooks/useCmsState";
import { useToasts } from "../../hooks/useToasts";
import { DragDropProvider } from "../../dragdrop/DragDropContext";
import { ToastContainer } from "../../../components/common/Toast";
import { CmsHeader } from "./CmsHeader";
import { ComponentLibrary } from "../library/ComponentLibrary";
import { VisualCanvas } from "../canvas/VisualCanvas";
import { Inspector } from "../inspector/Inspector";
import { JsonEditorModal } from "../dialogs/JsonEditorModal";
import { PageManagerModal } from "../dialogs/PageManagerModal";
import { BranchModal } from "../../branch/BranchModal";
import { BranchRepository } from "../../services/branchRepository";
import { JourneyDashboard } from "../../journey/JourneyDashboard";
import { colors } from "../../theme";


// ─── Right Panel Tabs ─────────────────────────────────────────────────────────
const RIGHT_TABS = [
  { id: "properties", label: "Properties" },
  { id: "json", label: "{ } JSON" },
];

export const CmsLayout = ({ onLogout, user }) => {
  const {
    schema, selectedComponentId, selectedNode, activeDevice,
    activePage, activeJourney, activeBranch, editingContext,
    isDirty, saveStatus, canUndo, canRedo,
    setActiveDevice, setActiveJourney, setActiveBranch, setEditingContext,
    selectComponent, clearSelection, updateComponent,
    addComponent, deleteComponent, duplicateComponent,
    moveComponent, addComponentAtSlot, moveComponentToSlot,
    applyJsonSchema, switchPage, openComponentEditor, switchBranch,
    saveCurrentPage, undo, redo,
  } = useCmsState();

  const { toasts, removeToast, showSuccess, showWarning } = useToasts();

  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' | 'editor'
  const [leftTab, setLeftTab] = useState("library"); // 'library'
  const [rightTab, setRightTab] = useState("properties"); // 'properties' | 'json'
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 900);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const cmd = e.ctrlKey || e.metaKey;
      if (cmd && e.key === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      if (cmd && e.key === "y") { e.preventDefault(); redo(); }
      if (cmd && e.key === "s") { e.preventDefault(); saveCurrentPage(); showSuccess("Saved ✓"); }
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, saveCurrentPage, clearSelection, showSuccess]);

  // ── Drop Handler ────────────────────────────────────────────────────────────
  const handleDropItem = useCallback(({ source, slot }) => {
    if (!slot?.parentId) return;

    if (source.isNew) {
      const result = addComponentAtSlot(source.type, slot);
      if (result.ok) {
        showSuccess(`✓ Added ${source.label || source.type}`);
      } else {
        showWarning(result.reason || `Cannot place ${source?.type || "component"} here`);
      }
    } else if (source.nodeId) {
      const result = moveComponentToSlot(source.nodeId, slot);
      if (result.ok) {
        showSuccess(result.moved === false ? "Component already in place" : "Component moved");
      } else {
        showWarning(result.reason || `Cannot place ${source?.type || "component"} here`);
      }
    }
  }, [addComponentAtSlot, moveComponentToSlot, showSuccess, showWarning]);

  const handleInvalidDrop = useCallback(({ source, slot, reason }) => {
    showWarning(reason || `Cannot place ${source?.type} here`);
  }, [showWarning]);

  // ── View Handlers ───────────────────────────────────────────────────────────
  const handleOpenPageEditor = (pageId) => {
    switchPage(pageId);
    setCurrentView("editor");
  };

  const handleOpenComponentEditor = (compType) => {
    openComponentEditor(compType);
    setCurrentView("editor");
  };

  // ─── DASHBOARD VIEW ──────────────────────────────────────────────────────────
  if (currentView === "dashboard") {
    return (
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <JourneyDashboard
          activeJourneyId={activeJourney?.id}
          activeBranchId={activeBranch}
          onSelectJourney={(j) => setActiveJourney(j)}
          onOpenPageEditor={handleOpenPageEditor}
          onOpenComponentEditor={handleOpenComponentEditor}
          onSwitchBranch={(branch) => { switchBranch(branch); setActiveBranch(branch); }}
          onLogout={onLogout}
          user={user}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // ─── EDITOR VIEW ─────────────────────────────────────────────────────────────
  const sidebarW = 280;
  const inspectorW = 340;

  return (
    <DragDropProvider schema={schema} onDropItem={handleDropItem} onInvalidDrop={handleInvalidDrop}>
      <div style={{
        display: "flex", flexDirection: "column", height: "100vh", width: "100vw",
        overflow: "hidden", backgroundColor: colors.bgCanvas,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: colors.textPrimary,
      }}>

        {/* ── TOP HEADER ─────────────────────────────────────────────────── */}
        <CmsHeader
          activePage={activePage}
          activeDevice={activeDevice}
          activeBranch={activeBranch}
          editingContext={editingContext}
          isDirty={isDirty}
          saveStatus={saveStatus}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          onDeviceChange={setActiveDevice}
          onSave={() => { saveCurrentPage(); showSuccess("Saved ✓"); }}
          onOpenPages={() => setIsPagesOpen(true)}
          onOpenJson={() => setIsJsonOpen(true)}
          onOpenBranches={() => setIsBranchOpen(true)}
          onBackToDashboard={() => setCurrentView("dashboard")}
        />

        {/* ── BREADCRUMB BAR ──────────────────────────────────────────────── */}
        <div style={{
          height: "36px", backgroundColor: "#ffffff", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", padding: "0 16px", gap: "6px",
          fontSize: "12px", color: "#94a3b8", flexShrink: 0,
        }}>
          <button onClick={() => setCurrentView("dashboard")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#4f46e5", fontSize: "12px", fontWeight: "600", padding: 0 }}>
            Dashboard
          </button>
          <span>/</span>
          {activeJourney?.name && <>
            <span style={{ color: "#374151", fontWeight: "500" }}>{activeJourney.name}</span>
            <span>/</span>
          </>}
          <span style={{ color: "#374151", fontWeight: "600" }}>
            {editingContext ? `${editingContext} Studio` : activePage?.name || "Editor"}
          </span>
          {onLogout && (
            <>
              <span>/</span>
              <button
                onClick={onLogout}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "12px", fontWeight: "600", padding: 0 }}
              >
                Sign out
              </button>
            </>
          )}
          {activeBranch && activeBranch !== "main" && (
            <span style={{ marginLeft: "8px", padding: "1px 8px", borderRadius: "10px", backgroundColor: "rgba(79,70,229,0.1)", color: "#4f46e5", fontSize: "11px", fontWeight: "600" }}>
              🌿 {activeBranch}
            </span>
          )}
        </div>

        {/* ── THREE-PANEL BODY ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ─── LEFT PANEL: Toolbox + Layers ─────────────────────────────── */}
          {!isMobile && (
            <aside style={{
              width: `${sidebarW}px`, flexShrink: 0, backgroundColor: "#ffffff",
              borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}>
              <ComponentLibrary
                onAddComponent={(type) => {
                  addComponent(type);
                  showSuccess(`Added ${type}`);
                }}
                selectedNode={selectedNode}
                editingContext={editingContext}
              />
            </aside>
          )}

          {/* ─── CENTER PANEL: Visual Canvas ─────────────────────────────── */}
          <main style={{
            flex: 1, display: "flex", flexDirection: "column",
            overflow: "hidden", minWidth: 0,
            backgroundColor: "#f8fafc",
          }}>
            <VisualCanvas
              schema={schema}
              activeDevice={activeDevice}
              selectedId={selectedComponentId}
              selectedNode={selectedNode}
              onSelectComponent={selectComponent}
              onDuplicateComponent={duplicateComponent}
              onDeleteComponent={deleteComponent}
              onMoveComponent={moveComponent}
              onOpenInspector={() => setRightTab("properties")}
              onDropItem={handleDropItem}
              onInvalidDrop={handleInvalidDrop}
              editingContext={editingContext}
              onNavigate={(route) => console.log("[CMS navigate]", route)}
            />
          </main>

          {/* ─── RIGHT PANEL: Inspector + JSON ───────────────────────────── */}
          {!isMobile && (
            <aside style={{
              width: `${inspectorW}px`, flexShrink: 0, backgroundColor: "#ffffff",
              borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}>
              {/* Right Panel Tab Strip */}
              <div style={{
                display: "flex", borderBottom: "1px solid #e2e8f0",
                padding: "0 4px", backgroundColor: "#ffffff", flexShrink: 0,
              }}>
                {RIGHT_TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setRightTab(t.id)}
                    style={{
                      flex: 1, padding: "11px 8px", background: "transparent", border: "none",
                      borderBottom: rightTab === t.id ? "2px solid #4f46e5" : "2px solid transparent",
                      color: rightTab === t.id ? "#4f46e5" : "#64748b",
                      fontSize: "12px", fontWeight: rightTab === t.id ? "700" : "500",
                      cursor: "pointer", outline: "none",
                    }}
                  >{t.label}</button>
                ))}
              </div>

              {/* Right Panel Content */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                {rightTab === "properties" ? (
                  <Inspector
                    selectedNode={selectedNode}
                    activeDevice={activeDevice}
                    onUpdateComponent={updateComponent}
                    onDeleteComponent={deleteComponent}
                    onDuplicateComponent={duplicateComponent}
                  />
                ) : (
                  <JsonPanelInline
                    selectedNode={selectedNode}
                    fullSchema={schema}
                    onUpdateComponent={updateComponent}
                    onApplyFullSchema={applyJsonSchema}
                  />
                )}
              </div>
            </aside>
          )}
        </div>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav style={{
            height: "54px", backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0",
            display: "flex", flexShrink: 0,
          }}>
            {[
              { id: "library", icon: "🧩", label: "Library" },
              { id: "canvas", icon: "🎨", label: "Canvas" },
              { id: "inspect", icon: "⚙️", label: "Inspect" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLeftTab(tab.id)}
                style={{
                  flex: 1, border: "none", background: leftTab === tab.id ? "rgba(79,70,229,0.06)" : "transparent",
                  color: leftTab === tab.id ? "#4f46e5" : "#94a3b8",
                  fontSize: "10px", fontWeight: "600", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px",
                }}
              >
                <span style={{ fontSize: "18px" }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        )}

        {/* Modals */}
        <PageManagerModal
          isOpen={isPagesOpen}
          onClose={() => setIsPagesOpen(false)}
          activePageId={activePage?.id}
          onSwitchPage={switchPage}
        />
        <JsonEditorModal
          isOpen={isJsonOpen}
          onClose={() => setIsJsonOpen(false)}
          schema={schema}
          onApplyJson={(json) => { applyJsonSchema(json); showSuccess("Schema applied"); }}
        />
        <BranchModal
          isOpen={isBranchOpen}
          onClose={() => setIsBranchOpen(false)}
          currentBranch={activeBranch}
          onSwitchBranch={(b) => {
            switchBranch(b);
            setActiveBranch(b);
            setIsBranchOpen(false);
            showSuccess(`Switched to branch ${b}`);
          }}
          onCreateBranch={(name) => {
            BranchRepository.create(name, activeBranch);
            switchBranch(name);
            setActiveBranch(name);
            setIsBranchOpen(false);
            showSuccess(`Created and switched to branch ${name}`);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    </DragDropProvider>
  );
};

// ─── Inline JSON Panel (right sidebar) ────────────────────────────────────────
const JsonPanelInline = ({ selectedNode, fullSchema, onUpdateComponent, onApplyFullSchema }) => {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("node"); // 'node' | 'full'
  const [copied, setCopied] = useState(false);

  const source = mode === "node" && selectedNode ? selectedNode : fullSchema;

  React.useEffect(() => {
    setJsonText(JSON.stringify(source, null, 2));
    setError("");
  }, [source, mode]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (mode === "node" && selectedNode) {
        parsed.id = selectedNode.id;
        onUpdateComponent(selectedNode.id, parsed);
      } else {
        onApplyFullSchema(parsed);
      }
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "12px", gap: "8px", boxSizing: "border-box" }}>
      {/* Mode switch */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <div style={{ display: "flex", backgroundColor: "#f1f5f9", borderRadius: "6px", padding: "2px" }}>
          {["node", "full"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: "4px 10px", border: "none", borderRadius: "4px",
                backgroundColor: mode === m ? "#ffffff" : "transparent",
                color: mode === m ? "#0f172a" : "#94a3b8",
                fontSize: "11px", fontWeight: "600", cursor: "pointer",
                boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >{m === "node" ? "Selected Node" : "Full Schema"}</button>
          ))}
        </div>
        <button onClick={handleCopy} style={{ marginLeft: "auto", padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: "4px", background: "#fff", fontSize: "11px", cursor: "pointer", color: "#64748b" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {!selectedNode && mode === "node" && (
        <div style={{ fontSize: "12px", color: "#94a3b8", padding: "12px 0" }}>Select a component to view its JSON</div>
      )}

      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "4px", padding: "6px 10px", fontSize: "11px", color: "#dc2626" }}>{error}</div>
      )}

      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        style={{
          flex: 1, resize: "none", border: "1px solid #e2e8f0", borderRadius: "6px",
          padding: "10px", fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontSize: "11px", lineHeight: "1.6", color: "#1e293b",
          backgroundColor: "#f8fafc", outline: "none", boxSizing: "border-box",
          minHeight: "200px",
        }}
        spellCheck={false}
      />

      <button
        onClick={handleApply}
        style={{
          padding: "8px 12px", borderRadius: "6px", border: "none",
          backgroundColor: "#4f46e5", color: "#ffffff", fontSize: "12px",
          fontWeight: "600", cursor: "pointer",
        }}
      >
        ✓ Apply Changes
      </button>

      <div style={{ fontSize: "10px", color: "#94a3b8" }}>
        ⚠️ The <code>id</code> field is protected and cannot be changed.
      </div>
    </div>
  );
};

export default CmsLayout;
