import React, { useState, useEffect } from "react";
import { useCmsState } from "../../hooks/useCmsState";
import { CmsHeader } from "./CmsHeader";
import { ComponentLibrary } from "../library/ComponentLibrary";
import { LayersPanel } from "../layers/LayersPanel";
import { VisualCanvas } from "../canvas/VisualCanvas";
import { Inspector } from "../inspector/Inspector";
import { PageManagerModal } from "../dialogs/PageManagerModal";
import { InterfaceManagerModal } from "../dialogs/InterfaceManagerModal";
import { JsonEditorModal } from "../dialogs/JsonEditorModal";
import { ComponentRegistry } from "../../../registry/componentRegistry";

export const CmsLayout = () => {
  const {
    schema,
    selectedComponentId,
    selectedNode,
    activeDevice,
    activePage,
    activeInterfaceId,
    isDirty,
    saveStatus,
    canUndo,
    canRedo,
    setActiveDevice,
    selectComponent,
    clearSelection,
    updateComponent,
    addComponent,
    deleteComponent,
    duplicateComponent,
    moveComponent,
    applyJsonSchema,
    switchPage,
    saveCurrentPage,
    loadInterface,
    undo,
    redo,
  } = useCmsState();

  const [leftTab, setLeftTab] = useState("library"); // 'library' | 'layers'
  const [mobileTab, setMobileTab] = useState("canvas"); // 'canvas' | 'library' | 'layers' | 'inspector'
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isInterfacesOpen, setIsInterfacesOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (cmdOrCtrl && e.key === "y") {
        e.preventDefault();
        redo();
      } else if (cmdOrCtrl && e.key === "s") {
        e.preventDefault();
        saveCurrentPage();
      } else if (e.key === "Escape") {
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, saveCurrentPage, clearSelection]);

  // Handle adding a component: on mobile, auto-switch to canvas to show result
  const handleAddComponent = (type) => {
    addComponent(type);
    if (window.innerWidth <= 1024) {
      setMobileTab("canvas");
    }
  };

  const selectedDef = selectedNode ? ComponentRegistry[selectedNode.type] : null;

  return (
    <div className="cms-root">
      {/* Top Header */}
      <CmsHeader
        activePage={activePage}
        activeInterfaceId={activeInterfaceId}
        activeDevice={activeDevice}
        isDirty={isDirty}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onDeviceChange={setActiveDevice}
        onSave={saveCurrentPage}
        onOpenPages={() => setIsPagesOpen(true)}
        onOpenInterfaces={() => setIsInterfacesOpen(true)}
        onOpenJson={() => setIsJsonOpen(true)}
      />

      {/* Main Studio Body with Responsive Mobile Classes */}
      <div className={`cms-body mobile-view-${mobileTab}`}>
        {/* Left Sidebar: Library & Layers */}
        <aside className="cms-sidebar-left">
          <div className="cms-tabs-strip">
            <button
              className={`cms-tab-btn ${leftTab === "library" ? "active" : ""}`}
              onClick={() => {
                setLeftTab("library");
                setMobileTab("library");
              }}
            >
              🧩 Components
            </button>
            <button
              className={`cms-tab-btn ${leftTab === "layers" ? "active" : ""}`}
              onClick={() => {
                setLeftTab("layers");
                setMobileTab("layers");
              }}
            >
              📑 Layers Tree
            </button>
          </div>

          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {leftTab === "library" ? (
              <ComponentLibrary
                onAddComponent={handleAddComponent}
                selectedNode={selectedNode}
              />
            ) : (
              <LayersPanel
                schema={schema}
                selectedId={selectedComponentId}
                onSelectComponent={(id) => {
                  selectComponent(id);
                  if (window.innerWidth <= 1024) {
                    // On mobile, keep layer selected or allow viewing
                  }
                }}
                onDeleteComponent={deleteComponent}
                onMoveComponent={moveComponent}
              />
            )}
          </div>
        </aside>

        {/* Center: Visual Canvas */}
        <main className="cms-canvas-container">
          <VisualCanvas
            schema={schema}
            activeDevice={activeDevice}
            selectedId={selectedComponentId}
            selectedNode={selectedNode}
            onSelectComponent={selectComponent}
            onDuplicateComponent={duplicateComponent}
            onDeleteComponent={deleteComponent}
            onMoveComponent={moveComponent}
            onOpenInspector={() => setMobileTab("inspector")}
            onNavigate={(route) => {
              console.log(`[CMS Navigation] Navigating to route: ${route}`);
            }}
          />
        </main>

        {/* Right Sidebar: Dynamic Inspector */}
        <aside className="cms-sidebar-right">
          <Inspector
            selectedNode={selectedNode}
            activeDevice={activeDevice}
            onUpdateComponent={updateComponent}
            onDeleteComponent={deleteComponent}
            onDuplicateComponent={duplicateComponent}
          />
        </aside>
      </div>

      {/* Responsive Mobile Bottom Navigation Bar (< 1024px) */}
      <nav className="cms-mobile-nav" aria-label="Mobile Navigation">
        <div className="cms-mobile-nav-items">
          <button
            className={`cms-mobile-nav-btn ${mobileTab === "canvas" ? "active" : ""}`}
            onClick={() => setMobileTab("canvas")}
          >
            <span className="cms-mobile-nav-icon">🎨</span>
            <span>Canvas</span>
          </button>

          <button
            className={`cms-mobile-nav-btn ${mobileTab === "library" ? "active" : ""}`}
            onClick={() => {
              setLeftTab("library");
              setMobileTab("library");
            }}
          >
            <span className="cms-mobile-nav-icon">🧩</span>
            <span>Library</span>
          </button>

          <button
            className={`cms-mobile-nav-btn ${mobileTab === "layers" ? "active" : ""}`}
            onClick={() => {
              setLeftTab("layers");
              setMobileTab("layers");
            }}
          >
            <span className="cms-mobile-nav-icon">📑</span>
            <span>Layers</span>
          </button>

          <button
            className={`cms-mobile-nav-btn ${mobileTab === "inspector" ? "active" : ""}`}
            onClick={() => setMobileTab("inspector")}
          >
            <span className="cms-mobile-nav-icon">⚙️</span>
            <span>Inspector</span>
            {selectedNode && (
              <span className="cms-nav-badge" title={selectedNode.type}>
                ●
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Modals & Dialogs */}
      <PageManagerModal
        isOpen={isPagesOpen}
        onClose={() => setIsPagesOpen(false)}
        activePageId={activePage?.id}
        onSwitchPage={switchPage}
      />

      <InterfaceManagerModal
        isOpen={isInterfacesOpen}
        onClose={() => setIsInterfacesOpen(false)}
        activeInterfaceId={activeInterfaceId}
        onApplyInterface={loadInterface}
      />

      <JsonEditorModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        schema={schema}
        onApplyJson={applyJsonSchema}
      />
    </div>
  );
};
