import React, { useState, useMemo } from "react";
import {
  Layers,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  Palette,
  Package,
  Plus,
  RefreshCw,
  Zap,
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

  const isWide =
    compType === "Header" ||
    compType === "NavBar" ||
    compType === "HeroBanner" ||
    compType === "Carousel" ||
    compType === "StoryRow" ||
    compType === "SearchBar";

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

const STEPS = [
  { id: 1, label: "Components", icon: Package, title: "Select Components", desc: "Choose the UI widgets for your store." },
  { id: 2, label: "Themes", icon: Palette, title: "Theme Presets", desc: "Pick visual styles and presets for your components." },
  { id: 3, label: "Launch", icon: Sparkles, title: "Ready to Launch", desc: "Review and start building on your SDUI canvas." },
];

export const OnboardingWizard = ({ onComplete, onBack }) => {
  // Step 1 is choosing components!
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState("forward");

  const allComponentKeys = useMemo(
    () => Object.keys(ComponentRegistry).filter((key) => key !== "Home" && key !== "Page"),
    []
  );

  // Step 1 State: Components
  const [selectedComponents, setSelectedComponents] = useState(DEFAULT_SELECTED_COMPONENTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Step 2 State: Themes
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

  const goToStep = (stepNumber) => {
    if (stepNumber > currentStep) {
      setSlideDirection("forward");
    } else {
      setSlideDirection("backward");
    }
    setCurrentStep(stepNumber);
  };

  const toggleComponent = (compType) => {
    setSelectedComponents((prev) =>
      prev.includes(compType) ? prev.filter((t) => t !== compType) : [...prev, compType]
    );
  };

  const handleSelectAll = () => setSelectedComponents([...allComponentKeys]);
  const handleDeselectAll = () => setSelectedComponents([]);
  const handleResetDefault = () => setSelectedComponents(DEFAULT_SELECTED_COMPONENTS);

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
    FoundationRepository.save(foundation);
    onComplete(foundation);
  };

  const categories = ["All", ...Object.values(ComponentCategories).filter((c) => c !== "All")];

  // Components for Step 1
  const displayedComponents = allComponentKeys.filter((type) => {
    const def = ComponentRegistry[type];
    const matchesCategory = activeCategory === "All" || def?.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      (def?.label || type).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (def?.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Themes for Step 2
  const displayedThemedComponents = selectedComponents.filter((type) => {
    const def = ComponentRegistry[type];
    const matchesCategory = themeCategory === "All" || def?.category === themeCategory;
    const matchesSearch =
      !themeSearch.trim() ||
      (def?.label || type).toLowerCase().includes(themeSearch.toLowerCase()) ||
      (def?.description || "").toLowerCase().includes(themeSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="wizard-root">
      {/* Background Decor */}
      <div className="bg-glow">
        <div className="glow-blob blob-1" />
        <div className="glow-blob blob-2" />
        <div className="subtle-grid" />
      </div>

      {/* Wizard Header Bar */}
      <header className="wizard-nav-header">
        <div className="nav-left">
          <button
            type="button"
            onClick={() => {
              if (currentStep === 1) {
                if (onBack) onBack();
              } else {
                goToStep(currentStep - 1);
              }
            }}
            className="nav-back-btn"
          >
            <ArrowLeft size={15} />
            <span>{currentStep === 1 ? "Sign In" : "Back"}</span>
          </button>

          <div className="brand-badge-box">
            <div className="brand-mini-icon">
              <Layers size={15} />
            </div>
            <span className="brand-title">CampusCommerce</span>
          </div>
        </div>

        <div className="step-slider-pills">
          {STEPS.map((s) => {
            const isCurrent = currentStep === s.id;
            const isCompleted = currentStep > s.id;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToStep(s.id)}
                className={`step-pill ${isCurrent ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              >
                <span className="pill-dot">
                  {isCompleted ? <Check size={11} strokeWidth={3} /> : s.id}
                </span>
                <span className="pill-label">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="nav-right">
          <span className="live-status-pill">
            <Zap size={13} className="zap-icon" />
            <span>SDUI Active</span>
          </span>
        </div>
      </header>

      <main className="wizard-slider-container">
        <div className={`slider-card slide-${slideDirection}`} key={currentStep}>
          {currentStep === 1 && (
            <div className="step-pane">
              <div className="step-header">
                <div>
                  <div className="header-title-row">
                    <h2 className="step-title">Select Components</h2>
                    <span className="count-pill">
                      {selectedComponents.length} of {allComponentKeys.length} selected
                    </span>
                  </div>
                  <p className="step-subtitle">Pick the widgets to enable in your visual canvas.</p>
                </div>

                <div className="quick-actions">
                  <button type="button" onClick={handleSelectAll} className="preset-btn">Select All</button>
                  <button type="button" onClick={handleDeselectAll} className="preset-btn">Clear</button>
                  <button type="button" onClick={handleResetDefault} className="preset-btn default">
                    <RefreshCw size={11} />
                    <span>Default (14)</span>
                  </button>
                </div>
              </div>

              <div className="toolbar-row">
                <div className="search-box">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search widgets (e.g. Hero, Carousel, Price)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="clear-btn">&times;</button>}
                </div>

                <div className="category-scroll">
                  {categories.map((cat) => {
                    const count = cat === "All" ? allComponentKeys.length : allComponentKeys.filter((k) => ComponentRegistry[k]?.category === cat).length;
                    const isActive = activeCategory === cat;
                    return (
                      <button key={cat} type="button" onClick={() => setActiveCategory(cat)} className={`cat-chip ${isActive ? "active" : ""}`}>
                        <span>{cat}</span>
                        <span className="cat-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="components-grid">
                {displayedComponents.map((compType) => {
                  const def = ComponentRegistry[compType];
                  const isSelected = selectedComponents.includes(compType);
                  return (
                    <div key={compType} onClick={() => toggleComponent(compType)} className={`widget-card ${isSelected ? "selected" : ""}`}>
                      <div className="card-top-row">
                        <span className="widget-emoji">{def?.icon || "📦"}</span>
                        <div className={`widget-checkbox ${isSelected ? "checked" : ""}`}>
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </div>
                      </div>
                      <div className="widget-info">
                        <div className="widget-name-row">
                          <span className="widget-name">{def?.label || compType}</span>
                          <span className="widget-cat">{def?.category || "Widget"}</span>
                        </div>
                        <p className="widget-desc">{def?.description || "Server-driven UI widget"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bottom-bar">
                <button type="button" onClick={() => onBack && onBack()} className="btn-back">
                  <ArrowLeft size={15} />
                  <span>Back</span>
                </button>
                <div className="bar-right">
                  <span className="summary-text">{selectedComponents.length} enabled</span>
                  <button type="button" onClick={() => goToStep(2)} disabled={selectedComponents.length === 0} className="btn-next">
                    <span>Step 2: Choose Themes</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-pane">
              <div className="step-header">
                <div>
                  <div className="header-title-row">
                    <h2 className="step-title">Theme Presets</h2>
                    <span className="count-pill">{displayedThemedComponents.length} of {selectedComponents.length} themed</span>
                  </div>
                  <p className="step-subtitle">Select visual styling presets for your selected components.</p>
                </div>
              </div>

              <div className="toolbar-row">
                <div className="search-box">
                  <Search size={14} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search themes..."
                    value={themeSearch}
                    onChange={(e) => setThemeSearch(e.target.value)}
                    className="search-input"
                  />
                  {themeSearch && <button type="button" onClick={() => setThemeSearch("")} className="clear-btn">&times;</button>}
                </div>

                <div className="category-scroll">
                  {categories.map((cat) => {
                    const count = cat === "All" ? selectedComponents.length : selectedComponents.filter((k) => ComponentRegistry[k]?.category === cat).length;
                    if (count === 0 && cat !== "All") return null;
                    const isActive = themeCategory === cat;
                    return (
                      <button key={cat} type="button" onClick={() => setThemeCategory(cat)} className={`cat-chip ${isActive ? "active" : ""}`}>
                        <span>{cat}</span>
                        <span className="cat-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="themes-scroll-list">
                {displayedThemedComponents.length === 0 ? (
                  <div className="empty-state">
                    <Package size={28} color="#94a3b8" />
                    <p>No components match your filter in current selection.</p>
                  </div>
                ) : (
                  displayedThemedComponents.map((compType) => {
                    let themes = ThemeRepository.getByComponentType(compType);
                    const registryItem = ComponentRegistry[compType];
                    if (!themes || themes.length === 0) {
                      themes = [{ id: `${compType.toLowerCase()}-default`, componentType: compType, name: `Default ${registryItem?.label || compType}` }];
                    }
                    const currentThemeId = chosenThemes[compType] || themes[0]?.id;
                    return (
                      <div key={compType} className="theme-group-card">
                        <div className="group-header">
                          <div className="group-title-wrap">
                            <span className="group-icon">{registryItem?.icon || "🎨"}</span>
                            <div>
                              <span className="group-title">{registryItem?.label || compType}</span>
                              <span className="group-badge">{registryItem?.category || "Widget"}</span>
                            </div>
                          </div>
                          <button type="button" onClick={() => setCustomThemeTarget(compType)} className="btn-create-theme">
                            <Plus size={13} />
                            <span>Create Theme</span>
                          </button>
                        </div>
                        <div className="theme-variants-grid">
                          {themes.map((t) => {
                            const isChosen = currentThemeId === t.id;
                            return (
                              <div key={t.id} onClick={() => handleSelectTheme(compType, t.id)} className={`theme-card ${isChosen ? "active" : ""}`}>
                                <div className="theme-preview-wrap">
                                  <ThemeLivePreview compType={compType} themeId={t.id} />
                                </div>
                                <div className="theme-card-footer">
                                  <span className="theme-name">{t.name}</span>
                                  {isChosen ? (
                                    <span className="theme-active-tag"><Check size={10} strokeWidth={3} /><span>Selected</span></span>
                                  ) : (
                                    <span className="theme-pick-tag">Select</span>
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

              <div className="bottom-bar">
                <button type="button" onClick={() => goToStep(1)} className="btn-back">
                  <ArrowLeft size={15} />
                  <span>Step 1: Components</span>
                </button>
                <div className="bar-right">
                  <span className="summary-text">{selectedComponents.length} configured</span>
                  <button type="button" onClick={() => goToStep(3)} className="btn-next">
                    <span>Step 3: Review & Launch</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-pane">
              <div className="step-header">
                <div>
                  <div className="header-title-row">
                    <h2 className="step-title">Review & Launch</h2>
                    <span className="count-pill success">Ready</span>
                  </div>
                  <p className="step-subtitle">Your SDUI workspace is configured and ready to compose.</p>
                </div>
              </div>

              <div className="review-grid">
                <div className="review-card">
                  <div className="review-card-top">
                    <div className="review-card-title-row">
                      <Package size={16} color="#4f46e5" />
                      <span className="review-card-heading">Enabled Widgets ({selectedComponents.length})</span>
                    </div>
                    <button type="button" onClick={() => goToStep(1)} className="edit-link">Edit</button>
                  </div>
                  <div className="pills-cloud">
                    {selectedComponents.map((c) => (
                      <span key={c} className="mini-widget-pill">
                        <span>{ComponentRegistry[c]?.icon || "📦"}</span>
                        <span>{ComponentRegistry[c]?.label || c}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="review-card">
                  <div className="review-card-top">
                    <div className="review-card-title-row">
                      <Palette size={16} color="#0ea5e9" />
                      <span className="review-card-heading">Active Themes</span>
                    </div>
                    <button type="button" onClick={() => goToStep(2)} className="edit-link">Edit</button>
                  </div>
                  <div className="themes-summary-list">
                    {selectedComponents.map((k) => (
                      <div key={k} className="summary-theme-row">
                        <span className="theme-row-label">
                          {ComponentRegistry[k]?.icon || "🎨"} {ComponentRegistry[k]?.label || k}
                        </span>
                        <span className="theme-row-value">{chosenThemes[k] || "Default System"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bottom-bar">
                <button type="button" onClick={() => goToStep(2)} className="btn-back">
                  <ArrowLeft size={15} />
                  <span>Step 2: Themes</span>
                </button>
                <button type="button" onClick={handleFinish} className="btn-launch">
                  <Sparkles size={16} />
                  <span>Launch CMS Studio</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {customThemeTarget && (
        <CustomThemeModal
          isOpen={!!customThemeTarget}
          componentType={customThemeTarget}
          onClose={() => setCustomThemeTarget(null)}
          onThemeCreated={(newTheme) => handleSelectTheme(customThemeTarget, newTheme.id)}
        />
      )}

      <style>{`
        .wizard-root {
          position: relative;
          height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          overflow: hidden;
        }

        .bg-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .glow-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.35;
        }

        .blob-1 {
          top: -15%;
          left: 15%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.22) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
        }

        .blob-2 {
          bottom: -15%;
          right: 15%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(168, 85, 247, 0.05) 70%, transparent 100%);
        }

        .subtle-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(226, 232, 240, 0.45) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(226, 232, 240, 0.45) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }

        /* HEADER */
        .wizard-nav-header {
          position: relative;
          z-index: 10;
          height: 60px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .nav-back-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .brand-badge-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-mini-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px -2px rgba(79, 70, 229, 0.35);
        }

        .brand-title {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .step-slider-pills {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
        }

        .step-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .step-pill.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .step-pill.completed {
          color: #4f46e5;
        }

        .pill-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .step-pill.active .pill-dot {
          background: #4f46e5;
          color: #ffffff;
        }

        .step-pill.completed .pill-dot {
          background: #dcfce7;
          color: #16a34a;
        }

        .pill-label {
          font-size: 12px;
        }

        .nav-right {
          display: flex;
          align-items: center;
        }

        .live-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: #16a34a;
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .zap-icon {
          color: #16a34a;
        }

        /* MAIN CONTAINER */
        .wizard-slider-container {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px 24px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .slider-card {
          width: 100%;
          max-width: 1060px;
          height: 100%;
          max-height: calc(100vh - 92px);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 20px 50px -15px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .step-pane {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          padding: 24px 30px;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* STEP HEADER */
        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
          flex-shrink: 0;
        }

        .header-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step-title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .count-pill {
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.2);
          padding: 2px 9px;
          border-radius: 999px;
        }

        .count-pill.success {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .step-subtitle {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #64748b;
        }

        .quick-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .preset-btn {
          font-size: 12px;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .preset-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .preset-btn.default {
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.05);
          border-color: rgba(79, 70, 229, 0.2);
        }

        .preset-btn.default:hover {
          background: rgba(79, 70, 229, 0.1);
        }

        /* TOOLBAR */
        .toolbar-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
          flex-shrink: 0;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 280px;
          flex-shrink: 0;
        }

        .search-icon {
          position: absolute;
          left: 11px;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          height: 36px;
          padding: 0 32px 0 32px;
          border-radius: 9px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 12px;
          color: #0f172a;
          outline: none;
          transition: all 0.15s ease;
        }

        .search-input:focus {
          border-color: #4f46e5;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .clear-btn {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 15px;
          line-height: 1;
        }

        .category-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }

        .cat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .cat-chip:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .cat-chip.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .cat-count {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.06);
        }

        .cat-chip.active .cat-count {
          background: rgba(255, 255, 255, 0.22);
          color: #ffffff;
        }

        /* COMPONENTS GRID (Step 1) */
        .components-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
          overflow-y: auto;
          padding: 2px 4px 10px 2px;
        }

        .widget-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .widget-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px -4px rgba(15, 23, 42, 0.06);
        }

        .widget-card.selected {
          border-color: #4f46e5;
          background: linear-gradient(180deg, rgba(79, 70, 229, 0.03) 0%, rgba(255, 255, 255, 1) 100%);
          box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.12);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .widget-emoji {
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
        }

        .widget-card.selected .widget-emoji {
          background: rgba(79, 70, 229, 0.08);
          border-color: rgba(79, 70, 229, 0.15);
        }

        .widget-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.15s ease;
        }

        .widget-checkbox.checked {
          background: #4f46e5;
          border-color: #4f46e5;
        }

        .widget-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .widget-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }

        .widget-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .widget-cat {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 5px;
          border-radius: 4px;
        }

        .widget-desc {
          margin: 0;
          font-size: 11px;
          color: #64748b;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* THEMES LIST (Step 2) */
        .themes-scroll-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-y: auto;
          padding: 2px 4px 10px 2px;
        }

        .theme-group-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .group-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .group-icon {
          font-size: 18px;
        }

        .group-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .group-badge {
          margin-left: 6px;
          font-size: 9px;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .btn-create-theme {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.06);
          border: 1px solid rgba(79, 70, 229, 0.2);
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-create-theme:hover {
          background: rgba(79, 70, 229, 0.12);
        }

        .theme-variants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
        }

        .theme-card {
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          background: #f8fafc;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
        }

        .theme-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .theme-card.active {
          border-color: #4f46e5;
          background: #ffffff;
          box-shadow: 0 0 0 1px #4f46e5, 0 4px 12px rgba(79, 70, 229, 0.15);
        }

        .theme-preview-wrap {
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          background: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }

        .preview-container {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .preview-container.wide-preview {
          padding: 2px 0;
        }

        .preview-scaler {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .preview-fallback-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .theme-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background: #ffffff;
        }

        .theme-name {
          font-size: 11px;
          font-weight: 600;
          color: #0f172a;
        }

        .theme-active-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 700;
          color: #16a34a;
          background: #dcfce7;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .theme-pick-tag {
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          color: #94a3b8;
          gap: 8px;
          font-size: 13px;
        }

        /* REVIEW (Step 3) */
        .review-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          overflow-y: auto;
          padding: 2px 4px 10px 2px;
        }

        .review-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .review-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .review-card-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .review-card-heading {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .edit-link {
          background: none;
          border: none;
          color: #4f46e5;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .pills-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          max-height: 280px;
          overflow-y: auto;
        }

        .mini-widget-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 6px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #334155;
        }

        .themes-summary-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 280px;
          overflow-y: auto;
        }

        .summary-theme-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          background: #ffffff;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 12px;
        }

        .theme-row-label {
          font-weight: 600;
          color: #334155;
        }

        .theme-row-value {
          font-weight: 700;
          color: #4f46e5;
        }

        /* BOTTOM ACTIONS */
        .bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
          flex-shrink: 0;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 38px;
          padding: 0 16px;
          border-radius: 9px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-back:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .bar-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .summary-text {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .btn-next {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 20px;
          border-radius: 9px;
          border: none;
          background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.4);
          transition: all 0.18s ease;
        }

        .btn-next:hover:not(:disabled) {
          box-shadow: 0 6px 18px -2px rgba(79, 70, 229, 0.55);
          transform: translateY(-1px);
        }

        .btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-launch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 24px;
          border-radius: 9px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #4f46e5 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px -2px rgba(16, 185, 129, 0.45);
          transition: all 0.18s ease;
        }

        .btn-launch:hover {
          box-shadow: 0 10px 24px -4px rgba(16, 185, 129, 0.6);
          transform: translateY(-1px);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .step-pane {
            padding: 16px 18px;
          }
          .toolbar-row {
            flex-direction: column;
            align-items: stretch;
          }
          .search-box {
            width: 100%;
          }
          .review-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OnboardingWizard;
