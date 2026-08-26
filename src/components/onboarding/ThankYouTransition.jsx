import React from "react";
import {
  Check,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Layers,
  GitBranch,
  FileCode,
  ShieldCheck,
  PackageCheck,
  User,
  Zap,
  Cpu,
} from "lucide-react";
import { ComponentRegistry } from "../../registry/componentRegistry";

export const ThankYouTransition = ({ user, foundation, onEnterDashboard, onBack }) => {
  const componentsCount = foundation?.components?.length || 14;
  const themesCount = Object.keys(foundation?.chosenThemes || {}).length || 5;

  const quickFeatures = [
    { label: "100-Col Visual Canvas", icon: LayoutDashboard, color: "#4f46e5" },
    { label: "Deep Component Tree", icon: Layers, color: "#0ea5e9" },
    { label: "Multi-Branch Journeys", icon: GitBranch, color: "#10b981" },
    { label: "Live JSON Engine", icon: FileCode, color: "#8b5cf6" },
  ];

  return (
    <div className="thankyou-root">
      {/* Ambient Background */}
      <div className="bg-decorations">
        <div className="glow-blob glow-blob-1" />
        <div className="glow-blob glow-blob-2" />
        <div className="grid-overlay" />
      </div>

      {/* Top Header / Navigation Bar */}
      <header className="thankyou-header">
        <button type="button" onClick={onBack} className="back-nav-btn">
          <ArrowLeft size={16} />
          <span>Back to Foundation Setup</span>
        </button>

        <div className="header-status-group">
          {user && (
            <div className="user-profile-badge">
              <div className="user-avatar">
                <User size={13} />
              </div>
              <div className="user-meta">
                <span className="user-name">{user.name || "Campus Architect"}</span>
                <span className="user-role">{user.role || "Lead Systems Architect"}</span>
              </div>
            </div>
          )}

          <div className="env-badge">
            <span className="env-dot" />
            <span>SDUI Engine Online</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Panel Container */}
      <main className="thankyou-main">
        <div className="thankyou-grid">
          {/* LEFT PANEL: Launch Card */}
          <div className="launch-panel">
            <div className="panel-badge-row">
              <span className="ready-pill">
                <Sparkles size={13} />
                <span>Environment Ready</span>
              </span>
              <span className="step-pill">Phase 3 of 3: Workspace Launch</span>
            </div>

            <div className="success-hero-group">
              <div className="success-icon-badge">
                <CheckCircle2 size={32} color="#10b981" />
              </div>
              <div>
                <h1 className="launch-title">Your workspace is ready.</h1>
                <p className="launch-desc">
                  Welcome to <strong>CampusCommerce Studio</strong>. Your interface foundation,
                  theme blueprints, and catalog components are configured and synchronized for live
                  Server-Driven UI authoring.
                </p>
              </div>
            </div>

            {/* Quick capabilities preview */}
            <div className="quick-features-grid">
              {quickFeatures.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="quick-feature-chip">
                    <div className="feature-icon-wrap" style={{ color: item.color, backgroundColor: `${item.color}14` }}>
                      <Icon size={16} />
                    </div>
                    <span className="feature-label">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="launch-actions-row">
              <button
                type="button"
                onClick={onEnterDashboard}
                className="btn-launch-primary"
              >
                <span>Open CMS Dashboard</span>
                <ArrowRight size={18} className="btn-arrow" />
              </button>

              <button
                type="button"
                onClick={onBack}
                className="btn-launch-secondary"
              >
                <ArrowLeft size={16} />
                <span>Reconfigure Setup</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Foundation Summary & Quick Start */}
          <div className="summary-panel">
            <div className="summary-panel-header">
              <div className="summary-icon-box">
                <PackageCheck size={20} />
              </div>
              <div>
                <h3 className="summary-title">Active Foundation State</h3>
                <p className="summary-subtitle">Compiled runtime configuration</p>
              </div>
            </div>

            <div className="summary-cards-list">
              {/* Enabled Widgets Card */}
              <div className="summary-item-card">
                <div className="summary-item-top">
                  <span className="item-title">Enabled Catalog Components</span>
                  <span className="item-badge">{componentsCount} Widgets</span>
                </div>
                <div className="components-preview-pills">
                  {(foundation?.components || []).slice(0, 12).map((c) => {
                    const type = typeof c === "string" ? c : c.type;
                    const def = ComponentRegistry[type];
                    return (
                      <span key={type} className="comp-mini-pill">
                        <span>{def?.icon || "📦"}</span>
                        <span>{def?.label || type}</span>
                      </span>
                    );
                  })}
                  {componentsCount > 12 && (
                    <span className="comp-more-pill">+{componentsCount - 12} more</span>
                  )}
                </div>
              </div>

              {/* Theme Blueprints Card */}
              <div className="summary-item-card">
                <div className="summary-item-top">
                  <span className="item-title">Theme Engine Status</span>
                  <span className="item-badge theme-badge">{themesCount} Blueprints</span>
                </div>
                <p className="item-desc">
                  Live multi-theme blueprints active with token-based styling & visual layout previews.
                </p>
              </div>
            </div>

            {/* Pro-Tip Box */}
            <div className="pro-tip-box">
              <Zap size={16} className="tip-icon" />
              <div className="tip-text">
                <strong>Pro-Tip:</strong> Press <kbd>Ctrl + S</kbd> inside the CMS canvas to save journey changes and <kbd>Ctrl + Z</kbd> to undo.
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .thankyou-root {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          overflow-x: hidden;
          overflow-y: auto;
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
          opacity: 0.38;
        }

        .glow-blob-1 {
          top: -10%;
          left: -5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(14, 165, 233, 0.06) 70%, transparent 100%);
        }

        .glow-blob-2 {
          bottom: -10%;
          right: -5%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, rgba(168, 85, 247, 0.06) 70%, transparent 100%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(226, 232, 240, 0.4) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(226, 232, 240, 0.4) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(ellipse at center, black 45%, transparent 85%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 45%, transparent 85%);
        }

        /* Top Header */
        .thankyou-header {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          max-width: 1140px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .back-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .back-nav-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
          transform: translateX(-2px);
        }

        .header-status-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-profile-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-meta {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .user-name {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.1;
        }

        .user-role {
          font-size: 10px;
          color: #64748b;
          line-height: 1.1;
        }

        .env-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: #334155;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .env-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #10b981;
        }

        /* Main Container */
        .thankyou-main {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px 32px 24px;
          box-sizing: border-box;
        }

        .thankyou-grid {
          width: 100%;
          max-width: 1080px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 28px;
          align-items: stretch;
          animation: thankyouFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes thankyouFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* LEFT PANEL (Launch) */
        .launch-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.07),
                      0 1px 3px rgba(15, 23, 42, 0.03);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 24px;
          box-sizing: border-box;
        }

        .panel-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ready-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #059669;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .step-pill {
          padding: 4px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
        }

        .success-hero-group {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .success-icon-badge {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(16, 185, 129, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.25);
        }

        .launch-title {
          margin: 0;
          font-size: clamp(26px, 3.4vw, 36px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }

        .launch-desc {
          margin: 10px 0 0 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          max-width: 48ch;
        }

        .quick-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .quick-feature-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.15s ease;
        }

        .quick-feature-chip:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .feature-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .launch-actions-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 6px;
        }

        .btn-launch-primary {
          padding: 13px 24px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #4f46e5 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 24px -6px rgba(16, 185, 129, 0.45);
          transition: all 0.18s ease;
        }

        .btn-launch-primary:hover {
          background: linear-gradient(135deg, #059669 0%, #4338ca 100%);
          box-shadow: 0 14px 28px -6px rgba(16, 185, 129, 0.55);
          transform: translateY(-1px);
        }

        .btn-arrow {
          transition: transform 0.15s ease;
        }

        .btn-launch-primary:hover .btn-arrow {
          transform: translateX(4px);
        }

        .btn-launch-secondary {
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .btn-launch-secondary:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #94a3b8;
        }

        /* RIGHT PANEL (Summary) */
        .summary-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.07),
                      0 1px 3px rgba(15, 23, 42, 0.03);
          padding: 30px 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
          box-sizing: border-box;
        }

        .summary-panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .summary-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .summary-title {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .summary-subtitle {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #64748b;
        }

        .summary-cards-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-item-card {
          padding: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .summary-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .item-title {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .item-badge {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.08);
          padding: 2px 8px;
          border-radius: 999px;
        }

        .item-badge.theme-badge {
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
        }

        .components-preview-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          max-height: 90px;
          overflow-y: auto;
        }

        .comp-mini-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 7px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          color: #334155;
        }

        .comp-more-pill {
          font-size: 10px;
          font-weight: 700;
          color: #64748b;
          padding: 3px 6px;
        }

        .item-desc {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.45;
        }

        .pro-tip-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(79, 70, 229, 0.04);
          border: 1px solid rgba(79, 70, 229, 0.14);
        }

        .tip-icon {
          color: #4f46e5;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .tip-text {
          font-size: 11px;
          color: #4338ca;
          line-height: 1.45;
        }

        kbd {
          font-family: inherit;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 1px 4px;
          font-size: 10px;
          color: #0f172a;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
        }

        /* RESPONSIVENESS */
        @media (max-width: 960px) {
          .thankyou-grid {
            grid-template-columns: 1fr;
            max-width: 580px;
            gap: 20px;
          }

          .thankyou-header {
            padding: 12px 16px;
          }

          .launch-panel, .summary-panel {
            padding: 24px 20px;
          }
        }

        @media (max-width: 480px) {
          .header-status-group .user-profile-badge {
            display: none;
          }

          .quick-features-grid {
            grid-template-columns: 1fr;
          }

          .launch-actions-row {
            flex-direction: column;
            width: 100%;
          }

          .btn-launch-primary, .btn-launch-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ThankYouTransition;
