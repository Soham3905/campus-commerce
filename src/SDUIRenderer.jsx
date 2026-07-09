import React, { useEffect, useState } from "react";
import jsonData from "./landingSchema.json";

export default function SDUIRenderer() {
  const [jsonText, setJsonText] = useState(JSON.stringify(jsonData, null, 2));
  const [schema, setSchema] = useState(jsonData);
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

  const getPreviewWidth = () => {
    if (deviceView === "mobile") return "375px";
    if (deviceView === "tablet") return "768px";
    return "100%";
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#1e1e1e", color: "#fff", fontFamily: "sans-serif" }}>

      {/* LEFT PANEL: JSON EDITOR */}
      <div style={{ width: "25%", display: "flex", flexDirection: "column", borderRight: "1px solid #444" }}>
        <div style={{ padding: "16px", backgroundColor: "#252526", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>📝 SDUI JSON Editor</h3>
          <button
            onClick={handleApplyJson}
            style={{ padding: "8px 16px", backgroundColor: "#007acc", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            Apply / Refresh UI
          </button>
        </div>

        {error && <div style={{ backgroundColor: "#cc0c39", color: "white", padding: "10px", fontSize: "14px" }}>{error}</div>}

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          style={{ flex: 1, padding: "16px", backgroundColor: "#1e1e1e", color: "#9cdcfe", fontSize: "14px", fontFamily: "monospace", border: "none", outline: "none", resize: "none" }}
        />
      </div>

      {/* RIGHT PANEL: DEVICE PREVIEWER */}
      <div style={{ width: "75%", display: "flex", flexDirection: "column", backgroundColor: "#f3f3f3", color: "#000" }}>

        {/* Navigation Bar */}
        <div style={{ padding: "16px", backgroundColor: "#fff", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "center", gap: "12px" }}>
          <DeviceButton label="📱 Mobile" active={deviceView === "mobile"} onClick={() => setDeviceView("mobile")} />
          <DeviceButton label="📟 Tablet" active={deviceView === "tablet"} onClick={() => setDeviceView("tablet")} />
          <DeviceButton label="💻 Desktop" active={deviceView === "desktop"} onClick={() => setDeviceView("desktop")} />
        </div>

        {/* Simulated Iframe Area */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", overflowY: "auto" }}>
          <div style={{
            width: getPreviewWidth(),
            height: "90%",
            backgroundColor: "#fff",
            border: deviceView === "desktop" ? "1px solid #ddd" : "12px solid #333", // Looks like a phone bezel
            borderRadius: deviceView === "desktop" ? "4px" : "36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            overflowY: "auto", // Scrolling inside the device
            transition: "all 0.3s ease", // Smooth animation when switching devices
            position: "relative"
          }}>
            {/* We pass deviceView strictly as a prop now, instead of reading window size! */}
            <Renderer schema={schema} deviceType={deviceView} />
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
      padding: "8px 16px",
      backgroundColor: active ? "#333" : "#eee",
      color: active ? "#fff" : "#333",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    {label}
  </button>
);

const Page = ({ children }) => (
  <div style={{
    width: "100%",
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "repeat(100, 1fr)",
    gridTemplateRows: "repeat(100, 1fr)",
    gap: "0px",
    padding: "20px",
    boxSizing: "border-box",
  }}>
    {children}
  </div>
);

const Carousel = ({ data, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic based on JSON data
  useEffect(() => {
    if (!data.autoPlay || !children) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === children.length - 1) {
          return data.infiniteLoop ? 0 : prevIndex;
        }
        return prevIndex + 1;
      });
    }, data.autoPLayInterval || 3000);
    return () => clearInterval(interval);
  }, [data.autoPlay, data.autoPLayInterval, data.infiniteLoop, children]);

  if (!children) return null;

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: "12px" }}>
      {/* 2A. The Sliding Track */}
      <div style={{
        display: "flex",
        transition: "transform 0.5s ease-in-out",
        transform: `translateX(-${currentIndex * 100}%)` // Moves the slider left and right
      }}>
        {/* We map over the children so each one takes up 100% of the width */}
        {React.Children.map(children, (child) => (
          <div style={{ minWidth: "100%", flexShrink: 0 }}>
            {child}
          </div>
        ))}
      </div>
      {/* 2B. The Navigation Dots (Bottom) */}
      {data.showDots && (
        <div style={{ position: "absolute", bottom: "10px", width: "100%", display: "flex", justifyContent: "center", gap: "8px" }}>
          {children.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: "8px", height: "8px", borderRadius: "50%",
                backgroundColor: currentIndex === idx ? "#ffffff" : "rgba(255,255,255,0.5)",
                cursor: "pointer"
              }}
              onClick={() => setCurrentIndex(idx)} // Allow clicking dots to navigate manually
            />
          ))}
        </div>
      )}
    </div>
  )
}

const ProductCard = ({ children, style }) => (
  <div style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px", backgroundColor: "#fff", ...style }}>
    {children}
  </div>
);

const ProductImage = ({ data, style }) => (
  <img src={data.imageUrl} alt={data.altText} style={{ width: "100%", height: "200px", objectFit: "contain", ...style }} />
);

const Label = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "4px", margin: "4px 0", ...style }}>
    {children}
  </div>
);

const Sponsored = ({ data, style }) => (
  <span style={{ color: "#888", fontSize: "12px", ...style }}>{data.text}</span>
);

const Icon = ({ data, style }) => (
  <img
    src={data.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png"}
    alt={data.altText}
    style={{ width: "14px", height: "14px", objectFit: "contain", opacity: 0.6, cursor: "pointer", ...style }}
  />
);

const Title = ({ data, style }) => (
  <h3 style={{ fontSize: "18px", margin: "4px 0", ...style }}>{data.text}</h3>
);

const Description = ({ data, style }) => (
  <p style={{
    fontSize: "14px",
    margin: "4px 0",
    display: "-webkit-box",
    WebkitLineClamp: data.maxLines ?? 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...style,
  }}>
    {data.text}
  </p>
);

const Rating = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "4px 0", ...style }}>
    {children}
  </div>
);

const Score = ({ data, style }) => (
  <span style={{ fontSize: "14px", color: "#e77600", fontWeight: "bold", ...style }}>
    ⭐ {data.text}
    {data["out of"] && <span style={{ color: "#888", fontWeight: "normal", fontSize: "12px" }}> / {data["out of"]}</span>}
  </span>
);

const ReviewCount = ({ data, style }) => (
  <span style={{ fontSize: "14px", color: "#007185", ...style }}>({data.text})</span>
);

const Badge = ({ data, style }) => (
  <span style={{ backgroundColor: "#cc0c39", color: "white", padding: "4px 8px", fontSize: "12px", borderRadius: "4px", ...style }}>
    {data.text}
  </span>
);

const PriceBlock = ({ data, style }) => (
  <div style={{ margin: "8px 0", ...style }}>
    <span style={{ fontSize: "20px", fontWeight: "bold" }}>{data.sellingPrice}</span>
    {" "}
    <span style={{ fontSize: "14px", color: "#888", textDecoration: "line-through" }}>M.R.P: {data.mrp}</span>
    {" "}
    <span style={{ fontSize: "14px", color: "#cc0c39" }}>({data.discount} off)</span>
  </div>
);

const OfferText = ({ data, style }) => (
  <p style={{ fontSize: "13px", color: "#007185", margin: "4px 0", ...style }}>{data.text}</p>
);

const DeliveryInfo = ({ data, style }) => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data.daysOffset ?? 7));
  const formatted = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return (
    <p style={{ fontSize: "13px", margin: "4px 0", ...style }}>
      <span style={{ fontWeight: "bold" }}>🚚 {data.prefix ?? "FREE delivery"} {formatted}</span>
    </p>
  );
};

const Button = ({ data, style }) => (
  <button style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    backgroundColor: "#ffa41c",
    border: "1px solid #ff8f00",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    ...style,
  }}>
    {data.label}
  </button>
);

const ComponentMap = {
  "Page": Page,
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

  let placementStyle = {};
  if (schema.placement) {
    const coordinates = schema.placement[deviceType];
    placementStyle = {
      gridColumn: `${coordinates.colStart} / ${coordinates.colEnd}`,
      gridRow: `${coordinates.rowStart} / ${coordinates.rowEnd}`,
    };
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
