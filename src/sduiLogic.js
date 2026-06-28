/**
 * sduiLogic.js  —  v3.0.0
 *
 * Pure helper functions for the SDUI rendering engine.
 * Responsibilities:
 *   • Schema & node validation (granular)
 *   • Breakpoint & context resolution
 *   • Theme token resolution
 *   • Style object construction (JSON → React CSSProperties)
 *   • Placement / grid-style construction
 *   • Template & repeater resolution
 *   • Behavior resolution
 *   • Slot resolution
 *   • Visibility / feature-flag checks
 *   • Price formatting & discount calculation
 *   • Fallback helpers
 *
 * Rules:
 *   ✗  No JSX
 *   ✗  No DOM access
 *   ✗  No network calls
 *   ✗  No React imports
 *   ✓  Pure functions — same input → same output
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1.  BREAKPOINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the current breakpoint name based on a pixel width.
 * Thresholds match schema.breakpoints.
 *
 * @param {number} width   window.innerWidth
 * @returns {'mobile'|'tablet'|'desktop'}
 */
export function getCurrentBreakpoint(width) {
  if (width >= 1024) return 'desktop';
  if (width >= 768)  return 'tablet';
  return 'mobile';
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds the renderer context object that is threaded through every renderNode
 * call.  This is the single source of runtime environment data — no component
 * should need window or document directly.
 *
 * @param {object} schema        The root schema object
 * @param {number} screenWidth   window.innerWidth
 * @param {number} screenHeight  window.innerHeight
 * @param {string} [locale]      e.g. 'en-IN'
 * @returns {SDUIContext}
 */
export function buildContext(schema, screenWidth, screenHeight, locale = 'en-IN') {
  const breakpoint = getCurrentBreakpoint(screenWidth);
  const theme      = resolveTheme(schema);

  return {
    schema,
    breakpoint,
    theme,
    screenWidth,
    screenHeight,
    orientation: screenWidth >= screenHeight ? 'landscape' : 'portrait',
    locale,
    isMobile:  breakpoint === 'mobile',
    isTablet:  breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  THEME
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the theme object from the schema root.
 * The schema uses a single active theme (no switching in v1).
 *
 * @param {object} schema
 * @returns {object} theme
 */
export function resolveTheme(schema) {
  return schema.theme || {};
}

/**
 * Resolves a single token string against the theme tokens map.
 * If the value is already a concrete CSS value (starts with '#', 'rgb', a digit,
 * or contains '('), it is returned as-is.
 * Otherwise the function looks the value up in theme.tokens.
 *
 * Examples:
 *   resolveToken('primary', theme)      → '#2874F0'
 *   resolveToken('#FF0000', theme)      → '#FF0000'
 *   resolveToken('surface', theme)      → '#FFFFFF'
 *   resolveToken('nonexistent', theme)  → 'nonexistent'
 *
 * @param {string} value
 * @param {object} theme
 * @returns {string}
 */
export function resolveToken(value, theme) {
  if (typeof value !== 'string') return value;
  // Already a concrete CSS value
  if (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl') ||
    value.startsWith('linear-gradient') ||
    value.startsWith('radial-gradient') ||
    value === 'transparent' ||
    value === 'none' ||
    value === 'inherit' ||
    value === 'currentColor' ||
    value.startsWith('rgba') ||
    // numeric string like '1px solid', 'auto', '100%'
    /^\d/.test(value) ||
    value.includes('(')
  ) {
    return value;
  }
  // Look up in tokens
  const tokens = theme.tokens || {};
  return tokens[value] !== undefined ? tokens[value] : value;
}

/**
 * Resolves a named radius token to a pixel string.
 * Falls back to the raw value if it's already a number or CSS string.
 *
 * @param {string|number} value   e.g. 'sm', 'pill', 4
 * @param {object} theme
 * @returns {string}  e.g. '4px', '9999px', '50%'
 */
export function resolveRadius(value, theme) {
  if (value === undefined || value === null) return '0px';
  if (typeof value === 'number') return `${value}px`;
  const radiusMap = theme.radius || {};
  if (radiusMap[value] !== undefined) {
    const r = radiusMap[value];
    if (typeof r === 'number') return `${r}px`;
    return r; // e.g. '50%', '9999px'
  }
  // Already a CSS string
  return value;
}

/**
 * Resolves a named shadow token to a CSS box-shadow string.
 *
 * @param {string|object} value   token name OR raw shadow object { x,y,blur,spread,color }
 * @param {object} theme
 * @returns {string}
 */
export function resolveShadow(value, theme) {
  if (!value || value === 'none') return 'none';
  if (typeof value === 'string') {
    const shadowMap = theme.shadow || {};
    return shadowMap[value] !== undefined ? shadowMap[value] : value;
  }
  // Legacy raw shadow object  { x, y, blur, spread, color }
  if (typeof value === 'object') {
    const { x = 0, y = 0, blur = 0, spread = 0, color = 'transparent' } = value;
    if (color === 'transparent') return 'none';
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }
  return 'none';
}

/**
 * Resolves a spacing token name to a pixel number or returns the raw value.
 *
 * @param {string|number} value   token name OR number OR CSS string
 * @param {object} theme
 * @returns {number|string}
 */
export function resolveSpacing(value, theme) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && /^\d/.test(value)) return value; // '16px', '1rem'
  const spacingMap = theme.spacing || {};
  return spacingMap[value] !== undefined ? spacingMap[value] : value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4.  STYLE OBJECT BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a JSON containerStyle object into a safe React CSSProperties object.
 * All token references are resolved against the theme.
 *
 * Supported keys:
 *   background, radius, shadow, padding, paddingTop/Right/Bottom/Left,
 *   margin, marginTop/Right/Bottom/Left, gap, height, width, minHeight,
 *   minWidth, maxHeight, maxWidth, overflow, opacity, zIndex, display,
 *   flexDirection, alignItems, justifyContent, flex, flexWrap, grow, shrink,
 *   textColor, fontSize, fontWeight, textAlign, letterSpacing, lineHeight,
 *   border, borderColor, borderWidth, objectFit, aspectRatio,
 *   cursor, transform, transition
 *
 * @param {object} containerStyle   Raw node containerStyle
 * @param {object} theme            Active theme
 * @returns {React.CSSProperties}
 */
export function buildStyleObject(containerStyle, theme) {
  if (!containerStyle || typeof containerStyle !== 'object') return {};

  const css = {};
  const t   = theme || {};

  // ── Background ──────────────────────────────────────────────────────────────
  if (containerStyle.background !== undefined) {
    css.backgroundColor = resolveToken(containerStyle.background, t);
  }
  if (containerStyle.bgGradient) {
    css.background = containerStyle.bgGradient;
  }

  // ── Border radius ────────────────────────────────────────────────────────────
  if (containerStyle.radius !== undefined) {
    css.borderRadius = resolveRadius(containerStyle.radius, t);
  }

  // ── Shadow ───────────────────────────────────────────────────────────────────
  if (containerStyle.shadow !== undefined) {
    css.boxShadow = resolveShadow(containerStyle.shadow, t);
  }

  // ── Padding ──────────────────────────────────────────────────────────────────
  _applySpacingProp(css, containerStyle, 'padding',       'padding',       t);
  _applySpacingProp(css, containerStyle, 'paddingTop',    'paddingTop',    t);
  _applySpacingProp(css, containerStyle, 'paddingRight',  'paddingRight',  t);
  _applySpacingProp(css, containerStyle, 'paddingBottom', 'paddingBottom', t);
  _applySpacingProp(css, containerStyle, 'paddingLeft',   'paddingLeft',   t);

  // ── Margin ───────────────────────────────────────────────────────────────────
  _applySpacingProp(css, containerStyle, 'margin',        'margin',        t);
  _applySpacingProp(css, containerStyle, 'marginTop',     'marginTop',     t);
  _applySpacingProp(css, containerStyle, 'marginRight',   'marginRight',   t);
  _applySpacingProp(css, containerStyle, 'marginBottom',  'marginBottom',  t);
  _applySpacingProp(css, containerStyle, 'marginLeft',    'marginLeft',    t);

  // ── Dimensions ───────────────────────────────────────────────────────────────
  _applyDimProp(css, containerStyle, 'height');
  _applyDimProp(css, containerStyle, 'width');
  _applyDimProp(css, containerStyle, 'minHeight');
  _applyDimProp(css, containerStyle, 'minWidth');
  _applyDimProp(css, containerStyle, 'maxHeight');
  _applyDimProp(css, containerStyle, 'maxWidth');

  // ── Layout ───────────────────────────────────────────────────────────────────
  if (containerStyle.gap !== undefined) {
    const g = resolveSpacing(containerStyle.gap, t);
    css.gap = typeof g === 'number' ? `${g}px` : g;
  }
  if (containerStyle.display)        css.display        = containerStyle.display;
  if (containerStyle.flexDirection)  css.flexDirection  = containerStyle.flexDirection;
  if (containerStyle.alignItems)     css.alignItems     = containerStyle.alignItems;
  if (containerStyle.justifyContent) css.justifyContent = containerStyle.justifyContent;
  if (containerStyle.flexWrap)       css.flexWrap       = containerStyle.flexWrap;
  if (containerStyle.flex !== undefined) css.flex       = containerStyle.flex;
  if (containerStyle.grow !== undefined) css.flexGrow   = containerStyle.grow;
  if (containerStyle.shrink !== undefined) css.flexShrink = containerStyle.shrink;

  // ── Typography (for text-bearing nodes) ──────────────────────────────────────
  if (containerStyle.textColor) {
    css.color = resolveToken(containerStyle.textColor, t);
  }
  if (containerStyle.fontSize) {
    // May be a token name like 'bodySize' or a direct value
    const typo = (t.typography || {});
    css.fontSize = typo[containerStyle.fontSize] || containerStyle.fontSize;
  }
  if (containerStyle.fontWeight !== undefined) css.fontWeight   = containerStyle.fontWeight;
  if (containerStyle.textAlign)               css.textAlign    = containerStyle.textAlign;
  if (containerStyle.letterSpacing)           css.letterSpacing = containerStyle.letterSpacing;
  if (containerStyle.lineHeight !== undefined) css.lineHeight   = containerStyle.lineHeight;
  if (containerStyle.textTransform)           css.textTransform = containerStyle.textTransform;

  // ── Border ───────────────────────────────────────────────────────────────────
  if (containerStyle.border)      css.border      = containerStyle.border;
  if (containerStyle.borderColor) css.borderColor = resolveToken(containerStyle.borderColor, t);
  if (containerStyle.borderWidth) css.borderWidth = containerStyle.borderWidth;

  // ── Overflow, opacity, cursor, zIndex ────────────────────────────────────────
  if (containerStyle.overflow)          css.overflow      = containerStyle.overflow;
  if (containerStyle.opacity !== undefined) css.opacity   = containerStyle.opacity;
  if (containerStyle.cursor)            css.cursor        = containerStyle.cursor;
  if (containerStyle.zIndex !== undefined) css.zIndex     = containerStyle.zIndex;

  // ── Object fit (images) ───────────────────────────────────────────────────────
  if (containerStyle.objectFit)   css.objectFit   = containerStyle.objectFit;
  if (containerStyle.aspectRatio) css.aspectRatio  = containerStyle.aspectRatio;
  if (containerStyle.clipPath)    css.clipPath     = containerStyle.clipPath;

  // ── Transform & transition ────────────────────────────────────────────────────
  if (containerStyle.transform)   css.transform   = containerStyle.transform;
  if (containerStyle.transition)  css.transition  = containerStyle.transition;

  // ── Position ──────────────────────────────────────────────────────────────────
  if (containerStyle.position)    css.position    = containerStyle.position;
  if (containerStyle.top !== undefined)    css.top    = _px(containerStyle.top);
  if (containerStyle.right !== undefined)  css.right  = _px(containerStyle.right);
  if (containerStyle.bottom !== undefined) css.bottom = _px(containerStyle.bottom);
  if (containerStyle.left !== undefined)   css.left   = _px(containerStyle.left);

  return css;
}

/**
 * Merges a base style with a state override style (e.g. hover).
 * Both are containerStyle objects and are resolved through buildStyleObject.
 * State styles win over base styles.
 *
 * @param {object} baseStyle       node.containerStyle
 * @param {string} stateName       'hover' | 'pressed' | 'disabled' | ...
 * @param {object} statesMap       node.states
 * @param {object} theme
 * @returns {React.CSSProperties}
 */
export function buildStateStyle(baseStyle, stateName, statesMap, theme) {
  const base   = buildStyleObject(baseStyle, theme);
  const stateOverride = (statesMap || {})[stateName] || {};
  const stateCSS = buildStyleObject(stateOverride, theme);
  return { ...base, ...stateCSS };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5.  PLACEMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts the placement coordinates for a node at the given breakpoint.
 * Falls back to 'desktop' if the requested breakpoint has no entry.
 *
 * @param {object} node
 * @param {'desktop'|'tablet'|'mobile'} breakpoint
 * @returns {{ colStart, colEnd, rowStart, rowEnd, zIndex? } | null}
 */
export function resolvePlacement(node, breakpoint) {
  const p = node.placement;
  if (!p) return null;
  return p[breakpoint] || p['desktop'] || null;
}

/**
 * Converts a placement object into a React CSS grid positioning style.
 * The 100×100 grid uses lines 1 → 101 (colEnd/rowEnd exclusive).
 *
 * @param {{ colStart, colEnd, rowStart, rowEnd, zIndex? }} placement
 * @returns {React.CSSProperties}
 */
export function buildGridStyle(placement) {
  if (!placement) return {};

  const style = {
    gridColumn: `${placement.colStart} / ${placement.colEnd}`,
    gridRow:    `${placement.rowStart} / ${placement.rowEnd}`,
    minWidth:   0,
    minHeight:  0,
  };

  if (placement.zIndex !== undefined) {
    style.zIndex   = placement.zIndex;
    style.position = 'relative'; // zIndex requires a positioning context
  }

  return style;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6.  TEMPLATE RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves a node's templateRef against the schema templates registry.
 * Returns the template object or null if not found.
 *
 * @param {object} schema
 * @param {string} templateRef
 * @returns {object|null}
 */
export function resolveTemplate(schema, templateRef) {
  if (!templateRef) return null;
  const template = (schema.templates || {})[templateRef];
  if (!template) {
    console.warn(`[SDUI] Template not found: "${templateRef}"`);
    return null;
  }
  return template;
}

/**
 * Merges a node with its template.  The node's own properties win over the
 * template defaults, except for containerStyle which is deep-merged
 * (template first, node override second).
 *
 * @param {object} node
 * @param {object} template
 * @returns {object}  merged node
 */
export function mergeNodeWithTemplate(node, template) {
  if (!template) return node;

  return {
    ...template,
    ...node,
    containerStyle: {
      ...(template.containerStyle || {}),
      ...(node.containerStyle    || {}),
    },
    states: {
      ...(template.states || {}),
      ...(node.states     || {}),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7.  REPEATER RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Expands a node's `repeat` block into an array of concrete child nodes.
 *
 * A repeat block has the shape:
 *   {
 *     templateRef: 'productCardTemplate',
 *     items: [ { id, name, imageUrl, ... }, ... ]
 *   }
 *
 * Each item in `items` becomes a child node whose `content` is the item data
 * and whose structure is taken from the template.
 *
 * @param {object} node     The parent node that has a `repeat` block
 * @param {object} schema   Full schema (for template lookup)
 * @returns {object[]}      Array of resolved child nodes, or []
 */
export function resolveRepeater(node, schema) {
  const repeat = node.repeat;
  if (!repeat || !Array.isArray(repeat.items)) return [];

  const template = resolveTemplate(schema, repeat.templateRef);

  return repeat.items.map((item) => {
    const childNode = {
      ...(template || {}),
      id:      item.id || `${node.id}-item-${Math.random().toString(36).slice(2, 7)}`,
      content: item,
      children: [],
    };
    return childNode;
  });
}

/**
 * Returns the effective children for a node — combining explicit `children`
 * with any expanded `repeat` items (repeater children come after static ones).
 *
 * @param {object} node
 * @param {object} schema
 * @returns {object[]}
 */
export function resolveChildren(node, schema) {
  const staticChildren   = Array.isArray(node.children) ? node.children : [];
  const repeaterChildren = resolveRepeater(node, schema);
  return [...staticChildren, ...repeaterChildren];
}

// ─────────────────────────────────────────────────────────────────────────────
// 8.  SLOT RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves a node's slots map against its children.
 * Returns a map of { slotName → childNode } so the renderer can place
 * specific children in named positions.
 *
 * A node's `slots` object maps slot names to child node IDs:
 *   "slots": { "left": "slide-1-text-block", "right": "slide-1-image" }
 *
 * @param {object} node
 * @param {object} schema
 * @returns {Object.<string, object>}  { slotName: resolvedChildNode }
 */
export function resolveSlots(node, schema) {
  const slotDefs = node.slots;
  if (!slotDefs || typeof slotDefs !== 'object') return {};

  const children = resolveChildren(node, schema);
  const childMap = Object.fromEntries(children.map((c) => [c.id, c]));

  const resolved = {};
  for (const [slotName, childId] of Object.entries(slotDefs)) {
    if (childMap[childId]) {
      resolved[slotName] = childMap[childId];
    } else {
      console.warn(`[SDUI] Slot "${slotName}" references unknown child id "${childId}"`);
    }
  }
  return resolved;
}

/**
 * Returns the children that are NOT assigned to any slot.
 * Used by renderers that fill slots explicitly but still want to render
 * unassigned children in a default position.
 *
 * @param {object} node
 * @param {object} schema
 * @returns {object[]}
 */
export function resolveUnslottedChildren(node, schema) {
  const slottedIds = new Set(Object.values(node.slots || {}));
  return resolveChildren(node, schema).filter((c) => !slottedIds.has(c.id));
}

// ─────────────────────────────────────────────────────────────────────────────
// 9.  BEHAVIOR RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the behavior config for a node, with safe defaults.
 *
 * @param {object} node
 * @returns {object}
 */
export function resolveBehavior(node) {
  const defaults = {
    autoplay:         false,
    autoplayInterval: 4000,
    loop:             false,
    snap:             false,
    draggable:        false,
    lazyLoad:         false,
    sticky:           false,
    collapsible:      false,
    expandable:       false,
    scrollable:       false,
    mobileMode:       'inline',  // 'inline' | 'overlay' | 'sheet'
    zIndex:           undefined,
  };

  return { ...defaults, ...(node.behavior || {}) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10.  VISIBILITY & FEATURE FLAGS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if a node should be rendered.
 * Checks the `enabled` flag.  Defaults to true when absent.
 *
 * In a future version this can also evaluate `visibilityRules`
 * against a user context object.
 *
 * @param {object} node
 * @returns {boolean}
 */
export function isNodeVisible(node) {
  // `enabled` flag  — explicit false disables the node
  if (node.enabled === false) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11.  TYPOGRAPHY TOKEN RESOLVER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves a fontSize value, which may be a theme typography token name
 * (e.g. 'heroTitleSize') or a direct CSS value (e.g. '1.25rem').
 *
 * @param {string|number} value
 * @param {object} theme
 * @returns {string}
 */
export function resolveFontSize(value, theme) {
  if (!value) return undefined;
  if (typeof value === 'number') return `${value}px`;
  const typo = (theme.typography || {});
  return typo[value] || value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12.  PRICE & FORMATTING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a number as an Indian Rupee string.
 *
 * @param {number} value
 * @param {string} [locale='en-IN']
 * @returns {string}  e.g. '₹1,299'
 */
export function formatPrice(value, locale = 'en-IN') {
  if (value === undefined || value === null || isNaN(value)) return '';
  return '₹' + Number(value).toLocaleString(locale);
}

/**
 * Calculates the integer discount percentage between a sale price and an
 * original price.  Returns 0 for invalid inputs.
 *
 * @param {number} price          Current / sale price
 * @param {number} originalPrice  Original / MRP price
 * @returns {number}  0–100
 */
export function calcDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= 0 || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// 13.  FALLBACK HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns `value` if defined, non-null, and non-empty-string; otherwise
 * returns `fallback`.
 *
 * @param {*} value
 * @param {*} fallback
 * @returns {*}
 */
export function withFallback(value, fallback) {
  if (value !== undefined && value !== null && value !== '') return value;
  return fallback;
}

/**
 * Returns a valid image URL, falling back to a placehold.co placeholder.
 *
 * @param {string}  url
 * @param {number}  [w=300]
 * @param {number}  [h=300]
 * @param {string}  [text='Image']
 * @returns {string}
 */
export function withImageFallback(url, w = 300, h = 300, text = 'Image') {
  if (url && typeof url === 'string' && url.trim().length > 0) return url;
  return `https://placehold.co/${w}x${h}/F1F3F6/878787?text=${encodeURIComponent(text)}`;
}

/**
 * Returns a fallback node definition for any type.
 * Used by the renderer's error boundary to show something safe.
 *
 * @param {string} type
 * @param {string} [id='fallback']
 * @returns {object}
 */
export function getFallbackNode(type, id = 'fallback') {
  return {
    id,
    type:           'text',
    version:        '1.0.0',
    containerStyle: { background: 'transparent', padding: 0, radius: 0, shadow: 'none' },
    content:        { text: `[${type} failed to render]`, textColor: '#878787', fontSize: '0.75rem' },
    children:       [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 14.  NODE NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalizes a raw node from the schema into a fully resolved, safe object.
 * Applies template merging and ensures all required keys are present.
 *
 * @param {object} node
 * @param {object} schema
 * @returns {object}  normalized node
 */
export function normalizeNode(node, schema) {
  if (!node || typeof node !== 'object') {
    return getFallbackNode('unknown');
  }

  // 1. Merge template if referenced
  const template = resolveTemplate(schema, node.templateRef);
  const merged   = mergeNodeWithTemplate(node, template);

  // 2. Ensure defaults
  return {
    enabled:        true,
    children:       [],
    allowedChildren: [],
    supportedStyles: [],
    states:         {},
    behavior:       {},
    ...merged,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 15.  SORTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sorts an array of nodes by their `order` field (if present), otherwise
 * preserves array order.  Non-destructive (returns new array).
 *
 * @param {object[]} nodes
 * @returns {object[]}
 */
export function sortByOrder(nodes) {
  if (!Array.isArray(nodes)) return [];
  return [...nodes].sort((a, b) => {
    const oa = a.order !== undefined ? a.order : Infinity;
    const ob = b.order !== undefined ? b.order : Infinity;
    return oa - ob;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 16.  LAYOUT CONFIG HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the column count for a grid-based section at the current breakpoint.
 *
 * @param {object} layoutConfig    node.layout
 * @param {'desktop'|'tablet'|'mobile'} breakpoint
 * @param {number} [fallback=3]
 * @returns {number}
 */
export function resolveColumnCount(layoutConfig, breakpoint, fallback = 3) {
  if (!layoutConfig) return fallback;
  const map = {
    desktop: layoutConfig.desktopColumns,
    tablet:  layoutConfig.tabletColumns,
    mobile:  layoutConfig.mobileColumns,
  };
  return map[breakpoint] || fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// 17.  COUNTDOWN HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns { days, hours, minutes, seconds } remaining until a target date.
 * Returns all zeros if the target is in the past.
 *
 * @param {string|Date} targetDate  ISO string or Date object
 * @returns {{ days: number, hours: number, minutes: number, seconds: number }}
 */
export function getTimeRemaining(targetDate) {
  const target = new Date(targetDate).getTime();
  const now    = Date.now();
  const diff   = Math.max(0, target - now);

  const seconds = Math.floor((diff / 1000)       % 60);
  const minutes = Math.floor((diff / 1000 / 60)  % 60);
  const hours   = Math.floor((diff / 1000 / 3600) % 24);
  const days    = Math.floor(diff  / 1000 / 3600 / 24);

  return { days, hours, minutes, seconds };
}

// ─────────────────────────────────────────────────────────────────────────────
// 18.  GRANULAR VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates the top-level schema structure.
 *
 * @param {object} schema
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSchema(schema) {
  const errors = [];

  if (!schema || typeof schema !== 'object') {
    return { valid: false, errors: ['Schema must be a non-null object'] };
  }
  if (!schema.schemaVersion) errors.push('Missing: schemaVersion');
  if (!schema.appId)         errors.push('Missing: appId');
  if (!schema.theme)         errors.push('Missing: theme');
  if (!schema.breakpoints)   errors.push('Missing: breakpoints');
  if (!schema.validation)    errors.push('Missing: validation');
  if (!schema.page)          errors.push('Missing: page');

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a single node's required fields.
 *
 * @param {object} node
 * @param {object} schema
 * @returns {{ valid: boolean, errors: string[], nodeId: string }}
 */
export function validateNode(node, schema) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';

  if (!node || typeof node !== 'object') {
    return { valid: false, errors: ['Node must be a non-null object'], nodeId };
  }

  const required = (schema?.validation?.requiredNodeKeys) ||
    ['id', 'type', 'version', 'containerStyle', 'children'];

  for (const key of required) {
    if (node[key] === undefined) {
      errors.push(`Node "${nodeId}" is missing required key: "${key}"`);
    }
  }

  // type must be in allowedTypes
  const allowedTypes = schema?.validation?.allowedTypes || [];
  if (allowedTypes.length > 0 && node.type && !allowedTypes.includes(node.type)) {
    errors.push(`Node "${nodeId}" has unknown type: "${node.type}"`);
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Validates the children array of a node.
 *
 * @param {object} node
 * @param {object} schema
 * @returns {{ valid: boolean, errors: string[], nodeId: string }}
 */
export function validateChildren(node, schema) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';

  if (!Array.isArray(node.children)) {
    errors.push(`Node "${nodeId}" has invalid children (must be an array)`);
    return { valid: false, errors, nodeId };
  }

  const allowedChildren = node.allowedChildren || [];

  for (const child of node.children) {
    if (!child || !child.type) {
      errors.push(`Node "${nodeId}" has a child with missing type`);
      continue;
    }
    if (allowedChildren.length > 0 && !allowedChildren.includes(child.type)) {
      errors.push(
        `Node "${nodeId}" does not allow child type "${child.type}". ` +
        `Allowed: [${allowedChildren.join(', ')}]`
      );
    }
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Validates the placement object of a node.
 *
 * @param {object} node
 * @returns {{ valid: boolean, errors: string[], nodeId: string }}
 */
export function validatePlacement(node) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';
  const p = node?.placement;

  // placement is optional — header-level nodes may not have it
  if (!p) return { valid: true, errors: [], nodeId };

  const breakpoints = ['desktop', 'tablet', 'mobile'];
  const required    = ['colStart', 'colEnd', 'rowStart', 'rowEnd'];

  for (const bp of breakpoints) {
    if (!p[bp]) continue; // partial definitions are allowed
    for (const key of required) {
      if (p[bp][key] === undefined) {
        errors.push(`Node "${nodeId}" placement.${bp} is missing "${key}"`);
      }
    }
    // Sanity checks
    if (p[bp].colStart >= p[bp].colEnd) {
      errors.push(`Node "${nodeId}" placement.${bp}: colStart must be < colEnd`);
    }
    if (p[bp].rowStart >= p[bp].rowEnd) {
      errors.push(`Node "${nodeId}" placement.${bp}: rowStart must be < rowEnd`);
    }
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Validates a node's behavior object.
 *
 * @param {object} node
 * @returns {{ valid: boolean, errors: string[], nodeId: string }}
 */
export function validateBehavior(node) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';
  const b = node?.behavior;

  if (!b) return { valid: true, errors: [], nodeId };
  if (typeof b !== 'object') {
    errors.push(`Node "${nodeId}" behavior must be an object`);
    return { valid: false, errors, nodeId };
  }

  if (b.autoplayInterval !== undefined && typeof b.autoplayInterval !== 'number') {
    errors.push(`Node "${nodeId}" behavior.autoplayInterval must be a number`);
  }
  if (b.mobileMode !== undefined && !['inline', 'overlay', 'sheet'].includes(b.mobileMode)) {
    errors.push(
      `Node "${nodeId}" behavior.mobileMode must be 'inline', 'overlay', or 'sheet'. ` +
      `Got: "${b.mobileMode}"`
    );
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Validates a node's containerStyle object.
 *
 * @param {object} node
 * @param {object} schema
 * @returns {{ valid: boolean, errors: string[], nodeId: string }}
 */
export function validateStyles(node, schema) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';
  const style  = node?.containerStyle;

  if (!style || typeof style !== 'object') {
    errors.push(`Node "${nodeId}" containerStyle must be an object`);
    return { valid: false, errors, nodeId };
  }

  const allowed = schema?.validation?.allowedStyles || [];
  if (allowed.length > 0) {
    for (const key of Object.keys(style)) {
      if (!allowed.includes(key)) {
        // Warn rather than error — unknown style keys are silently ignored
        console.warn(
          `[SDUI] Node "${nodeId}" uses unrecognized style key "${key}". ` +
          `It will be ignored.`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Validates a node's slots map.
 *
 * @param {object} node
 * @param {object} schema
 * @returns {{ valid: boolean, errors: string[], nodeId: string }}
 */
export function validateSlots(node, schema) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';
  const slots  = node?.slots;

  if (!slots) return { valid: true, errors: [], nodeId };

  if (typeof slots !== 'object' || Array.isArray(slots)) {
    errors.push(`Node "${nodeId}" slots must be a plain object`);
    return { valid: false, errors, nodeId };
  }

  const children = resolveChildren(node, schema);
  const childIds = new Set(children.map((c) => c.id));

  for (const [slotName, childId] of Object.entries(slots)) {
    if (!childIds.has(childId)) {
      errors.push(
        `Node "${nodeId}" slot "${slotName}" references non-existent child id "${childId}"`
      );
    }
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Full recursive validation of an entire node tree.
 * Runs all granular validators on every node.
 *
 * @param {object} node
 * @param {object} schema
 * @param {number} [depth=0]
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateNodeTree(node, schema, depth = 0) {
  const allErrors = [];
  const maxDepth  = schema?.validation?.maxNestedDepth || 8;

  if (depth > maxDepth) {
    allErrors.push(
      `Node "${node?.id}" exceeds maximum nesting depth of ${maxDepth}`
    );
    return { valid: false, errors: allErrors };
  }

  // Run all granular validators
  const validators = [
    validateNode(node, schema),
    validateChildren(node, schema),
    validatePlacement(node),
    validateBehavior(node),
    validateStyles(node, schema),
    validateSlots(node, schema),
  ];

  for (const result of validators) {
    allErrors.push(...result.errors);
  }

  // Recurse into children
  const children = resolveChildren(node, schema);
  for (const child of children) {
    const childResult = validateNodeTree(child, schema, depth + 1);
    allErrors.push(...childResult.errors);
  }

  return { valid: allErrors.length === 0, errors: allErrors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 19.  INTERNAL UTILITIES  (not exported)
// ─────────────────────────────────────────────────────────────────────────────

/** Applies a spacing property (padding/margin) to the css accumulator. */
function _applySpacingProp(css, style, srcKey, dstKey, theme) {
  const raw = style[srcKey];
  if (raw === undefined) return;
  if (typeof raw === 'number') {
    css[dstKey] = `${raw}px`;
    return;
  }
  if (typeof raw === 'string') {
    // Could be '16px', '1rem', or a token name
    const resolved = resolveSpacing(raw, theme);
    css[dstKey] = typeof resolved === 'number' ? `${resolved}px` : resolved;
  }
}

/** Applies a dimension property (width/height) to the css accumulator. */
function _applyDimProp(css, style, key) {
  const raw = style[key];
  if (raw === undefined) return;
  if (typeof raw === 'number') {
    css[key] = `${raw}px`;
  } else {
    css[key] = raw; // '100%', 'auto', 'fit-content', etc.
  }
}

/** Converts a number to a px string; passes strings through unchanged. */
function _px(value) {
  if (typeof value === 'number') return `${value}px`;
  return value;
}
