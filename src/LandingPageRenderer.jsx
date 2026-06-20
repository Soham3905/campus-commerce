// LandingPageRenderer.jsx
// Layout-driven, 100×100 canvas SDUI renderer.
// All page structure comes from JSON. No hardcoded sections.
// To switch layouts: change pageId. To move anything: change placement in JSON.

import { useState, useEffect, useRef } from "react";
import schema from "./landing.schema.json";
import {
  getCurrentBreakpoint,
  getTheme,
  getPage,
  getPageRegions,
  getPlacement,
  buildGridStyle,
  getRegionContent,
  calcDiscount,
  formatPrice,
  withImageFallback,
  buildCssVars,
} from "./sduiLogic.js";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useTheme(themeId) {
  return getTheme(schema, themeId);
}

function useBreakpoint() {
  const [bp, setBp] = useState(() => getCurrentBreakpoint(window.innerWidth));
  useEffect(() => {
    const handler = () => setBp(getCurrentBreakpoint(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
}

// ─── Root Renderer ────────────────────────────────────────────────────────────

/**
 * LandingPageRenderer
 *
 * Renders a full landing page from JSON alone.
 * Uses a 100×100 CSS grid canvas.
 * Each region declares colStart/colEnd/rowStart/rowEnd per breakpoint.
 *
 * @param {{ pageId?: string, themeOverride?: string }} props
 */
export default function LandingPageRenderer({ pageId = "home", themeOverride }) {
  const page = getPage(schema, pageId);
  const themeId = themeOverride || page.themeId;
  const theme = useTheme(themeId);
  const breakpoint = useBreakpoint();
  const regions = getPageRegions(schema, pageId);
  const cssVars = buildCssVars(theme);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(100, 1fr)",
        gridAutoRows: "minmax(0, auto)",
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        ...cssVars,
      }}
    >
      {regions.map((region) => {
        const placement = getPlacement(region, breakpoint);
        if (!placement) return null;

        const Component = COMPONENT_MAP[region.component];
        if (!Component) {
          console.warn(`[SDUI] No component registered for: "${region.component}"`);
          return null;
        }

        const content = getRegionContent(schema, region.contentId);
        const config = region.config || {};
        const variant = region.variant || "default";

        return (
          <div key={region.id} style={buildGridStyle(placement)}>
            <Component
              content={content}
              config={config}
              theme={theme}
              breakpoint={breakpoint}
              variant={variant}
              region={region}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function HeaderSection({ content, config, theme }) {
  return (
    <header
      style={{
        backgroundColor: theme.colors.headerBg,
        color: theme.colors.headerText,
        boxShadow: theme.shadow.header,
        position: config.sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
          <span style={{ fontSize: 22 }}>{content.logoIcon}</span>
          <span style={{ fontWeight: 700, fontSize: "1.25rem", color: theme.colors.headerText, letterSpacing: -0.5 }}>
            {content.logoText}
          </span>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 600 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: theme.radius.button,
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <span style={{ padding: "8px 12px", color: "#999", fontSize: 16 }}>🔍</span>
            <input
              type="text"
              placeholder={content.searchPlaceholder}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "10px 8px",
                fontSize: 14,
                backgroundColor: "transparent",
                color: theme.colors.textPrimary,
              }}
            />
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 20, marginLeft: "auto" }}>
          {content.navLinks.map((link) => (
            <button
              key={link.label}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: theme.colors.headerText,
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ─── Hero Banner  (variants: full | slim | split) ─────────────────────────────

function HeroBannerSection({ content, config, theme, breakpoint, variant }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const slides = content?.slides || [];

  useEffect(() => {
    if (!config.autoplay || slides.length < 2) return;
    timerRef.current = setInterval(
      () => setCurrent((i) => (i + 1) % slides.length),
      config.autoplayInterval || 4000
    );
    return () => clearInterval(timerRef.current);
  }, [config.autoplay, config.autoplayInterval, slides.length]);

  if (!slides.length) return null;
  const slide = slides[current];
  const isMobile = breakpoint === "mobile";

  // ── split variant ──────────────────────────────────────────────────────────
  if (variant === "split") {
    return (
      <section style={{ overflow: "hidden" }}>
        <div
          style={{
            backgroundColor: slide.bgColor || theme.colors.primary,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            minHeight: isMobile ? 280 : 360,
          }}
        >
          {/* Text side */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: isMobile ? "32px 20px" : "48px 56px",
              color: "#fff",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: theme.colors.secondary,
                color: "#111",
                borderRadius: theme.radius.pill,
                padding: "4px 14px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 16,
                alignSelf: "flex-start",
              }}
            >
              {slide.eyebrow}
            </div>
            <h1
              style={{
                fontSize: isMobile ? "1.75rem" : theme.typography.heroTitleSize,
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 12,
                color: "#fff",
              }}
            >
              {slide.title}
            </h1>
            <p style={{ fontSize: isMobile ? "0.9rem" : "1.1rem", color: "rgba(255,255,255,0.85)", marginBottom: 28, maxWidth: 400 }}>
              {slide.subtitle}
            </p>
            <button
              style={{
                backgroundColor: theme.colors.secondary,
                color: "#111",
                border: "none",
                borderRadius: theme.radius.button,
                padding: "12px 32px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              {slide.ctaLabel}
            </button>
          </div>

          {/* Image side */}
          {!isMobile && (
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <img
                src={withImageFallback(slide.imageUrl, 600, 360)}
                alt={slide.imageAlt || ""}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
        <SliderDots slides={slides} current={current} setCurrent={setCurrent} theme={theme} />
      </section>
    );
  }

  // ── full / slim variants ───────────────────────────────────────────────────
  const minH = variant === "slim"
    ? (isMobile ? 140 : 220)
    : (isMobile ? 220 : 400);

  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div
        style={{
          backgroundColor: slide.bgColor || theme.colors.primary,
          minHeight: minH,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={withImageFallback(slide.imageUrl, 1200, 450)}
          alt={slide.imageAlt || ""}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "28px 20px" : variant === "slim" ? "32px 48px" : "64px 48px",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: theme.colors.secondary,
              color: "#111",
              borderRadius: theme.radius.pill,
              padding: "4px 14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            {slide.eyebrow}
          </div>
          <h1
            style={{
              fontSize: variant === "slim"
                ? (isMobile ? "1.25rem" : "1.75rem")
                : (isMobile ? "1.75rem" : theme.typography.heroTitleSize),
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 10,
              color: "#fff",
            }}
          >
            {slide.title}
          </h1>
          {variant !== "slim" && (
            <p style={{ fontSize: isMobile ? "0.9rem" : "1.1rem", color: "rgba(255,255,255,0.85)", marginBottom: 24, maxWidth: 480 }}>
              {slide.subtitle}
            </p>
          )}
          <button
            style={{
              backgroundColor: theme.colors.secondary,
              color: "#111",
              border: "none",
              borderRadius: theme.radius.button,
              padding: variant === "slim" ? "8px 22px" : "12px 32px",
              fontWeight: 700,
              fontSize: variant === "slim" ? 13 : 15,
              cursor: "pointer",
            }}
          >
            {slide.ctaLabel}
          </button>
        </div>
      </div>
      <SliderDots slides={slides} current={current} setCurrent={setCurrent} theme={theme} />
    </section>
  );
}

function SliderDots({ slides, current, setCurrent, theme }) {
  if (slides.length <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0", backgroundColor: theme.colors.surface }}>
      {slides.map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrent(i)}
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            borderRadius: theme.radius.pill,
            border: "none",
            cursor: "pointer",
            backgroundColor: i === current ? theme.colors.primary : theme.colors.border,
            transition: "width 0.3s ease",
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Category Grid ────────────────────────────────────────────────────────────

function CategoryGridSection({ content, theme, breakpoint }) {
  const cols = breakpoint === "mobile" ? 4 : breakpoint === "tablet" ? 6 : 8;
  return (
    <section style={{ backgroundColor: theme.colors.surface, padding: `20px ${theme.spacing.containerPadding}`, marginTop: theme.spacing.sectionGap }}>
      <SectionTitle title={content.title} theme={theme} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, maxWidth: 1280, margin: "0 auto" }}>
        {content.items.map((item) => (
          <button
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "12px 8px",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRadius: theme.radius.card,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.background)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: `2px solid ${theme.colors.border}` }}>
              <img src={withImageFallback(item.iconUrl, 64, 64)} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontSize: theme.typography.captionSize, fontWeight: 600, color: theme.colors.textPrimary, textAlign: "center" }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Coupon Strip ─────────────────────────────────────────────────────────────

function CouponStripSection({ content, theme }) {
  const [copied, setCopied] = useState(null);

  function handleCopy(code) {
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section style={{ backgroundColor: theme.colors.background, padding: `12px ${theme.spacing.containerPadding}`, marginTop: theme.spacing.sectionGap }}>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", maxWidth: 1280, margin: "0 auto", paddingBottom: 4 }}>
        {content.items.map((coupon) => (
          <div
            key={coupon.id}
            style={{
              minWidth: 260,
              border: `2px dashed ${theme.colors.primary}`,
              borderRadius: theme.radius.card,
              backgroundColor: theme.colors.surface,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: theme.colors.textPrimary, marginBottom: 2 }}>{coupon.title}</div>
              <div style={{ fontSize: 12, color: theme.colors.textSecondary }}>{coupon.subtitle}</div>
              <code style={{ fontSize: 13, fontWeight: 700, color: theme.colors.primary, marginTop: 4, display: "block" }}>{coupon.code}</code>
            </div>
            <button
              onClick={() => handleCopy(coupon.code)}
              style={{
                backgroundColor: copied === coupon.code ? "#16A34A" : theme.colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: theme.radius.button,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
            >
              {copied === coupon.code ? "✓ Copied!" : coupon.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Product Rail  (variants: scroll | peek) ──────────────────────────────────

function ProductRailSection({ content, theme, breakpoint, variant }) {
  const itemWidth = breakpoint === "mobile" ? 148 : breakpoint === "tablet" ? 170 : 200;
  const gap = breakpoint === "mobile" ? 10 : 16;

  return (
    <section style={{ backgroundColor: theme.colors.surface, padding: `20px ${theme.spacing.containerPadding}`, marginTop: theme.spacing.sectionGap }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <SectionTitle title={content.title} theme={theme} noMargin />
          <button
            style={{
              color: theme.colors.primary,
              background: "none",
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: theme.radius.button,
              padding: "6px 16px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {content.ctaLabel}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: gap,
            overflowX: "auto",
            paddingBottom: 8,
            paddingRight: variant === "peek" ? itemWidth * 0.4 : 0,
            scrollbarWidth: "thin",
          }}
        >
          {content.items.map((product) => (
            <ProductCard key={product.id} product={product} theme={theme} itemWidth={itemWidth} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Grid  (variants: grid | masonry | list) ─────────────────────────

function ProductGridComponent({ content, theme, breakpoint, variant }) {
  const [sortBy, setSortBy] = useState(content?.sortOptions?.[0]?.value || "relevance");
  const cols =
    variant === "list" ? 1
    : breakpoint === "mobile" ? 2
    : breakpoint === "tablet" ? 3
    : 4;

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      {/* Sort bar */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.colors.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 13, color: theme.colors.textSecondary, fontWeight: 500 }}>
          {content?.totalCount?.toLocaleString("en-IN")} Products
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: theme.colors.textSecondary }}>Sort by :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.button,
              padding: "4px 8px",
              cursor: "pointer",
              backgroundColor: theme.colors.surface,
            }}
          >
            {(content?.sortOptions || []).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: variant === "list" ? "flex" : "grid",
          flexDirection: variant === "list" ? "column" : undefined,
          gridTemplateColumns: variant !== "list" ? `repeat(${cols}, 1fr)` : undefined,
          gap: theme.spacing.cardGap,
          padding: "16px",
          overflowY: "auto",
          flex: 1,
          alignContent: "start",
        }}
      >
        {(content?.items || []).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            theme={theme}
            itemWidth={variant === "list" ? "100%" : undefined}
            listMode={variant === "list"}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Promo Grid  (variants: 2col | 3col | fullrow) ───────────────────────────

function PromoGridSection({ content, theme, breakpoint, variant }) {
  const cols =
    variant === "3col" ? (breakpoint === "mobile" ? 1 : 3)
    : variant === "fullrow" ? 1
    : (breakpoint === "mobile" ? 1 : 2);

  return (
    <section style={{ padding: `20px ${theme.spacing.containerPadding}`, marginTop: theme.spacing.sectionGap }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle title={content.title} theme={theme} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: theme.spacing.cardGap }}>
          {content.items.map((promo) => (
            <div
              key={promo.id}
              style={{
                borderRadius: theme.radius.card,
                overflow: "hidden",
                position: "relative",
                minHeight: 180,
                cursor: "pointer",
                backgroundColor: promo.bgColor || theme.colors.primary,
                boxShadow: theme.shadow.card,
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={withImageFallback(promo.imageUrl, 600, 300)}
                alt={promo.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }}
              />
              <div style={{ position: "relative", zIndex: 1, padding: "24px 28px", color: "#fff" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 6 }}>{promo.title}</h3>
                <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 16 }}>{promo.subtitle}</p>
                <button
                  style={{
                    backgroundColor: "#fff",
                    color: promo.bgColor || theme.colors.primary,
                    border: "none",
                    borderRadius: theme.radius.button,
                    padding: "8px 20px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {promo.ctaLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promo Banner  (variants: default | overlay) ──────────────────────────────

function PromoBannerComponent({ content, theme, variant }) {
  const overlayOpacity = variant === "overlay" ? 0.5 : 0.3;

  return (
    <div
      style={{
        position: "relative",
        minHeight: 220,
        height: "100%",
        backgroundColor: content?.bgColor || theme.colors.primary,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.querySelector("img").style.transform = "scale(1.04)")}
      onMouseLeave={(e) => (e.currentTarget.querySelector("img").style.transform = "scale(1)")}
    >
      <img
        src={withImageFallback(content?.imageUrl, 700, 420)}
        alt={content?.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: overlayOpacity,
          transition: "transform 0.4s ease",
        }}
      />
      {/* gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${content?.bgColor || theme.colors.primary}cc 0%, transparent 70%)`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, padding: "32px 40px", color: "#fff", maxWidth: 480 }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>{content?.title}</h2>
        <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 20 }}>{content?.subtitle}</p>
        <button
          style={{
            backgroundColor: "#fff",
            color: content?.bgColor || theme.colors.primary,
            border: "none",
            borderRadius: theme.radius.button,
            padding: "10px 24px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {content?.ctaLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Brand Carousel  (variants: carousel | grid) ──────────────────────────────

function BrandCarouselSection({ content, theme, breakpoint, variant }) {
  const itemWidth = breakpoint === "mobile" ? 100 : breakpoint === "tablet" ? 120 : 140;
  const gap = breakpoint === "mobile" ? 10 : 20;

  if (variant === "grid") {
    const cols = breakpoint === "mobile" ? 3 : breakpoint === "tablet" ? 4 : 6;
    return (
      <section style={{ backgroundColor: theme.colors.surface, padding: `20px ${theme.spacing.containerPadding}`, marginTop: theme.spacing.sectionGap }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionTitle title={content.title} theme={theme} />
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
            {content.items.map((brand) => (
              <BrandCard key={brand.id} brand={brand} theme={theme} itemWidth={undefined} grid />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ backgroundColor: theme.colors.surface, padding: `20px ${theme.spacing.containerPadding}`, marginTop: theme.spacing.sectionGap }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle title={content.title} theme={theme} />
        <div style={{ display: "flex", gap, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {content.items.map((brand) => (
            <BrandCard key={brand.id} brand={brand} theme={theme} itemWidth={itemWidth} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandCard({ brand, theme, itemWidth, grid }) {
  return (
    <button
      style={{
        minWidth: grid ? undefined : itemWidth,
        maxWidth: grid ? undefined : itemWidth,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "12px 8px",
        background: "none",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.card,
        cursor: "pointer",
        transition: "border-color 0.15s, transform 0.15s",
        width: grid ? "100%" : undefined,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.colors.primary; e.currentTarget.style.transform = "scale(1.03)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.colors.border; e.currentTarget.style.transform = "scale(1)"; }}
    >
      <div style={{ width: grid ? 60 : (itemWidth ? itemWidth - 20 : 100), height: 50, overflow: "hidden", borderRadius: 6 }}>
        <img
          src={withImageFallback(brand.logoUrl, 120, 60)}
          alt={brand.label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: theme.colors.textPrimary }}>{brand.label}</span>
    </button>
  );
}

// ─── Brand List  (variant: default) ──────────────────────────────────────────

function BrandListComponent({ content, theme }) {
  return (
    <section style={{ backgroundColor: theme.colors.surface, padding: "20px 16px" }}>
      <SectionTitle title={content?.title} theme={theme} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(content?.items || []).map((brand) => (
          <button
            key={brand.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 12px",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.card,
              background: "none",
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = theme.colors.primary; e.currentTarget.style.background = theme.colors.background; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = theme.colors.border; e.currentTarget.style.background = "none"; }}
          >
            <img
              src={withImageFallback(brand.logoUrl, 40, 40)}
              alt={brand.label}
              style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 4 }}
            />
            <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.textPrimary }}>{brand.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Filter Sidebar  (variants: default | compact) ───────────────────────────

function FilterSidebarComponent({ content, theme, variant }) {
  const [openGroups, setOpenGroups] = useState(() => {
    const init = {};
    (content?.groups || []).forEach((g) => { init[g.id] = true; });
    return init;
  });
  const [selected, setSelected] = useState({});

  function toggleGroup(id) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleOption(groupId, value) {
    setSelected((prev) => {
      const current = new Set(prev[groupId] || []);
      current.has(value) ? current.delete(value) : current.add(value);
      return { ...prev, [groupId]: current };
    });
  }

  function clearAll() {
    setSelected({});
  }

  const totalSelected = Object.values(selected).reduce((sum, s) => sum + s.size, 0);
  const isCompact = variant === "compact";

  return (
    <aside
      style={{
        backgroundColor: theme.colors.surface,
        borderRight: `1px solid ${theme.colors.border}`,
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isCompact ? "12px 14px" : "16px 18px",
          borderBottom: `1px solid ${theme.colors.border}`,
          position: "sticky",
          top: 0,
          backgroundColor: theme.colors.surface,
          zIndex: 1,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: isCompact ? 13 : 15, color: theme.colors.textPrimary, letterSpacing: 0.5 }}>
          {content?.title || "FILTERS"}
        </span>
        {totalSelected > 0 && (
          <button
            onClick={clearAll}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.primary,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Filter groups */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {(content?.groups || []).map((group) => {
          const groupSelected = selected[group.id] || new Set();
          return (
            <div
              key={group.id}
              style={{ borderBottom: `1px solid ${theme.colors.border}` }}
            >
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: isCompact ? "10px 14px" : "14px 18px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: isCompact ? 12 : 13,
                  color: theme.colors.textPrimary,
                  textAlign: "left",
                }}
              >
                <span>
                  {group.label}
                  {groupSelected.size > 0 && (
                    <span
                      style={{
                        marginLeft: 6,
                        backgroundColor: theme.colors.primary,
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: theme.radius.pill,
                        padding: "1px 6px",
                      }}
                    >
                      {groupSelected.size}
                    </span>
                  )}
                </span>
                <span style={{ color: theme.colors.textSecondary, fontSize: 10 }}>
                  {openGroups[group.id] ? "▲" : "▼"}
                </span>
              </button>

              {/* Options */}
              {openGroups[group.id] && (
                <div style={{ padding: isCompact ? "4px 14px 12px" : "4px 18px 14px" }}>
                  {group.options.map((opt) => (
                    <label
                      key={opt.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "5px 0",
                        cursor: "pointer",
                        fontSize: isCompact ? 12 : 13,
                        color: groupSelected.has(opt.value) ? theme.colors.primary : theme.colors.textPrimary,
                        fontWeight: groupSelected.has(opt.value) ? 600 : 400,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={groupSelected.has(opt.value)}
                        onChange={() => toggleOption(group.id, opt.value)}
                        style={{ accentColor: theme.colors.primary, cursor: "pointer" }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Video Banner  (variant: default) ────────────────────────────────────────

function VideoBannerComponent({ content, theme }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: 280 }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        src={content?.videoUrl}
        poster={content?.posterUrl}
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 100%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", color: "#fff" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>{content?.title}</h2>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 24, maxWidth: 480 }}>{content?.subtitle}</p>
          {content?.ctaLabel && (
            <button
              style={{
                backgroundColor: theme.colors.secondary || "#fff",
                color: "#111",
                border: "none",
                borderRadius: theme.radius.button,
                padding: "12px 32px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {content.ctaLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Advertisement  (variants: default | inline) ─────────────────────────────

function AdvertisementComponent({ content, theme, variant }) {
  const maxH = variant === "inline" ? 80 : 140;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        maxHeight: maxH,
        backgroundColor: theme.colors.border,
      }}
      onClick={() => content?.targetUrl && window.open(content.targetUrl, "_blank")}
    >
      <span
        style={{
          position: "absolute",
          top: 6,
          right: 10,
          fontSize: 10,
          fontWeight: 700,
          color: theme.colors.textSecondary,
          backgroundColor: "rgba(255,255,255,0.85)",
          padding: "1px 5px",
          borderRadius: 2,
          zIndex: 1,
          letterSpacing: 0.5,
        }}
      >
        Ad
      </span>
      <img
        src={withImageFallback(content?.imageUrl, 1200, maxH)}
        alt={content?.alt || "Advertisement"}
        style={{ width: "100%", height: maxH, objectFit: "cover", display: "block", transition: "opacity 0.2s" }}
      />
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function FooterSection({ content, theme }) {
  return (
    <footer style={{ backgroundColor: theme.colors.footerBg, color: theme.colors.footerText, paddingTop: 40 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${theme.spacing.containerPadding}` }}>
        {/* Brand */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: 4 }}>{content.logoText}</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>{content.tagline}</div>
        </div>

        {/* Link columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 32, marginBottom: 40 }}>
          {content.columns.map((col) => (
            <div key={col.heading}>
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  opacity: 0.9,
                }}
              >
                {col.heading}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: theme.colors.footerText,
                        fontSize: 13,
                        opacity: 0.7,
                        padding: 0,
                        textAlign: "left",
                      }}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            padding: "16px 0",
            fontSize: 12,
            opacity: 0.5,
            textAlign: "center",
          }}
        >
          {content.copyright}
        </div>
      </div>
    </footer>
  );
}

// ─── Container  (variants: row | column | stack) ──────────────────────────────
//
// Renders a nested 100×100 CSS sub-grid.
// Children use their own colStart/colEnd/rowStart/rowEnd within this container.
// Supports recursive nesting.

function ContainerComponent({ region, theme, breakpoint }) {
  const children = region.children || [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(100, 1fr)",
        gridAutoRows: "minmax(0, auto)",
        width: "100%",
        height: "100%",
      }}
    >
      {children.map((child) => {
        const placement = getPlacement(child, breakpoint);
        if (!placement) return null;

        const Component = COMPONENT_MAP[child.component];
        if (!Component) return null;

        const content = getRegionContent(schema, child.contentId);
        const config = child.config || {};
        const variant = child.variant || "default";

        return (
          <div key={child.id} style={buildGridStyle(placement)}>
            <Component
              content={content}
              config={config}
              theme={theme}
              breakpoint={breakpoint}
              variant={variant}
              region={child}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared: Product Card ─────────────────────────────────────────────────────

function ProductCard({ product, theme, itemWidth, listMode }) {
  const discount = calcDiscount(product.price, product.originalPrice);
  const width = typeof itemWidth === "number" ? itemWidth : undefined;

  return (
    <div
      style={{
        minWidth: listMode ? undefined : width || 200,
        maxWidth: listMode ? undefined : width || 200,
        width: listMode ? "100%" : undefined,
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.card,
        overflow: "hidden",
        boxShadow: theme.shadow.card,
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        flexShrink: 0,
        display: listMode ? "flex" : "block",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = theme.shadow.elevated || theme.shadow.card; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = theme.shadow.card; }}
    >
      {/* Image */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={withImageFallback(product.imageUrl, width || 200, width || 200)}
          alt={product.title}
          style={{
            width: listMode ? 100 : "100%",
            height: listMode ? 100 : width || 200,
            objectFit: "cover",
            display: "block",
          }}
        />
        {discount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: theme.colors.accent || "#FB641B",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 4,
              padding: "2px 6px",
            }}
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px", flex: 1 }}>
        <div style={{ fontSize: 11, color: theme.colors.textSecondary, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>
          {product.brand}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: theme.colors.textPrimary,
            marginBottom: 6,
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.title}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: theme.colors.textPrimary }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span style={{ fontSize: 12, color: theme.colors.textSecondary, textDecoration: "line-through" }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.rating && (
          <div style={{ marginTop: 4, fontSize: 11, color: theme.colors.textSecondary, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ backgroundColor: "#388E3C", color: "#fff", borderRadius: 3, padding: "1px 5px", fontSize: 11, fontWeight: 600 }}>
              ★ {product.rating}
            </span>
            <span>({(product.reviews / 1000).toFixed(1)}k)</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared: Section Title ────────────────────────────────────────────────────

function SectionTitle({ title, theme, noMargin }) {
  if (!title) return null;
  return (
    <h2
      style={{
        fontSize: theme.typography.sectionTitleSize,
        fontWeight: 700,
        color: theme.colors.textPrimary,
        marginBottom: noMargin ? 0 : 16,
        lineHeight: 1.3,
      }}
    >
      {title}
    </h2>
  );
}

// ─── Component Map ────────────────────────────────────────────────────────────
// Declared after all component functions so all refs are initialized.
// The component key must match the "component" field in the schema.

const COMPONENT_MAP = {
  header:        HeaderSection,
  heroBanner:    HeroBannerSection,
  categoryGrid:  CategoryGridSection,
  couponStrip:   CouponStripSection,
  productRail:   ProductRailSection,
  productGrid:   ProductGridComponent,
  promoGrid:     PromoGridSection,
  promoBanner:   PromoBannerComponent,
  brandCarousel: BrandCarouselSection,
  brandList:     BrandListComponent,
  filterSidebar: FilterSidebarComponent,
  videoBanner:   VideoBannerComponent,
  advertisement: AdvertisementComponent,
  footer:        FooterSection,
  container:     ContainerComponent,
};
