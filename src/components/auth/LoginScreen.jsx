import React, { useState } from "react";

export const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("admin@campuscommerce.edu");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        email,
        name: "Campus Lead Architect",
        role: "Frontend Engineer / System Designer",
      });
    }, 450);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "54px",
              height: "54px",
              borderRadius: "14px",
              backgroundColor: "rgba(79, 70, 229, 0.08)",
              color: "#4f46e5",
              fontSize: "26px",
              marginBottom: "12px",
            }}
          >
            🎓
          </div>
          <h1
            style={{
              margin: "0 0 6px 0",
              fontSize: "22px",
              fontWeight: "700",
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            CampusCommerce SDUI
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Server-Driven UI Component Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Workspace Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                color: "#0f172a",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              placeholder="you@campuscommerce.edu"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                fontSize: "14px",
                color: "#0f172a",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: "8px",
              padding: "11px 16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: isLoading ? "wait" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
              transition: "background-color 0.15s ease",
            }}
          >
            {isLoading ? "Authenticating..." : "Enter CampusCommerce →"}
          </button>
        </form>

        <div
          style={{
            borderTop: "1px solid #f1f5f9",
            paddingTop: "16px",
            textAlign: "center",
            fontSize: "11px",
            color: "#94a3b8",
          }}
        >
          Secure Local SDUI Management Workspace
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
