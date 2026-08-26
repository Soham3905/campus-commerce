import React, { useState, useRef } from "react";
import { executeOptionAction } from "../../actions/actionExecutor";

export const ProductList = ({ children, style, actions }) => {
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
      if (now - lastScrollTime.current > debounceTime) {
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

  return (
    <div
      onScroll={actions?.onScroll || actions?.onEndReached ? handleScroll : undefined}
      style={{
        display: "flex",
        gap: "14px",
        padding: "20px max(16px, calc((100% - 1180px) / 2)) 28px",
        overflowX: "auto",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        width: "100%",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
      {isFetching && (
        <div
          style={{
            minWidth: "220px",
            width: "220px",
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "linear-gradient(180deg, #FAFAF8 0%, #F4F4F0 100%)",
            border: "1.5px dashed #CBD5E1",
            borderRadius: "16px",
            padding: "24px 16px",
            boxSizing: "border-box",
            flexShrink: 0,
            marginRight: "16px",
          }}
        >
          <div className="campus-loader">
            <div className="loader-ring"></div>
            <div className="loader-sparkle">✨</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: "0 0 3px 0",
                fontSize: "13px",
                fontWeight: "700",
                color: "#1E293B",
                letterSpacing: "0.01em",
              }}
            >
              Loading more deals
            </p>
            <span
              style={{
                fontSize: "11px",
                color: "#64748B",
                fontWeight: "500",
              }}
            >
              Fetching fresh items...
            </span>
          </div>
        </div>
      )}
      <style>{`
        .campus-loader {
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loader-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(219, 39, 119, 0.15);
          border-top-color: #DB2777;
          border-right-color: #9333EA;
          animation: loaderSpin 0.75s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .loader-sparkle {
          font-size: 16px;
          animation: pulseSparkle 1.2s ease-in-out infinite alternate;
        }
        @keyframes loaderSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseSparkle {
          0% { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
