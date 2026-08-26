/**
 * Foundation Repository — Manages user foundation setup, active default themes,
 * and enabled components catalog.
 */

import { StorageService } from "./storage";

const FOUNDATION_STORAGE_KEY = "campus_sdui_foundation_v1";

const DEFAULT_FOUNDATION = {
  id: "foundation-default",
  components: [
    "Header",
    "SearchBar",
    "StoryRow",
    "CategoryGrid",
    "HeroBanner",
    "Carousel",
    "ProductList",
    "ProductCard",
    "PriceBlock",
    "Button",
    "CouponCode",
    "CountDownTimer",
    "Footer",
    "NavBar",
  ],
  chosenThemes: {
    ProductCard: "product-card-classic",
    Header: "header-classic",
    Button: "button-primary",
    CategoryGrid: "category-grid-circular",
    HeroBanner: "hero-banner-cinematic",
  },
};

export const FoundationRepository = {
  /**
   * Retrieves the active foundation configuration.
   * @returns {Object}
   */
  get() {
    const saved = StorageService.get(FOUNDATION_STORAGE_KEY, null);
    if (!saved) {
      StorageService.set(FOUNDATION_STORAGE_KEY, DEFAULT_FOUNDATION);
      return DEFAULT_FOUNDATION;
    }
    return saved;
  },

  /**
   * Saves the entire foundation configuration.
   * @param {Object} foundation
   * @returns {Object}
   */
  save(foundation) {
    const current = this.get();
    const updated = {
      ...current,
      ...foundation,
      chosenThemes: {
        ...(current.chosenThemes || {}),
        ...(foundation.chosenThemes || {}),
      },
      updatedAt: new Date().toISOString(),
    };
    StorageService.set(FOUNDATION_STORAGE_KEY, updated);
    return updated;
  },

  /**
   * Gets the default theme ID for a given component type.
   * @param {string} componentType
   * @returns {string|null}
   */
  getDefaultThemeId(componentType) {
    const foundation = this.get();
    if (foundation.chosenThemes && foundation.chosenThemes[componentType]) {
      return foundation.chosenThemes[componentType];
    }
    // Fallback defaults
    switch (componentType) {
      case "ProductCard":
        return "product-card-classic";
      case "Header":
        return "header-classic";
      case "Button":
        return "button-primary";
      case "CategoryGrid":
        return "category-grid-circular";
      case "HeroBanner":
        return "hero-banner-cinematic";
      default:
        return null;
    }
  },

  /**
   * Sets the default theme ID for a given component type.
   * @param {string} componentType
   * @param {string} themeId
   */
  setDefaultTheme(componentType, themeId) {
    const current = this.get();
    const updated = {
      ...current,
      chosenThemes: {
        ...(current.chosenThemes || {}),
        [componentType]: themeId,
      },
      updatedAt: new Date().toISOString(),
    };
    StorageService.set(FOUNDATION_STORAGE_KEY, updated);
    return updated;
  },

  /**
   * Resets foundation to default settings.
   */
  resetDefaults() {
    StorageService.set(FOUNDATION_STORAGE_KEY, DEFAULT_FOUNDATION);
    return DEFAULT_FOUNDATION;
  },
};

export default FoundationRepository;
