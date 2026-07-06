/**
 * sduiLogic.js — v5.0.0
 *
 * All SDUI logic in one file: pure helpers, action dispatch, navigation.
 *
 * Sections
 *   1.  BREAKPOINT         getCurrentBreakpoint
 *   2.  CONTEXT            buildContext
 *   3.  THEME              resolveTheme, resolveToken, resolveRadius, resolveShadow, resolveSpacing
 *   4.  STYLE BUILDER      buildStyleObject, buildStateStyle
 *   5.  PLACEMENT          resolvePlacement, buildGridStyle
 *   6.  TEMPLATE           resolveTemplate, mergeNodeWithTemplate
 *   7.  REPEATER           resolveRepeater, resolveChildren
 *   8.  SLOTS              resolveSlots, resolveUnslottedChildren
 *   9.  BEHAVIOR           resolveBehavior
 *   10. VISIBILITY         isNodeVisible
 *   11. TYPOGRAPHY         resolveFontSize
 *   12. PRICE              formatPrice, calcDiscount
 *   13. FALLBACKS          withFallback, withImageFallback, getFallbackNode
 *   14. NORMALIZATION      normalizeNode
 *   15. SORTING            sortByOrder
 *   16. LAYOUT             resolveColumnCount
 *   17. COUNTDOWN          getTimeRemaining
 *   18. VALIDATION         validateSchema, validateNode, validateChildren,
 *                          validatePlacement, validateBehavior, validateStyles,
 *                          validateSlots, validateNodeTree
 *   19. INTERNAL UTILS     _applySpacingProp, _applyDimProp, _px  (private)
 *   20. PAGE ROUTING       getPages, getNavigation, findPageIndex
 *   21. OVERLAY REGISTRY   resolveOverlayDef
 *   22. ACTION GROUP       enrichActionGroupChildren
 *   23. ACTION TYPES       ACTION_TYPES
 *   24. TOAST              fireToast
 *   25. ANALYTICS          trackAnalytics  (private)
 *   26. HANDLERS — Navigation
 *   27. HANDLERS — Overlay
 *   28. HANDLERS — Commerce
 *   29. HANDLERS — Filter & Sort
 *   30. HANDLERS — Utility & Media
 *   31. ACTION REGISTRY    ACTION_REGISTRY
 *   32. DISPATCHER         dispatchAction, dispatchActions, createClickHandler
 *   33. GESTURE            dispatchGesture
 *   34. NAV HISTORY        NavigationHistory
 *
 * Rule: Pure helpers have zero side effects.
 *       Action handlers are the only functions allowed to read window / document.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. BREAKPOINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns the breakpoint name for a given screen width.
 * Input:   width — number (window.innerWidth)
 * Output:  'mobile' | 'tablet' | 'desktop'
 * Example: getCurrentBreakpoint(375) → 'mobile'
 *          getCurrentBreakpoint(1280) → 'desktop'
 */
export function getCurrentBreakpoint(width) {
  if (width >= 1024) return 'desktop';
  if (width >= 768)  return 'tablet';
  return 'mobile';
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Builds the renderer context passed to every renderNode call.
 * Input:   schema, screenWidth, screenHeight, locale — optional string
 * Output:  Context object { schema, breakpoint, theme, screenWidth, ... }
 * Example: buildContext(schema, 390, 844) → { breakpoint: 'mobile', ... }
 *
 * Centralising context here means no component ever reads window.innerWidth directly.
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
// 3. THEME
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Extracts the theme object from the schema root.
 * Input:   schema
 * Output:  theme object (or {} if absent)
 * Example: resolveTheme(schema) → { tokens: {...}, typography: {...}, ... }
 */
export function resolveTheme(schema) {
  return schema.theme || {};
}

/**
 * Purpose: Resolves a token name to a concrete CSS value.
 * Input:   value — token name OR concrete CSS value; theme — active theme
 * Output:  CSS string (e.g. '#2874F0', 'rgba(0,0,0,0.5)')
 * Example: resolveToken('primary', theme)   → '#2874F0'
 *          resolveToken('#FF0000', theme)    → '#FF0000'
 *
 * Skips token lookup for values that already look like concrete CSS.
 * This avoids '#FF0000' being treated as a token name to look up.
 */
export function resolveToken(value, theme) {
  if (typeof value !== 'string') return value;

  // Early-exit for values that are already concrete CSS
  if (
    value.startsWith('#')                ||
    value.startsWith('rgb')             ||
    value.startsWith('hsl')             ||
    value.startsWith('linear-gradient') ||
    value.startsWith('radial-gradient') ||
    value === 'transparent'             ||
    value === 'none'                    ||
    value === 'inherit'                 ||
    value === 'currentColor'            ||
    /^\d/.test(value)                   || // '1px solid', '100%', 'auto'
    value.includes('(')
  ) {
    return value;
  }

  const tokens = theme.tokens || {};
  return tokens[value] !== undefined ? tokens[value] : value;
}

/**
 * Purpose: Resolves a radius token to a CSS string.
 * Input:   value — token name (e.g. 'sm'), number (px), or CSS string; theme
 * Output:  CSS string (e.g. '4px', '9999px', '50%')
 * Example: resolveRadius('pill', theme) → '9999px'
 *          resolveRadius(8, theme) → '8px'
 */
export function resolveRadius(value, theme) {
  if (value === undefined || value === null) return '0px';
  if (typeof value === 'number') return `${value}px`;
  const radiusMap = theme.radius || {};
  if (radiusMap[value] !== undefined) {
    const r = radiusMap[value];
    return typeof r === 'number' ? `${r}px` : r;
  }
  // Already a CSS string like '50%' or '4px 8px'
  return value;
}

/**
 * Purpose: Resolves a shadow token to a CSS box-shadow string.
 * Input:   value — token name, legacy raw object, or CSS string; theme
 * Output:  CSS box-shadow string
 * Example: resolveShadow('md', theme) → '0 4px 12px rgba(0,0,0,0.12)'
 */
export function resolveShadow(value, theme) {
  if (!value || value === 'none') return 'none';

  if (typeof value === 'string') {
    const shadowMap = theme.shadow || {};
    return shadowMap[value] !== undefined ? shadowMap[value] : value;
  }

  // Legacy raw object: { x, y, blur, spread, color }
  if (typeof value === 'object') {
    const { x = 0, y = 0, blur = 0, spread = 0, color = 'transparent' } = value;
    if (color === 'transparent') return 'none';
    return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
  }

  return 'none';
}

/**
 * Purpose: Resolves a spacing token to a number or CSS string.
 * Input:   value — token name, number, or CSS string; theme
 * Output:  number (pixels) or CSS string
 * Example: resolveSpacing('md', theme) → 12
 *          resolveSpacing('16px', theme) → '16px'
 */
export function resolveSpacing(value, theme) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  // CSS strings starting with a digit pass through unchanged
  if (typeof value === 'string' && /^\d/.test(value)) return value;
  const spacingMap = theme.spacing || {};
  return spacingMap[value] !== undefined ? spacingMap[value] : value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STYLE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Converts a containerStyle JSON object to a React CSSProperties object.
 * Input:   containerStyle — raw node.containerStyle; theme — active theme
 * Output:  React.CSSProperties with all tokens resolved
 * Example: buildStyleObject({ background:'primary', radius:'md' }, theme)
 *          → { backgroundColor:'#2874F0', borderRadius:'8px' }
 *
 * This is the single gateway between JSON and CSS.
 * No renderer writes CSS properties directly — they call this function.
 */
export function buildStyleObject(containerStyle, theme) {
  if (!containerStyle || typeof containerStyle !== 'object') return {};

  const css = {};
  const t   = theme || {};

  // ── Background ──────────────────────────────────────────────────────────────
  if (containerStyle.background !== undefined) {
    css.backgroundColor = resolveToken(containerStyle.background, t);
  }
  // bgGradient overrides backgroundColor — gradient wins
  if (containerStyle.bgGradient) {
    css.background = containerStyle.bgGradient;
  }

  // ── Border radius, shadow ────────────────────────────────────────────────────
  if (containerStyle.radius  !== undefined) css.borderRadius = resolveRadius(containerStyle.radius, t);
  if (containerStyle.shadow  !== undefined) css.boxShadow    = resolveShadow(containerStyle.shadow, t);

  // ── Spacing ──────────────────────────────────────────────────────────────────
  _applySpacingProp(css, containerStyle, 'padding',       'padding',       t);
  _applySpacingProp(css, containerStyle, 'paddingTop',    'paddingTop',    t);
  _applySpacingProp(css, containerStyle, 'paddingRight',  'paddingRight',  t);
  _applySpacingProp(css, containerStyle, 'paddingBottom', 'paddingBottom', t);
  _applySpacingProp(css, containerStyle, 'paddingLeft',   'paddingLeft',   t);
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

  // ── Gap (flex / grid) ─────────────────────────────────────────────────────────
  if (containerStyle.gap !== undefined) {
    const g = resolveSpacing(containerStyle.gap, t);
    css.gap = typeof g === 'number' ? `${g}px` : g;
  }

  // ── Flex layout appearance (NOT intrinsic — intrinsic is set per-renderer) ────
  if (containerStyle.display)        css.display        = containerStyle.display;
  if (containerStyle.flexDirection)  css.flexDirection  = containerStyle.flexDirection;
  if (containerStyle.alignItems)     css.alignItems     = containerStyle.alignItems;
  if (containerStyle.justifyContent) css.justifyContent = containerStyle.justifyContent;
  if (containerStyle.flexWrap)       css.flexWrap       = containerStyle.flexWrap;
  if (containerStyle.flex  !== undefined) css.flex       = containerStyle.flex;
  if (containerStyle.grow  !== undefined) css.flexGrow   = containerStyle.grow;
  if (containerStyle.shrink !== undefined) css.flexShrink = containerStyle.shrink;

  // ── Typography (for nodes that render text inline) ────────────────────────────
  if (containerStyle.textColor) {
    css.color = resolveToken(containerStyle.textColor, t);
  }
  if (containerStyle.fontSize) {
    // fontSize may be a theme token key or a direct CSS value like '1.25rem'
    const typo = t.typography || {};
    css.fontSize = typo[containerStyle.fontSize] || containerStyle.fontSize;
  }
  if (containerStyle.fontWeight  !== undefined) css.fontWeight    = containerStyle.fontWeight;
  if (containerStyle.textAlign)                 css.textAlign     = containerStyle.textAlign;
  if (containerStyle.letterSpacing)             css.letterSpacing = containerStyle.letterSpacing;
  if (containerStyle.lineHeight  !== undefined) css.lineHeight    = containerStyle.lineHeight;
  if (containerStyle.textTransform)             css.textTransform = containerStyle.textTransform;

  // ── Border ───────────────────────────────────────────────────────────────────
  if (containerStyle.border)      css.border      = containerStyle.border;
  if (containerStyle.borderColor) css.borderColor = resolveToken(containerStyle.borderColor, t);
  if (containerStyle.borderWidth) css.borderWidth = containerStyle.borderWidth;

  // ── Visual misc ───────────────────────────────────────────────────────────────
  if (containerStyle.overflow !== undefined)  css.overflow  = containerStyle.overflow;
  if (containerStyle.opacity  !== undefined)  css.opacity   = containerStyle.opacity;
  if (containerStyle.cursor)                  css.cursor    = containerStyle.cursor;
  if (containerStyle.zIndex   !== undefined)  css.zIndex    = containerStyle.zIndex;

  // ── Image ─────────────────────────────────────────────────────────────────────
  if (containerStyle.objectFit)   css.objectFit   = containerStyle.objectFit;
  if (containerStyle.aspectRatio) css.aspectRatio = containerStyle.aspectRatio;
  if (containerStyle.clipPath)    css.clipPath    = containerStyle.clipPath;

  // ── Motion ────────────────────────────────────────────────────────────────────
  if (containerStyle.transform)  css.transform  = containerStyle.transform;
  if (containerStyle.transition) css.transition = containerStyle.transition;

  // ── Positioning ───────────────────────────────────────────────────────────────
  if (containerStyle.position          !== undefined) css.position = containerStyle.position;
  if (containerStyle.top               !== undefined) css.top      = _px(containerStyle.top);
  if (containerStyle.right             !== undefined) css.right    = _px(containerStyle.right);
  if (containerStyle.bottom            !== undefined) css.bottom   = _px(containerStyle.bottom);
  if (containerStyle.left              !== undefined) css.left     = _px(containerStyle.left);

  return css;
}

/**
 * Purpose: Merges base style with a named state override (e.g. 'hover').
 * Input:   baseStyle, stateName — string, statesMap — node.states, theme
 * Output:  React.CSSProperties — state keys override base keys
 * Example: buildStateStyle(node.containerStyle, 'hover', node.states, theme)
 */
export function buildStateStyle(baseStyle, stateName, statesMap, theme) {
  const base     = buildStyleObject(baseStyle, theme);
  const stateCSS = buildStyleObject((statesMap || {})[stateName] || {}, theme);
  return { ...base, ...stateCSS };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PLACEMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns placement coords for a node at the given breakpoint.
 * Input:   node, breakpoint — 'desktop' | 'tablet' | 'mobile'
 * Output:  { colStart, colEnd, rowStart, rowEnd, zIndex? } or null
 * Example: resolvePlacement(node, 'mobile') → { colStart:1, colEnd:101, ... }
 *
 * Falls back to 'desktop' when the target breakpoint has no entry.
 */
export function resolvePlacement(node, breakpoint) {
  const p = node.placement;
  if (!p) return null;
  return p[breakpoint] || p['desktop'] || null;
}

/**
 * Purpose: Converts a placement object to CSS grid positioning styles.
 * Input:   placement — { colStart, colEnd, rowStart, rowEnd, zIndex? }
 * Output:  React.CSSProperties
 * Example: buildGridStyle({ colStart:1, colEnd:101, rowStart:1, rowEnd:6 })
 *          → { gridColumn:'1 / 101', gridRow:'1 / 6', minWidth:0, minHeight:0 }
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
    // zIndex needs position:relative to take effect
    style.zIndex   = placement.zIndex;
    style.position = 'relative';
  }
  return style;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Looks up a template by name from schema.templates.
 * Input:   schema, templateRef — string key
 * Output:  Template object or null
 * Example: resolveTemplate(schema, 'productCardTemplate') → { type:'productCard', ... }
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
 * Purpose: Merges a node with its template. Node fields win; containerStyle is deep-merged.
 * Input:   node, template
 * Output:  Merged node object (new object — neither input is mutated)
 * Example: mergeNodeWithTemplate(node, template) → { ...template, ...node, containerStyle: merged }
 *
 * Deep-merging containerStyle lets a template set defaults that nodes override partially.
 */
export function mergeNodeWithTemplate(node, template) {
  if (!template) return node;
  return {
    ...template,
    ...node,
    containerStyle: {
      ...(template.containerStyle || {}),
      ...(node.containerStyle     || {}),
    },
    states: {
      ...(template.states || {}),
      ...(node.states     || {}),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. REPEATER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Expands a node's repeat block into concrete child nodes.
 * Input:   node — with a repeat field; schema
 * Output:  Array of child nodes with content from repeat.items
 * Example: resolveRepeater(productRailNode, schema) → [{ type:'productCard', ... }, ...]
 *
 * Each item in repeat.items becomes a child node whose shape comes from the template.
 */
export function resolveRepeater(node, schema) {
  const repeat = node.repeat;
  if (!repeat || !Array.isArray(repeat.items)) return [];

  const template = resolveTemplate(schema, repeat.templateRef);

  return repeat.items.map((item) => ({
    ...(template || {}),
    id:       item.id || `${node.id}-item-${Math.random().toString(36).slice(2, 7)}`,
    content:  item,
    children: [],
  }));
}

/**
 * Purpose: Returns all effective children — static children + repeater items.
 * Input:   node, schema
 * Output:  Array of child nodes
 * Example: resolveChildren(productRailNode, schema) → [...staticChildren, ...repeaterItems]
 */
export function resolveChildren(node, schema) {
  const staticChildren   = Array.isArray(node.children) ? node.children : [];
  const repeaterChildren = resolveRepeater(node, schema);
  return [...staticChildren, ...repeaterChildren];
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. SLOTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Resolves a node's slots map to actual child node objects.
 * Input:   node — with a slots field; schema
 * Output:  { slotName: childNode } map
 * Example: resolveSlots(slideNode, schema) → { left: stackNode, right: imageNode }
 *
 * Slots let renderers place specific children into named positions (e.g. split layout).
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
 * Purpose: Returns children NOT assigned to any named slot.
 * Input:   node, schema
 * Output:  Array of unslotted child nodes
 * Example: resolveUnslottedChildren(slideNode, schema) → [badgeNode]
 *
 * Used by renderers that fill named slots but still want to render remaining children.
 */
export function resolveUnslottedChildren(node, schema) {
  const slottedIds = new Set(Object.values(node.slots || {}));
  return resolveChildren(node, schema).filter((c) => !slottedIds.has(c.id));
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. BEHAVIOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns a node's behavior config with safe defaults applied.
 * Input:   node
 * Output:  Behavior object with all expected keys present
 * Example: resolveBehavior(heroBannerNode) → { autoplay:true, autoplayInterval:4000, ... }
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
// 10. VISIBILITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns true if a node should be rendered.
 * Input:   node
 * Output:  boolean
 * Example: isNodeVisible({ enabled: false }) → false
 *          isNodeVisible({ enabled: true })  → true
 *
 * Explicit false disables the node. Absent enabled field defaults to visible.
 */
export function isNodeVisible(node) {
  if (node.enabled === false) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. TYPOGRAPHY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Resolves a fontSize value — may be a theme token or a CSS value.
 * Input:   value — token name (e.g. 'heroTitleSize') or CSS string; theme
 * Output:  CSS string (e.g. '2.5rem')
 * Example: resolveFontSize('heroTitleSize', theme) → '2.5rem'
 *          resolveFontSize('1.25rem', theme) → '1.25rem'
 */
export function resolveFontSize(value, theme) {
  if (!value) return undefined;
  if (typeof value === 'number') return `${value}px`;
  const typo = theme.typography || {};
  return typo[value] || value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. PRICE & FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Formats a number as an Indian Rupee string.
 * Input:   value — number; locale — optional string
 * Output:  String like '₹1,299'
 * Example: formatPrice(1299) → '₹1,299'
 */
export function formatPrice(value, locale = 'en-IN') {
  if (value === undefined || value === null || isNaN(value)) return '';
  return '₹' + Number(value).toLocaleString(locale);
}

/**
 * Purpose: Calculates integer discount percentage from sale and original price.
 * Input:   price — sale price; originalPrice — MRP
 * Output:  number 0–100
 * Example: calcDiscount(799, 1299) → 38
 *          calcDiscount(1299, 1299) → 0
 */
export function calcDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= 0 || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. FALLBACKS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns value if defined and non-empty, otherwise returns fallback.
 * Input:   value — any; fallback — any
 * Output:  value or fallback
 * Example: withFallback(undefined, 'default') → 'default'
 *          withFallback('hello', 'default') → 'hello'
 */
export function withFallback(value, fallback) {
  if (value !== undefined && value !== null && value !== '') return value;
  return fallback;
}

/**
 * Purpose: Returns a valid image URL, falling back to a placehold.co placeholder.
 * Input:   url — string; w, h — dimensions; text — placeholder label
 * Output:  URL string
 * Example: withImageFallback('', 300, 300) → 'https://placehold.co/300x300/...'
 */
export function withImageFallback(url, w = 300, h = 300, text = 'Image') {
  if (url && typeof url === 'string' && url.trim().length > 0) return url;
  return `https://placehold.co/${w}x${h}/F1F3F6/878787?text=${encodeURIComponent(text)}`;
}

/**
 * Purpose: Returns a safe fallback text node for error cases.
 * Input:   type — string; id — optional string
 * Output:  A minimal valid node that TextRenderer can render
 * Example: getFallbackNode('productCard') → { type:'text', content:{...}, ... }
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
// 14. NODE NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Normalizes a raw schema node — applies template and fills required keys.
 * Input:   node — raw node object; schema
 * Output:  Safe, fully-resolved node with all required keys present
 * Example: normalizeNode({ templateRef:'productCardTemplate', ... }, schema)
 *          → merged node with template defaults + node overrides
 *
 * Ensures every renderer always receives a complete, safe object.
 */
export function normalizeNode(node, schema) {
  if (!node || typeof node !== 'object') {
    return getFallbackNode('unknown');
  }
  const template = resolveTemplate(schema, node.templateRef);
  const merged   = mergeNodeWithTemplate(node, template);

  return {
    enabled:         true,
    children:        [],
    allowedChildren: [],
    supportedStyles: [],
    states:          {},
    behavior:        {},
    ...merged,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. SORTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Sorts nodes by their order field. Non-destructive.
 * Input:   nodes — array of node objects
 * Output:  New sorted array (original is not mutated)
 * Example: sortByOrder([{order:2}, {order:1}]) → [{order:1}, {order:2}]
 */
export function sortByOrder(nodes) {
  if (!Array.isArray(nodes)) return [];
  return [...nodes].sort((a, b) => {
    // Nodes with no order field sort to the end
    const oa = a.order !== undefined ? a.order : Infinity;
    const ob = b.order !== undefined ? b.order : Infinity;
    return oa - ob;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. LAYOUT CONFIG
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns grid column count for the current breakpoint.
 * Input:   layoutConfig — node.layout; breakpoint; fallback — default count
 * Output:  number
 * Example: resolveColumnCount({ desktopColumns:4, mobileColumns:2 }, 'mobile', 3) → 2
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
// 17. COUNTDOWN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns time remaining until a target date.
 * Input:   targetDate — ISO string or Date object
 * Output:  { days, hours, minutes, seconds } — all zero if date is in the past
 * Example: getTimeRemaining('2026-12-31T00:00:00Z') → { days:179, hours:6, ... }
 */
export function getTimeRemaining(targetDate) {
  const diff    = Math.max(0, new Date(targetDate).getTime() - Date.now());
  const seconds = Math.floor((diff / 1000)        % 60);
  const minutes = Math.floor((diff / 1000 / 60)   % 60);
  const hours   = Math.floor((diff / 1000 / 3600) % 24);
  const days    = Math.floor(diff / 1000 / 3600 / 24);
  return { days, hours, minutes, seconds };
}

// ─────────────────────────────────────────────────────────────────────────────
// 18. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Validates top-level schema structure.
 * Input:   schema
 * Output:  { valid: boolean, errors: string[] }
 * Example: validateSchema(schema) → { valid:true, errors:[] }
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
  if (!schema.pages && !schema.page) errors.push('Missing: pages');
  return { valid: errors.length === 0, errors };
}

/**
 * Purpose: Validates a single node's required fields and type.
 * Input:   node, schema
 * Output:  { valid: boolean, errors: string[], nodeId: string }
 * Example: validateNode({ id:'btn', type:'button', ... }, schema)
 */
export function validateNode(node, schema) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';

  if (!node || typeof node !== 'object') {
    return { valid: false, errors: ['Node must be a non-null object'], nodeId };
  }

  const required = schema?.validation?.requiredNodeKeys ||
    ['id', 'type', 'version', 'containerStyle', 'children'];

  for (const key of required) {
    if (node[key] === undefined) {
      errors.push(`Node "${nodeId}" is missing required key: "${key}"`);
    }
  }

  const allowedTypes = schema?.validation?.allowedTypes || [];
  if (allowedTypes.length > 0 && node.type && !allowedTypes.includes(node.type)) {
    errors.push(`Node "${nodeId}" has unknown type: "${node.type}"`);
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Purpose: Validates a node's children array and allowed child types.
 * Input:   node, schema
 * Output:  { valid: boolean, errors: string[], nodeId: string }
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
 * Purpose: Validates a node's placement object for required fields and ranges.
 * Input:   node
 * Output:  { valid: boolean, errors: string[], nodeId: string }
 */
export function validatePlacement(node) {
  const errors = [];
  const nodeId = node?.id || '(unknown)';
  const p = node?.placement;

  // Placement is optional — many nodes live inside parents without grid positioning
  if (!p) return { valid: true, errors: [], nodeId };

  const breakpoints = ['desktop', 'tablet', 'mobile'];
  const required    = ['colStart', 'colEnd', 'rowStart', 'rowEnd'];

  for (const bp of breakpoints) {
    if (!p[bp]) continue;
    for (const key of required) {
      if (p[bp][key] === undefined) {
        errors.push(`Node "${nodeId}" placement.${bp} is missing "${key}"`);
      }
    }
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
 * Purpose: Validates a node's behavior object for known field types.
 * Input:   node
 * Output:  { valid: boolean, errors: string[], nodeId: string }
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
 * Purpose: Validates a node's containerStyle keys. Warns on unknown keys, doesn't error.
 * Input:   node, schema
 * Output:  { valid: boolean, errors: string[], nodeId: string }
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
        // Unknown keys are silently dropped; warn only so the schema can self-document
        console.warn(`[SDUI] Node "${nodeId}" uses unrecognized style key "${key}". It will be ignored.`);
      }
    }
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Purpose: Validates a node's slots map for references to existing child IDs.
 * Input:   node, schema
 * Output:  { valid: boolean, errors: string[], nodeId: string }
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
      errors.push(`Node "${nodeId}" slot "${slotName}" references non-existent child id "${childId}"`);
    }
  }

  return { valid: errors.length === 0, errors, nodeId };
}

/**
 * Purpose: Recursively validates a full node tree, running all validators on every node.
 * Input:   node, schema, depth — current nesting depth (starts at 0)
 * Output:  { valid: boolean, errors: string[] }
 * Example: validateNodeTree(homePage, schema) → { valid:true, errors:[] }
 */
export function validateNodeTree(node, schema, depth = 0) {
  const allErrors = [];
  const maxDepth  = schema?.validation?.maxNestedDepth || 8;

  if (depth > maxDepth) {
    allErrors.push(`Node "${node?.id}" exceeds maximum nesting depth of ${maxDepth}`);
    return { valid: false, errors: allErrors };
  }

  const results = [
    validateNode(node, schema),
    validateChildren(node, schema),
    validatePlacement(node),
    validateBehavior(node),
    validateStyles(node, schema),
    validateSlots(node, schema),
  ];

  for (const r of results) allErrors.push(...r.errors);

  const children = resolveChildren(node, schema);
  for (const child of children) {
    const childResult = validateNodeTree(child, schema, depth + 1);
    allErrors.push(...childResult.errors);
  }

  return { valid: allErrors.length === 0, errors: allErrors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 19. INTERNAL UTILITIES  (private — not exported)
// ─────────────────────────────────────────────────────────────────────────────

/** Applies a spacing property (padding / margin) to the CSS accumulator. */
function _applySpacingProp(css, style, srcKey, dstKey, theme) {
  const raw = style[srcKey];
  if (raw === undefined) return;
  if (typeof raw === 'number') { css[dstKey] = `${raw}px`; return; }
  const resolved = resolveSpacing(raw, theme);
  css[dstKey] = typeof resolved === 'number' ? `${resolved}px` : resolved;
}

/** Applies a dimension property (width / height / min* / max*) to the CSS accumulator. */
function _applyDimProp(css, style, key) {
  const raw = style[key];
  if (raw === undefined) return;
  // Numbers become px; strings like '100%', 'auto', 'fit-content' pass through
  css[key] = typeof raw === 'number' ? `${raw}px` : raw;
}

/** Converts a number to a px string; passes strings through unchanged. */
function _px(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 20. PAGE ROUTING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Returns the pages array from the schema.
 * Input:   schema
 * Output:  Array of page objects
 * Example: getPages(schema) → [{ id:'home', ... }, { id:'wishlist', ... }]
 *
 * Falls back to wrapping the legacy single `page` key for compatibility.
 */
export function getPages(schema) {
  if (Array.isArray(schema.pages)) return schema.pages;
  if (schema.page) return [schema.page];
  return [];
}

/**
 * Purpose: Returns the navigation config from the schema.
 * Input:   schema
 * Output:  navigation object or null
 * Example: getNavigation(schema) → { type:'bottomNav', items:[...] }
 */
export function getNavigation(schema) {
  return schema.navigation || null;
}

/**
 * Purpose: Finds the array index of a page by its id.
 * Input:   schema, pageId — string
 * Output:  number (index) or -1 if not found
 * Example: findPageIndex(schema, 'cart') → 2
 */
export function findPageIndex(schema, pageId) {
  return getPages(schema).findIndex((p) => p.id === pageId);
}

// ─────────────────────────────────────────────────────────────────────────────
// 21. OVERLAY REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Looks up an overlay definition from schema.overlays by its key.
 * Input:   schema, overlayId — string (matches a key in schema.overlays)
 * Output:  Overlay definition object or null
 * Example: resolveOverlayDef(schema, 'login') → { containerStyle:{...}, children:[...] }
 *
 * schema.overlays is a unified registry for modals, drawers, sheets, and tooltips.
 * The renderer reads it — never hardcodes overlay content.
 */
export function resolveOverlayDef(schema, overlayId) {
  if (!overlayId) return null;
  const def = (schema.overlays || {})[overlayId];
  if (!def) {
    console.warn(`[SDUI] Overlay definition not found: "${overlayId}". Rendering fallback.`);
    return null;
  }
  return def;
}

// ─────────────────────────────────────────────────────────────────────────────
// 22. ACTION GROUP HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Enriches header action group children with live runtime state.
 * Input:   children — array of child nodes; cartCount — number; isMobile — boolean
 * Output:  Enriched children array (new array — originals not mutated)
 * Example: enrichActionGroupChildren(children, 3, true)
 *          → cart button with badgeCount=3 and label='' on mobile
 *
 * This lives in sduiLogic so ActionGroupRenderer stays completely dumb.
 * Mobile label hiding is opt-in via content.mobileHideLabel in schema.
 */
export function enrichActionGroupChildren(children, cartCount, isMobile) {
  return children.map((child) => {
    // Inject live cart badge count into the designated cart button
    if (child.id === 'header-btn-cart' && child.type === 'button') {
      return {
        ...child,
        content: {
          ...child.content,
          badgeCount: cartCount,
          // Strip label on mobile when the schema opts this button in
          label: (isMobile && child.content?.mobileHideLabel) ? '' : child.content?.label,
        },
      };
    }

    // Apply mobile label stripping to any button that opts in via schema
    if (isMobile && child.type === 'button' && child.content?.mobileHideLabel) {
      return {
        ...child,
        content:        { ...child.content, label: '' },
        containerStyle: { ...child.containerStyle, padding: '6px 8px' },
      };
    }

    return child;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 23. ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────

export const ACTION_TYPES = {
  NAVIGATE:             'navigate',
  NAVIGATE_CATEGORY:    'navigate_category',
  NAVIGATE_PRODUCT:     'navigate_product',
  NAVIGATE_BRAND:       'navigate_brand',
  NAVIGATE_SEARCH:      'navigate_search',
  NAVIGATE_BACK:        'navigate_back',
  NAVIGATE_PAGE:        'navigate_page',
  OPEN_URL:             'open_url',
  ADD_TO_CART:          'add_to_cart',
  REMOVE_FROM_CART:     'remove_from_cart',
  ADD_TO_WISHLIST:      'add_to_wishlist',
  REMOVE_FROM_WISHLIST: 'remove_from_wishlist',
  OPEN_MODAL:           'open_modal',
  CLOSE_MODAL:          'close_modal',
  OPEN_DRAWER:          'open_drawer',
  CLOSE_DRAWER:         'close_drawer',
  TOGGLE_FILTER:        'toggle_filter',
  APPLY_SORT:           'apply_sort',
  CLEAR_FILTERS:        'clear_filters',
  COPY_TEXT:            'copy_text',
  SCROLL_TO:            'scroll_to',
  SCROLL_TOP:           'scroll_top',
  SWIPE_NEXT:           'swipe_next',
  SWIPE_PREV:           'swipe_prev',
  GO_TO_SLIDE:          'go_to_slide',
  OPEN_SEARCH:          'open_search',
  SUBMIT_SEARCH:        'submit_search',
  DOWNLOAD_APP:         'download_app',
  SHARE:                'share',
  NOOP:                 'noop',
};

// ─────────────────────────────────────────────────────────────────────────────
// 24. TOAST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Fires a toast notification via a DOM custom event.
 * Input:   message — string; type — 'info'|'success'|'error'|'navigate'|'warning'; duration — ms
 * Output:  void (side effect: dispatches window event)
 * Example: fireToast('Added to cart 🛒', 'success', 2500)
 *
 * Uses a custom DOM event so ToastContainer can subscribe without shared module state.
 */
export function fireToast(message, type = 'info', duration = 2500) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('sdui:toast', {
      detail: { message, type, duration, id: Date.now() },
    })
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 25. ANALYTICS  (private — not exported)
// ─────────────────────────────────────────────────────────────────────────────

/** Logs analytics data from an action object. Replace console.info with a real tracker. */
function trackAnalytics(action) {
  if (!action?.analytics) return;
  console.info('[SDUI Analytics]', action.analytics);
}

// ─────────────────────────────────────────────────────────────────────────────
// 26. ACTION HANDLERS — Navigation
// ─────────────────────────────────────────────────────────────────────────────

function handleNavigate(payload, ctx) {
  const route = payload?.route || payload?.href || '/';
  const title = payload?.title || route;
  if (ctx?.onNavigate) {
    ctx.onNavigate(route, title);
  } else {
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState({}, title, route);
    }
    fireToast(`Navigating to ${title}`, 'navigate');
  }
}

function handleNavigateCategory(payload, ctx) {
  const slug  = payload?.slug  || 'all';
  const title = payload?.title || slug.charAt(0).toUpperCase() + slug.slice(1);
  if (ctx?.onNavigate) {
    ctx.onNavigate(`/category/${slug}`, title);
  } else {
    fireToast(`Opening "${title}" category`, 'navigate');
  }
}

function handleNavigateProduct(payload, ctx) {
  const productId = payload?.productId || payload?.id || '';
  const name      = payload?.name || 'Product';
  if (ctx?.onNavigate) {
    ctx.onNavigate(`/product/${productId}`, name);
  } else {
    fireToast(`Opening "${name}"`, 'navigate');
  }
}

function handleNavigateBrand(payload, ctx) {
  const brand = payload?.brand || payload?.name || '';
  if (ctx?.onNavigate) {
    ctx.onNavigate(`/brand/${brand.toLowerCase().replace(/\s+/g, '-')}`, brand);
  } else {
    fireToast(`Opening ${brand} store`, 'navigate');
  }
}

function handleNavigateSearch(payload, ctx) {
  const query = payload?.query || '';
  if (ctx?.onNavigate) {
    ctx.onNavigate(`/search?q=${encodeURIComponent(query)}`, `Search: ${query}`);
  } else {
    fireToast(`Searching for "${query}"`, 'info');
  }
}

function handleNavigateBack(payload, ctx) {
  if (ctx?.onBack) {
    ctx.onBack();
  } else if (typeof window !== 'undefined') {
    window.history.back();
  }
}

/**
 * Switches the active page in the multi-page shell.
 *
 * IMPORTANT: ctx must contain navigatePage (from NavigationContext value, not just actionCtx).
 * Always pass the full navigation context when calling dispatchGesture on page-level nodes.
 */
function handleNavigatePage(payload, ctx) {
  const pageId = payload?.pageId;
  if (!pageId) return;

  if (ctx?.navigatePage) {
    ctx.navigatePage(pageId);
  } else {
    // Emergency fallback — fires a DOM event when navigatePage is missing from ctx.
    // If this ever fires, the caller passed an incomplete context to dispatchGesture.
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sdui:navigate-page', { detail: { pageId } }));
    }
  }
}

function handleOpenUrl(payload) {
  const url    = payload?.url || '#';
  const target = payload?.target || '_blank';
  if (typeof window !== 'undefined') {
    window.open(url, target, 'noopener,noreferrer');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 27. ACTION HANDLERS — Overlay (modal / drawer / sheet)
// ─────────────────────────────────────────────────────────────────────────────

function handleOpenModal(payload, ctx) {
  if (ctx?.openModal) {
    ctx.openModal(payload?.modalId || 'default', payload);
  } else {
    fireToast(`Opening ${payload?.title || 'dialog'}`, 'info');
  }
}

function handleCloseModal(payload, ctx) {
  if (ctx?.closeModal) ctx.closeModal();
}

function handleOpenDrawer(payload, ctx) {
  if (ctx?.openDrawer) {
    ctx.openDrawer(payload?.drawerId || 'default', payload);
  } else {
    fireToast(`Opening ${payload?.title || 'drawer'}`, 'info');
  }
}

function handleCloseDrawer(payload, ctx) {
  if (ctx?.closeDrawer) ctx.closeDrawer();
}

// ─────────────────────────────────────────────────────────────────────────────
// 28. ACTION HANDLERS — Commerce (cart / wishlist)
// ─────────────────────────────────────────────────────────────────────────────

function handleAddToCart(payload, ctx) {
  if (ctx?.addToCart) {
    ctx.addToCart(payload);
    fireToast(`Added "${payload?.name || 'Item'}" to cart 🛒`, 'success');
  } else {
    fireToast('Added to cart 🛒', 'success');
  }
}

function handleRemoveFromCart(payload, ctx) {
  if (ctx?.removeFromCart) {
    ctx.removeFromCart(payload);
    fireToast('Removed from cart', 'info');
  }
}

function handleAddToWishlist(payload, ctx) {
  if (ctx?.addToWishlist) ctx.addToWishlist(payload);
  fireToast('Added to Wishlist ♡', 'success');
}

function handleRemoveFromWishlist(payload, ctx) {
  if (ctx?.removeFromWishlist) {
    ctx.removeFromWishlist(payload);
    fireToast('Removed from Wishlist', 'info');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 29. ACTION HANDLERS — Filter & Sort
// ─────────────────────────────────────────────────────────────────────────────

function handleToggleFilter(payload, ctx) {
  if (ctx?.toggleFilter) ctx.toggleFilter(payload?.filterId, payload?.value);
}

function handleApplySort(payload, ctx) {
  if (ctx?.applySort) ctx.applySort(payload?.sortId);
  fireToast(`Sorted by ${payload?.label || payload?.sortId}`, 'info');
}

function handleClearFilters(payload, ctx) {
  if (ctx?.clearFilters) ctx.clearFilters();
  fireToast('Filters cleared', 'info');
}

// ─────────────────────────────────────────────────────────────────────────────
// 30. ACTION HANDLERS — Utility & Media
// ─────────────────────────────────────────────────────────────────────────────

async function handleCopyText(payload) {
  const text = payload?.text || payload?.code || '';
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for environments without Clipboard API
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    fireToast(`Copied "${text}" ✓`, 'success');
  } catch {
    fireToast('Copy failed', 'error');
  }
}

function handleScrollTo(payload) {
  const el = document.getElementById(payload?.targetId || '');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleScrollTop() {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSwipeNext(payload, ctx) {
  if (ctx?.onSwipeNext) ctx.onSwipeNext();
}

function handleSwipePrev(payload, ctx) {
  if (ctx?.onSwipePrev) ctx.onSwipePrev();
}

function handleGoToSlide(payload, ctx) {
  if (ctx?.goToSlide) ctx.goToSlide(payload?.index ?? 0);
}

function handleOpenSearch() {
  const el = document.querySelector('[data-sdui="search-input"]');
  if (el) {
    el.focus();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    fireToast('Search is open', 'info');
  }
}

function handleSubmitSearch(payload, ctx) {
  handleNavigateSearch({ query: payload?.query || '' }, ctx);
}

function handleDownloadApp(payload) {
  const url      = payload?.url || '#';
  const platform = payload?.platform || 'app';
  fireToast(`Redirecting to ${platform} store…`, 'navigate');
  // Delay gives the toast time to appear before the browser navigates away
  setTimeout(() => {
    if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
  }, 500);
}

function handleShare(payload) {
  const shareData = {
    title: payload?.title || (typeof document !== 'undefined' ? document.title : ''),
    text:  payload?.text  || '',
    url:   payload?.url   || (typeof window !== 'undefined' ? window.location.href : '#'),
  };
  if (navigator?.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    // Web Share API unavailable — fall back to copying the URL
    handleCopyText({ text: shareData.url });
  }
}

function handleNoop() {}

// ─────────────────────────────────────────────────────────────────────────────
// 31. ACTION REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps action type strings to their handler functions.
 *
 * To add a new action:
 *   1. Write a handler function in the appropriate section above.
 *   2. Add its string key here.
 * The dispatcher below uses this map — no if/else chains anywhere.
 */
const ACTION_REGISTRY = {
  // Navigation
  navigate:             handleNavigate,
  navigate_category:    handleNavigateCategory,
  navigate_product:     handleNavigateProduct,
  navigate_brand:       handleNavigateBrand,
  navigate_search:      handleNavigateSearch,
  navigate_back:        handleNavigateBack,
  navigate_page:        handleNavigatePage,
  open_url:             handleOpenUrl,

  // Overlay
  open_modal:           handleOpenModal,
  close_modal:          handleCloseModal,
  open_drawer:          handleOpenDrawer,
  close_drawer:         handleCloseDrawer,

  // Commerce
  add_to_cart:          handleAddToCart,
  remove_from_cart:     handleRemoveFromCart,
  add_to_wishlist:      handleAddToWishlist,
  remove_from_wishlist: handleRemoveFromWishlist,

  // Filter & Sort
  toggle_filter:        handleToggleFilter,
  apply_sort:           handleApplySort,
  clear_filters:        handleClearFilters,

  // Utility & Media
  copy_text:            handleCopyText,
  scroll_to:            handleScrollTo,
  scroll_top:           handleScrollTop,
  swipe_next:           handleSwipeNext,
  swipe_prev:           handleSwipePrev,
  go_to_slide:          handleGoToSlide,
  open_search:          handleOpenSearch,
  submit_search:        handleSubmitSearch,
  download_app:         handleDownloadApp,
  share:                handleShare,
  noop:                 handleNoop,
};

// ─────────────────────────────────────────────────────────────────────────────
// 32. DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Dispatches a single action object from the JSON schema.
 * Input:   action — { type, payload, analytics } or string shorthand; ctx — context object
 * Output:  void (side effects: calls handler, fires analytics)
 * Example: dispatchAction({ type:'add_to_cart', payload:{...} }, actionCtx)
 */
export function dispatchAction(action, ctx = {}) {
  if (!action) return;

  // String shorthand: 'navigate:/path' → { type:'navigate', payload:{ route:'/path' } }
  if (typeof action === 'string') {
    if (action === 'noop') return;
    const [type, ...rest] = action.split(':');
    action = { type, payload: { route: rest.join(':') } };
  }

  const { type, payload = {}, analytics } = action;
  trackAnalytics({ type, analytics });

  const handler = ACTION_REGISTRY[type];
  if (!handler) {
    console.warn(`[SDUI] Unknown action type: "${type}"`);
    return;
  }

  try {
    handler(payload, ctx);
  } catch (err) {
    console.error(`[SDUI] Error in handler for "${type}":`, err);
  }
}

/**
 * Purpose: Dispatches multiple actions in sequence.
 * Input:   actions — array of action objects; ctx
 * Output:  void
 * Example: dispatchActions([{ type:'add_to_cart' }, { type:'close_modal' }], ctx)
 */
export function dispatchActions(actions, ctx = {}) {
  if (!Array.isArray(actions)) return;
  actions.forEach((a) => dispatchAction(a, ctx));
}

/**
 * Purpose: Creates a React onClick handler from a node's action or actions field.
 * Input:   node — SDUI node; ctx — action context
 * Output:  Click handler function or undefined if the node has no action
 * Example: createClickHandler(buttonNode, actionCtx) → (e) => dispatchAction(...)
 */
export function createClickHandler(node, ctx = {}) {
  const action  = node?.action;
  const actions = node?.actions;
  if (!action && !actions) return undefined;
  return (e) => {
    e?.stopPropagation?.();
    if (Array.isArray(actions)) {
      dispatchActions(actions, ctx);
    } else if (action) {
      dispatchAction(action, ctx);
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 33. GESTURE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purpose: Dispatches the action defined in a node's gestures field for a given gesture name.
 * Input:   node — has a gestures field; gesture — e.g. 'swipeLeft'; ctx — FULL navigation context
 * Output:  void
 * Example: dispatchGesture(page, 'swipeLeft', fullNavCtx)
 *
 * ⚠ IMPORTANT: ctx must include `navigatePage` for navigate_page gestures to work.
 *   Always pass the full NavigationContext value, NOT just actionCtx.
 *   The navigate_page handler falls back to a DOM event if navigatePage is absent,
 *   which means the page will not visually change.
 */
export function dispatchGesture(node, gesture, ctx = {}) {
  const action = node?.gestures?.[gesture];
  if (action) dispatchAction(action, ctx);
}

// ─────────────────────────────────────────────────────────────────────────────
// 34. NAVIGATION HISTORY
// ─────────────────────────────────────────────────────────────────────────────

let _history          = ['/'];
let _historyListeners = [];

/**
 * Purpose: In-memory navigation history with pub/sub support.
 * Usage:   NavigationHistory.push('/cart')
 *          NavigationHistory.subscribe((route, history) => { ... })
 *
 * Module-level state is intentional here — history is a singleton just like browser history.
 */
export const NavigationHistory = {
  push(route) {
    _history.push(route);
    _historyListeners.forEach((fn) => fn(route, _history));
  },
  back() {
    if (_history.length > 1) {
      _history.pop();
      const current = _history[_history.length - 1];
      _historyListeners.forEach((fn) => fn(current, _history));
      return current;
    }
    return '/';
  },
  current() {
    return _history[_history.length - 1] || '/';
  },
  subscribe(fn) {
    _historyListeners.push(fn);
    // Return an unsubscribe function for cleanup
    return () => { _historyListeners = _historyListeners.filter((l) => l !== fn); };
  },
  getHistory() {
    return [..._history];
  },
};
