import React, { useState } from "react";
import {
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Cpu,
  Palette,
  GitBranch,
  CheckCircle2,
  Loader2,
  Activity,
} from "lucide-react";

const DEMO_PROFILES = [
  {
    id: "architect",
    name: "Ayush Kumbhare",
    role: "Lead Systems Architect",
    email: "admin@campuscommerce.edu",
    badge: "Full Access",
    color: "#4f46e5",
  },
  {
    id: "designer",
    name: "Soham Dhakate",
    role: "Design Systems Lead",
    email: "designer@campuscommerce.edu",
    badge: "Theme Specialist",
    color: "#0ea5e9",
  },
  {
    id: "growth",
    name: "Marcus Reed",
    role: "Journey & Growth Manager",
    email: "growth@campuscommerce.edu",
    badge: "Campaigns",
    color: "#10b981",
  },
];

const CAPABILITIES = [
  {
    icon: Cpu,
    title: "Zero-Code SDUI Engine",
    desc: "Real-time canvas with drag-and-drop component orchestration & instant JSON preview.",
  },
  {
    icon: Palette,
    title: "Dynamic Theme Blueprints",
    desc: "Curated component styling tokens, custom palettes, and live visual rendering.",
  },
  {
    icon: GitBranch,
    title: "Branching Journey Studio",
    desc: "Multi-variant campus campaigns, seasonal rush flows, and audience routing.",
  },
];

export const LoginScreen = ({ onLoginSuccess }) => {
  const [selectedProfile, setSelectedProfile] = useState(DEMO_PROFILES[0]);
  const [email, setEmail] = useState(DEMO_PROFILES[0].email);
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkspace, setRememberWorkspace] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setEmail(profile.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email,
        name: selectedProfile?.name || "Campus Architect",
        role: selectedProfile?.role || "Frontend Engineer / System Designer",
      });
    }, 450);
  };

  return (
    <div className="login-root">
      {/* Dynamic Background Gradients & Grid */}
      <div className="bg-decorations">
        <div className="glow-blob glow-blob-1" />
        <div className="glow-blob glow-blob-2" />
        <div className="grid-overlay" />
      </div>

      <div className="login-container">
        {/* LEFT COLUMN: Platform Showcase & Value Props (Desktop/Tablet) */}
        <div className="hero-column">
          {/* Brand Header */}
          <div className="brand-header">
            <div className="brand-logo-wrapper">
              <div className="brand-logo-icon">
                <Layers className="icon-primary" />
                <Sparkles className="icon-sparkle" />
              </div>
            </div>
            <div>
              <div className="brand-title-row">
                <span className="brand-name">CampusCommerce</span>
                <span className="badge-pill">SDUI Studio</span>
              </div>
              <p className="brand-tagline">Enterprise Server-Driven UI Platform</p>
            </div>
          </div>

          {/* Hero Pitch */}
          <div className="hero-pitch">
            <div className="status-badge">
              <span className="status-dot">
                <span className="status-pulse" />
              </span>
              <span className="status-text">v2.4 Engine Active • Zero Rebuild Deploys</span>
            </div>
            <h1 className="hero-heading">
              Orchestrate campus shopping experiences in{" "}
              <span className="gradient-text">real-time.</span>
            </h1>
            <p className="hero-subtext">
              Design, test, and publish dynamic mobile & web component layouts directly from a
              centralized SDUI studio without App Store release cycles.
            </p>
          </div>

          {/* Core Capabilities List */}
          <div className="capabilities-grid">
            {CAPABILITIES.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="capability-card">
                  <div className="capability-icon-wrap">
                    <Icon size={18} />
                  </div>
                  <div className="capability-info">
                    <h4 className="capability-title">{cap.title}</h4>
                    <p className="capability-desc">{cap.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Metrics / Ticker */}
          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-val">14+</span>
              <span className="metric-lbl">SDUI Widgets</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">&lt; 12ms</span>
              <span className="metric-lbl">Schema Sync</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">100%</span>
              <span className="metric-lbl">Live Tree Sync</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication & Quick Demo Selector */}
        <div className="auth-column">
          <div className="auth-card">
            <div className="auth-card-header">
              <div className="mobile-brand-row">
                <div className="mobile-brand-icon">
                  <Layers size={20} color="#4f46e5" />
                </div>
                <div>
                  <div className="mobile-brand-title">CampusCommerce SDUI</div>
                  <div className="mobile-brand-sub">Component Management System</div>
                </div>
              </div>

              <h2 className="auth-title">Workspace Sign In</h2>
              <p className="auth-subtitle">
                Select a demo role or enter your institutional credentials
              </p>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="quick-roles-section">
              <label className="section-label">
                <span>Quick Demo Profiles</span>
                <span className="label-hint">1-click fill</span>
              </label>
              <div className="roles-grid">
                {DEMO_PROFILES.map((p) => {
                  const isSelected = selectedProfile.id === p.id && email === p.email;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProfileSelect(p)}
                      className={`role-chip ${isSelected ? "active" : ""}`}
                    >
                      <div className="role-chip-top">
                        <span className="role-chip-name">{p.name}</span>
                        {isSelected && <CheckCircle2 size={14} className="check-icon" />}
                      </div>
                      <span className="role-chip-role">{p.role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field-group">
                <label className="field-label" htmlFor="workspace-email">
                  Institutional Email
                </label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="workspace-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                    placeholder="name@campuscommerce.edu"
                    className="styled-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <div className="field-label-row">
                  <label className="field-label" htmlFor="workspace-password">
                    Password / Access Key
                  </label>
                  <span className="helper-text">Demo mode enabled</span>
                </div>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="workspace-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="styled-input with-action"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-btn"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-options-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberWorkspace}
                    onChange={(e) => setRememberWorkspace(e.target.checked)}
                    className="styled-checkbox"
                  />
                  <span>Keep workspace active</span>
                </label>
                <span className="sandbox-tag">
                  <ShieldCheck size={13} />
                  <span>Sandbox Verified</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`submit-btn ${isLoading ? "loading" : ""}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Accessing SDUI Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Component Studio</span>
                    <ArrowRight size={16} className="arrow-icon" />
                  </>
                )}
              </button>
            </form>

            <div className="auth-card-footer">
              <div className="footer-status-pill">
                <Activity size={12} className="pulse-icon" />
                <span>Local Mock Server Active &bull; Port 5173</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-root {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 24px 16px;
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
          filter: blur(100px);
          opacity: 0.45;
        }

        .glow-blob-1 {
          top: -10%;
          left: -5%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.22) 0%, rgba(99, 102, 241, 0.08) 70%, transparent 100%);
        }

        .glow-blob-2 {
          bottom: -10%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(168, 85, 247, 0.08) 70%, transparent 100%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(226, 232, 240, 0.4) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(226, 232, 240, 0.4) 1px, transparent 1px);
          background-size: 36px 36px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }

        /* Main Container */
        .login-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 32px;
          align-items: center;
          animation: loginFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes loginFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* HERO COLUMN (Left) */
        .hero-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding: 12px 16px;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-logo-wrapper {
          position: relative;
        }

        .brand-logo-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.35);
          position: relative;
        }

        .icon-primary {
          color: #ffffff;
          width: 24px;
          height: 24px;
        }

        .icon-sparkle {
          position: absolute;
          top: -3px;
          right: -3px;
          color: #38bdf8;
          width: 14px;
          height: 14px;
          filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.8));
        }

        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .badge-pill {
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.16);
          color: #4f46e5;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .brand-tagline {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        /* Hero Pitch */
        .hero-pitch {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          border-radius: 999px;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          width: fit-content;
        }

        .status-dot {
          position: relative;
          display: flex;
          width: 8px;
          height: 8px;
        }

        .status-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background-color: #10b981;
          animation: pulsePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes pulsePing {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .status-dot::after {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
        }

        .status-text {
          font-size: 11px;
          font-weight: 600;
          color: #334155;
        }

        .hero-heading {
          margin: 0;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .gradient-text {
          background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtext {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: #475569;
          max-width: 52ch;
        }

        /* Capabilities List */
        .capabilities-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .capability-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .capability-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateX(4px);
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.05);
        }

        .capability-icon-wrap {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(79, 70, 229, 0.08);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .capability-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .capability-title {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .capability-desc {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.45;
        }

        /* Hero Metrics Bar */
        .hero-metrics {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 12px 16px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          width: fit-content;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .metric-item {
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.01em;
        }

        .metric-lbl {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        .metric-divider {
          width: 1px;
          height: 24px;
          background-color: #e2e8f0;
        }

        /* AUTH CARD (Right Column) */
        .auth-column {
          display: flex;
          justify-content: center;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08),
                      0 1px 3px rgba(15, 23, 42, 0.04);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-sizing: border-box;
        }

        .mobile-brand-row {
          display: none;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .mobile-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-brand-title {
          font-size: 16px;
          font-weight: 800;
          color: #0f172a;
        }

        .mobile-brand-sub {
          font-size: 11px;
          color: #64748b;
        }

        .auth-card-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .auth-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .auth-subtitle {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Quick Roles */
        .quick-roles-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #475569;
        }

        .label-hint {
          font-weight: 600;
          text-transform: none;
          color: #4f46e5;
          font-size: 11px;
        }

        .roles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .role-chip {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }

        .role-chip:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        }

        .role-chip.active {
          background: rgba(79, 70, 229, 0.06);
          border-color: #4f46e5;
          box-shadow: 0 0 0 1px #4f46e5;
        }

        .role-chip-top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .role-chip-name {
          font-size: 11px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .check-icon {
          color: #4f46e5;
          flex-shrink: 0;
        }

        .role-chip-role {
          font-size: 10px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .helper-text {
          font-size: 11px;
          color: #94a3b8;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.15s ease;
        }

        .styled-input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 13px;
          color: #0f172a;
          font-family: inherit;
          outline: none;
          transition: all 0.15s ease;
          box-sizing: border-box;
        }

        .styled-input.with-action {
          padding-right: 36px;
        }

        .styled-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }

        .input-wrapper:focus-within .input-icon {
          color: #4f46e5;
        }

        .toggle-password-btn {
          position: absolute;
          right: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 6px;
          transition: color 0.15s ease;
        }

        .toggle-password-btn:hover {
          color: #334155;
        }

        /* Checkbox & Options */
        .auth-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #475569;
          cursor: pointer;
          user-select: none;
          font-size: 12px;
        }

        .styled-checkbox {
          accent-color: #4f46e5;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        .sandbox-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #10b981;
          font-weight: 600;
          font-size: 11px;
        }

        /* Submit Button */
        .submit-btn {
          margin-top: 4px;
          padding: 12px 18px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 6px 16px -4px rgba(79, 70, 229, 0.4);
          transition: all 0.18s ease;
        }

        .submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
          box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.5);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.85;
          cursor: wait;
        }

        .spinner {
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .arrow-icon {
          transition: transform 0.15s ease;
        }

        .submit-btn:hover:not(:disabled) .arrow-icon {
          transform: translateX(3px);
        }

        /* Footer */
        .auth-card-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
          display: flex;
          justify-content: center;
        }

        .footer-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #64748b;
        }

        .pulse-icon {
          color: #10b981;
        }

        /* RESPONSIVENESS */
        @media (max-width: 960px) {
          .login-container {
            grid-template-columns: 1fr;
            max-width: 520px;
            gap: 20px;
          }

          .hero-column {
            display: none;
          }

          .mobile-brand-row {
            display: flex;
          }

          .auth-card {
            max-width: 100%;
            padding: 24px 20px;
          }
        }

        @media (max-width: 480px) {
          .login-root {
            padding: 12px 10px;
          }

          .roles-grid {
            grid-template-columns: 1fr;
          }

          .auth-options-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
