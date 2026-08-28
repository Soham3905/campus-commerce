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
  Loader2,
} from "lucide-react";

export const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("admin@campuscommerce.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberWorkspace, setRememberWorkspace] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email,
        name: email.split("@")[0] || "Admin",
        role: "Workspace Owner",
      });
    }, 350);
  };

  return (
    <div className="login-root">
      {/* Ambient Backdrop */}
      <div className="bg-glow">
        <div className="glow-blob blob-1" />
        <div className="glow-blob blob-2" />
        <div className="subtle-grid" />
      </div>

      <div className="login-card-wrapper">
        {/* Brand Logo & Header */}
        <div className="login-brand-header">
          <div className="brand-icon-box">
            <Layers size={22} className="brand-logo" />
            <Sparkles size={13} className="brand-sparkle" />
          </div>
          <div className="brand-text">
            <div className="brand-title-wrap">
              <h1 className="brand-title">CampusCommerce</h1>
              <span className="brand-badge">STUDIO</span>
            </div>
            <p className="brand-subtitle">Server-Driven UI Platform</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="login-card">
          <div className="card-top">
            <h2 className="card-heading">Welcome Back</h2>
            <p className="card-subheading">Sign in to access your visual store editor and widgets</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label className="field-label" htmlFor="workspace-email">
                Institutional Email
              </label>
              <div className="input-box">
                <Mail size={16} className="input-icon" />
                <input
                  id="workspace-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@campuscommerce.edu"
                  className="text-input"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="workspace-password">
                Password
              </label>
              <div className="input-box">
                <Lock size={16} className="input-icon" />
                <input
                  id="workspace-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="text-input has-toggle"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pw-toggle-btn"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="form-footer-row">
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={rememberWorkspace}
                  onChange={(e) => setRememberWorkspace(e.target.checked)}
                  className="styled-checkbox"
                />
                <span className="checkbox-text">Remember this device</span>
              </label>
              <span className="sandbox-badge">
                <ShieldCheck size={13} />
                <span>Secure Access</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? "loading" : ""}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={17} className="btn-spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight size={16} className="btn-arrow" />
                </>
              )}
            </button>
          </form>
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
          padding: 24px 16px;
          box-sizing: border-box;
          overflow-x: hidden;
          overflow-y: auto;
        }

        .bg-glow {
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

        .blob-1 {
          top: -15%;
          left: 15%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%);
        }

        .blob-2 {
          bottom: -15%;
          right: 15%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(168, 85, 247, 0.05) 70%, transparent 100%);
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

        .login-card-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon-box {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px -4px rgba(79, 70, 229, 0.35);
        }

        .brand-logo {
          color: #ffffff;
        }

        .brand-sparkle {
          position: absolute;
          top: -2px;
          right: -2px;
          color: #38bdf8;
          filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.8));
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-title {
          margin: 0;
          font-size: 19px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .brand-badge {
          font-size: 10px;
          font-weight: 800;
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.2);
          padding: 2px 6px;
          border-radius: 6px;
          letter-spacing: 0.04em;
        }

        .brand-subtitle {
          margin: 1px 0 0 0;
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .login-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.08),
                      0 1px 3px rgba(15, 23, 42, 0.03);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          box-sizing: border-box;
        }

        .card-top {
          display: flex;
          flex-direction: column;
          gap: 5px;
          text-align: center;
        }

        .card-heading {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .card-subheading {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .input-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          color: #94a3b8;
          pointer-events: none;
        }

        .text-input {
          width: 100%;
          height: 42px;
          padding: 0 12px 0 38px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 13px;
          color: #0f172a;
          outline: none;
          transition: all 0.15s ease;
        }

        .text-input.has-toggle {
          padding-right: 38px;
        }

        .text-input:focus {
          background: #ffffff;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }

        .pw-toggle-btn {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease;
        }

        .pw-toggle-btn:hover {
          color: #475569;
        }

        .form-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2px;
        }

        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .styled-checkbox {
          width: 14px;
          height: 14px;
          accent-color: #4f46e5;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        .sandbox-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #059669;
          background: rgba(16, 185, 129, 0.08);
          padding: 2px 8px;
          border-radius: 999px;
        }

        .submit-button {
          margin-top: 6px;
          height: 44px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.4);
          transition: all 0.18s ease;
        }

        .submit-button:hover:not(:disabled) {
          box-shadow: 0 12px 24px -4px rgba(79, 70, 229, 0.55);
          transform: translateY(-1px);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button.loading {
          opacity: 0.85;
          cursor: wait;
        }

        .btn-spinner {
          animation: spin 0.8s linear infinite;
        }

        .btn-arrow {
          transition: transform 0.15s ease;
        }

        .submit-button:hover .btn-arrow {
          transform: translateX(3px);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
