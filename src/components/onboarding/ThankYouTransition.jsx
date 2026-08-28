import React from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PackageCheck,
  Zap,
  Layers,
} from "lucide-react";
import { ComponentRegistry } from "../../registry/componentRegistry";

export const ThankYouTransition = ({ user, foundation, onEnterDashboard, onBack }) => {
  const componentsCount = foundation?.components?.length || 14;

  return (
    <div className="thankyou-root">
      {/* Ambient Backdrop */}
      <div className="bg-glow">
        <div className="glow-blob blob-1" />
        <div className="glow-blob blob-2" />
        <div className="subtle-grid" />
      </div>

      {/* Main Card */}
      <div className="thankyou-wrapper">
        <div className="brand-header">
          <div className="brand-icon">
            <Layers size={20} />
          </div>
          <span className="brand-text">CampusCommerce Studio</span>
        </div>

        <div className="thankyou-card">
          <div className="celebration-badge">
            <CheckCircle2 size={36} className="check-animated" />
          </div>

          <div className="card-headings">
            <h1 className="title">Workspace Ready</h1>
            <p className="subtitle">
              Your {componentsCount} foundation components and themes are configured.
            </p>
          </div>

          {/* Minimal Widget Chips Preview */}
          <div className="components-preview-cloud">
            {(foundation?.components || []).slice(0, 8).map((c) => {
              const type = typeof c === "string" ? c : c.type;
              const def = ComponentRegistry[type];
              return (
                <span key={type} className="preview-chip">
                  <span>{def?.icon || "📦"}</span>
                  <span>{def?.label || type}</span>
                </span>
              );
            })}
            {componentsCount > 8 && (
              <span className="more-chip">+{componentsCount - 8} more</span>
            )}
          </div>

          {/* Actions */}
          <div className="action-row">
            <button
              type="button"
              onClick={onEnterDashboard}
              className="launch-button"
            >
              <Sparkles size={16} />
              <span>Open CMS Dashboard</span>
              <ArrowRight size={16} className="btn-arrow" />
            </button>

            {onBack && (
              <button type="button" onClick={onBack} className="back-btn">
                <ArrowLeft size={14} />
                <span>Reconfigure</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .thankyou-root {
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
          overflow: hidden;
        }

        .bg-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
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
          left: 20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(14, 165, 233, 0.05) 70%, transparent 100%);
        }

        .blob-2 {
          bottom: -15%;
          right: 20%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.22) 0%, rgba(168, 85, 247, 0.05) 70%, transparent 100%);
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

        .thankyou-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-text {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }

        .thankyou-card {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.03);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          box-sizing: border-box;
        }

        .celebration-badge {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px -4px rgba(16, 185, 129, 0.3);
        }

        .check-animated {
          animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-headings {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .subtitle {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        .components-preview-cloud {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
          max-width: 380px;
        }

        .preview-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #334155;
        }

        .more-chip {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          padding: 4px 6px;
        }

        .action-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-top: 4px;
        }

        .launch-button {
          height: 44px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #4f46e5 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.4);
          transition: all 0.18s ease;
        }

        .launch-button:hover {
          box-shadow: 0 12px 24px -4px rgba(16, 185, 129, 0.55);
          transform: translateY(-1px);
        }

        .launch-button:active {
          transform: translateY(0);
        }

        .btn-arrow {
          transition: transform 0.15s ease;
        }

        .launch-button:hover .btn-arrow {
          transform: translateX(4px);
        }

        .back-btn {
          height: 36px;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: color 0.15s ease;
        }

        .back-btn:hover {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default ThankYouTransition;
