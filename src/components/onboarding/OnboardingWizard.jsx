import React, { useState } from "react";
import { ComponentRegistry, ComponentCategories } from "../../registry/componentRegistry";
import { ThemeRepository } from "../../cms/services/themeRepository";
import { CustomThemeModal } from "./CustomThemeModal";

export const OnboardingWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Welcome, 2: Components, 3: Themes, 4: Review

  // Step 2 State: Selected Components
  const allComponentKeys = Object.keys(ComponentRegistry).filter(
    (key) => key !== "Home" && key !== "Page"
  );
  const [selectedComponents, setSelectedComponents] = useState([
    "Header",
    "SearchBar",
    "StoryRow",
    "CategoryGrid",
    "HeroBanner",
    "Carousel",
    "ProductList",
    "ProductCard",
    "PriceBlock",
    "Button",
    "CouponCode",
    "CountDownTimer",
    "Footer",
    "NavBar",
  ]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Step 3 State: Chosen Themes
  const [chosenThemes, setChosenThemes] = useState({
    ProductCard: "product-card-classic",
    Header: "header-classic",
    Button: "button-primary",
    CategoryGrid: "category-grid-circular",
    HeroBanner: "hero-banner-cinematic",
  });

  // Modal State for custom theme
  const [customThemeTarget, setCustomThemeTarget] = useState(null);

  const toggleComponent = (compType) => {
    setSelectedComponents((prev) =>
      prev.includes(compType)
        ? prev.filter((t) => t !== compType)
        : [...prev, compType]
    );
  };

  const handleSelectTheme = (compType, themeId) => {
    setChosenThemes((prev) => ({
      ...prev,
      [compType]: themeId,
    }));
  };

  const handleFinish = () => {
    const foundation = {
      id: "foundation-default",
      components: selectedComponents.map((type) => ({
        type,
        themeId: chosenThemes[type] || null,
      })),
      chosenThemes,
    };
    onComplete(foundation);
  };

  const categories = ["All", ...Object.values(ComponentCategories).filter((c) => c !== "All")];
  const displayedComponents = allComponentKeys.filter((type) => {
    if (activeCategory === "All") return true;
    return ComponentRegistry[type]?.category === activeCategory;
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Top Wizard Navigation */}
      <header
        style={{
          height: "64px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px" }}>🎓</span>
          <strong style={{ fontSize: "16px", color: "#0f172a", fontWeight: "700" }}>
            CampusCommerce Foundation Setup
          </strong>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {[
            { num: 1, label: "Welcome" },
            { num: 2, label: "Components" },
            { num: 3, label: "Themes" },
            { num: 4, label: "Review" },
          ].map((s) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: currentStep === s.num ? "#4f46e5" : currentStep > s.num ? "#10b981" : "#e2e8f0",
                  color: currentStep >= s.num ? "#ffffff" : "#64748b",
                  fontSize: "11px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {currentStep > s.num ? "✓" : s.num}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: currentStep === s.num ? "600" : "400",
                  color: currentStep === s.num ? "#0f172a" : "#64748b",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Wizard Content Body */}
      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "32px 24px",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        <div style={{ width: "100%", maxWidth: "900px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* STEP 1: Welcome */}
          {currentStep === 1 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                textAlign: "center",
                alignItems: "center",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(79, 70, 229, 0.08)",
                  fontSize: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🚀
              </div>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                Configure Your SDUI Foundation
              </h2>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748b", maxWidth: "560px", lineHeight: 1.6 }}>
                Before entering the visual component studio, customize your initial component catalog and visual design themes. You can freely extend or adjust them at any time inside your Journeys.
              </p>
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  marginTop: "16px",
                  padding: "11px 24px",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Step 2: Choose Components →
              </button>
            </div>
          )}

          {/* STEP 2: Components Catalog Selection */}
          {currentStep === 2 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                  Select Initial Components ({selectedComponents.length} selected)
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                  Choose which UI elements will be available in your toolbox
                </p>
              </div>

              {/* Category Pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: "1px solid",
                      borderColor: activeCategory === cat ? "#4f46e5" : "#e2e8f0",
                      backgroundColor: activeCategory === cat ? "#4f46e5" : "#ffffff",
                      color: activeCategory === cat ? "#ffffff" : "#475569",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Components Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "12px",
                  maxHeight: "420px",
                  overflowY: "auto",
                  padding: "4px",
                }}
              >
                {displayedComponents.map((compType) => {
                  const def = ComponentRegistry[compType];
                  const isSelected = selectedComponents.includes(compType);

                  return (
                    <div
                      key={compType}
                      onClick={() => toggleComponent(compType)}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: `1.5px solid ${isSelected ? "#4f46e5" : "#e2e8f0"}`,
                        backgroundColor: isSelected ? "rgba(79, 70, 229, 0.04)" : "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "20px" }}>{def?.icon || "📦"}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                        {def?.label || compType}
                      </span>
                      <span style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.3 }}>
                        {def?.description ? def.description.slice(0, 50) + "..." : ""}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <button
                  onClick={() => setCurrentStep(1)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Step 3: Choose Themes →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Themes Selection & Custom Theme Studio */}
          {currentStep === 3 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                  Component Theme Selection
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                  Select curated visual styles or create your own custom theme
                </p>
              </div>

              {["ProductCard", "Header", "Button", "CategoryGrid"].map((compType) => {
                const themes = ThemeRepository.getByComponentType(compType);
                const currentThemeId = chosenThemes[compType];

                return (
                  <div
                    key={compType}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: "14px", color: "#0f172a" }}>
                        {ComponentRegistry[compType]?.icon || "🎨"} {ComponentRegistry[compType]?.label || compType}
                      </strong>
                      <button
                        onClick={() => setCustomThemeTarget(compType)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "1px solid #4f46e5",
                          backgroundColor: "rgba(79, 70, 229, 0.05)",
                          color: "#4f46e5",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      >
                        + Create Theme
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                      {themes.map((t) => {
                        const isChosen = currentThemeId === t.id;
                        return (
                          <div
                            key={t.id}
                            onClick={() => handleSelectTheme(compType, t.id)}
                            style={{
                              padding: "10px",
                              borderRadius: "8px",
                              border: `1.5px solid ${isChosen ? "#4f46e5" : "#e2e8f0"}`,
                              backgroundColor: isChosen ? "rgba(79, 70, 229, 0.04)" : "#ffffff",
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>
                                {t.name}
                              </span>
                              {isChosen && <span style={{ color: "#4f46e5", fontSize: "12px" }}>✓</span>}
                            </div>
                            <span style={{ fontSize: "11px", color: "#64748b" }}>
                              {t.description || "Component styling"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <button
                  onClick={() => setCurrentStep(2)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#4f46e5",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Step 4: Review Foundation →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review Foundation */}
          {currentStep === 4 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                  Review Foundation Object
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                  Your foundation determines what components and visual styles are available in new Journeys
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#0f172a" }}>
                    Components Catalog ({selectedComponents.length})
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {selectedComponents.map((c) => (
                      <span
                        key={c}
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          backgroundColor: "#ffffff",
                          border: "1px solid #cbd5e1",
                          color: "#334155",
                        }}
                      >
                        {ComponentRegistry[c]?.icon} {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "16px", borderRadius: "10px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#0f172a" }}>
                    Assigned Theme Presets
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {Object.keys(chosenThemes).map((k) => (
                      <div key={k} style={{ fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#64748b" }}>{k}:</span>
                        <strong style={{ color: "#0f172a" }}>{chosenThemes[k]}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <button
                  onClick={() => setCurrentStep(3)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleFinish}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#10b981",
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Confirm & Enter Workspace ✨
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Custom Theme Creator Modal */}
      {customThemeTarget && (
        <CustomThemeModal
          isOpen={!!customThemeTarget}
          componentType={customThemeTarget}
          onClose={() => setCustomThemeTarget(null)}
          onThemeCreated={(newTheme) => {
            handleSelectTheme(customThemeTarget, newTheme.id);
          }}
        />
      )}
    </div>
  );
};

export default OnboardingWizard;
