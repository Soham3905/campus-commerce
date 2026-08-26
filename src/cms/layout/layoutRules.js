/**
 * Layout Rules & Defaults for SDUI Components
 * Defines realistic device-specific column spans, row spans, and overlay permissions.
 *
 * Grid Model: gridAutoRows ≈ 10px, so rowSpan = ceil(pixelHeight / 10).
 */

/**
 * Parse a CSS height string like "48px" into a number of pixels.
 * Returns null for relative / calc / percentage / unparseable values.
 */
function parsePx(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.endsWith("px")) {
    const n = parseFloat(trimmed);
    return isNaN(n) ? null : n;
  }
  return null;
}

/**
 * Row-span lookup table keyed by component type.
 * These are used as FALLBACKS when the component's containerStyle
 * does not declare an explicit pixel height.
 *
 * Values represent grid rows (each ≈ 10px).
 */
export const DEVICE_ROW_SPANS = {
  Header: { mobile: 5, tablet: 5, desktop: 5 },
  SearchBar: { mobile: 6, tablet: 5, desktop: 5 },
  StoryRow: { mobile: 12, tablet: 11, desktop: 11 },
  CategoryGrid: { mobile: 10, tablet: 8, desktop: 8 },
  Carousel: { mobile: 24, tablet: 23, desktop: 23 },
  HeroBanner: { mobile: 40, tablet: 40, desktop: 40 },
  CouponCode: { mobile: 11, tablet: 11, desktop: 11 },
  CountDownTimer: { mobile: 8, tablet: 8, desktop: 8 },
  ProductList: { mobile: 57, tablet: 57, desktop: 57 },
  ProductCard: { mobile: 52, tablet: 52, desktop: 52 },
  Footer: { mobile: 28, tablet: 28, desktop: 28 },
  NavBar: { mobile: 7, tablet: 7, desktop: 6 },
  IFrame: { mobile: 24, tablet: 22, desktop: 20 },
  Box: { mobile: 20, tablet: 20, desktop: 20 },
  Title: { mobile: 5, tablet: 5, desktop: 4 },
  Description: { mobile: 6, tablet: 5, desktop: 4 },
  Text: { mobile: 4, tablet: 4, desktop: 3 },
  Badge: { mobile: 4, tablet: 3, desktop: 3 },
  Image: { mobile: 22, tablet: 20, desktop: 18 },
  PriceBlock: { mobile: 5, tablet: 4, desktop: 4 },
  OfferText: { mobile: 4, tablet: 3, desktop: 3 },
  DeliveryInfo: { mobile: 4, tablet: 4, desktop: 3 },
  Button: { mobile: 5, tablet: 5, desktop: 4 },
  ShareButton: { mobile: 4, tablet: 4, desktop: 3 },
  Rating: { mobile: 4, tablet: 3, desktop: 3 },
  Score: { mobile: 4, tablet: 3, desktop: 3 },
  ReviewCount: { mobile: 4, tablet: 3, desktop: 3 },
  Sponsored: { mobile: 3, tablet: 3, desktop: 2 },
  CategoryItem: { mobile: 8, tablet: 7, desktop: 6 },
  StoryCircle: { mobile: 8, tablet: 7, desktop: 6 },
  HeaderButton: { mobile: 5, tablet: 4, desktop: 4 },
};

export const DEFAULT_DEVICE_SPANS = {
  Header: { rowSpan: 5, colSpan: 100 },
  SearchBar: { rowSpan: 5, colSpan: 100 },
  StoryRow: { rowSpan: 11, colSpan: 100 },
  CategoryGrid: { rowSpan: 8, colSpan: 100 },
  Carousel: { rowSpan: 23, colSpan: 100 },
  HeroBanner: { rowSpan: 40, colSpan: 100 },
  CouponCode: { rowSpan: 11, colSpan: 100 },
  CountDownTimer: { rowSpan: 8, colSpan: 100 },
  ProductList: { rowSpan: 57, colSpan: 100 },
  ProductCard: { rowSpan: 52, colSpan: 100 },
  Footer: { rowSpan: 28, colSpan: 100 },
  NavBar: { rowSpan: 6, colSpan: 100 },
  IFrame: { rowSpan: 20, colSpan: 100 },
  Box: { rowSpan: 20, colSpan: 100 },
  Title: { rowSpan: 4, colSpan: 100 },
  Description: { rowSpan: 4, colSpan: 100 },
  Text: { rowSpan: 3, colSpan: 100 },
  Badge: { rowSpan: 3, colSpan: 50 },
  Image: { rowSpan: 18, colSpan: 100 },
  PriceBlock: { rowSpan: 4, colSpan: 100 },
  OfferText: { rowSpan: 3, colSpan: 100 },
  DeliveryInfo: { rowSpan: 3, colSpan: 100 },
  Button: { rowSpan: 4, colSpan: 100 },
  ShareButton: { rowSpan: 3, colSpan: 30 },
  Rating: { rowSpan: 3, colSpan: 50 },
  Score: { rowSpan: 3, colSpan: 25 },
  ReviewCount: { rowSpan: 3, colSpan: 25 },
  Sponsored: { rowSpan: 2, colSpan: 30 },
  CategoryItem: { rowSpan: 6, colSpan: 20 },
  StoryCircle: { rowSpan: 6, colSpan: 15 },
  HeaderButton: { rowSpan: 4, colSpan: 25 },
};

/**
 * Gets default height (in grid rows) for a component type and device.
 *
 * Priority:
 *   1. containerStyle.height in pixels  → ceil(px / 10)
 *   2. Content-aware heuristic per type  → custom logic
 *   3. DEVICE_ROW_SPANS fallback table   → static lookup
 *
 * IMPORTANT: This function must NOT read component.placement.
 * Doing so creates a circular dependency where stale row values persist forever.
 *
 * @param {string|Object} component - Component type string or schema node object
 * @param {string} [device='desktop'] - 'mobile' | 'tablet' | 'desktop'
 * @returns {number} Row span (each row ≈ 10px)
 */
export function getDefaultRowSpan(component, device = "desktop") {
  const type = typeof component === "object" && component ? component.type : component;

  // ── 1. Try explicit CSS pixel height from containerStyle ──
  if (typeof component === "object" && component?.containerStyle) {
    const cs = component.containerStyle;
    const px = parsePx(cs.height) || parsePx(cs.minHeight);
    if (px !== null && px > 0) {
      // Account for vertical padding if parseable
      let paddingPx = 0;
      const padTop = parsePx(cs.paddingTop);
      const padBot = parsePx(cs.paddingBottom);
      if (padTop !== null) paddingPx += padTop;
      if (padBot !== null) paddingPx += padBot;
      // If padding shorthand is a single px value (all sides), use top+bottom
      if (paddingPx === 0) {
        const padAll = parsePx(cs.padding);
        if (padAll !== null) paddingPx = padAll * 2;
      }
      return Math.ceil((px + paddingPx) / 10);
    }
  }

  // ── 2. Content-aware heuristic for compound types ──
  if (typeof component === "object" && component) {
    if (type === "ProductList") {
      // Horizontal scroll of 516px product cards + vertical padding
      return 57;
    }

    if (type === "Box") {
      const cs = component.containerStyle || {};
      const childCount = Array.isArray(component.children) ? component.children.length : 0;

      // Grid box (product card grid)
      if (cs.display === "grid" && childCount > 0) {
        const cols = device === "mobile" ? 2 : device === "tablet" ? 3 : 4;
        const rowsOfCards = Math.ceil(childCount / cols);
        return rowsOfCards * 30 + 4; // ~300px per row of cards + padding
      }

      // Horizontal flex row (coupons, countdown timers)
      if (cs.display === "flex" && cs.overflowX) {
        return 11;
      }

      return 20;
    }

    if (type === "HeroBanner") {
      return 40; // ~400px hero image
    }

    if (type === "Footer") {
      return 28;
    }
  }

  // ── 3. Static lookup fallback ──
  const deviceSpans = DEVICE_ROW_SPANS[type] || { mobile: 10, tablet: 10, desktop: 10 };
  return deviceSpans[device] || deviceSpans.desktop || 10;
}

/**
 * Gets default width (in grid columns) for a component type.
 * @param {string} type - Component type
 * @returns {number} Default column span (1..100)
 */
export function getDefaultColSpan(type) {
  return DEFAULT_DEVICE_SPANS[type]?.colSpan || 100;
}

/**
 * Checks if a component permits intentional child overlays (e.g. HeroBanner, Box).
 * @param {string} parentType - Parent component type
 * @returns {boolean} True if overlay positioning is permitted
 */
export function allowsOverlayLayout(parentType) {
  return parentType === "HeroBanner";
}

export default {
  DEVICE_ROW_SPANS,
  DEFAULT_DEVICE_SPANS,
  getDefaultRowSpan,
  getDefaultColSpan,
  allowsOverlayLayout,
};
