import React, { useState } from "react";
import { ComponentRegistry, ComponentCategories } from "../../../registry/componentRegistry";
import { colors } from "../../theme";
import { useDragDrop } from "../../dragdrop/DragDropContext";
import { suppressNativeDragImage } from "../../dragdrop/dragImage";
import { canAddChild } from "../../utils/validation";

export const ComponentLibrary = ({ onAddComponent, selectedNode, editingContext = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { startDrag, endDrag, isDragging } = useDragDrop();

  // Active target context (e.g. 'ProductCard' or 'Header' if selected or in studio)
  const targetParentNode = !editingContext && selectedNode && ComponentRegistry[selectedNode.type]?.canHaveChildren !== false ? selectedNode : null;
  const targetParentType = editingContext || targetParentNode?.type || null;

  const allTypes = Object.keys(ComponentRegistry).filter(
    (type) => type !== "Home" && type !== "Page"
  );

  // Filter components by search query, category, and context validity
  const filteredComponents = allTypes
    .map((type) => ComponentRegistry[type])
    .filter(Boolean)
    .filter((def) => {
      const matchesSearch =
        !searchQuery ||
        def.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        def.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        def.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || def.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  // Sort components: compatible items first if targeting a container
  const sortedComponents = [...filteredComponents].sort((a, b) => {
    if (targetParentType) {
      const aValid = canAddChild(targetParentNode || targetParentType, a.type).valid;
      const bValid = canAddChild(targetParentNode || targetParentType, b.type).valid;
      if (aValid && !bValid) return -1;
      if (!aValid && bValid) return 1;
    }
    return 0;
  });

  const categories = ["All", ...Object.values(ComponentCategories).filter((c) => c !== "All")];

  const handleDragStart = (e, def) => {
    e.dataTransfer.effectAllowed = "all";
    e.dataTransfer.setData("application/sdui-type", def.type);
    e.dataTransfer.setData("text/plain", def.type);
    suppressNativeDragImage(e.dataTransfer);
    startDrag({
      type: def.type,
      isNew: true,
      label: def.label,
    });
  };

  const handleDragEnd = () => {
    endDrag(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: colors.bgPanel,
      }}
    >
      {/* Header with Dynamic Context Title */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${colors.borderSubtle}`,
          backgroundColor: colors.bgPanelHeader,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "16px" }}>🧩</span>
            <h3 style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: colors.textPrimary }}>
              Component Library
            </h3>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: "600",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "rgba(79, 70, 229, 0.1)",
              color: colors.accentPrimary,
            }}
          >
            Drag & Drop
          </span>
        </div>

        {/* Target Context Pill */}
        {targetParentType && (
          <div
            style={{
              fontSize: "11px",
              color: "#4f46e5",
              backgroundColor: "rgba(79, 70, 229, 0.06)",
              border: "1px solid rgba(79, 70, 229, 0.15)",
              borderRadius: "6px",
              padding: "4px 8px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>🎯</span>
            <span>Targeting <strong>{targetParentType}</strong></span>
          </div>
        )}

        {/* Search Input */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search components (or drag onto canvas)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 10px 7px 28px",
              backgroundColor: colors.bgCanvas,
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: "6px",
              color: colors.textPrimary,
              fontSize: "12px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <span style={{ position: "absolute", left: "9px", top: "7px", fontSize: "12px", color: colors.textMuted }}>
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "6px",
                top: "6px",
                background: "transparent",
                border: "none",
                color: colors.textMuted,
                cursor: "pointer",
                fontSize: "11px",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          padding: "8px 12px",
          borderBottom: `1px solid ${colors.borderSubtle}`,
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0,
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "3px 8px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: selectedCategory === cat ? colors.accentPrimary : colors.borderSubtle,
              backgroundColor: selectedCategory === cat ? colors.accentPrimary : "transparent",
              color: selectedCategory === cat ? "#ffffff" : colors.textSecondary,
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Components List / Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {sortedComponents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 12px", color: colors.textMuted, fontSize: "12px" }}>
            No matching items found.
          </div>
        ) : (
          sortedComponents.map((def) => {
            const isCompatible = !targetParentType || canAddChild(targetParentNode || targetParentType, def.type).valid;

            return (
              <div
                key={def.type}
                draggable
                onDragStart={(e) => handleDragStart(e, def)}
                onDragEnd={handleDragEnd}
                onClick={() => onAddComponent(def.type)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  backgroundColor: colors.bgCard,
                  border: `1px solid ${isCompatible ? colors.borderSubtle : "#fecaca"}`,
                  borderRadius: "8px",
                  cursor: "grab",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                  opacity: isCompatible ? 1 : 0.65,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isCompatible ? colors.accentPrimary : "#ef4444";
                  e.currentTarget.style.backgroundColor = isCompatible ? colors.bgCardHover : "#fff5f5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isCompatible ? colors.borderSubtle : "#fecaca";
                  e.currentTarget.style.backgroundColor = colors.bgCard;
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    backgroundColor: colors.bgCanvas,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: 0,
                    border: `1px solid ${colors.borderSubtle}`,
                  }}
                >
                  {def.icon || "📦"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: colors.textPrimary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {def.label}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: isCompatible ? colors.accentPrimary : "#ef4444",
                        fontWeight: "700",
                      }}
                    >
                      {isCompatible ? "+ Add" : "Context"}
                    </span>
                  </div>
                  {def.description && (
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: "11px",
                        color: colors.textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {def.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Helper */}
      <div
        style={{
          padding: "8px 12px",
          borderTop: `1px solid ${colors.borderSubtle}`,
          backgroundColor: colors.bgCanvas,
          fontSize: "11px",
          color: colors.textMuted,
          textAlign: "center",
        }}
      >
        Drag item onto canvas or click to insert
      </div>
    </div>
  );
};

export default ComponentLibrary;
