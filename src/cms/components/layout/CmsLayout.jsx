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

      {/* Main Studio Body */}
      <div className="cms-body">
        {/* Left Sidebar: Library & Layers */}
        <aside className="cms-sidebar-left">
          <div className="cms-tabs-strip">
            <button
              className={`cms-tab-btn ${leftTab === "library" ? "active" : ""}`}
              onClick={() => setLeftTab("library")}
            >
              🧩 Components
            </button>
            <button
              className={`cms-tab-btn ${leftTab === "layers" ? "active" : ""}`}
              onClick={() => setLeftTab("layers")}
            >
              📑 Layers Tree
            </button>
          </div>

          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {leftTab === "library" ? (
              <ComponentLibrary
                onAddComponent={(type) => addComponent(type)}
                selectedNode={selectedNode}
              />
            ) : (
              <LayersPanel
                schema={schema}
                selectedId={selectedComponentId}
                onSelectComponent={selectComponent}
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
