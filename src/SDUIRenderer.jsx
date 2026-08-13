import React, { useCallback, useEffect, useRef, useState } from "react";
import { fullPageJSON } from "./landingSchema";

const createDummyPage = (titleText, routeName) => {
  // Deep clone the NavBar so we can modify it without breaking the original
  const navBar = JSON.parse(JSON.stringify(fullPageJSON.children[1]));

  if (navBar.data && navBar.data.items) {
    navBar.data.items.forEach(item => {
      if (item.actions?.onTap?.route === routeName) {
        item.isActive = "true";
      } else {
        item.isActive = "false";
      }
    });
  }

  return {
    "type": "Home",
    "children": [
      {
        "type": "Page",
        "children": [
          {
            "type": "Title",
            "placement": {
              "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 5 },
              "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 5 },
              "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 5 }
            },
            "data": { "text": titleText }
          }
        ]
      },
      navBar
    ]
  };
};


const PageRoutes = {
  "home": fullPageJSON,
  "categories": createDummyPage("Categories Page 🗂️", "categories"),
  "cart": createDummyPage("Cart Page 🛒", "cart"),
  "account": createDummyPage("Account Page 👤", "account"),
}

const pageChildren = fullPageJSON?.children?.[0]?.children || [];

const TEMPLATES = {
  "Full Page": fullPageJSON,
  "Carousel Only": pageChildren[1],
  "Product List": pageChildren[2],
  "Category Grid": pageChildren[3],
  "Search Bar": pageChildren[4],
  "HeroBanner": pageChildren[5],
  "CountDownTimer": pageChildren[6],
  "CouponCode": pageChildren[7],
  "StoryRow": pageChildren[8],
  "Share": pageChildren[9],
  "Footer": pageChildren[10],
  "Navbar": fullPageJSON?.children?.[1],
};

async function executeOptionAction(option) {
  const action = option.action || {};
  if (!action) return;

  if (action.type === "API_CALL") {
    console.log(`[API_CALL] Action: ${action.actionName} — fetching test endpoint...`);
    const response = await fetch(action.endpoint);
    if (!response.ok) throw new Error("API call failed");
    const json = await response.json();
    console.log("[API_CALL] Response:", json);
    return;
  }
  if (action.type === "COPY_TO_CLIPBOARD") {
    console.log(`[COPY_TO_CLIPBOARD] Copied: ${action.value}`);
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(action.value);
    }
  }
}

export default function SDUIRenderer() {
  const [activeTab, setActiveTab] = useState("Full Page");
  const [jsonText, setJsonText] = useState(JSON.stringify(TEMPLATES["Full Page"], null, 2));
  const [schema, setSchema] = useState(TEMPLATES["Full Page"]);
  const [deviceView, setDeviceView] = useState("desktop");
  const [error, setError] = useState("");
  const [menu, setMenu] = useState(null);
  const [sheetData, setSheetData] = useState(null);

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

  const handleOptionSelect = async (option) => {
    try {
      const action = option.action || {};
      
      // Handle opening another sheet directly from an option
      if (action.type === "OPEN_BOTTOM_SHEET") {
        closeMenu();
        setSheetData({
          title: action.data?.title,
          options: action.data?.options || [],
        });
        return;
      }

      await executeOptionAction(option);
      closeMenu();
      closeSheet();
    } catch (err) {
      setError(err.message || "Action failed");
    }
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
              style={{ padding: "6px 12px", backgroundColor: activeTab === tab ? "#4f46e5" : "transparent", color: activeTab === tab ? "#fff" : "#a6accd", border: activeTab === tab ? "none" : "1px solid #444", borderRadius: "16px", cursor: "pointer", fontSize: "11px", fontWeight: "bold", }}
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
          style={{ flex: 1, padding: "10px", background: "transparent", color: "#89dceb", fontSize: "12px", fontFamily: "monospace" }}
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
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Screen Content Container */}
            <div style={{ backgroundColor: "#f3f3f3", height: "100%", overflowY: "auto", scrollbarWidth: "none" }}>
              <Renderer schema={schema} deviceType={deviceView} openMenu={setMenu} openSheet={setSheetData} onNavigate={handleNavigate} />
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

const DeviceButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{ padding: "6px 16px", background: active ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "12px", }}
  >
    {label}
  </button>
);

const useSwipe = ({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance = 50 }) => {
  const touchStart = useRef({ x: null, y: null });
  const mouseStart = useRef({ x: null, y: null });

  const handleTouchStart = (e) => {
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (touchStart.current.x === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const distanceX = touchStart.current.x - endX;
    const distanceY = touchStart.current.y - endY;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > minSwipeDistance && onSwipeLeft) onSwipeLeft();
      if (distanceX < -minSwipeDistance && onSwipeRight) onSwipeRight();
    } else {
      if (distanceY > minSwipeDistance && onSwipeUp) onSwipeUp();
      if (distanceY < -minSwipeDistance && onSwipeDown) onSwipeDown();
    }

    touchStart.current = { x: null, y: null };
  };

  const handleMouseDown = (e) => {
    mouseStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e) => {
    if (mouseStart.current.x === null) return;
    const endX = e.clientX;
    const endY = e.clientY;

    const distanceX = mouseStart.current.x - endX;
    const distanceY = mouseStart.current.y - endY;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > minSwipeDistance && onSwipeLeft) onSwipeLeft();
      if (distanceX < -minSwipeDistance && onSwipeRight) onSwipeRight();
    } else {
      if (distanceY > minSwipeDistance && onSwipeUp) onSwipeUp();
      if (distanceY < -minSwipeDistance && onSwipeDown) onSwipeDown();
    }

    mouseStart.current = { x: null, y: null };
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onDragStart: (e) => e.preventDefault()
  };
};

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

const ActionWrapper = ({ actions, children, style }) => {
  const [isFetching, setIsFetching] = useState(false);
  const fetchingRef = useRef(false);
  const lastScrollTime = useRef(0);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const clientWidth = e.target.clientWidth;
    const scrollWidth = e.target.scrollWidth;

    if (actions?.onScroll) {
      const debounceTime = actions.onScroll.debounceDuration || 1000;
      const now = Date.now();
      if (now - lastScrollTime.current > debounceTime) { // 1000ms delay for scroll to be noticeable..
        lastScrollTime.current = now;
        executeOptionAction({ action: actions.onScroll });
      }
    }

    if (actions?.onEndReached) {
      const nearEndThreshold = actions.onEndReached.nearEndThreshold || 50;
      const nearEnd = scrollLeft + clientWidth >= scrollWidth - nearEndThreshold;
      if (nearEnd && !fetchingRef.current) {
        fetchingRef.current = true;
        setIsFetching(true);
        executeOptionAction({ action: actions.onEndReached });
        setTimeout(() => {
          fetchingRef.current = false;
          setIsFetching(false);
        }, 2000);
      }
    }
  };

  if (actions?.onScroll || actions?.onEndReached) {
    return (
      <div
        onScroll={handleScroll}
        style={{ display: "flex", overflowX: "auto", scrollBehavior: "smooth", scrollbarWidth: "none", ...style }}>
        {children}
        {isFetching && (
          <div style={{ minWidth: "50px", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: "10px" }}>
            <div className="spinner"></div>
          </div>
        )}
        <style>{`
          .spinner {
            width: 20px; height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4f46e5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }
  return <div style={style}>{children}</div>;
};

const Home = ({ children, style }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      ...style
    }}>
      {children}
    </div>
  );
};

const Page = ({ children, style }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(100, 1fr)", gridTemplateRows: "repeat(200, 10px)", gap: "0px", height: "100%", padding: "10px", ...style }}>
    {children}
  </div>
);

const Header = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
    {children}
    </div>
  );

const HeaderButton = ({ data, style }) => (
  <div
      style={{
      padding: "8px 12px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 6, ...style
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 12 }}> {data?.icon} {data?.label}</span>
    </div>
  );

const ProductList = ({ children }) => {
  return (
    <div style={{ display: "flex", gap: "8px", padding: "8px", width: "max-content" }}>
      {React.Children.map(children, (child) => (
        <div style={{ display: "flex" }}>
          {child}
        </div>
      ))}
    </div>
  );
};

const Carousel = ({ data, children, style, actions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data.autoPlay || !children) return;
    const interval = setInterval(() => {
      nextSlide();
    }, data.autoPlayInterval || 3000);
    return () => clearInterval(interval);
  }, [data.autoPlay, data.autoPlayInterval, data.infiniteLoop, children]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const count = React.Children.count(children);
      if (prevIndex === count - 1) return data.infiniteLoop ? 0 : prevIndex;
      return prevIndex + 1;
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const count = React.Children.count(children);
      if (prevIndex === 0) return data.infiniteLoop ? count - 1 : prevIndex;
      return prevIndex - 1;
    })
  }

  const minSwipeDistance = actions?.onSwipeLeft?.minSwipeDistance || actions?.onSwipeRight?.minSwipeDistance || data?.minSwipeDistance || 50;
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    minSwipeDistance
  });

  if (!children) return null;

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "10px", userSelect: "none", ...style }}
      {...swipeHandlers}
    >
      <div style={{ display: "flex", transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)", transform: `translateX(-${currentIndex * 100}%)` }}>
        {React.Children.map(children, (child) => (
          <div style={{ minWidth: "100%" }}>{child}</div>
        ))}
      </div>
      {data.showDots && (
        <div style={{ position: "absolute", bottom: "0px", width: "100%", display: "flex", justifyContent: "center" }}>
          {React.Children.map(children, (_, idx) => (
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
  <div style={{ display: "grid", gridAutoFlow: "column", gap: "12px", padding: "10px", backgroundColor: "#fff", borderRadius: "12px", overflowX: "auto", scrollbarWidth: "none", ...style }}>
    {children}
  </div>
);

const CategoryItem = ({ data, style }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", ...style }}>
    <div style={{ width: "35px", height: "35px", backgroundColor: "#f0f2f5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", cursor: "pointer" }}>
      {data.icon}
    </div>
    <span style={{ fontSize: "10px", fontWeight: "600", color: "#444", cursor: "pointer" }}>{data.label}</span>
  </div>
);

const SearchBar = ({ data, style }) => {
  const [query, setQuery] = useState("");

  return (
    <div style={{ padding: "10px", ...style }}>
      <div style={{ display: "flex", alignItems: "center", backgroundColor: "#fff", borderRadius: "8px", padding: "8px 12px", border: "1px solid #ddd" }}>
        <span style={{ marginRight: "8px" }}>{data?.icon || "🔍"}</span>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={data?.placeholder || "Search..."} style={{ fontSize: "14px", width: "100%", border: "none", outline: "none" }} />
      </div>
    </div>
  );
}

const ProductCard = ({ children, style, isHovered }) => {
  return (
    <div
      style={{ padding: "10px", width: "280px", borderRadius: "10px", backgroundColor: "#fff", position: "relative", overflow: "hidden", ...style }}>
      {children}

      {/* Quick Add Overlay */}
      <div style={{ position: "absolute", bottom: isHovered ? "200px" : "-50px", right: isHovered ? "12px" : "-50px", transition: "right 0.6s ease-in-out", width: "90%", }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert("Added to cart!");
          }}
          style={{ width: "100%", padding: "8px", backgroundColor: "#fadb61ff", color: "#000", borderRadius: "20px", fontWeight: "600", cursor: "pointer", }}>
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

const Sponsored = ({ data, style }) => (
  <span style={{ color: "#888", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", ...style }}>{data.text}</span>
);

const Icon = ({ data, style }) => (
  <img src={data.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png"} alt={data.altText} style={{ width: "14px", height: "14px", opacity: 0.4, cursor: "pointer", ...style }} />
);

const Title = ({ data, style }) => (
  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", ...style }}>{data.text}</h3>
);

const Description = ({ data, style }) => (
  <p style={{ fontSize: "13px", color: "#555", display: "-webkit-box", WebkitLineClamp: data.maxLines ?? 2, WebkitBoxOrient: "vertical", overflow: "hidden", ...style }}>
    {data.text}
  </p>
);

const Rating = ({ children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>{children}</div>
);

const Score = ({ data, style }) => (
  <span style={{ fontSize: "10px", color: "#e77600", fontWeight: "bold", background: "rgba(231,118,0,0.1)", borderRadius: "8px", ...style }}>
    ★ {data.text}
    {data["out of"] && <span style={{ color: "#888", fontWeight: "bold", fontSize: "10px" }}> / {data["out of"]}</span>}
  </span>
);

const ReviewCount = ({ data, style }) => (
  <span style={{ fontSize: "11px", color: "#007185", fontWeight: "500", ...style }}>({data.text} reviews)</span>
);

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

const OfferText = ({ data, style }) => (
  <p style={{ fontSize: "12px", color: "#007185", fontWeight: "500", display: "flex", alignItems: "center", ...style }}>🏷️ {data.text}</p>
);

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
    style={{ width: "100%", padding: "8px", background: "linear-gradient(135deg, #ffa41c, #ff8f00)", color: "#111", borderRadius: "24px", fontSize: "14px", fontWeight: "800", cursor: "pointer", ...style }}>
    {data.label}
  </button>
);

const HeroBanner = ({ data, style, children, onError }) => {
  return (
    <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", ...style }}>
      <img
        src={data.imageUrl} alt={data.altText}
        onError={onError}
        style={{ width: "100%", height: "400px", objectFit: "cover" }}
      />
      {/* Overlay Text */}
      <div style={{
        position: "absolute", bottom: "0", left: "0", right: "0", padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", color: "#fff"
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

const CountDownTimer = ({ data, style, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const target = new Date(data.targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff < 0) {
        clearInterval(interval);
        setTimeLeft(data.expiredText || "Expired...");
        if (onExpire) {
          onExpire();
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
};

const CouponCode = ({ data, style, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
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
        style={{ padding: "4px 10px", backgroundColor: copied ? "#81c784" : "#4caf50", color: "#fff", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}
      >
        {copied ? "Copied!" : data.copyLabel}
      </button>
    </div>
  );
};

const StoryRow = ({ children, style }) => {
  return (
    <div
      style={{ display: "flex", gap: "8px", padding: "10px 4px", overflowX: "auto", backgroundColor: "#fff", scrollbarWidth: "none", borderBottom: "1px solid #efefef", borderRadius: "24px", ...style }}>
      {children}
    </div>
  );
}

const StoryCircle = ({ data, style }) => {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "grab", flexShrink: 0, ...style
      }}
    >
      <div style={{ width: "60px", height: "60px", borderRadius: "50%", padding: "2px", border: "2px solid #e1306c", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <img src={data.imageUrl} alt={data.label} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
      </div>
      <span style={{ fontSize: "11px", fontWeight: "500", color: "#262626" }}>{data.label}</span>
    </div>
  );
}

const ShareButton = ({ data, style }) => {
  return <button style={{ border: "1px solid #ddd", padding: "5px 10px", borderRadius: "15px", fontSize: "12px", cursor: "pointer", ...style }}>
    {data?.icon} {data.label}
  </button>
}

const NavBar = ({ data, style, onNavigate }) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-around", alignItems: "center", backgroundColor: "#ffffff", borderTop: "1px solid #e5e7eb", ...style }}>
      {data?.items.map((item, idx) => (
        <div
          key={idx}
          onClick={() => {
            if (item.actions?.onTap?.type === "NAVIGATE" && onNavigate) {
              onNavigate(item.actions.onTap.route);
            }
          }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", cursor: "pointer", color: (item.isActive === "true") ? "#4f46e5" : "#6b7280" }}>
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
          <span style={{ fontSize: "10px", fontWeight: "600" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const Footer = ({ data, style }) => {
  return (
    <div style={{ padding: "10px", backgroundColor: "#0f172a", color: "#f8fafc", ...style }}>
      <div style={{ display: "grid", gridAutoFlow: "column", gap: "10px" }}>
        {data.sections?.map((section, i) => (
          <div key={i}>
            <h4 style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "5px", color: "#818cf8" }}>
              {section.title}
            </h4>
            <ul>
              {section.links?.map((link, j) => (
                <li key={j} style={{ fontSize: "11px", marginBottom: "5px", cursor: "pointer", color: "#94a3b8" }} onMouseEnter={(e) => e.target.style.color = "#ffffff"} onMouseLeave={(e) => e.target.style.color = "#94a3b8"}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #64748b", paddingTop: "8px", textAlign: "center", fontSize: "11px", opacity: 0.6 }}>
        {data.copyrightText}
      </div>
    </div>
  );
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

const BottomSheet = ({ data, isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
        display: "flex", alignItems: "flex-end"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", backgroundColor: "#fff", borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px", padding: "10px", animation: "slideUp 0.3s ease-out"
        }}
      >
        <div style={{ width: "40px", height: "4px", backgroundColor: "#ddd", borderRadius: "2px", margin: "0 auto 10px" }} />
        <h3 style={{ textAlign: "center", marginBottom: "10px", fontSize: "14px" }}>{data.title || "Share via"}</h3>

        <div style={{ display: "grid", gridAutoFlow: "column", gap: "10px" }}>
          {data.options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (onSelect) onSelect(option);
                onClose();
              }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}
            >
              <div style={{ fontSize: "20px", background: "#f0f0f0", width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {option.icon}
              </div>
              <span style={{ fontSize: "11px" }}>{option.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{ width: "100%", marginTop: "20px", padding: "4px", border: "none", background: "#eee", borderRadius: "8px", fontWeight: "bold" }}
        >
          Cancel
        </button>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

const ComponentMap = {
  "Home": Home,
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
  "StoryRow": StoryRow,
  "StoryCircle": StoryCircle,
  "ShareButton": ShareButton,
  "NavBar": NavBar,
  "Footer": Footer,
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

const Renderer = ({ schema, deviceType, openMenu, openSheet, onNavigate }) => {
  const debounceTimer = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (schema?.actions?.onMount) {
      executeOptionAction({ action: schema.actions.onMount });
    }
    return () => {
      if (schema?.actions?.onUnmount) {
        executeOptionAction({ action: schema.actions.onUnmount });
      }
    };
  }, []);

  const handleError = () => {
    if (schema?.actions?.onError) {
      executeOptionAction({ action: schema.actions.onError });
    }
  };

  const handleExpire = () => {
    if (schema?.actions?.onExpire) {
      executeOptionAction({ action: schema.actions.onExpire });
    }
  };

  const handleCopy = () => {
    if (schema?.actions?.onCopy) {
      executeOptionAction({ action: schema.actions.onCopy });
    }
  };

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
      if (tapAction.type === "OPEN_BOTTOM_SHEET") {
        openSheet({
          title: tapAction.data?.title,
          options: tapAction.data?.options || [],
          schema,
        });
      } else if (tapAction.type === "NAVIGATE") {
        if (onNavigate) {
          onNavigate(tapAction.route);
        }
      } else {
        executeOptionAction({ action: tapAction });
      }
    }
  }

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    const hoverAction = schema.actions?.onHover;
    if (hoverAction) {
      executeOptionAction({ action: hoverAction });
    }
  }

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    const hoverOutAction = schema.actions?.onHoverOut;
    if (hoverOutAction) {
      executeOptionAction({ action: hoverOutAction });
    }
  }

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    if (schema.actions?.onDrag) {
      executeOptionAction({ action: schema.actions.onDrag });
    }
  };

  const handleDragOver = (e) => {
    if (schema.actions?.onDrop) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (e) => {
    if (schema.actions?.onDrop) {
      e.preventDefault();
      executeOptionAction({ action: schema.actions.onDrop });
    }
  };

  const handleFocus = (e) => {
    if (schema.actions?.onFocus) {
      console.log("Focus");
      executeOptionAction({ action: schema.actions.onFocus });
    }
  };

  const handleBlur = (e) => {
    if (schema.actions?.onBlur) {
      console.log("Blur");
      executeOptionAction({ action: schema.actions.onBlur });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && schema.actions?.onSubmit) {
      console.log("Submit");
      executeOptionAction({ action: schema.actions.onSubmit });
    }
  };

  const handleChange = (e) => {
    if (schema.actions?.onChange) {
      clearTimeout(debounceTimer.current);
      const debounceDuration = schema.actions.onChange.debounceDuration || 500;
      const value = e.target.value;
      // Debouncing logic i.e. wait for 500ms after the user stops typing
      debounceTimer.current = setTimeout(() => {
        console.log("Search query is", value);
        executeOptionAction({ action: schema.actions.onChange });
      }, debounceDuration);
    }
  };

  const minSwipeDistance = schema.actions?.onSwipeLeft?.minSwipeDistance || schema.actions?.onSwipeRight?.minSwipeDistance || schema.actions?.onSwipeUp?.minSwipeDistance || schema.actions?.onSwipeDown?.minSwipeDistance || 50;
  const swipeHandlers = useSwipe({
    onSwipeLeft: schema.actions?.onSwipeLeft ? () => executeOptionAction({ action: schema.actions.onSwipeLeft }) : null,
    onSwipeRight: schema.actions?.onSwipeRight ? () => executeOptionAction({ action: schema.actions.onSwipeRight }) : null,
    onSwipeUp: schema.actions?.onSwipeUp ? () => executeOptionAction({ action: schema.actions.onSwipeUp }) : null,
    onSwipeDown: schema.actions?.onSwipeDown ? () => executeOptionAction({ action: schema.actions.onSwipeDown }) : null,
    minSwipeDistance
  });

  const hasSwipe = schema.actions?.onSwipeLeft || schema.actions?.onSwipeRight || schema.actions?.onSwipeUp || schema.actions?.onSwipeDown;
  const interactionProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ...(schema.actions?.onLongPress ? longPressHandlers : {}),
    ...(schema.actions?.onTap ? { onClick: handleTap } : {}),
    ...(schema.actions?.onFocus ? { onFocus: handleFocus } : {}),
    ...(schema.actions?.onBlur ? { onBlur: handleBlur } : {}),
    ...(schema.actions?.onSubmit ? { onKeyDown: handleKeyDown } : {}),
    ...(schema.actions?.onChange ? { onChange: handleChange } : {}),
    ...(schema.actions?.onDrag ? { onDragStart: handleDragStart, draggable: true } : {}),
    ...(schema.actions?.onDrop ? { onDrop: handleDrop, onDragOver: handleDragOver } : {}),
    ...(hasSwipe ? swipeHandlers : {}),
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

  const stickyStyle = schema.containerStyle?.position === 'sticky' ? {
    position: 'sticky',
    top: schema.containerStyle.top,
    bottom: schema.containerStyle.bottom,
    zIndex: schema.containerStyle.zIndex
  } : {};

  return (
    <>
      <div style={{ ...placementStyle, ...stickyStyle }} {...interactionProps}>
        <ActionWrapper actions={schema.actions}>
          <TargetComponent data={schema.data} style={schema.containerStyle} actions={schema.actions} isHovered={isHovered} onError={handleError} onExpire={handleExpire} onCopy={handleCopy} onNavigate={onNavigate}>
            {schema.children && schema.children.map((child, idx) => (
              <Renderer key={idx} schema={child} deviceType={deviceType} openMenu={openMenu} openSheet={openSheet} onNavigate={onNavigate} />
            ))}
          </TargetComponent>
        </ActionWrapper>
      </div>
    </>
  );
};
