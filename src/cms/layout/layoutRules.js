/**
 * Layout Rules & Defaults for SDUI Components
 * Defines default column spans, row spans, and overlay permissions.
 */

export const DEFAULT_DEVICE_SPANS = {
  Header: { rowSpan: 5, colSpan: 100 },
  SearchBar: { rowSpan: 5, colSpan: 100 },
  StoryRow: { rowSpan: 9, colSpan: 100 },
  CategoryGrid: { rowSpan: 10, colSpan: 100 },
  Carousel: { rowSpan: 22, colSpan: 100 },
  HeroBanner: { rowSpan: 22, colSpan: 100 },
  CouponCode: { rowSpan: 8, colSpan: 100 },
  CountDownTimer: { rowSpan: 8, colSpan: 100 },
  ProductList: { rowSpan: 58, colSpan: 100 },
  ProductCard: { rowSpan: 32, colSpan: 100 },
  Footer: { rowSpan: 30, colSpan: 100 },
  NavBar: { rowSpan: 6, colSpan: 100 },
  IFrame: { rowSpan: 20, colSpan: 100 },
  Box: { rowSpan: 30, colSpan: 100 },
  Title: { rowSpan: 4, colSpan: 100 },
  Description: { rowSpan: 5, colSpan: 100 },
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
 * Gets default height (in grid rows) for a component type.
 * @param {string} type - Component type
 * @returns {number} Default row span
 */
export function getDefaultRowSpan(type) {
  return DEFAULT_DEVICE_SPANS[type]?.rowSpan || 5;
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
  return parentType === "HeroBanner" || parentType === "Box";
}
