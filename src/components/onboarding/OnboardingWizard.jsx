import React, { useState, useMemo } from "react";
import {
  Layers,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Palette,
  Package,
  Boxes,
  Compass,
  Plus,
  RefreshCw,
  LayoutGrid,
  FileCode,
  ShieldCheck,
  Zap,
  Filter,
} from "lucide-react";
import { ComponentRegistry, ComponentCategories } from "../../registry/componentRegistry";
import { ThemeRepository } from "../../cms/services/themeRepository";
import { FoundationRepository } from "../../cms/services/foundationRepository";
import { CustomThemeModal } from "./CustomThemeModal";
import { SDUIRenderer } from "../../sdui/SDUIRenderer";
import { createComponent } from "../../cms/utils/componentFactory";

/**
 * Mini Renderer for Theme Preview in Wizard & Dashboard
 */
const ThemeLivePreview = ({ compType, themeId }) => {
  const previewSchema = useMemo(() => {
    try {
      return createComponent(compType, { themeId });
    } catch (e) {
      return null;
    }
  }, [compType, themeId]);

  if (!previewSchema) {
    const reg = ComponentRegistry[compType];
    return (
      <div className="preview-fallback-box">
        <span className="fallback-icon">{reg?.icon || "📦"}</span>
        <span className="fallback-text">{reg?.label || compType}</span>
      </div>
    );
  }

  const isWide = compType === "Header" || compType === "NavBar" || compType === "HeroBanner" || compType === "Carousel" || compType === "StoryRow" || compType === "SearchBar";

  return (
    <div className={`preview-container ${isWide ? "wide-preview" : ""}`}>
      <div
        className="preview-scaler"
        style={{
          width: compType === "ProductCard" ? "260px" : isWide ? "100%" : "auto",
          maxWidth: "100%",
          transform: compType === "ProductCard" ? "scale(0.86)" : "none",
          transformOrigin: "top center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <SDUIRenderer schema={previewSchema} deviceType="mobile" isEditable={false} />
      </div>
    </div>
  );
};

const DEFAULT_SELECTED_COMPONENTS = [
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
];

export const OnboardingWizard = ({ onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Welcome, 2: Components, 3: Themes, 4: Review

  // Step 2 State: Selected Components
  const allComponentKeys = Object.keys(ComponentRegistry).filter(
    (key) => key !== "Home" && key !== "Page"
  );
  const [selectedComponents, setSelectedComponents] = useState(DEFAULT_SELECTED_COMPONENTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Step 3 State: Themes Filter & Chosen Themes
  const [themeCategory, setThemeCategory] = useState("All");
  const [themeSearch, setThemeSearch] = useState("");
  const [chosenThemes, setChosenThemes] = useState(() => {
    const existing = FoundationRepository.get();
    return (
      existing?.chosenThemes || {
        ProductCard: "product-card-classic",
        Header: "header-classic",
        Button: "button-primary",
        CategoryGrid: "category-grid-circular",
        HeroBanner: "hero-banner-cinematic",
        SearchBar: "search-classic",
        NavBar: "navbar-classic",
        Carousel: "carousel-classic",
        CouponCode: "coupon-ticket",
        CountDownTimer: "timer-urgent",
      }
    );
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

  const handleSelectAll = () => {
    setSelectedComponents([...allComponentKeys]);
  };

  const handleDeselectAll = () => {
    setSelectedComponents([]);
  };

  const handleResetDefault = () => {
    setSelectedComponents(DEFAULT_SELECTED_COMPONENTS);
  };

  const handleSelectTheme = (compType, themeId) => {
    setChosenThemes((prev) => ({
      ...prev,
      [compType]: themeId,
    }));
  };

  const handleStepBack = () => {
    if (currentStep === 1) {
      if (onBack) onBack();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
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
    FoundationRepository.save(foundation);
    onComplete(foundation);
  };

  const categories = ["All", ...Object.values(ComponentCategories).filter((c) => c !== "All")];

  // Components for Step 2
  const displayedComponents = allComponentKeys.filter((type) => {
    const def = ComponentRegistry[type];
    const matchesCategory = activeCategory === "All" || def?.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      (def?.label || type).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (def?.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic Components with Themes for Step 3 (all selected components)
  const displayedThemedComponents = selectedComponents.filter((type) => {
    const def = ComponentRegistry[type];
    const matchesCategory = themeCategory === "All" || def?.category === themeCategory;
    const matchesSearch =
      !themeSearch.trim() ||
      (def?.label || type).toLowerCase().includes(themeSearch.toLowerCase()) ||
      (def?.description || "").toLowerCase().includes(themeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const STEPS = [
    { num: 1, label: "Welcome", icon: Sparkles },
    { num: 2, label: "Components", icon: Package },
    { num: 3, label: "Themes", icon: Palette },
    { num: 4, label: "Review", icon: CheckCircle2 },
  ];

  return (
    <div className="wizard-root">
      {/* Dynamic Background */}
      <div className="bg-decorations">
        <div className="glow-blob glow-blob-1" />
        <div className="glow-blob glow-blob-2" />
        <div className="grid-overlay" />
      </div>

      {/* Top Wizard Navigation Header */}
      <header className="wizard-header">
        <div className="header-left">
          <button
            type="button"
            onClick={handleStepBack}
            className="header-back-btn"
            title={currentStep === 1 ? "Back to Welcome Screen" : "Back to previous step"}
          >
            <ArrowLeft size={16} />
            <span>{currentStep === 1 ? "Welcome Screen" : "Back"}</span>
          </button>

          <div className="header-brand-divider" />

          <div className="header-brand">
            <div className="brand-icon-box">
              <Layers size={18} color="#4f46e5" />
            </div>
            <div>
              <div className="brand-title">CampusCommerce Foundation</div>
              <div className="brand-subtitle">SDUI Environment Setup</div>
            </div>
          </div>
        </div>

        {/* Interactive Step Indicator */}
        <div className="step-indicator-track">
          {STEPS.map((s) => {
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            const isClickable = s.num < currentStep;

            return (
              <button
                key={s.num}
                type="button"
                disabled={!isClickable && !isCurrent}
                onClick={() => isClickable && setCurrentStep(s.num)}
                className={`step-bubble-btn ${isCurrent ? "current" : ""} ${isCompleted ? "completed" : ""} ${isClickable ? "clickable" : ""}`}
              >
                <div className="step-bubble-circle">
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : s.num}
                </div>
                <span className="step-bubble-label">{s.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Wizard Main Content Area */}
      <main className="wizard-main">
        <div className="wizard-card-wrapper">
          {/* STEP 1: Foundation Welcome */}
          {currentStep === 1 && (
            <div className="step-card-panel step-welcome">
              <div className="welcome-hero-badge">
                <Sparkles size={28} color="#4f46e5" />
              </div>

              <div className="welcome-text-center">
                <span className="welcome-step-tag">Step 1 of 4 &bull; Initial Architecture</span>
                <h2 className="welcome-heading">Configure Your SDUI Foundation</h2>
                <p className="welcome-description">
                  Customize the initial component catalog and visual design theme blueprints for
                  your campus store. All settings can be adjusted or extended dynamically in your
                  Journeys.
                </p>
              </div>

              <div className="welcome-summary-grid">
                <div className="summary-pill-card">
                  <div className="pill-icon-wrap" style={{ backgroundColor: "rgba(79, 70, 229, 0.1)", color: "#4f46e5" }}>
                    <Package size={20} />
                  </div>
                  <div>
                    <div className="pill-card-title">{allComponentKeys.length} Modular Widgets</div>
                    <div className="pill-card-sub">Carousels, Product Cards, Timers, Story Rows</div>
                  </div>
                </div>

                <div className="summary-pill-card">
                  <div className="pill-icon-wrap" style={{ backgroundColor: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9" }}>
                    <Palette size={20} />
                  </div>
                  <div>
                    <div className="pill-card-title">Design Blueprints</div>
                    <div className="pill-card-sub">Pre-styled themes or custom token styling</div>
                  </div>
                </div>

                <div className="summary-pill-card">
                  <div className="pill-icon-wrap" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="pill-card-title">Instant CMS Ready</div>
                    <div className="pill-card-sub">Real-time schema sync & live canvas preview</div>
                  </div>
                </div>
              </div>

              <div className="step-action-bar center-actions">
                {onBack && (
                  <button type="button" onClick={onBack} className="btn-secondary">
                    <ArrowLeft size={16} />
                    <span>Back to Welcome</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary"
                >
                  <span>Step 2: Choose Components</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Component Catalog Selection */}
          {currentStep === 2 && (
            <div className="step-card-panel">
              <div className="step-panel-header">
                <div>
                  <div className="panel-title-row">
                    <h2 className="step-panel-title">Component Catalog Selection</h2>
                    <span className="counter-badge">
                      {selectedComponents.length} of {allComponentKeys.length} selected
                    </span>
                  </div>
                  <p className="step-panel-subtitle">
                    Select which UI building blocks will be available in your CMS toolbox.
                  </p>
                </div>

                {/* Quick actions */}
                <div className="quick-select-actions">
                  <button type="button" onClick={handleSelectAll} className="btn-ghost">
                    Select All ({allComponentKeys.length})
                  </button>
                  <span className="dot-sep">&bull;</span>
                  <button type="button" onClick={handleDeselectAll} className="btn-ghost">
                    Clear
                  </button>
                  <span className="dot-sep">&bull;</span>
                  <button type="button" onClick={handleResetDefault} className="btn-ghost">
                    <RefreshCw size={12} />
                    <span>Default (14)</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="filters-toolbar">
                <div className="search-input-wrap">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search widgets (e.g., Carousel, Header, Price)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="clear-search-btn"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="category-chips">
                  {categories.map((cat) => {
                    const count =
                      cat === "All"
                        ? allComponentKeys.length
                        : allComponentKeys.filter((k) => ComponentRegistry[k]?.category === cat)
                            .length;
                    const isCurrent = activeCategory === cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`category-chip ${isCurrent ? "active" : ""}`}
                      >
                        <span>{cat}</span>
                        <span className="chip-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Component Cards Grid */}
              <div className="components-grid">
                {displayedComponents.map((compType) => {
                  const def = ComponentRegistry[compType];
                  const isSelected = selectedComponents.includes(compType);

                  return (
                    <div
                      key={compType}
                      onClick={() => toggleComponent(compType)}
                      className={`component-card ${isSelected ? "selected" : ""}`}
                    >
                      <div className="comp-card-top">
                        <div className="comp-icon-circle">
                          {def?.icon || "📦"}
                        </div>
                        <div className={`comp-checkbox ${isSelected ? "checked" : ""}`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </div>

                      <div className="comp-card-body">
                        <div className="comp-card-name-row">
                          <span className="comp-name">{def?.label || compType}</span>
                          <span className="comp-cat-tag">{def?.category || "Widget"}</span>
                        </div>
                        <p className="comp-desc">
                          {def?.description || "Modular server-driven UI widget"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Navigation Actions */}
              <div className="step-action-bar">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-secondary"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Welcome</span>
                </button>

                <div className="action-right-group">
                  <span className="selection-count-hint">
                    {selectedComponents.length} components enabled
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="btn-primary"
                    disabled={selectedComponents.length === 0}
                  >
                    <span>Step 3: Choose Themes</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Component Theme Selection */}
          {currentStep === 3 && (
            <div className="step-card-panel">
              <div className="step-panel-header">
                <div>
                  <div className="panel-title-row">
                    <h2 className="step-panel-title">Component Theme Blueprints</h2>
                    <span className="counter-badge">
                      {displayedThemedComponents.length} of {selectedComponents.length} Components Displayed
                    </span>
                  </div>
                  <p className="step-panel-subtitle">
                    Select curated visual theme blueprints or create custom style tokens with real-time live
                    rendering for your selected components.
                  </p>
                </div>
              </div>

              {/* Step 3 Filter Toolbar */}
              <div className="filters-toolbar">
                <div className="search-input-wrap">
                  <Search size={15} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search themes by component name..."
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    className="search-input"
                  />
                  {themeSearch && (
                    <button
                      type="button"
                      onClick={() => setThemeSearch("")}
                      className="clear-search-btn"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="category-chips">
                  {categories.map((cat) => {
                    const count =
                      cat === "All"
                        ? selectedComponents.length
                        : selectedComponents.filter(
                            (k) => ComponentRegistry[k]?.category === cat
                          ).length;
                    if (count === 0 && cat !== "All") return null;
                    const isCurrent = themeCategory === cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setThemeCategory(cat)}
                        className={`category-chip ${isCurrent ? "active" : ""}`}
                      >
                        <span>{cat}</span>
                        <span className="chip-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Themes List for All Selected Components */}
              <div className="themes-list-container">
                {displayedThemedComponents.length === 0 ? (
                  <div className="no-themes-state">
                    <Package size={32} color="#94a3b8" />
                    <p>No components match the current filter in your selection.</p>
                  </div>
                ) : (
                  displayedThemedComponents.map((compType) => {
                    let themes = ThemeRepository.getByComponentType(compType);
                    const registryItem = ComponentRegistry[compType];

                    // If no predefined custom theme, provide standard system theme default
                    if (!themes || themes.length === 0) {
                      themes = [
                        {
                          id: `${compType.toLowerCase()}-default`,
                          componentType: compType,
                          name: `Default ${registryItem?.label || compType}`,
                          description: `Standard system styling tokens for ${registryItem?.label || compType}`,
                        },
                      ];
                    }

                    const currentThemeId = chosenThemes[compType] || themes[0]?.id;

                    return (
                      <div key={compType} className="theme-group-card">
                        <div className="theme-group-header">
                          <div className="theme-group-title-row">
                            <span className="theme-group-icon">{registryItem?.icon || "🎨"}</span>
                            <div>
                              <div className="theme-group-label">
                                {registryItem?.label || compType}
                                <span className="theme-cat-tag">
                                  {registryItem?.category || "Widget"}
                                </span>
                              </div>
                              <div className="theme-group-sub">
                                {themes.length} {themes.length === 1 ? "blueprint" : "blueprints"} available
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCustomThemeTarget(compType)}
                            className="btn-create-theme"
                          >
                            <Plus size={14} />
                            <span>Create Theme</span>
                          </button>
                        </div>

                        {/* Theme Previews Grid */}
                        <div
                          className={`theme-options-grid ${
                            compType === "ProductCard" ? "product-card-grid" : ""
                          }`}
                        >
                          {themes.map((t) => {
                            const isChosen = currentThemeId === t.id;
                            return (
                              <div
                                key={t.id}
                                onClick={() => handleSelectTheme(compType, t.id)}
                                className={`theme-option-card ${isChosen ? "active" : ""}`}
                              >
                                <div className="theme-preview-box">
                                  <ThemeLivePreview compType={compType} themeId={t.id} />
                                </div>

                                <div className="theme-option-footer">
                                  <div className="theme-option-meta">
                                    <span className="theme-option-name">{t.name}</span>
                                    <span className="theme-option-desc">
                                      {t.description || "Visual preset"}
                                    </span>
                                  </div>

                                  {isChosen ? (
                                    <span className="theme-selected-pill">
                                      <Check size={11} strokeWidth={3} />
                                      <span>Selected</span>
                                    </span>
                                  ) : (
                                    <span className="theme-select-btn">Select</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Step Navigation Actions */}
              <div className="step-action-bar">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-secondary"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Components</span>
                </button>

                <div className="action-right-group">
                  <span className="selection-count-hint">
                    {selectedComponents.length} components themed
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="btn-primary"
                  >
                    <span>Step 4: Review Foundation</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review Foundation */}
          {currentStep === 4 && (
            <div className="step-card-panel">
              <div className="step-panel-header">
                <div>
                  <div className="panel-title-row">
                    <h2 className="step-panel-title">Review SDUI Foundation</h2>
                    <span className="counter-badge success">Ready for Deployment</span>
                  </div>
                  <p className="step-panel-subtitle">
                    Confirm your component toolbox ({selectedComponents.length} widgets) and theme presets before launching the visual studio.
                  </p>
                </div>
              </div>

              <div className="review-dashboard-grid">
                {/* Selected Components Panel */}
                <div className="review-box">
                  <div className="review-box-header">
                    <div className="review-header-left">
                      <Package size={18} color="#4f46e5" />
                      <div>
                        <h4 className="review-box-title">
                          Enabled Components ({selectedComponents.length})
                        </h4>
                        <p className="review-box-sub">Available in CMS Component Library</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="edit-step-btn"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="review-tags-wrap">
                    {selectedComponents.map((c) => (
                      <span key={c} className="review-comp-pill">
                        <span className="pill-icon">{ComponentRegistry[c]?.icon || "📦"}</span>
                        <span>{ComponentRegistry[c]?.label || c}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned Themes Panel */}
                <div className="review-box">
                  <div className="review-box-header">
                    <div className="review-header-left">
                      <Palette size={18} color="#0ea5e9" />
                      <div>
                        <h4 className="review-box-title">Assigned Theme Presets</h4>
                        <p className="review-box-sub">Default visual styling tokens</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="edit-step-btn"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="review-themes-list">
                    {selectedComponents.map((k) => (
                      <div key={k} className="review-theme-row">
                        <span className="theme-row-key">
                          {ComponentRegistry[k]?.icon || "🎨"} {ComponentRegistry[k]?.label || k}
                        </span>
                        <span className="theme-row-val">{chosenThemes[k] || "Default System Style"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="review-status-banner">
                <ShieldCheck size={18} className="banner-icon" />
                <div>
                  <strong>Foundation State Initialized:</strong> All {selectedComponents.length} components
                  will be ready in your Journey toolbox with full drag-and-drop capability, real-time JSON sync, and instant theme switching.
                </div>
              </div>

              {/* Step Navigation Actions */}
              <div className="step-action-bar">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-secondary"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Themes</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="btn-finish"
                >
                  <Sparkles size={16} />
                  <span>Confirm & Launch Visual CMS Studio ✨</span>
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

      <style>{`
        .wizard-root {
          position: relative;
          height: 100vh;
          max-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Ambient Glow & Grid Backdrop */
        .bg-decorations {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }

        .glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.35;
        }

        .glow-blob-1 {
          top: -10%;
          left: -5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
        }

        .glow-blob-2 {
          bottom: -10%;
          right: -5%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(16, 185, 129, 0.05) 70%, transparent 100%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(226, 232, 240, 0.4) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(226, 232, 240, 0.4) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(ellipse at center, black 50%, transparent 90%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 50%, transparent 90%);
        }

        /* Header Navigation */
        .wizard-header {
          position: relative;
          z-index: 10;
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .header-back-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
          transform: translateX(-2px);
        }

        .header-brand-divider {
          width: 1px;
          height: 24px;
          background-color: #e2e8f0;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(79, 70, 229, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 11px;
          color: #64748b;
          line-height: 1.1;
        }

        /* Step Indicator Track */
        .step-indicator-track {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .step-bubble-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          border-radius: 20px;
          background: transparent;
          border: 1px solid transparent;
          cursor: default;
          transition: all 0.15s ease;
        }

        .step-bubble-btn.clickable {
          cursor: pointer;
        }

        .step-bubble-btn.clickable:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .step-bubble-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .step-bubble-btn.current .step-bubble-circle {
          background: #4f46e5;
          color: #ffffff;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }

        .step-bubble-btn.completed .step-bubble-circle {
          background: #10b981;
          color: #ffffff;
        }

        .step-bubble-label {
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
        }

        .step-bubble-btn.current .step-bubble-label {
          color: #0f172a;
          font-weight: 700;
        }

        .step-bubble-btn.completed .step-bubble-label {
          color: #334155;
          font-weight: 600;
        }

        /* Main Content Container */
        .wizard-main {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 24px 20px;
          overflow-y: auto;
          min-height: 0;
          box-sizing: border-box;
        }

        .wizard-card-wrapper {
          width: 100%;
          max-width: 1040px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-card-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.06),
                      0 1px 3px rgba(15, 23, 42, 0.02);
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-sizing: border-box;
          animation: cardSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes cardSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Step 1 Welcome Specific */
        .step-welcome {
          text-align: center;
          align-items: center;
          padding: 44px 32px;
          gap: 24px;
        }

        .welcome-hero-badge {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: rgba(79, 70, 229, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.2);
        }

        .welcome-text-center {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .welcome-step-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.06);
          padding: 3px 10px;
          border-radius: 999px;
        }

        .welcome-heading {
          margin: 0;
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .welcome-description {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          max-width: 580px;
          line-height: 1.6;
        }

        .welcome-summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          width: 100%;
          margin-top: 8px;
        }

        .summary-pill-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          text-align: left;
        }

        .pill-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pill-card-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .pill-card-sub {
          font-size: 11px;
          color: #64748b;
          line-height: 1.35;
          margin-top: 2px;
        }

        /* Step Panels Common Header */
        .step-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 16px;
        }

        .panel-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step-panel-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .counter-badge {
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(79, 70, 229, 0.08);
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
        }

        .counter-badge.success {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .step-panel-subtitle {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #64748b;
        }

        .quick-select-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-ghost {
          background: transparent;
          border: none;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .btn-ghost:hover {
          background: rgba(79, 70, 229, 0.06);
        }

        .dot-sep {
          color: #cbd5e1;
        }

        /* Filters & Search Toolbar */
        .filters-toolbar {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 9px 32px 9px 36px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 13px;
          color: #0f172a;
          outline: none;
          transition: all 0.15s ease;
        }

        .search-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .clear-search-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          font-size: 16px;
          color: #94a3b8;
          cursor: pointer;
        }

        .category-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .category-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .category-chip:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .category-chip.active {
          background: #4f46e5;
          border-color: #4f46e5;
          color: #ffffff;
        }

        .chip-count {
          font-size: 10px;
          opacity: 0.8;
          background: rgba(0, 0, 0, 0.08);
          padding: 1px 5px;
          border-radius: 10px;
        }

        .category-chip.active .chip-count {
          background: rgba(255, 255, 255, 0.25);
        }

        /* Components Grid */
        .components-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          max-height: 380px;
          overflow-y: auto;
          padding: 2px;
        }

        .component-card {
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .component-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 10px -2px rgba(15, 23, 42, 0.04);
          transform: translateY(-1px);
        }

        .component-card.selected {
          border-color: #4f46e5;
          background: rgba(79, 70, 229, 0.03);
          box-shadow: 0 0 0 1px #4f46e5;
        }

        .comp-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .comp-icon-circle {
          font-size: 20px;
        }

        .comp-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.15s ease;
        }

        .comp-checkbox.checked {
          background: #4f46e5;
          border-color: #4f46e5;
        }

        .comp-card-body {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .comp-card-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .comp-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .comp-cat-tag {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          background: #f1f5f9;
          padding: 1px 5px;
          border-radius: 4px;
        }

        .comp-desc {
          margin: 0;
          font-size: 11px;
          color: #64748b;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Step 3 Themes List */
        .themes-list-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 480px;
          overflow-y: auto;
          padding: 2px;
        }

        .no-themes-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px;
          color: #64748b;
          font-size: 13px;
        }

        .theme-group-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .theme-group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .theme-group-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .theme-group-icon {
          font-size: 20px;
        }

        .theme-group-label {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .theme-cat-tag {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.08);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .theme-group-sub {
          font-size: 11px;
          color: #64748b;
        }

        .btn-create-theme {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid #4f46e5;
          background: rgba(79, 70, 229, 0.06);
          color: #4f46e5;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-create-theme:hover {
          background: #4f46e5;
          color: #ffffff;
        }

        .theme-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }

        .theme-options-grid.product-card-grid {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .theme-option-card {
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.15s ease;
        }

        .theme-option-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
        }

        .theme-option-card.active {
          border-color: #4f46e5;
          background: rgba(79, 70, 229, 0.02);
          box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.15);
        }

        .theme-preview-box {
          border-radius: 8px;
          overflow: hidden;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
        }

        .preview-container {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 4px;
        }

        .preview-container.wide-preview {
          padding: 4px 0;
        }

        .preview-fallback-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 16px;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .theme-option-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .theme-option-meta {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .theme-option-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .theme-option-desc {
          font-size: 11px;
          color: #64748b;
        }

        .theme-selected-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #4f46e5;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 999px;
        }

        .theme-select-btn {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 600;
        }

        /* Step 4 Review */
        .review-dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .review-box {
          padding: 18px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .review-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .review-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .review-box-title {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .review-box-sub {
          margin: 0;
          font-size: 11px;
          color: #64748b;
        }

        .edit-step-btn {
          background: transparent;
          border: none;
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .review-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          max-height: 220px;
          overflow-y: auto;
        }

        .review-comp-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
        }

        .review-themes-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 220px;
          overflow-y: auto;
        }

        .review-theme-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          background: #ffffff;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
        }

        .theme-row-key {
          color: #475569;
          font-weight: 500;
        }

        .theme-row-val {
          color: #0f172a;
          font-weight: 700;
        }

        .review-status-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 12px;
          background: rgba(79, 70, 229, 0.05);
          border: 1px solid rgba(79, 70, 229, 0.15);
          font-size: 12px;
          color: #3730a3;
          line-height: 1.45;
        }

        .banner-icon {
          color: #4f46e5;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Actions Bar Common */
        .step-action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        .step-action-bar.center-actions {
          justify-content: center;
        }

        .action-right-group {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .selection-count-hint {
          font-size: 12px;
          color: #64748b;
        }

        .btn-primary {
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px -2px rgba(79, 70, 229, 0.35);
          transition: all 0.15s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
          box-shadow: 0 6px 16px -2px rgba(79, 70, 229, 0.45);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.15s ease;
        }

        .btn-secondary:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #94a3b8;
        }

        .btn-finish {
          padding: 11px 24px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px -2px rgba(16, 185, 129, 0.4);
          transition: all 0.15s ease;
        }

        .btn-finish:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          box-shadow: 0 6px 18px -2px rgba(16, 185, 129, 0.5);
          transform: translateY(-1px);
        }

        /* RESPONSIVENESS */
        @media (max-width: 900px) {
          .wizard-header {
            padding: 0 16px;
          }

          .header-brand {
            display: none;
          }

          .welcome-summary-grid {
            grid-template-columns: 1fr;
          }

          .review-dashboard-grid {
            grid-template-columns: 1fr;
          }

          .step-card-panel {
            padding: 20px 16px;
          }
        }

        @media (max-width: 600px) {
          .step-indicator-track .step-bubble-label {
            display: none;
          }

          .step-action-bar {
            flex-direction: column-reverse;
            gap: 10px;
          }

          .step-action-bar .btn-primary,
          .step-action-bar .btn-secondary,
          .step-action-bar .btn-finish {
            width: 100%;
            justify-content: center;
          }

          .action-right-group {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingWizard;
