import React from "react";
import {
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Blocks,
  Palette,
  LayoutDashboard,
  ShieldCheck,
  User,
  CheckCircle2,
  Cpu,
  ChevronRight,
  Compass,
} from "lucide-react";

export const WelcomeTransition = ({ user, onProceed, onBack }) => {
  const steps = [
    {
      step: "01",
      icon: Blocks,
      title: "Components Catalog",
      description: "Curate the exact UI widgets (Hero, Product Cards, Timers) for your workspace.",
      tag: "Toolbox Selection",
      color: "#4f46e5",
    },
    {
      step: "02",
      icon: Palette,
      title: "Theme Blueprints",
      description: "Pick curated visual presets or craft custom design tokens with live preview.",
      tag: "Design System",
      color: "#0ea5e9",
    },
    {
      step: "03",
      icon: LayoutDashboard,
      title: "Visual CMS Canvas",
      description: "Drag-and-drop hierarchy builder with instant multi-device rendering & JSON sync.",
      tag: "SDUI Studio",
      color: "#10b981",
    },
  ];

  const highlights = [
    "White Studio UI",
    "Interface-Driven CMS",
    "Dynamic Drag & Drop",
    "Theme Presets",
    "Instant JSON Sync",
  ];

  return (
    <div className="welcome-root">
      {/* Dynamic Ambient Background */}
      <div className="bg-decorations">
        <div className="glow-blob glow-blob-1" />
        <div className="glow-blob glow-blob-2" />
        <div className="grid-overlay" />
      </div>

      {/* Top Header / Navigation Bar */}
      <header className="welcome-header">
        <button type="button" onClick={onBack} className="back-nav-btn">
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>

        <div className="header-status-group">
          {user && (
            <div className="user-profile-badge">
              <div className="user-avatar">
                <User size={13} />
              </div>
              <div className="user-meta">
                <span className="user-name">{user.name || "Campus Architect"}</span>
                <span className="user-role">{user.role || "Frontend Engineer"}</span>
              </div>
            </div>
          )}

          <div className="env-badge">
            <span className="env-dot" />
            <span>SDUI Engine v2.4</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="welcome-main">
        <div className="welcome-grid">
          {/* LEFT PANEL: Orientation Hero */}
          <div className="hero-panel">
            <div className="panel-badge-row">
              <span className="studio-pill">
                <Sparkles size={13} className="sparkle-icon" />
                <span>CampusCommerce Studio</span>
              </span>
              <span className="step-pill">Phase 1 of 3: Setup</span>
            </div>

            <div className="hero-text-block">
              <h1 className="hero-title">
                Welcome to your <br />
                <span className="gradient-text">component studio.</span>
              </h1>
              <p className="hero-description">
                Start with a guided foundation: pick the components you need, choose a visual theme
                blueprint, and move into a clean CMS workspace built for drag-and-drop SDUI
                composition.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="tags-wrap">
              {highlights.map((item) => (
                <span key={item} className="feature-pill">
                  <CheckCircle2 size={13} className="pill-check" />
                  <span>{item}</span>
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="action-row">
              <button type="button" onClick={onProceed} className="primary-action-btn">
                <span>Choose your foundation</span>
                <ArrowRight size={16} className="action-arrow" />
              </button>

              <button type="button" onClick={onBack} className="secondary-action-btn">
                <ArrowLeft size={15} />
                <span>Switch Account</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Guided Roadmap Card */}
          <div className="roadmap-panel">
            <div className="roadmap-header">
              <div className="roadmap-icon-wrap">
                <Compass size={20} />
              </div>
              <div>
                <h3 className="roadmap-title">Foundation Onboarding Flow</h3>
                <p className="roadmap-sub">3 quick steps to initialize your journey environment</p>
              </div>
            </div>

            <div className="steps-list">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div key={idx} className="step-card">
                    <div className="step-num-badge" style={{ color: s.color }}>
                      {s.step}
                    </div>
                    <div className="step-icon-box" style={{ backgroundColor: `${s.color}14`, color: s.color }}>
                      <Icon size={18} />
                    </div>
                    <div className="step-content">
                      <div className="step-title-row">
                        <h4 className="step-title">{s.title}</h4>
                        <span className="step-tag">{s.tag}</span>
                      </div>
                      <p className="step-desc">{s.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Environment Info Footer */}
            <div className="roadmap-footer-card">
              <div className="footer-card-left">
                <ShieldCheck size={16} className="shield-icon" />
                <span>All settings can be customized or reconfigured later inside Journeys.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .welcome-root {
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
          filter: blur(110px);
          opacity: 0.4;
        }

        .glow-blob-1 {
          top: -12%;
          left: -8%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.22) 0%, rgba(99, 102, 241, 0.06) 70%, transparent 100%);
        }

        .glow-blob-2 {
          bottom: -10%;
          right: -6%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(16, 185, 129, 0.06) 70%, transparent 100%);
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
        .welcome-header {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          max-width: 1200px;
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
        .welcome-main {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px 32px 24px;
          box-sizing: border-box;
        }

        .welcome-grid {
          width: 100%;
          max-width: 1080px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 28px;
          align-items: stretch;
          animation: welcomeFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes welcomeFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* LEFT PANEL (Hero) */
        .hero-panel {
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

        .studio-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.16);
          color: #4338ca;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .sparkle-icon {
          color: #4f46e5;
        }

        .step-pill {
          padding: 4px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
        }

        .hero-text-block {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hero-title {
          margin: 0;
          font-size: clamp(30px, 3.8vw, 44px);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-description {
          margin: 0;
          font-size: 14px;
          color: #475569;
          line-height: 1.65;
          max-width: 52ch;
        }

        .tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .feature-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.15s ease;
        }

        .feature-pill:hover {
          background: #ffffff;
          border-color: #cbd5e1;
        }

        .pill-check {
          color: #4f46e5;
        }

        .action-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 6px;
        }

        .primary-action-btn {
          padding: 13px 22px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 10px 24px -6px rgba(79, 70, 229, 0.45);
          transition: all 0.18s ease;
        }

        .primary-action-btn:hover {
          background: linear-gradient(135deg, #4338ca 0%, #0284c7 100%);
          box-shadow: 0 14px 28px -6px rgba(79, 70, 229, 0.55);
          transform: translateY(-1px);
        }

        .primary-action-btn:active {
          transform: translateY(0);
        }

        .action-arrow {
          transition: transform 0.15s ease;
        }

        .primary-action-btn:hover .action-arrow {
          transform: translateX(3px);
        }

        .secondary-action-btn {
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

        .secondary-action-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #94a3b8;
        }

        /* RIGHT PANEL (Roadmap) */
        .roadmap-panel {
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

        .roadmap-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .roadmap-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(79, 70, 229, 0.08);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .roadmap-title {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .roadmap-sub {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #64748b;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
          position: relative;
        }

        .step-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
          transform: translateY(-1px);
        }

        .step-num-badge {
          font-size: 11px;
          font-weight: 800;
          font-family: monospace;
          letter-spacing: -0.05em;
          padding-top: 2px;
        }

        .step-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .step-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .step-title {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .step-tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .step-desc {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.45;
        }

        .roadmap-footer-card {
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.04);
          border: 1px solid rgba(79, 70, 229, 0.12);
        }

        .footer-card-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #4f46e5;
          font-weight: 500;
          line-height: 1.4;
        }

        .shield-icon {
          flex-shrink: 0;
        }

        /* RESPONSIVENESS */
        @media (max-width: 960px) {
          .welcome-grid {
            grid-template-columns: 1fr;
            max-width: 580px;
            gap: 20px;
          }

          .welcome-header {
            padding: 12px 16px;
          }

          .hero-panel, .roadmap-panel {
            padding: 24px 20px;
          }
        }

        @media (max-width: 480px) {
          .header-status-group .user-profile-badge {
            display: none;
          }

          .action-row {
            flex-direction: column;
            width: 100%;
          }

          .primary-action-btn, .secondary-action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeTransition;
