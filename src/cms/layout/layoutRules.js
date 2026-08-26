/**
 * Layout Rules & Defaults for SDUI Components
 * Defines realistic device-specific column spans, row spans, and overlay permissions.
 */

export const DEVICE_ROW_SPANS = {
  Header: { mobile: 15, tablet: 10, desktop: 6 },
  SearchBar: { mobile: 6, tablet: 6, desktop: 5 },
  StoryRow: { mobile: 14, tablet: 13, desktop: 12 },
  CategoryGrid: { mobile: 14, tablet: 12, desktop: 11 },
  Carousel: { mobile: 26, tablet: 24, desktop: 22 },
  HeroBanner: { mobile: 32, tablet: 28, desktop: 24 },
  CouponCode: { mobile: 13, tablet: 12, desktop: 11 },
  CountDownTimer: { mobile: 13, tablet: 12, desktop: 11 },
  ProductList: { mobile: 57, tablet: 56, desktop: 55 },
  ProductCard: { mobile: 44, tablet: 42, desktop: 40 },
  Footer: { mobile: 40, tablet: 35, desktop: 30 },
  NavBar: { mobile: 7, tablet: 7, desktop: 6 },
  IFrame: { mobile: 24, tablet: 22, desktop: 20 },
  Box: { mobile: 26, tablet: 25, desktop: 24 },
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
  Header: { rowSpan: 6, colSpan: 100 },
  SearchBar: { rowSpan: 5, colSpan: 100 },
  StoryRow: { rowSpan: 12, colSpan: 100 },
  CategoryGrid: { rowSpan: 11, colSpan: 100 },
  Carousel: { rowSpan: 22, colSpan: 100 },
  HeroBanner: { rowSpan: 24, colSpan: 100 },
  CouponCode: { rowSpan: 11, colSpan: 100 },
  CountDownTimer: { rowSpan: 11, colSpan: 100 },
  ProductList: { rowSpan: 55, colSpan: 100 },
  ProductCard: { rowSpan: 40, colSpan: 100 },
  Footer: { rowSpan: 30, colSpan: 100 },
  NavBar: { rowSpan: 6, colSpan: 100 },
  IFrame: { rowSpan: 20, colSpan: 100 },
  Box: { rowSpan: 24, colSpan: 100 },
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
 * @param {string|Object} component - Component type or node object
 * @param {string} [device='desktop'] - 'mobile' | 'tablet' | 'desktop'
 * @returns {number} Default row span
 */
export function getDefaultRowSpan(component, device = "desktop") {
  const type = typeof component === "object" && component ? component.type : component;
  const deviceSpans = DEVICE_ROW_SPANS[type] || { mobile: 10, tablet: 10, desktop: 10 };
  let baseSpan = deviceSpans[device] || deviceSpans.desktop || 10;

  if (typeof component === "object" && component) {
    if (type === "Header" && Array.isArray(component.children) && component.children.length >= 3) {
      if (device === "mobile") baseSpan = Math.max(baseSpan, 15);
      else if (device === "tablet") baseSpan = Math.max(baseSpan, 10);
    }
    if (type === "ProductList" && Array.isArray(component.children) && component.children.length > 0) {
      baseSpan = Math.max(baseSpan, device === "mobile" ? 57 : device === "tablet" ? 56 : 55);
    }
  }

  return baseSpan;
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
