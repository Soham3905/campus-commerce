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
import { colors } from "../../theme";

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
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 1024);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isInterfacesOpen, setIsInterfacesOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  // Responsive window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleAddComponent = (type) => {
    addComponent(type);
    if (isMobile) {
      setMobileTab("canvas");
    }
  };

  // Helper for responsive panel display
  const showLeftPanel = !isMobile || mobileTab === "library" || mobileTab === "layers";
  const showCanvas = !isMobile || mobileTab === "canvas";
  const showRightPanel = !isMobile || mobileTab === "inspector";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: colors.bgCanvas,
        color: colors.textPrimary,
        fontFamily: colors.fontSans,
      }}
    >
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
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          position: "relative",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Left Sidebar: Library & Layers */}
        {showLeftPanel && (
          <aside
            style={{
              width: isMobile ? "100%" : "320px",
              height: "100%",
              backgroundColor: colors.bgPanel,
              borderRight: isMobile ? "none" : `1px solid ${colors.borderSubtle}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* Tabs Strip */}
            <div
              style={{
                display: "flex",
                backgroundColor: colors.bgPanel,
                borderBottom: `1px solid ${colors.borderSubtle}`,
                padding: "0 4px",
                overflowX: "auto",
                flexShrink: 0,
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  background: "transparent",
                  border: "none",
                  borderBottom: leftTab === "library" ? `2px solid ${colors.accentPrimary}` : "2px solid transparent",
                  color: leftTab === "library" ? colors.accentPrimary : colors.textMuted,
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  outline: "none",
                }}
                onClick={() => {
                  setLeftTab("library");
                  setMobileTab("library");
                }}
              >
                🧩 Components
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "10px 8px",
                  background: "transparent",
                  border: "none",
                  borderBottom: leftTab === "layers" ? `2px solid ${colors.accentPrimary}` : "2px solid transparent",
                  color: leftTab === "layers" ? colors.accentPrimary : colors.textMuted,
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  outline: "none",
                }}
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
                  onSelectComponent={selectComponent}
                  onDeleteComponent={deleteComponent}
                  onMoveComponent={moveComponent}
                />
              )}
            </div>
          </aside>
        )}

        {/* Center: Visual Canvas */}
        {showCanvas && (
          <main
            style={{
              flex: 1,
              width: isMobile ? "100%" : "auto",
              height: "100%",
              backgroundColor: colors.bgCanvas,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              minWidth: 0,
            }}
          >
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
        )}

        {/* Right Sidebar: Dynamic Inspector */}
        {showRightPanel && (
          <aside
            style={{
              width: isMobile ? "100%" : "350px",
              height: "100%",
              backgroundColor: colors.bgPanel,
              borderLeft: isMobile ? "none" : `1px solid ${colors.borderSubtle}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Inspector
              selectedNode={selectedNode}
              activeDevice={activeDevice}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              onDuplicateComponent={duplicateComponent}
            />
          </aside>
        )}
      </div>

      {/* Responsive Mobile Bottom Navigation Bar (Shown on <= 1024px) */}
      {isMobile && (
        <nav
          style={{
            height: "56px",
            backgroundColor: colors.bgPanel,
            borderTop: `1px solid ${colors.borderSubtle}`,
            zIndex: 100,
            flexShrink: 0,
            display: "flex",
            alignItems: "stretch",
          }}
          aria-label="Mobile Navigation"
        >
          <button
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              background: mobileTab === "canvas" ? colors.accentPrimaryLight : "transparent",
              border: "none",
              color: mobileTab === "canvas" ? colors.accentPrimary : colors.textMuted,
              fontSize: "10px",
              fontWeight: "600",
              cursor: "pointer",
              position: "relative",
              padding: "4px 0",
              outline: "none",
            }}
            onClick={() => setMobileTab("canvas")}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>🎨</span>
            <span>Canvas</span>
          </button>

          <button
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              background: mobileTab === "library" ? colors.accentPrimaryLight : "transparent",
              border: "none",
              color: mobileTab === "library" ? colors.accentPrimary : colors.textMuted,
              fontSize: "10px",
              fontWeight: "600",
              cursor: "pointer",
              position: "relative",
              padding: "4px 0",
              outline: "none",
            }}
            onClick={() => {
              setLeftTab("library");
              setMobileTab("library");
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>🧩</span>
            <span>Library</span>
          </button>

          <button
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              background: mobileTab === "layers" ? colors.accentPrimaryLight : "transparent",
              border: "none",
              color: mobileTab === "layers" ? colors.accentPrimary : colors.textMuted,
              fontSize: "10px",
              fontWeight: "600",
              cursor: "pointer",
              position: "relative",
              padding: "4px 0",
              outline: "none",
            }}
            onClick={() => {
              setLeftTab("layers");
              setMobileTab("layers");
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>📑</span>
            <span>Layers</span>
          </button>

          <button
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              background: mobileTab === "inspector" ? colors.accentPrimaryLight : "transparent",
              border: "none",
              color: mobileTab === "inspector" ? colors.accentPrimary : colors.textMuted,
              fontSize: "10px",
              fontWeight: "600",
              cursor: "pointer",
              position: "relative",
              padding: "4px 0",
              outline: "none",
            }}
            onClick={() => setMobileTab("inspector")}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>⚙️</span>
            <span>Inspector</span>
            {selectedNode && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "20%",
                  background: colors.accentPrimary,
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: "700",
                  padding: "1px 4px",
                  borderRadius: "10px",
                  minWidth: "14px",
                  textAlign: "center",
                }}
              >
                ●
              </span>
            )}
          </button>
        </nav>
      )}

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
