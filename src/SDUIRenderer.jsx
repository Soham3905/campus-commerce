import React, { useCallback, useEffect, useRef, useState } from "react";
import { fullPageJSON } from "./landingSchema";

const TEMPLATES = {
  "Full Page": fullPageJSON,
  "Carousel Only": fullPageJSON.children[1],
  "Product List": fullPageJSON.children[2],
  "Category Grid": fullPageJSON.children[3],
  "Search Bar": fullPageJSON.children[4],
  "HeroBanner": fullPageJSON.children[5],
  "CountDownTimer": fullPageJSON.children[6],
  "CouponCode" : fullPageJSON.children[7],
};

async function executeOptionAction(option, closeMenu, setError) {
  const action = option.action || {};
  if (!action) return;

  try {
    if (action.type === "API_CALL") {
      console.log(`[API_CALL] Action: ${action.actionName} — fetching test endpoint...`);
      const response = await fetch(action.endpoint);
      const json = await response.json();
      console.log("[API_CALL] Response:", json);
      if (closeMenu) closeMenu();
      return;
    }
    if (action.type === "COPY_TO_CLIPBOARD") {
      console.log(`[COPY_TO_CLIPBOARD] Copied: ${action.value}`);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(action.value);
      }
    }
  } catch (err) {
    if (setError) setError(err.message || "Action failed");
  }
}

export default function SDUIRenderer() {
  const [activeTab, setActiveTab] = useState("Full Page");
  const [jsonText, setJsonText] = useState(JSON.stringify(TEMPLATES["Full Page"], null, 2));
  const [schema, setSchema] = useState(TEMPLATES["Full Page"]);
  const [deviceView, setDeviceView] = useState("desktop");
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(null);

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
    if (deviceView === "mobile") return "2000px";
    if (deviceView === "tablet") return "2000px";
    return "2000px";
  };

  const closeMenu = () => setMenu(null);

  const handleOptionSelect = async (option) => {
    await executeOptionAction(option, closeMenu, setError);
  };

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
              <Renderer schema={schema} deviceType={deviceView} openMenu={setMenu} />
            </div>
            <ContextMenu
              data={menu}
              onClose={closeMenu}
              onSelect={handleOptionSelect}
            />
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
    gridTemplateRows: "repeat(200, 10px)",
    gap: "0px",
    height: "100%",
    padding: "10px", ...style
  }}>
    {children}
  </div>
);

const HeaderButton = ({ data, style }) => (
  <div
    style={{
      padding: "8px 12px",
      borderRadius: 12,
      background: "#f8fafc",
      border: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      gap: 6, ...style
    }}
  >
    <span style={{ fontWeight: 600, fontSize: 12 }}>
      {data?.icon} {data?.label}
    </span>
  </div>
);

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
  );
};

const CategoryGrid = ({ children, style }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(20,1fr)",
    gap: "12px",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    ...style
  }}>{children}
  </div>
);

const CategoryItem = ({ data, style }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    ...style
  }}>
    <div style={{
      width: "35px",
      height: "35px",
      backgroundColor: "#f0f2f5",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      cursor: "pointer"
    }}>
      {data.icon}
    </div>
    <span style={{ fontSize: "10px", fontWeight: "600", color: "#444", cursor: "pointer" }}>{data.label}</span>
  </div>
);

const SearchBar = ({ data, style, actions }) => {
  const [query, setQuery] = useState("");
  const debounceTimer = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Debouncing logic i.e. wait for 500ms after the user stops typing
    if (actions?.onChange) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        console.log("Search query is", value);
        executeOptionAction({ action: actions.onChange });
      }, 500);
    }
  };

  const handleFocus = () => {
    if (actions.onFocus) {
      console.log("Focus");
      executeOptionAction({ action: actions.onFocus });
    }
  }

  const handleBlur = () => {
    if (actions.onBlur) {
      console.log("Blur");
      executeOptionAction({ action: actions.onBlur });
    }
  }

  const handleKeyDown = (e) => {
    console.log("Key down");
    if (e.key === "Enter" && actions?.onSubmit) {
      console.log("Submit")
      executeOptionAction({ action: actions.onSubmit });
    }
  };

  return (
    <div style={{ padding: "10px", ...style }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "8px 12px",
        border: "1px solid #ddd"
      }}>
        <span style={{ marginRight: "8px" }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={data?.placeholder || "Search products..."}
          style={{ fontSize: "14px", width: "100%", border: "none", outline: "none" }}
        />
      </div>
    </div>
  );
}

const HeroBanner = ({ data, style, actions, children }) => {

  useEffect(() => {
    if (actions?.onMount) {
      executeOptionAction({ action: actions.onMount });
    }
  }, [actions]);

  return (
    <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", ...style }}>
      <img
        src={data.imageUrl}
        alt={data.altText}
        onError={() => {
          if (actions?.onError) {
            executeOptionAction({ action: actions.onError });
          }
        }}
        style={{ width: "100%", height: "400px", objectFit: "cover" }}
      />
      {/* Overlay Text */}
      <div style={{
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        padding: "20px",
        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
        color: "#fff"
      }}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>{data.title}</h2>
        <p style={{ margin: "4px 0 0", fontSize: "14px", opacity: 0.9 }}>{data.subtitle}</p>

        {children && (
          <div style={{ marginTop: "10px" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

const ProductCard = ({ children, style }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "10px",
        width: "280px",
        borderRadius: "10px",
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
        ...style
      }}
    >
      {children}

      {/* Quick Add Overlay */}
      <div style={{
        position: "absolute",
        bottom: isHovered ? "100px" : "-50px",
        transition: "bottom 0.3s ease-in-out",
        width: "90%",
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert("Added to cart!");
          }}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: "#fadb61ff",
            color: "#000",
            borderRadius: "20px",
            fontWeight: "600",
            cursor: "pointer",
          }}>
          Quick Add
        </button>
      </div>
    </div>
  );
};

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
  };
};

const ContextMenu = ({ data, onClose, onSelect }) => {
  if (!data) return null;

  return (
    <div style={{
      position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
      justifyContent: "center", alignItems: "center"
    }} onClick={onClose}>
      <div
        style={{ background: "#fff", borderRadius: "12px", width: "190px" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: "15px", borderBottom: "1px solid #eee", fontWeight: "bold", textAlign: "center" }}>
          {data.title}
        </div>
        {data.options.map((opt, i) => (
          <div
            key={i}
            style={{ padding: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", borderBottom: i === data.options.length - 1 ? "none" : "1px solid #f0f0f0" }}
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
  );
};

const CountDownTimer = ({ data, style, actions }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const target = new Date(data.targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff < 0) {
        clearInterval(interval);
        setTimeLeft(data.expiredText || "Expired...");
        if (actions?.onExpire) {
          executeOptionAction({ action: actions.onExpire });
        }
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      if (data.showDays === "true") {
        setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
      } else {
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div style={{ padding: "10px", backgroundColor: "#fff3cd", borderRadius: "12px", border: "1px solid #ffeeba", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", ...style }}>
      <h3 style={{ color: style?.color || "#856404", fontSize: "16px", margin: "0 0 5px 0" }}>{data.label}</h3>
      <div style={{ fontSize: "20px", fontWeight: "600", color: style?.color || "#856404", fontFamily: "monospace" }}>
        {timeLeft || "Loading..."}
      </div>
    </div>
  )
}

const CouponCode = ({ data, style, actions }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (actions?.onCopy) {
      executeOptionAction({ action: actions.onCopy });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: "12px", backgroundColor: "#e8f5e9", borderRadius: "8px", border: "2px dashed #4caf50", display: "flex", justifyContent: "space-between", alignItems: "center", ...style }}>
      <div>
        <h4 style={{ color: "#2e7d32", fontSize: "16px" }}>{data.title}</h4>
        <p style={{ fontSize: "12px", color: "#555" }}>{data.description}</p>
      </div>
      <button
        onClick={handleCopy}
        style={{ padding: "4px 10px", backgroundColor: copied ? "#81c784" : "#4caf50", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "600"}}
      >
        {copied ? "Copied!" : data.copyLabel}
      </button>
    </div>
  );
};

const ComponentMap = {
  "Page": Page,
  "Header": Header,
  "HeaderButton": HeaderButton,
  "ProductList": ProductList,
  "Carousel": Carousel,
  "CategoryGrid": CategoryGrid,
  "CategoryItem": CategoryItem,
  "SearchBar": SearchBar,
  "HeroBanner": HeroBanner,
  "CountDownTimer": CountDownTimer,
  "CouponCode": CouponCode,
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

const Renderer = ({ schema, deviceType, openMenu }) => {
  if (!schema) return null;

  const TargetComponent = ComponentMap[schema.type];
  if (!TargetComponent) return <div style={{ color: "red" }}>Unknown Component: {schema.type}</div>;

  // Handle Long Press
  const longPressHandlers = useLongPress(() => {
    const lp = schema.actions?.onLongPress;
    if (lp?.type === "SHOW_CONTEXT_MENU") {
      openMenu({
        title: lp.data?.title || "Actions",
        options: lp.data?.options || [],
        schema,
      });
    }
  });

  // Handle Tap

  const handleTap = (e) => {
    const tapAction = schema.actions?.onTap;
    if (tapAction) {
      e.stopPropagation();
      executeOptionAction({ action: tapAction });
    }
  }

  const handleMouseEnter = (e) => {
    const hoverAction = schema.actions?.onHover;
    if (hoverAction) {
      executeOptionAction({ action: hoverAction });
    }
  }

  const interactionProps = {
    ...(schema.actions?.onLongPress ? longPressHandlers : {}),
    ...(schema.actions?.onTap ? { onClick: handleTap } : {}),
    ...(schema.actions?.onHover ? { onMouseEnter: handleMouseEnter } : {}),
  }

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
      <div style={placementStyle} {...interactionProps}>
        <TargetComponent data={schema.data} style={schema.containerStyle} actions={schema.actions}>
          {schema.children && schema.children.map((child, idx) => (
            <Renderer key={idx} schema={child} deviceType={deviceType} openMenu={openMenu} />
          ))}
        </TargetComponent>
      </div>
    </>
  );
};
