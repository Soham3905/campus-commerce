// LandingPageRenderer.jsx
// Fully JSON-driven landing page renderer.
// Change themeId or content in the schema — no code changes needed.

import { useState, useEffect, useRef } from "react";
import schema from "./landing.schema.json";
import {
  getCurrentBreakpoint,
  getTheme,
  getLayout,
  getPage,
  getVisibleSections,
  getSectionContent,
  getSectionConfig,
  calcDiscount,
  formatPrice,
  withImageFallback,
  buildCssVars,
} from "./sduiLogic.js";

// ─── Theme Provider ────────────────────────────────────────────────────────────

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

// ─── Root Renderer ─────────────────────────────────────────────────────────────

export default function LandingPageRenderer({ pageId = "home", themeOverride }) {
  const page = getPage(schema, pageId);
  const themeId = themeOverride || page.themeId;
  const theme = useTheme(themeId);
  const breakpoint = useBreakpoint();
  const layout = getLayout(schema, breakpoint);
  const visibleSections = getVisibleSections(schema, pageId);

  // Inject CSS variables onto root element
  const cssVars = buildCssVars(theme);
  const styleVars = Object.entries(cssVars)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");

  const SECTION_COMPONENTS = {
    header: HeaderSection,
    heroBanner: HeroBannerSection,
    categoryGrid: CategoryGridSection,
    couponStrip: CouponStripSection,
    productRail: ProductRailSection,
    promoGrid: PromoGridSection,
    brandCarousel: BrandCarouselSection,
    footer: FooterSection,
  };

  return (
    <div
      style={{
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        ...cssVars,
      }}
      className="min-h-screen"
    >
      {visibleSections.map((sectionId) => {
        const SectionComponent = SECTION_COMPONENTS[sectionId];
        if (!SectionComponent) return null;

        const content = getSectionContent(schema, sectionId);
        const config = getSectionConfig(schema, sectionId);

        return (
          <SectionComponent
            key={sectionId}
            content={content}
            config={config}
            theme={theme}
            layout={layout}
            breakpoint={breakpoint}
          />
        );
      })}
    </div>
  );
}

// ─── Header Section ───────────────────────────────────────────────────────────

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
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.25rem",
              color: theme.colors.headerText,
              letterSpacing: -0.5,
            }}
          >
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

        {/* Nav actions */}
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
                opacity: 0.95,
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

// ─── Hero Banner Section ──────────────────────────────────────────────────────

function HeroBannerSection({ content, config, theme, breakpoint }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const slides = content.slides || [];

  useEffect(() => {
    if (!config.autoplay || slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, config.autoplayInterval || 4000);
    return () => clearInterval(timerRef.current);
  }, [config.autoplay, config.autoplayInterval, slides.length]);

  if (!slides.length) return null;
  const slide = slides[current];
  const isMobile = breakpoint === "mobile";

  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <div
        style={{
          backgroundColor: slide.bgColor || theme.colors.primary,
          minHeight: isMobile ? 220 : 400,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image */}
        <img
          src={withImageFallback(slide.imageUrl, 1200, 450)}
          alt={slide.imageAlt || ""}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1280,
            margin: "0 auto",
            padding: isMobile ? "32px 20px" : "64px 48px",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: theme.colors.secondary,
              color: theme.colors.primaryText === "#FFFFFF" ? "#111" : theme.colors.primaryText,
              borderRadius: theme.radius.pill,
              padding: "4px 14px",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
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
          <p
            style={{
              fontSize: isMobile ? "0.9rem" : "1.125rem",
              color: "rgba(255,255,255,0.85)",
              marginBottom: 28,
              maxWidth: 480,
            }}
          >
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
              letterSpacing: 0.5,
            }}
          >
            {slide.ctaLabel}
          </button>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            padding: "10px 0",
            backgroundColor: theme.colors.surface,
          }}
        >
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
      )}
    </section>
  );
}

// ─── Category Grid Section ────────────────────────────────────────────────────

function CategoryGridSection({ content, theme, layout, breakpoint }) {
  const cols = layout.categoryGrid?.columns || 4;
  return (
    <section
      style={{
        backgroundColor: theme.colors.surface,
        padding: `20px ${theme.spacing.containerPadding}`,
        marginTop: theme.spacing.sectionGap,
      }}
    >
      <SectionTitle title={content.title} theme={theme} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 8,
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        {content.items.map((item) => (
          <CategoryCard key={item.id} item={item} theme={theme} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ item, theme }) {
  return (
    <button
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
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          overflow: "hidden",
          border: `2px solid ${theme.colors.border}`,
        }}
      >
        <img
          src={withImageFallback(item.iconUrl, 64, 64)}
          alt={item.label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span
        style={{
          fontSize: theme.typography.captionSize,
          fontWeight: 600,
          color: theme.colors.textPrimary,
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {item.label}
      </span>
    </button>
  );
}

// ─── Coupon Strip Section ─────────────────────────────────────────────────────

function CouponStripSection({ content, theme, breakpoint }) {
  const [copied, setCopied] = useState(null);

  function handleCopy(code) {
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <section
      style={{
        backgroundColor: theme.colors.background,
        padding: `12px ${theme.spacing.containerPadding}`,
        marginTop: theme.spacing.sectionGap,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          maxWidth: 1280,
          margin: "0 auto",
          paddingBottom: 4,
        }}
      >
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
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: theme.colors.textPrimary,
                  marginBottom: 2,
                }}
              >
                {coupon.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: theme.colors.textSecondary,
                }}
              >
                {coupon.subtitle}
              </div>
              <code
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.colors.primary,
                  marginTop: 4,
                  display: "block",
                }}
              >
                {coupon.code}
              </code>
            </div>
            <button
              onClick={() => handleCopy(coupon.code)}
              style={{
                backgroundColor:
                  copied === coupon.code ? theme.colors.accent || "#16A34A" : theme.colors.primary,
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

// ─── Product Rail Section ─────────────────────────────────────────────────────

function ProductRailSection({ content, theme, layout, breakpoint }) {
  const itemWidth = layout.productRail?.itemWidth || 200;
  const gap = layout.productRail?.gap || 16;

  return (
    <section
      style={{
        backgroundColor: theme.colors.surface,
        padding: `20px ${theme.spacing.containerPadding}`,
        marginTop: theme.spacing.sectionGap,
      }}
    >
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

function ProductCard({ product, theme, itemWidth }) {
  const discount = calcDiscount(product.price, product.originalPrice);

  return (
    <div
      style={{
        minWidth: itemWidth,
        maxWidth: itemWidth,
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.card,
        overflow: "hidden",
        boxShadow: theme.shadow.card,
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = theme.shadow.elevated || theme.shadow.card;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = theme.shadow.card;
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={withImageFallback(product.imageUrl, itemWidth, itemWidth)}
          alt={product.title}
          style={{ width: "100%", height: itemWidth, objectFit: "cover", display: "block" }}
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
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            fontSize: 11,
            color: theme.colors.textSecondary,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 2,
          }}
        >
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
            <span
              style={{
                fontSize: 12,
                color: theme.colors.textSecondary,
                textDecoration: "line-through",
              }}
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.rating && (
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              color: theme.colors.textSecondary,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                backgroundColor: "#388E3C",
                color: "#fff",
                borderRadius: 3,
                padding: "1px 5px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              ★ {product.rating}
            </span>
            <span>({(product.reviews / 1000).toFixed(1)}k)</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Promo Grid Section ───────────────────────────────────────────────────────

function PromoGridSection({ content, theme, layout, breakpoint }) {
  const cols = layout.promoGrid?.columns || 2;

  return (
    <section
      style={{
        padding: `20px ${theme.spacing.containerPadding}`,
        marginTop: theme.spacing.sectionGap,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle title={content.title} theme={theme} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: theme.spacing.cardGap,
          }}
        >
          {content.items.map((promo) => (
            <PromoCard key={promo.id} promo={promo} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoCard({ promo, theme }) {
  return (
    <div
      style={{
        borderRadius: theme.radius.card,
        overflow: "hidden",
        position: "relative",
        minHeight: 180,
        cursor: "pointer",
        backgroundColor: promo.bgColor || theme.colors.primary,
        boxShadow: theme.shadow.card,
      }}
    >
      <img
        src={withImageFallback(promo.imageUrl, 600, 300)}
        alt={promo.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "24px 28px",
          color: "#fff",
        }}
      >
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
  );
}

// ─── Brand Carousel Section ───────────────────────────────────────────────────

function BrandCarouselSection({ content, theme, layout }) {
  const itemWidth = layout.brandCarousel?.itemWidth || 140;
  const gap = layout.brandCarousel?.gap || 20;

  return (
    <section
      style={{
        backgroundColor: theme.colors.surface,
        padding: `20px ${theme.spacing.containerPadding}`,
        marginTop: theme.spacing.sectionGap,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionTitle title={content.title} theme={theme} />
        <div
          style={{
            display: "flex",
            gap: gap,
            overflowX: "auto",
            paddingBottom: 8,
            scrollbarWidth: "none",
          }}
        >
          {content.items.map((brand) => (
            <BrandCard key={brand.id} brand={brand} theme={theme} itemWidth={itemWidth} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandCard({ brand, theme, itemWidth }) {
  return (
    <button
      style={{
        minWidth: itemWidth,
        maxWidth: itemWidth,
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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.colors.primary;
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = theme.colors.border;
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          width: itemWidth - 20,
          height: 60,
          overflow: "hidden",
          borderRadius: 6,
        }}
      >
        <img
          src={withImageFallback(brand.logoUrl, itemWidth, 60)}
          alt={brand.label}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.colors.textPrimary,
        }}
      >
        {brand.label}
      </span>
    </button>
  );
}

// ─── Footer Section ───────────────────────────────────────────────────────────

function FooterSection({ content, theme }) {
  return (
    <footer
      style={{
        backgroundColor: theme.colors.footerBg,
        color: theme.colors.footerText,
        marginTop: theme.spacing.sectionGap,
        paddingTop: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `0 ${theme.spacing.containerPadding}`,
        }}
      >
        {/* Brand */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontWeight: 800, fontSize: "1.25rem", marginBottom: 4 }}>
            {content.logoText}
          </div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>{content.tagline}</div>
        </div>

        {/* Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 32,
            marginBottom: 40,
          }}
        >
          {content.columns.map((col) => (
            <div key={col.heading}>
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: 13,
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
            borderTop: `1px solid rgba(255,255,255,0.12)`,
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

// ─── Shared: Section Title ─────────────────────────────────────────────────────

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
