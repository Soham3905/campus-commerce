import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fullPageJSON } from "./landingSchema";
import { setServerState, setReduxValue } from "./store/countSlice";

const API_BASE_URL = "http://localhost:4000";

const TEMPLATES = {
  "Full Page": fullPageJSON,
  "Carousel Only": fullPageJSON.children[1],
  "Product List": fullPageJSON.children[2],
};

function normalizeValue(value, type) {
  if (type === "Number") return Number(value);
  if (type === "string") return String(value);
  return value;
}

function getByPath(obj, path) {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function buildPayload(payloadBlocks = [], appState, componentData) {
  const result = {};

  payloadBlocks.forEach((block) => {
    (block.requestConfig || []).forEach((item) => {
      if (!item.requestKeyName) return;

      let value;

      if (item.getValueFrom === "componentData") {
        value = getByPath(componentData, item.getValueFromKey);
        console.log("componentData:", item.getValueFromKey, "→", value);
      } else if (item.getValueFrom === "redux") {
        // appState is already state.count
        value = getByPath(appState, item.getValueFromKey);
        console.log("redux:", item.getValueFromKey, "→", value);
      } else if (item.getValueFrom === "express") {
        // appState is already state.count, so serverState is appState.serverState
        value = getByPath(appState.serverState, item.getValueFromKey);
        console.log("express:", item.getValueFromKey, "→", value);
      } else if (item.getValueFrom === "static") {
        value = item.value;
        console.log("static:", item.requestKeyName, "→", value);
      }
      result[item.requestKeyName] = normalizeValue(value, item.type);
    });
  });

  return result;
}

async function executeOptionAction(option, appState, dispatch, closeMenu, setError, componentData) {
  const action = option.action || option.apiConfig || {};
  if (!action) return;

  try {
    if (action.type === "API_CALL") {
      const payload = buildPayload(action.payload, appState, componentData);
      const response = await fetch(action.endpoint, {
        method: action.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionName: action.actionName,
          payload,
        })
      })
      const data = await response.json();
      if (data?.state) {
        dispatch(setServerState(data.state))
      }
      closeMenu();
      return;
    }
    if (action.type === "SET_REDUX_VALUE") {
      dispatch(setReduxValue({ key: action.key, value: action.value }));
      closeMenu();
      return;
    }
  } catch (err) {
    if (setError) setError(err.message || "Action failed");
  }
}

export default function SDUIRenderer() {
  const dispatch = useDispatch();
  // Select only the count slice to avoid full-state re-renders
  const appState = useSelector((state) => state.count);
  const [activeTab, setActiveTab] = useState("Full Page");
  const [jsonText, setJsonText] = useState(JSON.stringify(TEMPLATES["Full Page"], null, 2));
  const [schema, setSchema] = useState(TEMPLATES["Full Page"]);
  const [deviceView, setDeviceView] = useState("desktop");
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const stateRes = await fetch(`${API_BASE_URL}/api/state`);
        const stateData = await stateRes.json();
        dispatch(setServerState(stateData));
      } catch (err) {
        setError("Error loading initial state");
      }
    };
    loadInitialData();
  }, [dispatch])

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
  };

  const getPreviewHeight = () => {
    if (deviceView === "mobile") return "812px";
    if (deviceView === "tablet") return "1024px";
    return "100%";
  };

  const closeMenu = () => setMenu(null);

  const handleOptionSelect = async (option) => {
    await executeOptionAction(
      option,
      appState,
      dispatch,
      closeMenu,
      setError,
      menu?.schema?.data
    )
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* -- LEFT PANEL: JSON EDITOR -- */}
      <div style={{ width: "22%", display: "flex", flexDirection: "column", borderRight: "1px solid #2a2a35", background: "#13131f" }}>

        {/* Editor Header */}
        <div style={{ padding: "12px 16px", background: "#1a1a24", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a2a35" }}>
          <h3 style={{ fontSize: "14px", color: "#cdd6f4" }}>⚙️ SDUI Studio</h3>
          <button
            onClick={handleApplyJson}
            style={{ padding: "6px 16px", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "#fff", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}
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
          style={{ flex: 1, padding: "10px", background: "transparent", color: "#89dceb", fontSize: "13px", fontFamily: "monospace" }}
        />
      </div>

      {/* -- RIGHT PANEL: DEVICE PREVIEWER -- */}
      <div style={{ width: "78%", display: "flex", flexDirection: "column", background: "radial-gradient(circle at center, #1f1f33 0%, #0f0f1a 100%)" }}>

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
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "15px", overflowY: "auto" }}>
          <div style={{
            width: getPreviewWidth(),
            height: getPreviewHeight(),
          }}>
            {/* Screen Content Container */}
            <div style={{ backgroundColor: "#f3f3f3" }}>
              <Renderer schema={schema} deviceType={deviceView} appState={appState} openMenu={setMenu} />
            </div>
          </div>
        </div>
      </div>
      <ContextMenu
        data={menu}
        onClose={closeMenu}
        onSelect={handleOptionSelect}
      />
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
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    {label}
  </button>
);

const Page = ({ children, style }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(100, 1fr)",
    gridTemplateRows: "repeat(100, 10px)",
    gap: "0px",
    height: "100%",
    padding: "10px", ...style
  }}>
    {children}
  </div>
);


const HeaderButton = ({ data, appState, style }) => {
  const countKey = data?.id ? `${data.id}Count` : null;
  // appState is state.count, so serverState is appState.serverState
  const count = countKey ? (appState?.serverState?.[countKey] ?? 0) : 0;

  return (
    <div
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4, ...style
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 12 }}>
        {data?.icon} {data?.label}
      </span>

      <span
        style={{
          minWidth: 15,
          height: 15,
          borderRadius: 999,
          background: "#111827",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </div>
  );
};

const Header = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
    {children}
  </div>
);

const ProductList = ({ children, style }) => (
  <div style={{ display: "flex", overflowX: "auto", gap: "10px", padding: "8px", width: "100%", scrollBehavior: "smooth", ...style }}>
    {React.Children.map(children, (child) => (
      <div style={{ display: "flex" }}>
        {child}
      </div>
    ))}
  </div>
);

const Carousel = ({ data, children, style }) => {
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
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px", ...style }}>
      <div style={{ display: "flex", transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)", transform: `translateX(-${currentIndex * 100}%)` }}>
        {React.Children.map(children, (child) => (
          <div style={{ minWidth: "100%" }}>{child}</div>
        ))}
      </div>
      {data.showDots && (
        <div style={{ position: "absolute", bottom: "0px", width: "100%", display: "flex", justifyContent: "center" }}>
          {children.map((_, idx) => (
            <div key={idx} onClick={() => setCurrentIndex(idx)} style={{
              width: currentIndex === idx ? "20px" : "8px", height: "8px", borderRadius: "4px",
              backgroundColor: currentIndex === idx ? "#a6a2a2ff" : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "width 0.3s ease"
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
      padding: "10px", width: "280px", borderRadius: "10px", backgroundColor: "#fff", ...style
    }}
  >
    {children}
  </div>
);

const ProductImage = ({ data, style }) => (
  <div style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
    <img src={data.imageUrl} alt={data.altText} style={{ width: "100%", height: "180px", objectFit: "contain", ...style }} />
  </div>
);

const Label = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "3px", ...style }}>{children}</div>
);

const Sponsored = ({ data, style }) =>
  <span style={{ color: "#888", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", ...style }}>{data.text}
  </span>;

const Icon = ({ data, style }) => (
  <img src={data.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png"} alt={data.altText} style={{ width: "14px", height: "14px", opacity: 0.4, cursor: "pointer", ...style }} />
);

const Title = ({ data, style }) => <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", ...style }}>{data.text}</h3>;

const Description = ({ data, style }) => (
  <p style={{ fontSize: "13px", color: "#555", display: "-webkit-box", WebkitLineClamp: data.maxLines ?? 2, WebkitBoxOrient: "vertical", overflow: "hidden", ...style }}>
    {data.text}
  </p>
);

const Rating = ({ children, style }) => <div style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>{children}</div>;

const Score = ({ data, style }) => (
  <span style={{ fontSize: "10px", color: "#e77600", fontWeight: "bold", background: "rgba(231,118,0,0.1)", borderRadius: "8px", ...style }}>
    ★ {data.text}
    {data["out of"] && <span style={{ color: "#888", fontWeight: "bold", fontSize: "10px" }}> / {data["out of"]}</span>}
  </span>
);

const ReviewCount = ({ data, style }) => <span style={{ fontSize: "11px", color: "#007185", fontWeight: "500", ...style }}>({data.text} reviews)</span>;

const Badge = ({ data, style }) => (
  <span style={{ backgroundColor: "#cc0c39", color: "white", padding: "4px 10px", fontSize: "11px", fontWeight: "bold", borderRadius: "16px", ...style }}>
    {data.text}
  </span>
);

const PriceBlock = ({ data, style }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", ...style }}>
    <span style={{ fontSize: "20px", fontWeight: "800", color: "#111" }}>{data.sellingPrice}</span>
    <span style={{ fontSize: "10px", color: "#888", textDecoration: "line-through" }}>M.R.P: {data.mrp}</span>
    <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700", background: "rgba(22,163,74,0.12)", padding: "2px 6px", borderRadius: "4px" }}>{data.discount} OFF</span>
  </div>
);

const OfferText = ({ data, style }) => <p style={{ fontSize: "12px", color: "#007185", fontWeight: "500", display: "flex", alignItems: "center", ...style }}>🏷️ {data.text}</p>;

const DeliveryInfo = ({ data, style }) => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + (data.daysOffset ?? 7));
  const formatted = deliveryDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  return (
    <p style={{ fontSize: "12px", color: "#333", ...style }}>
      🚚 <span style={{ fontWeight: "700" }}>{data.prefix ?? "FREE delivery"}</span> {formatted}
    </p>
  );
};

const Button = ({ data, style }) => (
  <button
    style={{
      width: "100%", padding: "8px", background: "linear-gradient(135deg, #ffa41c, #ff8f00)", color: "#111", borderRadius: "24px",
      fontSize: "14px", fontWeight: "800", cursor: "pointer", ...style
    }}
  >
    {data.label}
  </button>
);

const useLongPress = (onLongPress, onClick, ms = 600) => {
  const timerRef = useRef();
  const isLongPressStarted = useRef(false);

  const start = useCallback((e) => {
    isLongPressStarted.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressStarted.current = true;
      onLongPress(e);
    }, ms);
  }, [onLongPress, ms]);

  const stop = useCallback((e) => {
    clearTimeout(timerRef.current);
    if (!isLongPressStarted.current && onClick) {
      onClick(e);
    }
  }, [onClick]);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onTouchStart: start,
    onTouchEnd: stop
  }
}

const ContextMenu = ({ data, onClose, onSelect }) => {
  if (!data) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: "10%", width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }} onClick={onClose}>
      <div
        style={{ background: "#fff", borderRadius: "12px", width: "190px", }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: "15px", borderBottom: "1px solid #eee", fontWeight: "bold", textAlign: "center" }}>
          {data.title}
        </div>
        {data.options.map((opt, i) => (
          <div
            key={i}
            style={{ padding: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", borderBottom: i === data.options.length - 1 ? "none" : "1px solid #f0f0f0", }}
            onMouseEnter={(e) => e.target.style.background = "#f9f9f9"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
            onClick={() => onSelect(opt)}
          >
            <span>{opt.icon}</span>
            <span style={{ fontSize: "14px" }}>{opt.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ComponentMap = {
  "Page": Page,
  "Header": Header,
  "HeaderButton": HeaderButton,
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

const Renderer = ({ schema, deviceType, appState, openMenu }) => {
  if (!schema) return null;

  const TargetComponent = ComponentMap[schema.type];
  if (!TargetComponent) return <div style={{ color: "red" }}>Unknown Component: {schema.type}</div>;

  // Handle Long Press...
  const longPressHandlers = useLongPress(() => {
    const lp = schema.actions?.onLongPress;
    if (lp?.type === "SHOW_CONTEXT_MENU") {
      openMenu({
        title: lp.data?.title || "Actions",
        options: lp.data?.options || [],
        schema,
      });
    }
  })

  let placementStyle = {};
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
    <>
      <div style={placementStyle} {...(schema.actions?.onLongPress ? longPressHandlers : {})}>
        <TargetComponent data={schema.data} appState={appState} style={schema.containerStyle}>
          {schema.children && schema.children.map((child, idx) => (
            <Renderer key={idx} schema={child} deviceType={deviceType} appState={appState} openMenu={openMenu} />
          ))}
        </TargetComponent>
      </div>
    </>
  );
};
