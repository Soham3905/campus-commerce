import { useState } from "react";
import SDUIRenderer from "./SDUIRenderer";
import HeaderPlayground from "./sdui/HeaderPlayground";
import ProductCardPlayground from "./sdui/ProductCardPlayground";

export default function Dashboard({ onLogout }) {
  // Active tab state: 'header-lab' | 'product-lab' | 'studio'
  const [currentTab, setCurrentTab] = useState("product-lab");

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      {/* Top Navbar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          backgroundColor: "#131b2e",
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Brand & Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "16px", fontWeight: "700" }}>
            Campus <span style={{ color: "#818cf8" }}>Commerce</span>
          </span>

          {/* Navigation Buttons */}
          <div style={{ display: "flex", gap: "6px", backgroundColor: "#0b0f19", padding: "4px", borderRadius: "8px" }}>
            <button
              onClick={() => setCurrentTab("header-lab")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: currentTab === "header-lab" ? "#4f46e5" : "transparent",
                color: currentTab === "header-lab" ? "#ffffff" : "#94a3b8"
              }}
            >
              Phase 1: Header Lab
            </button>

            <button
              onClick={() => setCurrentTab("product-lab")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: currentTab === "product-lab" ? "#4f46e5" : "transparent",
                color: currentTab === "product-lab" ? "#ffffff" : "#94a3b8"
              }}
            >
              Phase 2: ProductCard Lab
            </button>

            <button
              onClick={() => setCurrentTab("studio")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                backgroundColor: currentTab === "studio" ? "#4f46e5" : "transparent",
                color: currentTab === "studio" ? "#ffffff" : "#94a3b8"
              }}
            >
              Full Landing Page
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: "600",
              color: "#f87171",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {currentTab === "header-lab" && <HeaderPlayground />}
        {currentTab === "product-lab" && <ProductCardPlayground />}
        {currentTab === "studio" && <SDUIRenderer />}
      </main>
    </div>
  );
}
