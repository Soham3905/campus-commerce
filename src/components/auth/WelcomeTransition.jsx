import React from "react";
import { Sparkles, ArrowRight, ArrowLeft, Layers } from "lucide-react";

export const WelcomeTransition = ({ user, onProceed, onBack }) => {
  return (
    <div className="welcome-root">
      <div className="bg-glow">
        <div className="glow-blob blob-1" />
        <div className="glow-blob blob-2" />
      </div>

      <div className="welcome-card-wrapper">
        <div className="welcome-card">
          <div className="icon-badge">
            <Layers size={28} />
          </div>

          <div className="content">
            <h1 className="title">Welcome, {user?.name || "Architect"}</h1>
            <p className="subtitle">
              Configure your component foundation and visual themes in 3 simple steps.
            </p>
          </div>

          <div className="actions">
            <button type="button" onClick={onProceed} className="primary-btn">
              <span>Start Setup</span>
              <ArrowRight size={16} />
            </button>
            <button type="button" onClick={onBack} className="secondary-btn">
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .welcome-root {
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
        }

        .bg-glow {
          position: fixed;
          inset: 0;
          pointer-events: none;
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

        .welcome-card-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .welcome-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(15, 23, 42, 0.03);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
        }

        .icon-badge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px -4px rgba(79, 70, 229, 0.35);
        }

        .content {
          display: flex;
          flex-direction: column;
          gap: 6px;
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
          line-height: 1.45;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .primary-btn {
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

        .primary-btn:hover {
          box-shadow: 0 12px 24px -4px rgba(79, 70, 229, 0.55);
          transform: translateY(-1px);
        }

        .secondary-btn {
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
        }

        .secondary-btn:hover {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default WelcomeTransition;
