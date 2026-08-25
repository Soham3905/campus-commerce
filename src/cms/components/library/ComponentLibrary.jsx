import React, { useState } from "react";
import { ComponentRegistry, ComponentCategories } from "../../../registry/componentRegistry";
import { colors } from "../../theme";
import { useDragDrop } from "../../dragdrop/DragDropContext";

export const ComponentLibrary = ({ onAddComponent, selectedNode, editingContext = null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { startDrag, endDrag, isDragging } = useDragDrop();

  // Determine active component definition context
  const contextType = editingContext || (selectedNode ? selectedNode.type : null);
  const contextDef = contextType ? ComponentRegistry[contextType] : null;

  // Decide if we are in Component Field Library mode or Global Page Component Library mode
  const isFieldMode = !!(contextDef && Array.isArray(contextDef.allowedChildren) && contextDef.allowedChildren.length > 0);

  let allowedTypes = [];
  if (isFieldMode) {
    allowedTypes = contextDef.allowedChildren;
  } else {
    allowedTypes = Object.keys(ComponentRegistry).filter(
      (type) => type !== "Home" && type !== "Page"
    );
  }

  // Filter components by search query and category
  const filteredComponents = allowedTypes
    .map((type) => ComponentRegistry[type])
    .filter(Boolean)
    .filter((def) => {
      const matchesSearch =
        def.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        def.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        def.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        isFieldMode || selectedCategory === "All" || def.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

  const categories = ["All", ...Object.values(ComponentCategories).filter((c) => c !== "All")];

  const handleDragStart = (e, def) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/sdui-type", def.type);
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
            <span style={{ fontSize: "16px" }}>{isFieldMode ? "🏷️" : "🧩"}</span>
            <h3 style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: colors.textPrimary }}>
              {isFieldMode ? `${contextDef.label} Fields` : "Component Library"}
            </h3>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: "600",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: isFieldMode ? "rgba(79, 70, 229, 0.1)" : "rgba(16, 185, 129, 0.1)",
              color: isFieldMode ? colors.accentPrimary : colors.success,
            }}
          >
            {isFieldMode ? "Context-Aware" : "Page Level"}
          </span>
        </div>

        {/* Search Input */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder={isFieldMode ? `Search ${contextDef.label} fields...` : "Search components..."}
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

      {/* Category Filter Pills (when in global Page mode) */}
      {!isFieldMode && (
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
      )}

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
        {filteredComponents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 12px", color: colors.textMuted, fontSize: "12px" }}>
            No matching items found.
          </div>
        ) : (
          filteredComponents.map((def) => (
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
                border: `1px solid ${colors.borderSubtle}`,
                borderRadius: "8px",
                cursor: "grab",
                transition: "all 0.15s ease",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.accentPrimary;
                e.currentTarget.style.backgroundColor = colors.bgCardHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.borderSubtle;
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
                  <span style={{ fontSize: "12px", fontWeight: "600", color: colors.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {def.label}
                  </span>
                  <span style={{ fontSize: "10px", color: colors.accentPrimary, fontWeight: "700" }}>
                    + Add
                  </span>
                </div>
                {def.description && (
                  <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {def.description}
                  </p>
                )}
              </div>
            </div>
          ))
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
