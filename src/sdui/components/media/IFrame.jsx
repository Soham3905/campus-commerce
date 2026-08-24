import React, { useState } from "react";

export const IFrame = ({ data = {}, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  if (!data?.src) return null;

  return (
    <div
      style={{
        width: "100%",
        height: style?.height || data?.height || "220px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#000000",
        boxSizing: "border-box",
        position: "relative",
        ...style,
      }}
    >
      {/* Loading Shimmer while iframe loads */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            backgroundColor: "#18181b",
            color: "#ffffff",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "3px solid rgba(255, 255, 255, 0.15)",
              borderTopColor: "#DB2777",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "500",
            }}
          >
            Loading...
          </span>
        </div>
      )}

      <iframe
        src={data.src}
        title={data.title || "Embedded Video"}
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen={data.allowFullScreen !== false}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        onLoad={() => setIsLoading(false)}
        style={{ border: "none", display: "block" }}
      />
    </div>
  );
};
