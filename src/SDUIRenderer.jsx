import React, { useState } from "react";
import { SDUIRenderer as Renderer } from "./sdui/SDUIRenderer";
import { ContextMenu } from "./sdui/components/overlays/ContextMenu";
import { BottomSheet } from "./sdui/components/overlays/BottomSheet";
import { ImagePreviewModal } from "./sdui/components/overlays/ImagePreviewModal";
import { executeOptionAction } from "./sdui/actions/actionExecutor";
import { IFrameDeviceFrame } from "./cms/components/canvas/IFrameDeviceFrame";
import { fullPageJSON } from "./landingSchema";

const createDummyPage = (titleText, routeName) => {
  // Deep clone the NavBar so we can modify it without breaking the original
  const navBar = JSON.parse(JSON.stringify(fullPageJSON.children[1] || {}));

  if (navBar.data && navBar.data.items) {
    navBar.data.items.forEach((item) => {
      if (item.actions?.onTap?.route === routeName) {
        item.isActive = "true";
      } else {
        item.isActive = "false";
      }
    });
  }

  return {
    type: "Home",
    children: [
      {
        type: "Page",
        children: [
          {
            type: "Title",
            placement: {
              mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 5 },
              tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 5 },
              desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 5 },
            },
            data: { text: titleText },
          },
        ],
      },
      navBar,
    ],
  };
};

const PageRoutes = {
  home: fullPageJSON,
  categories: createDummyPage("Categories Page 🗂️", "categories"),
  cart: createDummyPage("Cart Page 🛒", "cart"),
  account: createDummyPage("Account Page 👤", "account"),
};

const pageChildren = fullPageJSON?.children?.[0]?.children || [];

const TEMPLATES = {
  "Full Page": fullPageJSON,
  Header: pageChildren[0],
  "Search Bar": pageChildren[1],
  StoryRow: pageChildren[2],
  "Category Grid": pageChildren[3],
  "Carousel Only": pageChildren[4],
  HeroBanner: pageChildren[5],
  CouponCode: pageChildren[6],
  CountDownTimer: pageChildren[7],
  "Product List": pageChildren[8],
  "Product Grid": pageChildren[9],
  Footer: pageChildren[10],
  Navbar: fullPageJSON?.children?.[1],
};

const DeviceButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 16px",
      background: active
        ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
        : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.6)",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    {label}
  </button>
);

export default function SDUIRenderer() {
  const [activeTab, setActiveTab] = useState("Full Page");
  const [jsonText, setJsonText] = useState(
    JSON.stringify(TEMPLATES["Full Page"], null, 2)
  );
  const [schema, setSchema] = useState(TEMPLATES["Full Page"]);
  const [deviceView, setDeviceView] = useState("desktop");
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(null);
  const [sheetData, setSheetData] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const handleNavigate = (route) => {
    console.log(`Navigating to: ${route}`);
    const newPageSchema = PageRoutes[route];

    if (newPageSchema) {
      setSchema(newPageSchema);
      setJsonText(JSON.stringify(newPageSchema, null, 2));
    }
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setSchema(parsed);
      setError("");
    } catch (err) {
      setError("Sorry, We cannot handle it..");
    }
  };

  const loadTemplate = (tabName) => {
    setActiveTab(tabName);
    const newJson = TEMPLATES[tabName];
    setJsonText(JSON.stringify(newJson, null, 2));
    setSchema(newJson);
    setError("");
  };

  const getPreviewWidth = () => {
    if (deviceView === "mobile") return "375px";
    if (deviceView === "tablet") return "768px";
    return "100%";
  };

  const getPreviewHeight = () => {
    if (deviceView === "mobile") return "100%";
    if (deviceView === "tablet") return "100%";
    return "100%";
  };

  const closeMenu = () => setMenu(null);
  const closeSheet = () => setSheetData(null);
  const closeImageModal = () => setImageModal(null);

  const handleOptionSelect = async (option) => {
    try {
      const action = option.action || {};

      if (action.type === "OPEN_BOTTOM_SHEET") {
        closeMenu();
        closeImageModal();
        setSheetData({
          title: action.data?.title,
          options: action.data?.options || [],
        });
        return;
      }

      if (action.type === "SHOW_IMAGE_MODAL" || action.type === "SHOW_IMAGE_PREVIEW") {
        closeMenu();
        closeSheet();
        setImageModal({
          imageUrl: action.data?.imageUrl,
        });
        return;
      }

      await executeOptionAction(option);
      closeMenu();
      closeSheet();
      closeImageModal();
    } catch (err) {
      setError(err.message || "Action failed");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* -- LEFT PANEL: JSON EDITOR -- */}
      {isSidebarOpen && (
        <div
          style={{
            width: "22%",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #2a2a35",
            background: "#13131f",
          }}
        >
          {/* Editor Header */}
          <div
            style={{
              padding: "12px 16px",
              background: "#1a1a24",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #2a2a35",
            }}
          >
            <h3 style={{ fontSize: "14px", color: "#cdd6f4", margin: 0 }}>⚙️ SDUI Studio</h3>
            <button
              onClick={handleApplyJson}
              style={{
                padding: "6px 16px",
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              Apply Changes
            </button>
          </div>

          {/* NAVIGATION TABS */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px",
              background: "#1e1e2e",
              borderBottom: "1px solid #2a2a35",
              overflowX: "auto",
            }}
          >
            {Object.keys(TEMPLATES).map((tab) => (
              <button
                key={tab}
                onClick={() => loadTemplate(tab)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: activeTab === tab ? "#4f46e5" : "transparent",
                  color: activeTab === tab ? "#fff" : "#a6accd",
                  border: activeTab === tab ? "none" : "1px solid #444",
                  borderRadius: "16px",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                background: "rgba(220,38,38,0.15)",
                borderLeft: "3px solid #dc2626",
                color: "#fca5a5",
                padding: "10px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {/* Text Area */}
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              color: "#89dceb",
              fontSize: "12px",
              fontFamily: "monospace",
              border: "none",
              outline: "none",
              resize: "none",
            }}
          />
        </div>
      )}

      {/* -- RIGHT PANEL: DEVICE PREVIEWER -- */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "radial-gradient(circle at center, #1f1f33 0%, #0f0f1a 100%)",
        }}
      >
        {/* Navigation Bar */}
        <div
          style={{
            padding: "12px 24px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ☰
            </button>
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "bold",
              }}
            >
              Preview Area
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: "6px",
              background: "rgba(0,0,0,0.2)",
              padding: "4px",
              borderRadius: "10px",
            }}
          >
            <DeviceButton
              label="📱 Mobile"
              active={deviceView === "mobile"}
              onClick={() => setDeviceView("mobile")}
            />
            <DeviceButton
              label="📟 Tablet"
              active={deviceView === "tablet"}
              onClick={() => setDeviceView("tablet")}
            />
            <DeviceButton
              label="💻 Desktop"
              active={deviceView === "desktop"}
              onClick={() => setDeviceView("desktop")}
            />
          </div>
        </div>

        {/* Simulated Device Canvas with IFrame Portal */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            overflowY: "auto",
          }}
        >
          <IFrameDeviceFrame device={deviceView}>
            <Renderer
              schema={schema}
              deviceType={deviceView}
              openMenu={setMenu}
              openSheet={setSheetData}
              openImageModal={setImageModal}
              onNavigate={handleNavigate}
            />
            <ContextMenu
              data={menu}
              onClose={closeMenu}
              onSelect={handleOptionSelect}
            />
            <BottomSheet
              isOpen={!!sheetData}
              data={sheetData}
              onClose={closeSheet}
              onSelect={handleOptionSelect}
            />
            <ImagePreviewModal
              data={imageModal}
              onClose={closeImageModal}
              onSelect={handleOptionSelect}
            />
          </IFrameDeviceFrame>
        </div>
      </div>
    </div>
  );
}
