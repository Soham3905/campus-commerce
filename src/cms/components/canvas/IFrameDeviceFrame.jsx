import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * IFrameDeviceFrame
 * Renders Mobile, Tablet, and Desktop viewport previews inside an isolated <iframe> portal.
 * Ensures natural, unrestricted scrolling from top to footer across all devices.
 */
export const IFrameDeviceFrame = ({
  device = "desktop",
  children,
  onCanvasDrop,
  onCanvasDragOver,
  onSelectComponent,
}) => {
  const iframeRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIFrame = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      doc.open();
      doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Inter+Tight:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
    }
    html {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      scroll-behavior: smooth;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
      background-color: #F6F6F4;
      color: #101f26;
      font-family: 'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #sdui-iframe-root {
      width: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }
    /* Sleek, visible scrollbar */
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    ::-webkit-scrollbar-thumb {
      background: #94a3b8;
      border-radius: 5px;
      border: 2px solid #f1f5f9;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }
  </style>
</head>
<body>
  <div id="sdui-iframe-root"></div>
</body>
</html>`);
      doc.close();

      // Mirror stylesheets and font links from parent document to iframe
      const parentStyles = document.querySelectorAll("style, link[rel='stylesheet']");
      parentStyles.forEach((el) => {
        try {
          doc.head.appendChild(el.cloneNode(true));
        } catch (e) {
          // ignore cross-origin stylesheet warnings
        }
      });

      // Forward native drag & click events from iframe window to parent listeners
      const handleDocDragOver = (e) => {
        e.preventDefault();
        if (onCanvasDragOver) onCanvasDragOver(e);
      };

      const handleDocDrop = (e) => {
        e.preventDefault();
        if (onCanvasDrop) onCanvasDrop(e);
      };

      const handleDocClick = (e) => {
        if (e.target === doc.body || e.target === root) {
          onSelectComponent?.(null);
        }
      };

      const root = doc.getElementById("sdui-iframe-root");
      doc.addEventListener("dragover", handleDocDragOver);
      doc.addEventListener("drop", handleDocDrop);
      doc.addEventListener("click", handleDocClick);

      setMountNode(root);

      return () => {
        doc.removeEventListener("dragover", handleDocDragOver);
        doc.removeEventListener("drop", handleDocDrop);
        doc.removeEventListener("click", handleDocClick);
      };
    };

    const cleanup = setupIFrame();
    return () => {
      if (cleanup) cleanup();
    };
  }, [device]);

  // Forward scroll wheel on outer device frames directly into the iframe document
  const handleOuterWheel = (e) => {
    const doc = iframeRef.current?.contentDocument;
    if (doc) {
      doc.documentElement.scrollTop += e.deltaY;
      doc.body.scrollTop += e.deltaY;
    }
  };

  // ── 1. MOBILE VIEW (390px iPhone-style Frame) ──
  if (device === "mobile") {
    return (
      <div
        onWheel={handleOuterWheel}
        style={{
          width: "390px",
          borderRadius: "44px",
          border: "10px solid #1e293b",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.28), 0 0 0 2px #334155 inset",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          flexShrink: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "800px",
          maxHeight: "calc(100vh - 150px)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* iOS Status Bar */}
        <div
          style={{
            height: "28px",
            backgroundColor: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            flexShrink: 0,
            userSelect: "none",
            zIndex: 10,
          }}
        >
          <span style={{ color: "#ffffff", fontSize: "11px", fontWeight: "700", letterSpacing: "0.02em" }}>9:41</span>
          <div style={{ width: "80px", height: "14px", backgroundColor: "#0f172a", borderRadius: "8px" }} />
          <span style={{ color: "#ffffff", fontSize: "10px", letterSpacing: "1px" }}>▲ ■ 100%</span>
        </div>

        {/* IFrame Viewport */}
        <div style={{ flex: 1, position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          <iframe
            ref={iframeRef}
            title="Mobile Storefront Preview"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              backgroundColor: "#F6F6F4",
            }}
          />
          {mountNode && createPortal(children, mountNode)}
        </div>

        {/* iOS Home Indicator */}
        <div
          style={{
            height: "18px",
            backgroundColor: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <div style={{ width: "110px", height: "4px", backgroundColor: "#94a3b8", borderRadius: "2px" }} />
        </div>
      </div>
    );
  }

  // ── 2. TABLET VIEW (768px iPad-style Frame) ──
  if (device === "tablet") {
    return (
      <div
        onWheel={handleOuterWheel}
        style={{
          width: "min(768px, 100%)",
          borderRadius: "28px",
          border: "8px solid #1e293b",
          boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.22), 0 0 0 1px #334155 inset",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          height: "820px",
          maxHeight: "calc(100vh - 150px)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Tablet Chrome Bar */}
        <div
          style={{
            height: "26px",
            backgroundColor: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "600" }}>iPad 10.9" · 768 × 1024</span>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#334155" }} />
          <span style={{ color: "#94a3b8", fontSize: "10px" }}>🔋 100%</span>
        </div>

        {/* IFrame Viewport */}
        <div style={{ flex: 1, position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          <iframe
            ref={iframeRef}
            title="Tablet Storefront Preview"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              backgroundColor: "#F6F6F4",
            }}
          />
          {mountNode && createPortal(children, mountNode)}
        </div>
      </div>
    );
  }

  // ── 3. DESKTOP VIEW (100% Browser Window Frame with Address Bar) ──
  return (
    <div
      onWheel={handleOuterWheel}
      style={{
        width: "100%",
        maxWidth: "1280px",
        height: "100%",
        maxHeight: "calc(100vh - 140px)",
        borderRadius: "14px",
        border: "1px solid #cbd5e1",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Desktop Browser Window Header / Address Bar */}
      <div
        style={{
          height: "36px",
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: "10px",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {/* Mac-style Window Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f59e0b" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10b981" }} />
        </div>

        {/* Mock Browser URL Bar */}
        <div
          style={{
            flex: 1,
            maxWidth: "460px",
            height: "22px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: "6px",
            fontSize: "11px",
            color: "#64748b",
          }}
        >
          <span style={{ fontSize: "10px", color: "#10b981" }}>🔒</span>
          <span style={{ color: "#334155", fontWeight: "500" }}>https://campuscommerce.store/home</span>
        </div>

        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", marginLeft: "auto" }}>
          Desktop Viewport (100%)
        </div>
      </div>

      {/* IFrame Viewport */}
      <div style={{ flex: 1, position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
        <iframe
          ref={iframeRef}
          title="Desktop Storefront Preview"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
            backgroundColor: "#F6F6F4",
          }}
        />
        {mountNode && createPortal(children, mountNode)}
      </div>
    </div>
  );
};

export default IFrameDeviceFrame;
