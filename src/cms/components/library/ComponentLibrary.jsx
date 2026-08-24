import React, { useState, useMemo } from "react";
import { ComponentRegistry, ComponentCategories } from "../../../registry/componentRegistry";

export const ComponentLibrary = ({ onAddComponent, selectedNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ComponentCategories.ALL);

  const categories = Object.values(ComponentCategories);

  const filteredComponents = useMemo(() => {
    return Object.values(ComponentRegistry).filter((comp) => {
      // Don't show Home or Page as addable child components inside normal layout
      if (comp.type === "Home" || comp.type === "Page") return false;

      const matchesCategory =
        activeCategory === ComponentCategories.ALL || comp.category === activeCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Panel Header */}
      <div className="cms-panel-header">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>🧩</span>
          <span>Component Library</span>
        </div>
        <span style={{ fontSize: "11px", color: "var(--cms-text-muted)" }}>
          {filteredComponents.length} items
        </span>
      </div>

      {/* Search Input */}
      <div style={{ padding: "10px 12px 6px" }}>
        <input
          type="text"
          className="cms-input"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ fontSize: "12px" }}
        />
      </div>

      {/* Category Pills */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          padding: "4px 12px 10px",
          overflowX: "auto",
          scrollbarWidth: "none",
          borderBottom: "1px solid var(--cms-border-subtle)",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "3px 8px",
              background: activeCategory === cat ? "var(--cms-accent-primary)" : "var(--cms-bg-card)",
              color: activeCategory === cat ? "#fff" : "var(--cms-text-secondary)",
              border: "1px solid",
              borderColor: activeCategory === cat ? "var(--cms-accent-primary)" : "var(--cms-border-medium)",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Components List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {filteredComponents.map((comp) => {
          return (
            <div
              key={comp.type}
              style={{
                background: "var(--cms-bg-card)",
                border: "1px solid var(--cms-border-subtle)",
                borderRadius: "var(--cms-radius-sm)",
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--cms-border-medium)";
                e.currentTarget.style.background = "var(--cms-bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--cms-border-subtle)";
                e.currentTarget.style.background = "var(--cms-bg-card)";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "20px",
                    width: "32px",
                    height: "32px",
                    background: "var(--cms-bg-panel)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {comp.icon}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--cms-text-primary)" }}>
                    {comp.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--cms-text-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "2px",
                    }}
                  >
                    {comp.description}
                  </div>
                </div>
              </div>

              <button
                className="cms-btn cms-btn-secondary"
                onClick={() => onAddComponent(comp.type)}
                style={{ padding: "4px 8px", fontSize: "11px" }}
                title={`Add ${comp.label}`}
              >
                + Add
              </button>
            </div>
          );
        })}

        {filteredComponents.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "30px 10px",
              color: "var(--cms-text-muted)",
              fontSize: "12px",
            }}
          >
            No matching components found.
          </div>
        )}
      </div>
    </div>
  );
};
