// sduiLogic.js
// Pure functions only. No DOM. No network. No side effects.
// Transforms the SDUI schema into data the renderer needs.

// ─── Breakpoint ───────────────────────────────────────────────────────────────

/**
 * Returns the current breakpoint based on window width.
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
 * Returns full theme tokens for a given themeId.
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
 * Returns global layout config for a given breakpoint.
 * @param {object} schema
 * @param {'mobile' | 'tablet' | 'desktop'} breakpoint
 * @returns {object} layout config
 */
export function getLayout(schema, breakpoint) {
  return schema.layoutRegistry[breakpoint] || schema.layoutRegistry['desktop'];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Returns the page config for a given pageId.
 * Falls back to 'home' if not found.
 * @param {object} schema
 * @param {string} pageId
 * @returns {object} page config
 */
export function getPage(schema, pageId) {
  return schema.pageRegistry[pageId] || schema.pageRegistry['home'];
}

// ─── Regions ─────────────────────────────────────────────────────────────────

/**
 * Resolves a single region reference from a page's regions array.
 *
 * Supports three forms:
 *   1. Inline:        { id, component, contentId, placement, ... }
 *   2. Ref:           { regionId: "header_full" }
 *   3. Ref + Override:{ regionId: "footer_full", contentId: "footer_amazon" }
 *
 * For refs, the regionRegistry entry is merged with any local overrides.
 * The regionId string becomes the fallback `id` when none is set in the registry.
 *
 * @param {object} schema
 * @param {object} regionRef
 * @returns {object | null} resolved region
 */
export function resolveRegion(schema, regionRef) {
  if (regionRef.regionId) {
    const base = schema.regionRegistry[regionRef.regionId];
    if (!base) {
      console.warn(`[SDUI] regionRegistry missing key: "${regionRef.regionId}"`);
      return null;
    }
    // Strip regionId, use it as fallback id, then merge overrides on top
    const { regionId, ...overrides } = regionRef;
    return { id: regionId, ...base, ...overrides };
  }
  return regionRef;
}

/**
 * Returns all resolved regions for a page.
 * Filters out any nulls from failed registry lookups.
 * @param {object} schema
 * @param {string} pageId
 * @returns {object[]} resolved region objects
 */
export function getPageRegions(schema, pageId) {
  const page = getPage(schema, pageId);
  return (page.regions || [])
    .map((ref) => resolveRegion(schema, ref))
    .filter(Boolean);
}

/**
 * Returns the placement object for a region at the given breakpoint.
 * Falls back to 'desktop' if the requested breakpoint is not defined.
 *
 * @param {object} region
 * @param {'desktop' | 'tablet' | 'mobile'} breakpoint
 * @returns {{ colStart: number, colEnd: number, rowStart: number, rowEnd: number } | null}
 */
export function getPlacement(region, breakpoint) {
  const p = region.placement;
  if (!p) return null;
  return p[breakpoint] || p['desktop'] || null;
}

/**
 * Converts a placement object into a React CSS grid style object.
 * Uses the 100×100 canvas coordinate system (grid lines 1–101).
 * minWidth/minHeight are set to 0 to prevent common grid blowout issues.
 *
 * @param {{ colStart, colEnd, rowStart, rowEnd }} placement
 * @returns {React.CSSProperties}
 */
export function buildGridStyle(placement) {
  if (!placement) return {};
  return {
    gridColumn: `${placement.colStart} / ${placement.colEnd}`,
    gridRow: `${placement.rowStart} / ${placement.rowEnd}`,
    minWidth: 0,
    minHeight: 0,
  };
}

/**
 * Returns the content for a given contentId from the contentRegistry.
 * Returns null if contentId is empty or not found.
 * @param {object} schema
 * @param {string | null} contentId
 * @returns {object | null}
 */
export function getRegionContent(schema, contentId) {
  if (!contentId) return null;
  const content = schema.contentRegistry[contentId];
  if (!content) {
    console.warn(`[SDUI] contentRegistry missing key: "${contentId}"`);
  }
  return content || null;
}

// ─── CSS Token Helpers ────────────────────────────────────────────────────────

/**
 * Converts theme tokens into a flat map of CSS custom property names → values.
 * Spread this object onto a style prop to inject all theme tokens as CSS vars.
 * @param {object} theme - result of getTheme()
 * @returns {object} { '--color-primary': '#2874F0', ... }
 */
export function buildCssVars(theme) {
  const vars = {};
  const add = (prefix, obj) =>
    Object.entries(obj || {}).forEach(([k, v]) => {
      vars[`--${prefix}-${toKebab(k)}`] = v;
    });
  add('color', theme.colors);
  add('font', theme.typography);
  add('radius', theme.radius);
  add('shadow', theme.shadow);
  add('spacing', theme.spacing);
  return vars;
}

/**
 * Serializes a CSS vars map to an inline style string.
 * @param {object} vars - result of buildCssVars()
 * @returns {string}
 */
export function cssVarsToString(vars) {
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');
}

// ─── Pricing Helpers ──────────────────────────────────────────────────────────

/**
 * Calculates discount percentage between two prices.
 * Returns 0 if no discount or invalid inputs.
 * @param {number} price
 * @param {number} originalPrice
 * @returns {number} integer discount %
 */
export function calcDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Formats a number as an Indian Rupee string.
 * @param {number} value
 * @returns {string} e.g. "₹1,499"
 */
export function formatPrice(value) {
  return '₹' + Number(value).toLocaleString('en-IN');
}

// ─── Fallback Helpers ─────────────────────────────────────────────────────────

/**
 * Returns value if defined and non-empty, otherwise returns fallback.
 * @param {any} value
 * @param {any} fallback
 * @returns {any}
 */
export function withFallback(value, fallback) {
  return value !== undefined && value !== null && value !== '' ? value : fallback;
}

/**
 * Returns the given URL if present, otherwise a placeholder image URL.
 * @param {string} url
 * @param {number} [w=200]
 * @param {number} [h=200]
 * @returns {string}
 */
export function withImageFallback(url, w = 200, h = 200) {
  return url || `https://placehold.co/${w}x${h}?text=Image`;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validates that all 6 required top-level registries are present.
 * @param {object} schema
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSchema(schema) {
  const required = [
    'themeRegistry',
    'layoutRegistry',
    'componentRegistry',
    'contentRegistry',
    'regionRegistry',
    'pageRegistry',
  ];
  const errors = required
    .filter((key) => !schema[key])
    .map((key) => `Missing required registry: "${key}"`);
  return { valid: errors.length === 0, errors };
}

// ─── Internal Utilities ───────────────────────────────────────────────────────

function toKebab(str) {
  return str.replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`);
}
