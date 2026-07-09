import React, { useEffect, useState } from "react";
import { fullPageJSON } from "./landingSchema";

const TEMPLATES = {
  "Full Page": fullPageJSON,
  "Carousel Only": fullPageJSON.children[0],
  "Product List": fullPageJSON.children[1],
};

export default function SDUIRenderer() {
  const [activeTab, setActiveTab] = useState("Full Page");
  const [jsonText, setJsonText] = useState(JSON.stringify(TEMPLATES["Full Page"], null, 2));
  const [schema, setSchema] = useState(TEMPLATES["Full Page"]);
  const [deviceView, setDeviceView] = useState("desktop");
  const [error, setError] = useState("");

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setSchema(parsed);
      setError("");
    } catch (err) {
      setError("Sorry, We cannot handle it..");
    }
  }

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
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#1e1e1e", color: "#fff", fontFamily: "sans-serif" }}>

      {/* -- LEFT PANEL: JSON EDITOR -- */}
      <div style={{ width: "25%", display: "flex", flexDirection: "column", borderRight: "1px solid #2a2a35", background: "#13131f" }}>

        {/* Editor Header */}
        <div style={{ padding: "12px 16px", background: "#1a1a24", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a2a35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
            <h3 style={{ margin: "0 0 0 8px", fontSize: "14px", color: "#cdd6f4" }}>⚙️ SDUI Studio</h3>
          </div>
          <button
            onClick={handleApplyJson}
            style={{ padding: "6px 16px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", boxShadow: "0 2px 8px rgba(124,58,237,0.4)" }}
          >
            Apply Changes
          </button>
        </div>

        {/*NAVIGATION TABS */}
        <div style={{ display: "flex", gap: "8px", padding: "12px", background: "#1e1e2e", borderBottom: "1px solid #2a2a35", overflowX: "auto" }}>
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
                whiteSpace: "nowrap"
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "rgba(220,38,38,0.15)", borderLeft: "3px solid #dc2626", color: "#fca5a5", padding: "10px", fontSize: "13px" }}>{error}</div>}

        {/* Text Area */}
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          spellCheck={false}
          style={{ flex: 1, padding: "16px", background: "transparent", color: "#89dceb", fontSize: "13px", fontFamily: "monospace", border: "none", outline: "none", resize: "none", lineHeight: "1.6" }}
        />
      </div>

      {/* -- RIGHT PANEL: DEVICE PREVIEWER -- */}
      <div style={{ width: "75%", display: "flex", flexDirection: "column", background: "radial-gradient(circle at center, #1f1f33 0%, #0f0f1a 100%)" }}>

        {/* Navigation Bar */}
        <div style={{ padding: "12px 24px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold" }}>Preview Area</span>
          <div style={{ display: "flex", gap: "6px", background: "rgba(0,0,0,0.2)", padding: "4px", borderRadius: "10px" }}>
            <DeviceButton label="📱 Mobile" active={deviceView === "mobile"} onClick={() => setDeviceView("mobile")} />
            <DeviceButton label="📟 Tablet" active={deviceView === "tablet"} onClick={() => setDeviceView("tablet")} />
            <DeviceButton label="💻 Desktop" active={deviceView === "desktop"} onClick={() => setDeviceView("desktop")} />
          </div>
        </div>

        {/* Simulated Device Canvas */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "30px", overflowY: "auto" }}>
          <div style={{
            width: getPreviewWidth(),
            height: "95%",
            backgroundColor: "#f3f3f3",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            border: deviceView === "desktop" ? "1px solid #ddd" : "12px solid #1c1c1e",
            borderRadius: deviceView === "mobile" ? "40px" : deviceView === "tablet" ? "24px" : "8px",
            boxShadow: deviceView === "desktop" ? "0 10px 40px rgba(0,0,0,0.3)" : "0 30px 60px rgba(0,0,0,0.6)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden"
          }}>
            {/* Simulated Phone Notch */}
            {deviceView === "mobile" && (
              <div style={{ width: "120px", height: "24px", background: "#1c1c1e", borderRadius: "0 0 16px 16px", alignSelf: "center", position: "absolute", top: 0, zIndex: 10 }} />
            )}
            {/* Screen Content Container */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: deviceView === "mobile" ? "30px" : "0px", backgroundColor: "#f3f3f3" }}>
              <Renderer schema={schema} deviceType={deviceView} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DeviceButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 16px",
      background: active ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.6)",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
      transition: "all 0.2s ease"
    }}
  >
    {label}
  </button>
);

const Page = ({ children }) => (
  <div style={{
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(100, 1fr)",
    gridTemplateRows: "repeat(100, 10px)",
    gap: "0px",
    padding: "16px",
    boxSizing: "border-box",
  }}>
    {children}
  </div>
);

const ProductList = ({ children, style }) => (
  <div style={{ display: "flex", overflowX: "auto", gap: "16px", padding: "8px", width: "100%", scrollBehavior: "smooth", ...style }}>
    {React.Children.map(children, (child) => (
      <div style={{ width: "260px", flexShrink: 0, display: "flex" }}>
        {child}
      </div>
    ))}
  </div>
);

const Carousel = ({ data, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data.autoPlay || !children) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === children.length - 1) return data.infiniteLoop ? 0 : prevIndex;
        return prevIndex + 1;
      });
    }, data.autoPLayInterval || 3000);
    return () => clearInterval(interval);
  }, [data.autoPlay, data.autoPLayInterval, data.infiniteLoop, children]);

  if (!children) return null;

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)", transform: `translateX(-${currentIndex * 100}%)` }}>
        {React.Children.map(children, (child) => (
          <div style={{ minWidth: "100%", flexShrink: 0 }}>{child}</div>
        ))}
      </div>
      {data.showDots && (
        <div style={{ position: "absolute", bottom: "12px", width: "100%", display: "flex", justifyContent: "center", gap: "8px" }}>
          {children.map((_, idx) => (
            <div key={idx} onClick={() => setCurrentIndex(idx)} style={{
              width: currentIndex === idx ? "20px" : "8px", height: "8px", borderRadius: "4px",
              backgroundColor: currentIndex === idx ? "#000000" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "width 0.3s ease"
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

const ProductCard = ({ children, style }) => (
  <div
    style={{
      border: "1px solid #e8e8e8", padding: "16px", borderRadius: "16px", backgroundColor: "#fff",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "all 0.2s ease", display: "flex", flexDirection: "column", gap: "4px", ...style
    }}
  >
    {children}
  </div>
);

const ProductImage = ({ data, style }) => (
  <div style={{ width: "100%", backgroundColor: "#f8f9fa", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}>
    <img src={data.imageUrl} alt={data.altText} style={{ width: "100%", height: "180px", objectFit: "contain", ...style }} />
  </div>
);

const Label = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "2px 0", ...style }}>{children}</div>
);

const Sponsored = ({ data, style }) =>
  <span style={{ color: "#888", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", ...style }}>{data.text}
  </span>;

const Icon = ({ data, style }) => (
  <img src={data.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png"} alt={data.altText} style={{ width: "14px", height: "14px", opacity: 0.4, cursor: "pointer", ...style }} />
);

const Title = ({ data, style }) => <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "4px 0", lineHeight: "1.3", ...style }}>{data.text}</h3>;

const Description = ({ data, style }) => (
  <p style={{ fontSize: "13px", color: "#555", margin: "2px 0 8px 0", display: "-webkit-box", WebkitLineClamp: data.maxLines ?? 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5", ...style }}>
    {data.text}
  </p>
);

const Rating = ({ children, style }) => <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0", ...style }}>{children}</div>;

const Score = ({ data, style }) => (
  <span style={{ fontSize: "13px", color: "#e77600", fontWeight: "bold", background: "rgba(231,118,0,0.1)", padding: "2px 8px", borderRadius: "12px", ...style }}>
    ★ {data.text}
    {data["out of"] && <span style={{ color: "#888", fontWeight: "normal", fontSize: "11px" }}> / {data["out of"]}</span>}
  </span>
);

const ReviewCount = ({ data, style }) => <span style={{ fontSize: "12px", color: "#007185", fontWeight: "500", ...style }}>({data.text} reviews)</span>;

const Badge = ({ data, style }) => (
  <span style={{ display: "inline-block", backgroundColor: "#cc0c39", color: "white", padding: "4px 10px", fontSize: "11px", fontWeight: "bold", borderRadius: "16px", marginBottom: "4px", ...style }}>
    {data.text}
  </span>
);

const PriceBlock = ({ data, style }) => (
  <div style={{ margin: "8px 0", display: "flex", alignItems: "baseline", gap: "8px", ...style }}>
    <span style={{ fontSize: "22px", fontWeight: "800", color: "#111" }}>{data.sellingPrice}</span>
    <span style={{ fontSize: "13px", color: "#888", textDecoration: "line-through" }}>M.R.P: {data.mrp}</span>
    <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "700", background: "rgba(22,163,74,0.12)", padding: "2px 6px", borderRadius: "4px" }}>{data.discount} OFF</span>
  </div>
);

const OfferText = ({ data, style }) => <p style={{ fontSize: "12px", color: "#007185", margin: "4px 0", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px", ...style }}>🏷️ {data.text}</p>;

const DeliveryInfo = ({ data, style }) => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data.daysOffset ?? 7));
  const formatted = deliveryDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return (
    <p style={{ fontSize: "13px", margin: "8px 0", color: "#333", display: "flex", alignItems: "center", gap: "6px", ...style }}>
      🚚 <span style={{ fontWeight: "700" }}>{data.prefix ?? "FREE delivery"}</span> {formatted}
    </p>
  );
};

const Button = ({ data, style }) => (
  <button
    style={{
      marginTop: "12px", width: "100%", padding: "12px", background: "linear-gradient(135deg, #ffa41c, #ff8f00)", color: "#111", border: "none", borderRadius: "24px",
      fontSize: "14px", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 12px rgba(255,164,28,0.3)", transition: "all 0.2s ease", ...style
    }}
  >
    {data.label}
  </button>
);

const ComponentMap = {
  "Page": Page,
  "ProductList": ProductList,
  "Carousel": Carousel,
  "ProductCard": ProductCard,
  "Image": ProductImage,
  "Label": Label,
  "Sponsored": Sponsored,
  "Icon": Icon,
  "Title": Title,
  "Description": Description,
  "Rating": Rating,
  "Score": Score,
  "ReviewCount": ReviewCount,
  "Badge": Badge,
  "PriceBlock": PriceBlock,
  "OfferText": OfferText,
  "DeliveryInfo": DeliveryInfo,
  "Button": Button,
};

const Renderer = ({ schema, deviceType }) => {
  if (!schema) return null;

  const TargetComponent = ComponentMap[schema.type];
  if (!TargetComponent) return <div>Unknown Component: {schema.type}</div>;

  let placementStyle = { height: "100%", width: "100%", display: "flex", flexDirection: "column" };
  if (schema.placement) {
    const coordinates = schema.placement[deviceType];
    if (coordinates) {
      placementStyle = {
        ...placementStyle,
        gridColumn: `${coordinates.colStart} / ${coordinates.colEnd}`,
        gridRow: `${coordinates.rowStart} / ${coordinates.rowEnd}`,
      };
    }
  }

  return (
    <div style={placementStyle}>
      <TargetComponent data={schema.data} style={schema.containerStyle}>
        {schema.children && schema.children.map((child, idx) => (
          <Renderer key={idx} schema={child} deviceType={deviceType} />
        ))}
      </TargetComponent>
    </div>
  );
};
