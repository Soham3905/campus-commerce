import React, { useState, useEffect } from "react";

export const CountDownTimer = ({ data = {}, style, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!data.targetDate) return;
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
      if (data.showDays === "true" || data.showDays === true) {
        setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
      } else {
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [data, onExpire]);

  return (
    <div
      style={{
        padding: "8px 14px",
        backgroundColor: "#fff3cd",
        borderRadius: "12px",
        border: "1px solid #ffeeba",
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {data.label && (
        <span
          style={{
            color: style?.color || "#856404",
            fontSize: "12px",
            fontWeight: "600",
            margin: "0 0 3px 0",
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}
        >
          {data.label}
        </span>
      )}
      <div
        style={{
          fontSize: "15px",
          fontWeight: "700",
          color: style?.color || "#856404",
          fontFamily: "'IBM Plex Mono', monospace, ui-monospace",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}
      >
        {timeLeft || "Loading..."}
      </div>
    </div>
  );
};
