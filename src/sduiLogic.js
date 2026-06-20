// sduiLogic.js
// Pure functions only. No DOM. No network. No side effects.
// These functions transform the schema into data the renderer needs.

// ─── Breakpoint ──────────────────────────────────────────────────────────────

/**
 * Returns the current breakpoint name based on window width.
 * @param {number} width - window.innerWidth
 * @returns {'mobile' | 'tablet' | 'desktop'}
 */
export function getCurrentBreakpoint(width) {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * Returns the full theme token object for a given themeId.
 * Falls back to 'flipkart' if not found.
 * @param {object} schema
 * @param {string} themeId
 * @returns {object} theme tokens
 */
export function getTheme(schema, themeId) {
  return schema.themeRegistry[themeId] || schema.themeRegistry['flipkart'];
}

// ─── Layout ──────────────────────────────────────────────────────────────────

/**
 * Returns layout config for a given breakpoint.
 * @param {object} schema
 * @param {'mobile' | 'tablet' | 'desktop'} breakpoint
 * @returns {object} layout config
 */
export function getLayout(schema, breakpoint) {
  return schema.layoutRegistry[breakpoint] || schema.layoutRegistry['desktop'];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Returns the page config for a given page name.
 * @param {object} schema
 * @param {string} pageId
 * @returns {object} page config
 */
export function getPage(schema, pageId) {
  return schema.pageRegistry[pageId] || schema.pageRegistry['home'];
}

/**
 * Returns the ordered list of visible section IDs for a page.
 * Filters out sections that are marked visible: false in sectionRegistry.
 * @param {object} schema
 * @param {string} pageId
 * @returns {string[]} visible section IDs in order
 */
export function getVisibleSections(schema, pageId) {
  const page = getPage(schema, pageId);
  return page.sections.filter((sectionId) => {
    const sectionConfig = schema.sectionRegistry[sectionId];
    return sectionConfig?.visible !== false;
  });
}

// ─── Section ──────────────────────────────────────────────────────────────────

/**
 * Returns the section config from sectionRegistry.
 * @param {object} schema
 * @param {string} sectionId
 * @returns {object} section config
 */
export function getSectionConfig(schema, sectionId) {
  return schema.sectionRegistry[sectionId] || {};
}

/**
 * Returns the content for a given section from contentRegistry.
 * @param {object} schema
 * @param {string} sectionId
 * @returns {object} content data
 */
export function getSectionContent(schema, sectionId) {
  return schema.contentRegistry[sectionId] || null;
}

// ─── CSS Token Helpers ────────────────────────────────────────────────────────

/**
 * Converts theme tokens into CSS custom properties string.
 * Useful for injecting into a style tag or inline styles.
 * @param {object} theme - result of getTheme()
 * @returns {object} flat key-value map of CSS var names to values
 */
export function buildCssVars(theme) {
  const vars = {};

  // Colors
  Object.entries(theme.colors || {}).forEach(([key, val]) => {
    vars[`--color-${toKebab(key)}`] = val;
  });

  // Typography
  Object.entries(theme.typography || {}).forEach(([key, val]) => {
    vars[`--font-${toKebab(key)}`] = val;
  });

  // Radius
  Object.entries(theme.radius || {}).forEach(([key, val]) => {
    vars[`--radius-${toKebab(key)}`] = val;
  });

  // Shadow
  Object.entries(theme.shadow || {}).forEach(([key, val]) => {
    vars[`--shadow-${toKebab(key)}`] = val;
  });

  // Spacing
  Object.entries(theme.spacing || {}).forEach(([key, val]) => {
    vars[`--spacing-${toKebab(key)}`] = val;
  });

  return vars;
}

/**
 * Converts CSS vars map to an inline style string.
 * @param {object} vars - from buildCssVars()
 * @returns {string}
 */
export function cssVarsToString(vars) {
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

// ─── Discount ─────────────────────────────────────────────────────────────────

/**
 * Calculates discount percentage between two prices.
 * @param {number} price - current price
 * @param {number} originalPrice - original price
 * @returns {number} discount percentage (integer)
 */
export function calcDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Formats a price in Indian Rupee style.
 * @param {number} value
 * @returns {string} e.g. "₹1,499"
 */
export function formatPrice(value) {
  return '₹' + Number(value).toLocaleString('en-IN');
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

/**
 * Returns value if truthy, otherwise the fallback.
 * @param {any} value
 * @param {any} fallback
 * @returns {any}
 */
export function withFallback(value, fallback) {
  return value !== undefined && value !== null && value !== '' ? value : fallback;
}

/**
 * Returns a placeholder image URL if the given URL is missing.
 * @param {string} url
 * @param {number} w
 * @param {number} h
 * @returns {string}
 */
export function withImageFallback(url, w = 200, h = 200) {
  return url || `https://placehold.co/${w}x${h}?text=Image`;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Basic schema validation. Checks required top-level keys exist.
 * Returns { valid: boolean, errors: string[] }
 * @param {object} schema
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSchema(schema) {
  const required = [
    'themeRegistry',
    'layoutRegistry',
    'contentRegistry',
    'sectionRegistry',
    'pageRegistry',
  ];

  const errors = required
    .filter((key) => !schema[key])
    .map((key) => `Missing required key: ${key}`);

  return { valid: errors.length === 0, errors };
}

// ─── Internal Utilities ───────────────────────────────────────────────────────

function toKebab(str) {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}
