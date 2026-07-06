/**
 * SDUIRenderer.jsx  —  v4.0.0
 *
 * The SDUI rendering engine entry point.
 *
 * Architecture:
 *   SDUIRenderer
 *     └─ renderNode(node, context)
 *          └─ COMPONENT_MAP[node.type]
 *               └─ renderNode(child, context)  (recursive)
 *
 * New in v4.0.0:
 *   ✓  Full action dispatch system (via sduiActions.js)
 *   ✓  NavigationContext with cart, wishlist, and modal state
 *   ✓  Touch swipe gestures on hero banner, product rails, carousels
 *   ✓  Styled scrollbars (thin, visible, branded)
 *   ✓  Toast notification system
 *   ✓  Mobile responsiveness improvements
 *   ✓  Wishlist quick-add on product cards
 *   ✓  Add to cart on product cards
 *
 * Rules:
 *   ✓  All layout and content decisions come from JSON.
 *   ✓  COMPONENT_MAP is the only extension point — no if-else chains.
 *   ✓  Every renderer is wrapped in an ErrorBoundary.
 *   ✓  No hardcoded brand logic.
 *   ✓  Styles always flow through buildStyleObject — no arbitrary Tailwind strings.
 */

import React, {
  useState, useEffect, useRef, useCallback,
  Component, createContext, useContext,
} from 'react';

import schema from './landing.schema.json';
import {
  buildContext,
  getCurrentBreakpoint,
  resolveTheme,
  resolveToken,
  resolveFontSize,
  buildStyleObject,
  buildStateStyle,
  buildGridStyle,
  resolvePlacement,
  resolveChildren,
  resolveSlots,
  resolveBehavior,
  isNodeVisible,
  normalizeNode,
  resolveColumnCount,
  validateSchema,
  formatPrice,
  calcDiscount,
  withFallback,
  withImageFallback,
  getTimeRemaining,
} from './sduiLogic.js';

import { dispatchAction, dispatchActions, createClickHandler, dispatchGesture, fireToast, NavigationHistory, getPages, getNavigation, findPageIndex, enrichActionGroupChildren, resolveOverlayDef } from './sduiLogic.js';


// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION / APP STATE CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const NavigationContext = createContext(null);

function useNavigation() {
  return useContext(NavigationContext);
}

function NavigationProvider({ children }) {
  const [cartItems,       setCartItems]       = useState([]);
  const [wishlistItems,   setWishlistItems]   = useState([]);
  const [activeModal,     setActiveModal]     = useState(null);
  const [activeDrawer,    setActiveDrawer]    = useState(null);
  const [currentRoute,    setCurrentRoute]    = useState('/');
  const [activePageIndex, setActivePageIndex] = useState(0);

  const addToCart = useCallback((item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) => i.productId === item.productId ? { ...i, qty: (i.qty || 1) + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((item) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== item.productId));
  }, []);

  const addToWishlist = useCallback((item) => {
    setWishlistItems((prev) => {
      if (prev.find((i) => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((item) => {
    setWishlistItems((prev) => prev.filter((i) => i.productId !== item.productId));
  }, []);

  const openModal  = useCallback((modalId, data) => setActiveModal({ modalId, data }), []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  const openDrawer  = useCallback((drawerId, data) => setActiveDrawer({ drawerId, data }), []);
  const closeDrawer = useCallback(() => setActiveDrawer(null), []);

  const navigate = useCallback((route, title) => {
    setCurrentRoute(route);
    NavigationHistory.push(route);
    fireToast(`📍 ${title || route}`, 'navigate');
  }, []);

  /**
   * Switches the active page by pageId (looked up from schema.pages).
   * Called by the navigate_page action handler.
   */
  const navigatePage = useCallback((pageId) => {
    const idx = findPageIndex(schema, pageId);
    if (idx !== -1) setActivePageIndex(idx);
  }, []);

  const actionCtx = {
    addToCart, removeFromCart,
    addToWishlist, removeFromWishlist,
    openModal, closeModal,
    openDrawer, closeDrawer,
    onNavigate: navigate,
    navigatePage,
    currentRoute,
  };

  return (
    <NavigationContext.Provider value={{
      cartItems, wishlistItems,
      activeModal, activeDrawer,
      currentRoute, navigate,
      activePageIndex, navigatePage,
      addToCart, removeFromCart,
      addToWishlist, removeFromWishlist,
      openModal, closeModal,
      openDrawer, closeDrawer,
      actionCtx,
    }}>
      {children}
      {activeModal && (
        <SDUIOverlayRenderer modal={activeModal} onClose={closeModal} />
      )}
    </NavigationContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERLAY RENDERER  (schema-driven — reads from schema.overlays)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SDUIOverlayRenderer
 *
 * Reads the overlay definition from schema.overlays[modalId] and renders its
 * children recursively using renderNode. All visual decisions (padding, radius,
 * background, animation) come from the overlay definition, never hardcoded here.
 *
 * Falls back to a generic message when no definition is found in the schema.
 */
function SDUIOverlayRenderer({ modal, onClose }) {
  const { modalId } = modal;

  // Get renderer context — SDUIContext is a parent in the tree so this always resolves.
  const ctx = useSDUI();
  const def = ctx ? resolveOverlayDef(ctx.schema, modalId) : null;

  // Close on ESC — respect the schema's closeOnEsc flag (defaults to true)
  useEffect(() => {
    const shouldClose = def?.behavior?.closeOnEsc !== false;
    if (!shouldClose) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, def]);

  // Backdrop and panel styles come entirely from the overlay definition
  const backdropBg  = def?.overlayStyle?.background || 'rgba(0,0,0,0.55)';
  const panelStyle  = ctx ? buildStyleObject(def?.containerStyle || {}, ctx.theme) : {};
  const handleOverlayClick = def?.behavior?.closeOnOverlayClick !== false ? onClose : undefined;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: backdropBg,
        backdropFilter: 'blur(4px)',
        animation: 'sdui-fade-in 0.2s ease',
      }}
      onClick={handleOverlayClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          ...panelStyle,
          position: 'relative',
          animation: `${def?.animation || 'sdui-slide-up'} 0.25s ease`,
          maxWidth: panelStyle.maxWidth || 420,
          width: '90%',
          overflow: 'auto',
        }}
      >
        {/* Close button — shown unless schema explicitly hides it */}
        {def?.behavior?.showCloseButton !== false && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'none', border: 'none',
              fontSize: 22, cursor: 'pointer',
              color: resolveToken(ctx?.theme?.tokens?.textSecondary || '#878787', ctx?.theme || {}),
              lineHeight: 1,
            }}
          >✕</button>
        )}

        {/* Schema-driven children — or a safe fallback if no overlay is defined */}
        {def && ctx
          ? renderChildren(def, ctx)
          : (
            <div style={{ padding: 32 }}>
              <p style={{ margin: 0, color: '#878787', fontSize: '0.875rem' }}>
                Dialog: <strong>{modalId}</strong>
              </p>
              <button
                onClick={onClose}
                style={{ marginTop: 20, padding: '10px 24px', background: '#2874F0', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit' }}
              >Close</button>
            </div>
          )
        }
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

const TOAST_ICONS = {
  success:  '✓',
  error:    '✕',
  navigate: '→',
  info:     'ℹ',
  warning:  '⚠',
};

const TOAST_COLORS = {
  success:  { bg: '#16A34A', text: '#fff' },
  error:    { bg: '#DC2626', text: '#fff' },
  navigate: { bg: '#2874F0', text: '#fff' },
  info:     { bg: '#212121', text: '#fff' },
  warning:  { bg: '#D97706', text: '#fff' },
};

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const { message, type = 'info', duration = 2500, id } = e.detail;
      setToasts((prev) => [...prev.slice(-4), { id, message, type, duration }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };
    window.addEventListener('sdui:toast', handler);
    return () => window.removeEventListener('sdui:toast', handler);
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => {
        const colors = TOAST_COLORS[toast.type] || TOAST_COLORS.info;
        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: colors.bg,
              color: colors.text,
              padding: '10px 20px',
              borderRadius: 9999,
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              animation: 'sdui-slide-up 0.25s ease',
              whiteSpace: 'nowrap',
              maxWidth: '90vw',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <span>{TOAST_ICONS[toast.type] || 'ℹ'}</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDERER CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const SDUIContext = createContext(null);

function useSDUI() {
  return useContext(SDUIContext);
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useBreakpoint() {
  const [bp, setBp] = useState(() => getCurrentBreakpoint(window.innerWidth));
  useEffect(() => {
    const handler = () => setBp(getCurrentBreakpoint(window.innerWidth));
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return bp;
}

/** Hover state toggle — returns [hovered, hoverProps] */
function useHover() {
  const [hovered, setHovered] = useState(false);
  return [
    hovered,
    {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  ];
}

/**
 * Touch swipe gesture hook.
 * Returns props to spread on a container element.
 *
 * @param {function} onSwipeLeft   Called when user swipes left
 * @param {function} onSwipeRight  Called when user swipes right
 * @param {number}   threshold     Minimum px to register as a swipe (default 40)
 */
function useSwipe(onSwipeLeft, onSwipeRight, threshold = 40) {
  const startX = useRef(null);
  const startY = useRef(null);

  const onTouchStart = useCallback((e) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (startX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - startX.current;
    const deltaY = e.changedTouches[0].clientY - startY.current;

    // Only fire if horizontal movement is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX < 0) onSwipeLeft?.();
      else            onSwipeRight?.();
    }
    startX.current = null;
    startY.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { onTouchStart, onTouchEnd };
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR BOUNDARY
// ─────────────────────────────────────────────────────────────────────────────

class NodeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[SDUI] Node render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '8px 12px',
          background: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: 4,
          fontSize: 12,
          color: '#92400E',
          fontFamily: 'monospace',
        }}>
          ⚠ [{this.props.nodeType || 'node'} failed to render]
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE RENDER FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recursively renders a single SDUI node.
 * This is the heart of the engine — it never has brand-specific knowledge.
 */
function renderNode(node, context) {
  if (!node) return null;

  const normalized = normalizeNode(node, context.schema);

  if (!isNodeVisible(normalized)) return null;

  const Renderer = COMPONENT_MAP[normalized.type];

  if (!Renderer) {
    console.warn(`[SDUI] No renderer registered for type: "${normalized.type}"`);
    return (
      <div key={normalized.id} style={{ padding: 8, color: '#878787', fontSize: 12 }}>
        [{normalized.type}]
      </div>
    );
  }

  return (
    <NodeErrorBoundary key={normalized.id} nodeType={normalized.type}>
      <Renderer node={normalized} context={context} />
    </NodeErrorBoundary>
  );
}

/** Renders an array of child nodes. */
function renderChildren(node, context) {
  const children = resolveChildren(node, context.schema);
  return children.map((child) => renderNode(child, context));
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT RENDERER
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// BOTTOM NAV  (driven entirely by schema.navigation)
// ─────────────────────────────────────────────────────────────────────────────

function BottomNavRenderer({ navigation, pages, activePageIndex, onSelect, theme }) {
  const items = navigation?.items || [];
  const primary = resolveToken(theme?.tokens?.primary || '#2874F0', theme);
  const surface  = resolveToken(theme?.tokens?.surface  || '#FFFFFF',  theme);
  const border   = resolveToken(theme?.tokens?.border   || '#E0E0E0',  theme);

  return (
    <nav
      style={{
        position:        'fixed',
        bottom:          0,
        left:            0,
        right:           0,
        height:          64,
        backgroundColor: surface,
        borderTop:       `1px solid ${border}`,
        display:         'flex',
        alignItems:      'stretch',
        zIndex:          1000,
        boxShadow:       '0 -2px 12px rgba(0,0,0,0.08)',
        fontFamily:      theme?.typography?.fontFamily || 'sans-serif',
      }}
    >
      {items.map((item, idx) => {
        const isActive = idx === activePageIndex;
        return (
          <button
            key={item.pageId}
            id={`nav-tab-${item.pageId}`}
            onClick={() => onSelect(idx)}
            style={{
              flex:          1,
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              justifyContent:'center',
              gap:           3,
              border:        'none',
              background:    'none',
              cursor:        'pointer',
              padding:       '4px 0',
              position:      'relative',
            }}
          >
            {isActive && (
              <span style={{
                position:        'absolute',
                top:             0,
                left:            '50%',
                transform:       'translateX(-50%)',
                width:           32,
                height:          3,
                borderRadius:    '0 0 4px 4px',
                backgroundColor: primary,
              }} />
            )}
            <span style={{
              fontSize:  22,
              lineHeight: 1,
              filter:    isActive ? 'none' : 'grayscale(1) opacity(0.45)',
              transform: isActive ? 'scale(1.15)' : 'scale(1)',
              transition:'transform 0.2s ease',
            }}>{item.icon}</span>
            <span style={{
              fontSize:   '0.625rem',
              fontWeight: isActive ? 700 : 400,
              color:      isActive ? primary : '#878787',
              transition: 'color 0.2s ease',
            }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE PAGE RENDERER
// ─────────────────────────────────────────────────────────────────────────────

function PageRenderer({ page, context, breakpoint }) {
  const { theme } = context;
  const pageStyle = {
    ...buildStyleObject(page.containerStyle || {}, theme),
    fontFamily: theme.typography?.fontFamily || 'sans-serif',
    color:      resolveToken(theme.tokens?.textPrimary || '#212121', theme),
    minHeight:  '100vh',
  };

  const gridStyle = {
    display:             'grid',
    gridTemplateColumns: 'repeat(100, 1fr)',
    gridAutoRows:        'minmax(0, auto)',
  };

  return (
    <div style={pageStyle}>
      <div style={gridStyle}>
        {(page.children || []).map((child) => {
          const norm      = normalizeNode(child, schema);
          if (!isNodeVisible(norm)) return null;
          const placement = resolvePlacement(norm, breakpoint);
          // If no placement defined (e.g. placeholder pages), span all 100 columns
          const gridPos   = placement ? buildGridStyle(placement) : { gridColumn: '1 / -1' };
          const Renderer  = COMPONENT_MAP[norm.type];
          if (!Renderer) return null;
          return (
            <NodeErrorBoundary key={norm.id} nodeType={norm.type}>
              <div style={{ ...gridPos, minWidth: 0 }}>
                <Renderer node={norm} context={{ ...context, breakpoint }} />
              </div>
            </NodeErrorBoundary>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT RENDERER
// ─────────────────────────────────────────────────────────────────────────────

export default function SDUIRenderer() {
  const breakpoint   = useBreakpoint();
  const screenWidth  = typeof window !== 'undefined' ? window.innerWidth  : 1280;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const context    = buildContext(schema, screenWidth, screenHeight);
  const pages      = getPages(schema);
  const navigation = getNavigation(schema);
  const { theme }  = context;

  // Validate schema once on mount (dev-only warnings)
  useEffect(() => {
    const { valid, errors } = validateSchema(schema);
    if (!valid) {
      errors.forEach((e) => console.warn('[SDUI] Schema validation:', e));
    }
  }, []);

  return (
    <NavigationProvider>
      <SDUIContext.Provider value={{ ...context, breakpoint, renderNode }}>
        <AppShell
          pages={pages}
          navigation={navigation}
          context={context}
          breakpoint={breakpoint}
          theme={theme}
        />
        <ToastContainer />
      </SDUIContext.Provider>
    </NavigationProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP SHELL  (reads activePageIndex from NavigationProvider)
// ─────────────────────────────────────────────────────────────────────────────

function AppShell({ pages, navigation, context, breakpoint, theme }) {
  const { activePageIndex, navigatePage, actionCtx } = useNavigation();
  const containerRef   = useRef(null);
  // Keep refs to latest values so the single-mount effect always sees them
  const activePageRef  = useRef(null);
  const actionCtxRef   = useRef(null);

  const currentIndex = (typeof activePageIndex === 'number') ? activePageIndex : 0;
  const activePage   = pages[currentIndex] || pages[0];

  useEffect(() => { activePageRef.current  = activePage; },  [activePage]);
  useEffect(() => { actionCtxRef.current   = actionCtx; },   [actionCtx]);

  const setIndex = useCallback((idx) => {
    if (idx >= 0 && idx < pages.length && navigatePage) {
      navigatePage(pages[idx].id);
    }
  }, [pages, navigatePage]);

  // ── Swipe gestures via non-passive DOM listeners ──────────────────────────
  // React's onTouchStart/onTouchEnd are passive — they cannot call preventDefault,
  // so the browser steals horizontal swipes as native scroll.
  // We use non-passive native listeners on the shell container instead.
  // The non-passive touchmove listener lets us block scroll during a horizontal swipe.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const THRESHOLD = 50; // px — minimum movement to register as a swipe
    let startX = null;
    let startY = null;

    const dispatch = (deltaX) => {
      const page = activePageRef.current;
      // fullCtx includes navigatePage — required for navigate_page gesture actions.
      // This is why we pass the full NavigationContext, not just actionCtx.
      const fullCtx = actionCtxRef.current || {};
      if      (deltaX < -THRESHOLD) dispatchGesture(page, 'swipeLeft',  fullCtx);
      else if (deltaX >  THRESHOLD) dispatchGesture(page, 'swipeRight', fullCtx);
    };

    const onTouchStart = (e) => {
      // Skip gesture detection if the touch started inside a component that
      // manages its own swipe (e.g. hero banner). Without this, a hero banner
      // swipe would ALSO trigger page navigation simultaneously.
      if (e.target.closest('[data-sdui-swipe-locked]')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      if (startX === null) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      // Only block browser scroll when horizontal movement is clearly dominant
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) dispatch(dx);
      startX = null;
      startY = null;
    };

    // Mouse drag — lets developers test swipes on desktop without a phone
    let mouseX = null;
    const onMouseDown = (e) => { mouseX = e.clientX; };
    const onMouseUp   = (e) => {
      if (mouseX === null) return;
      dispatch(e.clientX - mouseX);
      mouseX = null;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false }); // MUST be non-passive
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    el.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup', onMouseUp); // document so drag-outside works

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
      el.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []); // Runs once — refs hold the latest values

  const hasNav = navigation && (navigation.items || []).length > 0;

  return (
    <div
      ref={containerRef}
      style={{ paddingBottom: hasNav ? 64 : 0, minHeight: '100vh', userSelect: 'none' }}
    >
      <PageRenderer page={activePage} context={context} breakpoint={breakpoint} />
      {hasNav && (
        <BottomNavRenderer
          navigation={navigation}
          pages={pages}
          activePageIndex={currentIndex}
          onSelect={setIndex}
          theme={theme}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── LAYOUT COMPONENTS ────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function ContainerRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);

  // Sidebar layout mode
  if (node.layout?.mode === 'sidebar') {
    const gap      = node.layout.gap || 16;
    const isMobile = context.breakpoint === 'mobile';

    return (
      <div style={{
        ...style,
        display:       'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap,
        padding:       style.padding,
      }}>
        {renderChildren(node, context)}
      </div>
    );
  }

  return (
    <div style={{ ...style }}>
      {renderChildren(node, context)}
    </div>
  );
}

function RowRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ...style }}>
      {renderChildren(node, context)}
    </div>
  );
}

function ColumnRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {renderChildren(node, context)}
    </div>
  );
}

function StackRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);
  const gap   = style.gap || '12px';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap, ...style }}>
      {renderChildren(node, context)}
    </div>
  );
}

function GridLayoutRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);
  const cols  = resolveColumnCount(node.layout, context.breakpoint, 3);
  const gap   = node.layout?.gap || 12;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, ...style }}>
      {renderChildren(node, context)}
    </div>
  );
}

function HorizontalScrollerRenderer({ node, context }) {
  const { theme } = context;
  const style    = buildStyleObject(node.containerStyle, theme);
  const behavior = resolveBehavior(node);
  return (
    <div className="sdui-hscroll" style={{
      display:        'flex',
      flexDirection:  'row',
      overflowX:      'auto',
      gap:            style.gap || 12,
      scrollSnapType: behavior.snap ? 'x mandatory' : 'none',
      WebkitOverflowScrolling: 'touch',
      ...style,
    }}>
      {renderChildren(node, context)}
    </div>
  );
}

function OverlayRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);
  return (
    <div style={{ position: 'relative', ...style }}>
      {renderChildren(node, context)}
    </div>
  );
}

function StickyContainerRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, ...style }}>
      {renderChildren(node, context)}
    </div>
  );
}

function SpacerRenderer({ node }) {
  const h = node.containerStyle?.height || 16;
  return <div style={{ height: typeof h === 'number' ? `${h}px` : h, flexShrink: 0 }} />;
}

function DividerRenderer({ node, context }) {
  const { theme } = context;
  const color     = resolveToken(node.containerStyle?.background || 'border', theme);
  const thickness = node.containerStyle?.height || 1;
  return (
    <hr style={{
      border:     'none',
      borderTop:  `${typeof thickness === 'number' ? thickness : 1}px solid ${color}`,
      margin:     0,
      flexShrink: 0,
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── PRIMITIVE COMPONENTS ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function TextRenderer({ node, context }) {
  const { theme } = context;
  const c     = node.content || {};
  const style = buildStyleObject(node.containerStyle, theme);

  const textStyle = {
    ...style,
    color:         c.textColor   ? resolveToken(c.textColor, theme)  : style.color,
    fontSize:      c.fontSize    ? resolveFontSize(c.fontSize, theme) : style.fontSize,
    fontWeight:    c.fontWeight  !== undefined ? c.fontWeight  : style.fontWeight,
    lineHeight:    c.lineHeight  !== undefined ? c.lineHeight  : style.lineHeight,
    letterSpacing: c.letterSpacing || style.letterSpacing,
    textTransform: c.textTransform || style.textTransform,
    textAlign:     c.textAlign   || style.textAlign,
    margin:        0,
  };

  const tag   = c.tag || 'p';
  const props = { style: textStyle };
  return React.createElement(tag, props, c.text || '');
}

function ImageRenderer({ node, context }) {
  const { theme, schema: sch } = context;
  const c          = node.content || {};
  const style      = buildStyleObject(node.containerStyle, theme);
  const fallbackUrl = sch?.fallbacks?.missingImage || '';

  return (
    <img
      src={withImageFallback(c.src, 400, 300)}
      alt={c.alt || ''}
      style={{
        display:      'block',
        objectFit:    c.objectFit || 'cover',
        opacity:      c.opacity !== undefined ? c.opacity : (style.opacity !== undefined ? style.opacity : 1),
        width:        style.width  || '100%',
        height:       style.height || '100%',
        borderRadius: style.borderRadius,
        ...style,
      }}
      onError={(e) => { e.currentTarget.src = fallbackUrl || withImageFallback(''); }}
    />
  );
}

function ButtonRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c          = node.content || {};
  const [hov, hoverProps] = useHover();
  const style      = hov
    ? buildStateStyle(node.containerStyle, 'hover', node.states, theme)
    : buildStyleObject(node.containerStyle, theme);

  const textColor = c.textColor
    ? resolveToken(c.textColor, theme)
    : resolveToken(theme.tokens?.primaryText || '#FFFFFF', theme);

  const handleClick = node.action
    ? (e) => { e.stopPropagation(); dispatchAction(node.action, actionCtx); }
    : undefined;

  return (
    <button
      {...hoverProps}
      onClick={handleClick}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        justifyContent:  'center',
        gap:             6,
        cursor:          'pointer',
        border:          style.border || 'none',
        borderColor:     style.borderColor,
        borderRadius:    style.borderRadius,
        padding:         style.padding || '10px 20px',
        backgroundColor: style.backgroundColor || 'transparent',
        color:           textColor,
        fontSize:        style.fontSize || '0.875rem',
        fontWeight:      style.fontWeight || 600,
        boxShadow:       style.boxShadow,
        transition:      'all 0.15s ease',
        whiteSpace:      'nowrap',
        fontFamily:      'inherit',
      }}
    >
      {c.icon && <span style={{ fontSize: '1.1em' }}>{c.icon}</span>}
      {c.label}
      {c.badgeCount !== undefined && c.badgeCount > 0 && (
        <span style={{
          background:    resolveToken(theme.tokens?.accent || '#FB641B', theme),
          color:         '#fff',
          borderRadius:  '50%',
          fontSize:      10,
          minWidth:      18,
          height:        18,
          display:       'flex',
          alignItems:    'center',
          justifyContent:'center',
          marginLeft:    2,
        }}>
          {c.badgeCount}
        </span>
      )}
    </button>
  );
}

function BadgeRenderer({ node, context }) {
  const { theme } = context;
  const c     = node.content || {};
  const style = buildStyleObject(node.containerStyle, theme);
  const bg    = style.backgroundColor || resolveToken(theme.tokens?.accent || '#FB641B', theme);
  const color = c.textColor ? resolveToken(c.textColor, theme) : '#FFFFFF';

  return (
    <span style={{
      display:         'inline-block',
      backgroundColor: bg,
      color,
      borderRadius:    style.borderRadius || '9999px',
      padding:         style.padding || '2px 8px',
      fontSize:        c.fontSize || '0.6875rem',
      fontWeight:      700,
      letterSpacing:   '0.03em',
      lineHeight:      1.5,
      textTransform:   'uppercase',
      whiteSpace:      'nowrap',
    }}>
      {c.text}
    </span>
  );
}

function PriceRenderer({ node, context }) {
  const { theme } = context;
  const c = node.content || {};

  const saleColor     = resolveToken(theme.tokens?.textPrimary   || '#212121', theme);
  const originalColor = resolveToken(theme.tokens?.textSecondary || '#878787', theme);
  const discountColor = resolveToken(theme.tokens?.success       || '#16A34A', theme);

  const discount = c.discount !== undefined
    ? c.discount
    : calcDiscount(c.price, c.originalPrice);

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 700, fontSize: '1rem', color: saleColor }}>
        {formatPrice(c.price)}
      </span>
      {c.originalPrice && c.originalPrice > c.price && (
        <span style={{ fontSize: '0.8rem', color: originalColor, textDecoration: 'line-through' }}>
          {formatPrice(c.originalPrice)}
        </span>
      )}
      {discount > 0 && (
        <span style={{ fontSize: '0.8rem', color: discountColor, fontWeight: 600 }}>
          {discount}% off
        </span>
      )}
    </div>
  );
}

function RatingRenderer({ node, context }) {
  const { theme } = context;
  const c   = node.content || {};
  const val = parseFloat(c.value || c.rating || 0);
  const count = c.count || c.ratingCount || 0;
  const bg  = resolveToken(theme.tokens?.success || '#16A34A', theme);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             3,
        backgroundColor: bg,
        color:           '#fff',
        borderRadius:    3,
        padding:         '2px 6px',
        fontSize:        '0.75rem',
        fontWeight:      700,
      }}>
        {val.toFixed(1)} ★
      </span>
      {count > 0 && (
        <span style={{ fontSize: '0.75rem', color: resolveToken(theme.tokens?.textSecondary || '#878787', theme) }}>
          ({Number(count).toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
}

function IconRenderer({ node, context }) {
  const c = node.content || {};
  return (
    <span style={{ fontSize: c.size || '1.25rem', lineHeight: 1, userSelect: 'none' }}>
      {c.icon || c.emoji || ''}
    </span>
  );
}

function ChipRenderer({ node, context }) {
  const { theme } = context;
  const c     = node.content || {};
  const style = buildStyleObject(node.containerStyle, theme);
  const [hov, hoverProps] = useHover();
  return (
    <button
      {...hoverProps}
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             4,
        padding:         '4px 12px',
        borderRadius:    9999,
        border:          c.selected ? 'none' : `1px solid ${resolveToken(theme.tokens?.border || '#E0E0E0', theme)}`,
        backgroundColor: c.selected
          ? resolveToken(theme.tokens?.primary || '#2874F0', theme)
          : hov
            ? resolveToken(theme.tokens?.background || '#F1F3F6', theme)
            : resolveToken(theme.tokens?.surface || '#FFFFFF', theme),
        color:       c.selected ? '#fff' : resolveToken(theme.tokens?.textPrimary || '#212121', theme),
        fontSize:    '0.8125rem',
        fontWeight:  c.selected ? 600 : 400,
        cursor:      'pointer',
        transition:  'all 0.15s ease',
        fontFamily:  'inherit',
        ...style,
      }}
    >
      {c.label}
    </button>
  );
}

function CheckboxRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c          = node.content || {};
  const [checked, setChecked] = useState(!!c.checked);
  const primary    = resolveToken(theme.tokens?.primary || '#2874F0', theme);

  function handleChange() {
    setChecked((v) => !v);
    if (node.action) {
      dispatchAction({ ...node.action, payload: { ...node.action.payload, checked: !checked } }, actionCtx);
    }
  }

  return (
    <label
      onClick={handleChange}
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        8,
        cursor:     'pointer',
        userSelect: 'none',
        fontSize:   '0.875rem',
        color:      resolveToken(theme.tokens?.textPrimary || '#212121', theme),
      }}
    >
      <span style={{
        width:           16,
        height:          16,
        borderRadius:    2,
        border:          `1.5px solid ${checked ? primary : resolveToken(theme.tokens?.border || '#E0E0E0', theme)}`,
        backgroundColor: checked ? primary : 'transparent',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        flexShrink:      0,
        transition:      'all 0.15s ease',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 10, lineHeight: 1 }}>✓</span>}
      </span>
      <span style={{ flex: 1 }}>{c.label}</span>
      {c.count !== undefined && (
        <span style={{ color: resolveToken(theme.tokens?.textSecondary || '#878787', theme), fontSize: '0.75rem' }}>
          ({c.count?.toLocaleString('en-IN')})
        </span>
      )}
    </label>
  );
}

function RadioRenderer({ node, context }) {
  const { theme } = context;
  const c       = node.content || {};
  const primary = resolveToken(theme.tokens?.primary || '#2874F0', theme);

  return (
    <label style={{
      display:    'flex',
      alignItems: 'center',
      gap:        8,
      cursor:     'pointer',
      userSelect: 'none',
      fontSize:   '0.875rem',
      color:      resolveToken(theme.tokens?.textPrimary || '#212121', theme),
    }}>
      <span style={{
        width:           16,
        height:          16,
        borderRadius:    '50%',
        border:          `1.5px solid ${c.selected ? primary : resolveToken(theme.tokens?.border || '#E0E0E0', theme)}`,
        backgroundColor: 'transparent',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        flexShrink:      0,
      }}>
        {c.selected && (
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: primary, display: 'block' }} />
        )}
      </span>
      {c.label}
    </label>
  );
}

function CountdownRenderer({ node, context }) {
  const { theme } = context;
  const c = node.content || {};
  const [remaining, setRemaining] = useState(() => getTimeRemaining(c.targetDate));

  useEffect(() => {
    if (!c.targetDate) return;
    const id = setInterval(() => setRemaining(getTimeRemaining(c.targetDate)), 1000);
    return () => clearInterval(id);
  }, [c.targetDate]);

  const style = buildStyleObject(node.containerStyle, theme);
  const bg    = style.backgroundColor || 'rgba(0,0,0,0.3)';

  const unit = (val, label) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff', lineHeight: 1 }}>
        {String(val).padStart(2, '0')}
      </div>
      <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );

  const sep = <span style={{ fontWeight: 700, color: '#fff', alignSelf: 'flex-start', marginTop: 2 }}>:</span>;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, ...style, backgroundColor: bg, padding: style.padding || '8px 16px', borderRadius: style.borderRadius }}>
      {c.label && (
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginRight: 8, fontWeight: 600 }}>
          {c.label}
        </span>
      )}
      {unit(remaining.days, 'Days')} {sep}
      {unit(remaining.hours, 'Hrs')} {sep}
      {unit(remaining.minutes, 'Mins')} {sep}
      {unit(remaining.seconds, 'Secs')}
    </div>
  );
}

function SkeletonRenderer({ node, context }) {
  const { theme } = context;
  const style = buildStyleObject(node.containerStyle, theme);
  return (
    <div style={{
      backgroundColor: '#E0E0E0',
      borderRadius:    style.borderRadius || 4,
      width:           style.width  || '100%',
      height:          style.height || 20,
      animation:       'sdui-pulse 1.5s ease-in-out infinite',
    }} />
  );
}

function LinkRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c     = node.content || {};
  const style = buildStyleObject(node.containerStyle, theme);
  const color = resolveToken(theme.tokens?.primary || '#2874F0', theme);

  const handleClick = node.action
    ? (e) => { e.preventDefault(); dispatchAction(node.action, actionCtx); }
    : undefined;

  return (
    <a
      href={c.href || '#'}
      onClick={handleClick}
      style={{ color: style.color || color, fontSize: style.fontSize, textDecoration: 'none', ...style }}
    >
      {c.label || c.text}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── COMPOSITE PRIMITIVES ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

/** Shared internal card shell used by ProductCard, BrandCard, PromoCard */
function CardShell({ node, context, children, onClick }) {
  const { theme }  = context;
  const [hov, hoverProps] = useHover();
  const style = hov
    ? buildStateStyle(node.containerStyle, 'hover', node.states, theme)
    : buildStyleObject(node.containerStyle, theme);

  return (
    <div
      {...hoverProps}
      onClick={onClick}
      style={{
        ...style,
        transition: 'all 0.2s ease',
        cursor:     style.cursor || 'pointer',
        overflow:   'hidden',
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── BUSINESS COMPOSITE COMPONENTS ────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function ProductCardRenderer({ node, context }) {
  const { theme }      = context;
  const { actionCtx, wishlistItems, addToWishlist } = useNavigation() || {};
  const c = node.content || {};

  const discount = c.discount !== undefined
    ? c.discount
    : calcDiscount(c.price, c.originalPrice);

  const textPrimary   = resolveToken(theme.tokens?.textPrimary   || '#212121', theme);
  const textSecondary = resolveToken(theme.tokens?.textSecondary || '#878787', theme);
  const successColor  = resolveToken(theme.tokens?.success       || '#16A34A', theme);
  const primaryColor  = resolveToken(theme.tokens?.primary       || '#2874F0', theme);

  // Build action from node.action OR from repeat item's action field
  const cardAction = node.action || (c.action ? c.action : null);
  const secondaryAction = node.secondaryAction || null;

  const isWishlisted = wishlistItems?.some((w) => w.productId === (c.action?.payload?.productId || c.id));

  const handleCardClick = cardAction
    ? () => dispatchAction(cardAction, actionCtx)
    : undefined;

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (secondaryAction) {
      dispatchAction(secondaryAction, actionCtx);
    } else if (c.name) {
      dispatchAction({
        type: 'add_to_wishlist',
        payload: { productId: c.id || node.id, name: c.name, price: c.price },
      }, actionCtx);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatchAction({
      type: 'add_to_cart',
      payload: { productId: c.id || node.id, name: c.name, price: c.price },
    }, actionCtx);
  };

  return (
    <CardShell node={node} context={context} onClick={handleCardClick}>
      {/* Badge */}
      <div style={{ position: 'relative' }}>
        {c.badge && (
          <span style={{
            position:        'absolute',
            top:             8,
            left:            8,
            zIndex:          1,
            backgroundColor: c.badgeColor || resolveToken(theme.tokens?.accent || '#FB641B', theme),
            color:           '#fff',
            fontSize:        '0.6875rem',
            fontWeight:      700,
            padding:         '2px 7px',
            borderRadius:    3,
            textTransform:   'uppercase',
          }}>
            {c.badge}
          </span>
        )}
        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          title="Add to Wishlist"
          style={{
            position:        'absolute',
            top:             8,
            right:           8,
            zIndex:          1,
            background:      'rgba(255,255,255,0.9)',
            border:          'none',
            borderRadius:    '50%',
            width:           28,
            height:          28,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            cursor:          'pointer',
            fontSize:        14,
            boxShadow:       '0 1px 4px rgba(0,0,0,0.15)',
            transition:      'transform 0.15s ease',
            color:           isWishlisted ? '#DC2626' : '#878787',
          }}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      </div>

      {/* Image */}
      <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#f8f8f8' }}>
        <img
          src={withImageFallback(c.imageUrl, 300, 400)}
          alt={c.name || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
          onError={(e) => { e.currentTarget.src = withImageFallback('', 300, 400); }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: context.breakpoint === 'mobile' ? '6px 4px 8px' : '8px 6px 10px' }}>
        {c.brand && (
          <div style={{ fontSize: '0.625rem', fontWeight: 700, color: textSecondary, textTransform: 'uppercase', marginBottom: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {c.brand}
          </div>
        )}
        <div style={{ fontSize: context.breakpoint === 'mobile' ? '0.8125rem' : '0.875rem', color: textPrimary, fontWeight: 500, lineHeight: 1.3, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {c.name}
        </div>

        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: textPrimary }}>
            {formatPrice(c.price)}
          </span>
          {c.originalPrice > c.price && (
            <span style={{ fontSize: '0.6875rem', color: textSecondary, textDecoration: 'line-through' }}>
              {formatPrice(c.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span style={{ fontSize: '0.6875rem', color: successColor, fontWeight: 600 }}>
              {discount}% off
            </span>
          )}
        </div>

        {/* Rating */}
        {c.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <span style={{ backgroundColor: successColor, color: '#fff', borderRadius: 3, padding: '1px 5px', fontSize: '0.6875rem', fontWeight: 700 }}>
              {parseFloat(c.rating).toFixed(1)} ★
            </span>
            {c.ratingCount && (
              <span style={{ fontSize: '0.6875rem', color: textSecondary }}>
                ({Number(c.ratingCount).toLocaleString('en-IN')})
              </span>
            )}
          </div>
        )}

        {/* Special offer */}
        {c.specialOffer && (
          <div style={{ fontSize: '0.6875rem', color: successColor, fontWeight: 600, marginBottom: 6 }}>
            {c.specialOffer}
          </div>
        )}

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          style={{
            width:           '100%',
            padding:         context.breakpoint === 'mobile' ? '6px 0' : '7px 0',
            backgroundColor: primaryColor,
            color:           '#fff',
            border:          'none',
            borderRadius:    4,
            fontSize:        context.breakpoint === 'mobile' ? '0.6875rem' : '0.75rem',
            fontWeight:      700,
            cursor:          'pointer',
            fontFamily:      'inherit',
            transition:      'background 0.15s ease',
            marginTop:       4,
            whiteSpace:      'nowrap',
            overflow:        'hidden',
            textOverflow:    'ellipsis',
          }}
        >
          {context.breakpoint === 'mobile' ? 'Add' : 'Add to Cart'}
        </button>
      </div>
    </CardShell>
  );
}

function BrandCardRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c = node.content || {};
  const [hov, hoverProps] = useHover();
  const style = hov
    ? buildStateStyle(node.containerStyle, 'hover', node.states, theme)
    : buildStyleObject(node.containerStyle, theme);

  const cardAction = node.action || (c.action ? c.action : null);
  const handleClick = cardAction
    ? () => dispatchAction(cardAction, actionCtx)
    : undefined;

  return (
    <div
      {...hoverProps}
      onClick={handleClick}
      style={{
        ...style,
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           8,
        cursor:        'pointer',
        transition:    'all 0.2s ease',
        textAlign:     'center',
        minWidth:      100,
      }}
    >
      <div style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: `1px solid ${resolveToken(theme.tokens?.border || '#E0E0E0', theme)}` }}>
        <img
          src={withImageFallback(c.logoUrl, 72, 72)}
          alt={c.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: resolveToken(theme.tokens?.textPrimary || '#212121', theme) }}>
        {c.name}
      </span>
      {c.offer && (
        <span style={{ fontSize: '0.6875rem', color: resolveToken(theme.tokens?.primary || '#2874F0', theme), fontWeight: 600 }}>
          {c.offer}
        </span>
      )}
    </div>
  );
}

function PromoCardRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c = node.content || {};
  const [hov, hoverProps] = useHover();
  const style = hov
    ? buildStateStyle(node.containerStyle, 'hover', node.states, theme)
    : buildStyleObject(node.containerStyle, theme);

  const cardAction = node.action;
  const handleClick = cardAction
    ? () => dispatchAction(cardAction, actionCtx)
    : undefined;

  return (
    <div
      {...hoverProps}
      onClick={handleClick}
      style={{
        ...style,
        position:  'relative',
        overflow:  'hidden',
        minHeight: style.minHeight || 200,
        display:   'flex',
        alignItems:'flex-end',
        cursor:    'pointer',
        transition:'transform 0.2s ease',
      }}
    >
      {/* Background image */}
      <img
        src={withImageFallback(c.imageUrl, 600, 300)}
        alt={c.title || ''}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
        onError={(e) => { e.currentTarget.src = withImageFallback('', 600, 300); }}
      />
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px', color: '#fff', width: '100%' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>{c.title}</h3>
        <p style={{ fontSize: '0.8125rem', opacity: 0.85, marginBottom: 12 }}>{c.subtitle}</p>
        <button style={{
          backgroundColor: '#fff',
          color:           c.bgColor || resolveToken(theme.tokens?.primary || '#2874F0', theme),
          border:          'none',
          borderRadius:    3,
          padding:         '7px 18px',
          fontWeight:      700,
          fontSize:        '0.8125rem',
          cursor:          'pointer',
          fontFamily:      'inherit',
        }}>
          {c.ctaLabel}
        </button>
      </div>
    </div>
  );
}

function CouponCardRenderer({ node, context }) {
  const { theme }        = context;
  const { actionCtx }    = useNavigation() || {};
  const c                = node.content || {};
  const [copied, setCopied] = useState(false);
  const style            = buildStyleObject(node.containerStyle, theme);
  const primaryColor     = resolveToken(theme.tokens?.primary || '#2874F0', theme);
  const successColor     = resolveToken(theme.tokens?.success || '#16A34A', theme);

  function handleCopy() {
    // Use the action from the node (copy_text action)
    const copyAction = node.action || { type: 'copy_text', payload: { text: c.code } };
    dispatchAction(copyAction, actionCtx);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      ...style,
      display:       'flex',
      flexDirection: 'column',
      gap:           8,
      minWidth:      220,
      flexShrink:    0,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {c.icon && <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: resolveToken(theme.tokens?.textPrimary || '#212121', theme), marginBottom: 2 }}>
            {c.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: resolveToken(theme.tokens?.textSecondary || '#878787', theme) }}>
            {c.subtitle}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <code style={{ fontSize: '0.875rem', fontWeight: 700, color: primaryColor, letterSpacing: '0.1em', background: '#EAF2FF', padding: '4px 10px', borderRadius: 3 }}>
          {c.code}
        </code>
        <button
          onClick={handleCopy}
          style={{
            backgroundColor: copied ? successColor : primaryColor,
            color:           '#fff',
            border:          'none',
            borderRadius:    3,
            padding:         '6px 14px',
            fontSize:        '0.75rem',
            fontWeight:      700,
            cursor:          'pointer',
            transition:      'background 0.2s ease',
            fontFamily:      'inherit',
          }}
        >
          {copied ? '✓ Copied!' : c.ctaLabel || 'Copy'}
        </button>
      </div>
      {c.expiry && (
        <div style={{ fontSize: '0.6875rem', color: resolveToken(theme.tokens?.textSecondary || '#878787', theme) }}>
          {c.expiry}
        </div>
      )}
    </div>
  );
}

function CategoryItemRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c = node.content || {};
  const [hov, hoverProps] = useHover();
  const bg = hov ? resolveToken(theme.tokens?.background || '#F1F3F6', theme) : 'transparent';

  const handleClick = node.action
    ? () => dispatchAction(node.action, actionCtx)
    : undefined;

  return (
    <button
      {...hoverProps}
      onClick={handleClick}
      style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           8,
        padding:       '10px 6px',
        background:    bg,
        border:        'none',
        cursor:        'pointer',
        borderRadius:  6,
        transition:    'background 0.15s ease',
        fontFamily:    'inherit',
        width:         '100%',
      }}
    >
      <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${resolveToken(theme.tokens?.border || '#E0E0E0', theme)}`, flexShrink: 0 }}>
        <img
          src={withImageFallback(c.iconUrl, 64, 64)}
          alt={c.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: resolveToken(theme.tokens?.textPrimary || '#212121', theme), textAlign: 'center', lineHeight: 1.3 }}>
        {c.label}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── SECTION COMPONENTS ───────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

function SectionTitle({ title, theme, cta, ctaAction }) {
  const { actionCtx } = useNavigation() || {};
  if (!title) return null;
  const textPrimary = resolveToken(theme.tokens?.textPrimary || '#212121', theme);
  const primary     = resolveToken(theme.tokens?.primary     || '#2874F0', theme);

  const handleCta = ctaAction
    ? () => dispatchAction(ctaAction, actionCtx)
    : undefined;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: textPrimary, margin: 0 }}>
        {title}
      </h2>
      {cta && (
        <button onClick={handleCta} style={{ background: 'none', border: `1px solid ${primary}`, borderRadius: 3, color: primary, fontSize: '0.8125rem', fontWeight: 600, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit' }}>
          {cta}
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function LogoRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c = node.content || {};
  const headerText = resolveToken(theme.tokens?.headerText || '#FFFFFF', theme);

  const handleClick = node.action
    ? () => dispatchAction(node.action, actionCtx)
    : undefined;

  return (
    <div
      onClick={handleClick}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: handleClick ? 'pointer' : 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {c.icon && <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>}
        <span style={{ fontWeight: 900, fontSize: '1.25rem', color: headerText, letterSpacing: '-0.02em' }}>
          {c.text}
        </span>
      </div>
      {c.tagline && (
        <span style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', marginTop: 1 }}>
          {c.tagline}
        </span>
      )}
    </div>
  );
}

function SearchBoxRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c     = node.content || {};
  const style = buildStyleObject(node.containerStyle, theme);
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim() && node.submitAction) {
      dispatchAction({ ...node.submitAction, payload: { query } }, actionCtx);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display:         'flex',
      alignItems:      'stretch',
      borderRadius:    style.borderRadius || 3,
      overflow:        'hidden',
      backgroundColor: style.backgroundColor || '#fff',
      flex:            1,
      maxWidth:        560,
      boxShadow:       style.boxShadow,
    }}>
      <span style={{ padding: '8px 12px', color: '#999', fontSize: 16, flexShrink: 0, display: 'flex', alignItems: 'center' }}>🔍</span>
      <input
        type="text"
        data-sdui="search-input"
        placeholder={c.placeholder || 'Search…'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex:            1,
          border:          'none',
          outline:         'none',
          padding:         '10px 8px',
          fontSize:        '0.875rem',
          backgroundColor: 'transparent',
          color:           resolveToken(theme.tokens?.textPrimary || '#212121', theme),
          fontFamily:      'inherit',
        }}
      />
      {c.showVoiceIcon && (
        <span style={{ padding: '8px 12px', color: '#555', fontSize: 16, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}>🎤</span>
      )}
      <button type="submit" style={{ padding: '0 16px', backgroundColor: '#FB641B', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Search
      </button>
    </form>
  );
}

function ActionGroupRenderer({ node, context }) {
  const { theme } = context;
  const { cartItems } = useNavigation() || {};
  const style    = buildStyleObject(node.containerStyle, theme);
  const isMobile = context.breakpoint === 'mobile';

  // Business logic lives in sduiLogic — this renderer just calls the helper and renders.
  const rawChildren = resolveChildren(node, context.schema);
  const children    = enrichActionGroupChildren(rawChildren, cartItems?.length || 0, isMobile);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 4 : (style.gap || 8), flexShrink: 0 }}>
      {children.map((child) => renderNode(child, context))}
    </div>
  );
}

function HeaderRenderer({ node, context }) {
  const { theme } = context;
  const style     = buildStyleObject(node.containerStyle, theme);
  const behavior  = resolveBehavior(node);
  const headerBg  = resolveToken(theme.tokens?.headerBg || '#2874F0', theme);
  const isMobile  = context.breakpoint === 'mobile';
  // maxWidth comes from schema layout — not hardcoded in the renderer
  const maxW      = node.layout?.maxWidth || 1280;

  const children  = resolveChildren(node, context.schema);
  const logo      = children.find((c) => c.type === 'logo');
  const search    = children.find((c) => c.type === 'searchBox');
  const actions   = children.find((c) => c.type === 'actionGroup');

  return (
    <header style={{
      backgroundColor: style.backgroundColor || headerBg,
      boxShadow:       style.boxShadow || '0 2px 4px rgba(0,0,0,0.15)',
      position:        behavior.sticky ? 'sticky' : 'relative',
      top:             0,
      zIndex:          behavior.zIndex || style.zIndex || 100,
      width:           '100%',
    }}>
      <div style={{
        maxWidth:   maxW,
        margin:     '0 auto',
        padding:    isMobile ? '10px 12px' : '10px 20px',
        display:    'flex',
        alignItems: 'center',
        gap:        isMobile ? 4 : 16,
      }}>
        {/* Logo — always shown */}
        {logo   && renderNode(logo,   context)}
        {/* Search — only on desktop in top row */}
        {search && !isMobile && renderNode(search, context)}
        {/* Actions — pushed right, compact on mobile */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: isMobile ? 2 : 8 }}>
          {actions && renderNode(actions, context)}
        </div>
      </div>
      {/* Mobile search row */}
      {isMobile && search && (
        <div style={{ padding: '0 12px 10px' }}>
          {renderNode(search, context)}
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function HeroBannerRenderer({ node, context }) {
  const { theme }             = context;
  const { actionCtx }         = useNavigation() || {};
  const behavior              = resolveBehavior(node);
  const children              = resolveChildren(node, context.schema);
  const slides                = children.filter((c) => c.type === 'slide');
  const [current, setCurrent] = useState(0);
  const timerRef              = useRef(null);
  const isMobile              = context.breakpoint === 'mobile';
  const layout                = node.layout || {};
  const gestures              = node.gestures || {};

  // Autoplay
  useEffect(() => {
    if (!behavior.autoplay || slides.length < 2) return;
    timerRef.current = setInterval(
      () => setCurrent((i) => (i + 1) % slides.length),
      behavior.autoplayInterval || 4000
    );
    return () => clearInterval(timerRef.current);
  }, [behavior.autoplay, behavior.autoplayInterval, slides.length]);

  const goNext = useCallback(() => setCurrent((i) => (i + 1) % slides.length), [slides.length]);
  const goPrev = useCallback(() => setCurrent((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  // Swipe gestures — stopPropagation so hero swipes don't bubble to page level
  const swipeProps = useSwipe(
    () => { goNext(); dispatchGesture(node, 'swipeLeft', { ...actionCtx, onSwipeNext: goNext }); },
    () => { goPrev(); dispatchGesture(node, 'swipeRight', { ...actionCtx, onSwipePrev: goPrev }); }
  );

  const heroBannerTouchProps = {
    onTouchStart: (e) => { e.stopPropagation(); swipeProps.onTouchStart(e); },
    onTouchEnd:   (e) => { e.stopPropagation(); swipeProps.onTouchEnd(e); },
  };

  if (!slides.length) return null;
  const slide = slides[current];

  return (
    <section
      style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
      // data-sdui-swipe-locked tells the AppShell gesture handler not to intercept
      // touches that start inside the hero banner. Without this, a banner swipe
      // would simultaneously advance the slide AND navigate to the next page.
      data-sdui-swipe-locked
      {...heroBannerTouchProps}
    >
      <SlideRenderer node={slide} context={context} isMobile={isMobile} />

      {/* Navigation dots */}
      {layout.showDots !== false && slides.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '10px 0', backgroundColor: resolveToken(theme.tokens?.surface || '#FFFFFF', theme) }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width:           i === current ? 24 : 8,
                height:          8,
                borderRadius:    9999,
                border:          'none',
                cursor:          'pointer',
                backgroundColor: i === current
                  ? resolveToken(theme.tokens?.primary || '#2874F0', theme)
                  : resolveToken(theme.tokens?.border  || '#E0E0E0', theme),
                transition:      'width 0.3s ease',
                padding:         0,
                flexShrink:      0,
              }}
            />
          ))}
        </div>
      )}

      {/* Arrow buttons */}
      {layout.showArrows && slides.length > 1 && !isMobile && (
        <>
          <button onClick={goPrev} style={arrowBtnStyle('left')}>◀</button>
          <button onClick={goNext} style={arrowBtnStyle('right')}>▶</button>
        </>
      )}

      {/* Mobile swipe hint */}
      {isMobile && slides.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 50, right: 12,
          fontSize: '0.625rem', color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          Swipe ›
        </div>
      )}
    </section>
  );
}

function arrowBtnStyle(side) {
  return {
    position:        'absolute',
    top:             '50%',
    [side]:          12,
    transform:       'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.45)',
    color:           '#fff',
    border:          'none',
    borderRadius:    '50%',
    width:           36,
    height:          36,
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    cursor:          'pointer',
    zIndex:          5,
    fontSize:        14,
    transition:      'background 0.15s ease',
  };
}

function SlideRenderer({ node, context, isMobile }) {
  const { theme }   = context;
  const { actionCtx } = useNavigation() || {};
  const c           = node.content || {};
  const variant     = node.variant || 'full';
  const bg          = c.bgGradient || c.bgColor || resolveToken(theme.tokens?.primary || '#2874F0', theme);
  const minH        = isMobile ? 220 : 380;

  const children   = resolveChildren(node, context.schema);
  const slots      = resolveSlots(node, context.schema);

  const slideAction = node.action;
  const handleSlideClick = slideAction && isMobile
    ? () => dispatchAction(slideAction, actionCtx)
    : undefined;

  // Split layout: text left, image right
  if (variant === 'split' && !isMobile) {
    const leftNode  = slots['left']  || children.find((c) => c.type === 'stack');
    const rightNode = slots['right'] || children.find((c) => c.type === 'image');

    return (
      <div style={{ display: 'flex', minHeight: minH, background: bg, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '40px 56px' }}>
          {leftNode && renderNode(leftNode, context)}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {rightNode && renderNode(rightNode, { ...context })}
        </div>
      </div>
    );
  }

  // Full / default: image as background, content overlaid
  const imageNode = children.find((c) => c.type === 'image');
  const stackNode = children.find((c) => c.type === 'stack');
  const countdown = children.find((c) => c.type === 'countdown');

  return (
    <div
      onClick={handleSlideClick}
      style={{ position: 'relative', minHeight: minH, background: bg, display: 'flex', alignItems: 'center', overflow: 'hidden', cursor: handleSlideClick ? 'pointer' : 'default' }}
    >
      {imageNode && (
        <img
          src={withImageFallback(imageNode.content?.src, 1200, 500)}
          alt={imageNode.content?.alt || ''}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 100%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: isMobile ? '28px 16px' : '56px 48px' }}>
        {stackNode
          ? renderNode(stackNode, context)
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 520 }}>
              {c.eyebrow && (
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: resolveToken(theme.tokens?.secondary || '#FFC400', theme), textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {c.eyebrow}
                </span>
              )}
              <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1 }}>
                {c.title}
              </h1>
              {c.subtitle && (
                <p style={{ fontSize: isMobile ? '0.9rem' : '1.05rem', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                  {c.subtitle}
                </p>
              )}
              {countdown && renderNode(countdown, context)}
              {c.ctaLabel && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (slideAction) dispatchAction(slideAction, actionCtx);
                  }}
                  style={{ alignSelf: 'flex-start', backgroundColor: resolveToken(theme.tokens?.secondary || '#FFC400', theme), color: '#111', border: 'none', borderRadius: 3, padding: '12px 32px', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {c.ctaLabel}
                </button>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function CategoryGridRenderer({ node, context }) {
  const { theme } = context;
  const style     = buildStyleObject(node.containerStyle, theme);
  const c         = node.content || {};
  const isMobile  = context.breakpoint === 'mobile';
  const cols      = resolveColumnCount(node.layout, context.breakpoint, 5);
  const gap       = node.layout?.gap || 8;
  const scrollableOnMobile = node.layout?.scrollableOnMobile && isMobile;

  return (
    <section style={{ ...style, width: '100%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {c.title && (
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: resolveToken(theme.tokens?.textPrimary || '#212121', theme), marginBottom: 12, padding: '0 4px' }}>
            {c.title}
          </h2>
        )}
        {scrollableOnMobile
          ? (
            <div className="sdui-hscroll" style={{ display: 'flex', gap, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
              {resolveChildren(node, context.schema).map((child) => (
                <div key={child.id} style={{ minWidth: 80, flexShrink: 0 }}>
                  {renderNode(child, context)}
                </div>
              ))}
            </div>
          )
          : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
              {renderChildren(node, context)}
            </div>
          )
        }
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function CouponStripRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const style      = buildStyleObject(node.containerStyle, theme);

  // Swipe support for coupon strip
  const stripRef = useRef(null);
  const swipeProps = useSwipe(
    () => { if (stripRef.current) stripRef.current.scrollBy({ left: 240, behavior: 'smooth' }); },
    () => { if (stripRef.current) stripRef.current.scrollBy({ left: -240, behavior: 'smooth' }); }
  );

  return (
    <section style={{ ...style, width: '100%' }} {...swipeProps}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          ref={stripRef}
          className="sdui-hscroll"
          style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, WebkitOverflowScrolling: 'touch' }}
        >
          {renderChildren(node, context)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ProductRailRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const style      = buildStyleObject(node.containerStyle, theme);
  const c          = node.content || {};
  const behavior   = resolveBehavior(node);
  const isMobile   = context.breakpoint === 'mobile';
  const cardW      = isMobile ? 180 : context.breakpoint === 'tablet' ? 190 : 210;
  const railRef    = useRef(null);

  // Swipe for product rail
  const swipeProps = useSwipe(
    () => { if (railRef.current) railRef.current.scrollBy({ left: cardW * 2 + 12, behavior: 'smooth' }); },
    () => { if (railRef.current) railRef.current.scrollBy({ left: -(cardW * 2 + 12), behavior: 'smooth' }); }
  );

  // Resolve children as raw nodes so we can wrap each in a fixed-width div
  const childNodes = resolveChildren(node, context.schema);

  return (
    <section style={{ ...style, width: '100%' }} {...swipeProps}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle
          title={c.title}
          theme={theme}
          cta={c.ctaLabel}
          ctaAction={c.ctaAction}
        />
        {/* Scroll arrows for desktop */}
        <div style={{ position: 'relative' }}>
          {!isMobile && (
            <>
              <button
                onClick={() => railRef.current?.scrollBy({ left: -(cardW * 2), behavior: 'smooth' })}
                style={{ ...railArrowStyle('left') }}
              >◀</button>
              <button
                onClick={() => railRef.current?.scrollBy({ left: cardW * 2, behavior: 'smooth' })}
                style={{ ...railArrowStyle('right') }}
              >▶</button>
            </>
          )}
          <div
            ref={railRef}
            className="sdui-hscroll"
            style={{
              display:        'flex',
              gap:            isMobile ? 10 : 12,
              overflowX:      'auto',
              paddingBottom:  isMobile ? 10 : 8,
              paddingLeft:    isMobile ? 12 : 0,
              paddingRight:   isMobile ? 12 : 0,
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {childNodes.map((childNode) => (
              <div
                key={childNode.id}
                style={{
                  minWidth:       cardW,
                  maxWidth:       cardW,
                  flexShrink:     0,
                  scrollSnapAlign: 'start',
                }}
              >
                {renderNode(childNode, context)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function railArrowStyle(side) {
  return {
    position:        'absolute',
    top:             '50%',
    [side]:          -20,
    transform:       'translateY(-50%)',
    zIndex:          5,
    backgroundColor: '#fff',
    border:          '1px solid #e0e0e0',
    borderRadius:    '50%',
    width:           36,
    height:          36,
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    cursor:          'pointer',
    boxShadow:       '0 2px 8px rgba(0,0,0,0.12)',
    fontSize:        12,
    color:           '#212121',
    transition:      'box-shadow 0.15s ease',
  };
}

// ─────────────────────────────────────────────────────────────────────────────

function PromoGridRenderer({ node, context }) {
  const { theme } = context;
  const style     = buildStyleObject(node.containerStyle, theme);
  const c         = node.content || {};
  const cols      = resolveColumnCount(node.layout, context.breakpoint, 1);
  const gap       = node.layout?.gap || 12;

  return (
    <section style={{ ...style, width: '100%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle title={c.title} theme={theme} />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
          {renderChildren(node, context)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function PromoBannerRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const c          = node.content || {};
  const style      = buildStyleObject(node.containerStyle, theme);
  const slots      = resolveSlots(node, context.schema);
  const children   = resolveChildren(node, context.schema);

  const bgNode      = slots['background'] || children.find((c) => c.type === 'image');
  const contentNode = slots['content']    || children.find((c) => c.type === 'stack');

  const bg = c.bgColor || style.backgroundColor || resolveToken(theme.tokens?.primary || '#2874F0', theme);

  const isMobile = context.breakpoint === 'mobile';

  const handleClick = node.action && isMobile
    ? () => dispatchAction(node.action, actionCtx)
    : undefined;

  return (
    <div
      onClick={handleClick}
      style={{
        position:        'relative',
        minHeight:       style.minHeight || 220,
        backgroundColor: bg,
        overflow:        'hidden',
        display:         'flex',
        alignItems:      'center',
        width:           '100%',
        cursor:          handleClick ? 'pointer' : 'default',
      }}
    >
      {bgNode && renderNode(bgNode, context)}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${bg}cc 0%, transparent 70%)` }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1280, margin: '0 auto' }}>
        {contentNode
          ? renderNode(contentNode, context)
          : (
            <div style={{ padding: 40, color: '#fff' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 10 }}>{c.title}</h2>
              <p style={{ marginBottom: 20, opacity: 0.85 }}>{c.subtitle}</p>
              {c.ctaLabel && (
                <button
                  onClick={() => node.action && dispatchAction(node.action, actionCtx)}
                  style={{ backgroundColor: resolveToken(theme.tokens?.secondary || '#FFC400', theme), color: '#111', border: 'none', borderRadius: 3, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {c.ctaLabel}
                </button>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
}


function BrandCarouselRenderer({ node, context }) {
  const { theme }  = context;
  const { actionCtx } = useNavigation() || {};
  const style      = buildStyleObject(node.containerStyle, theme);
  const c          = node.content || {};
  const carouselRef = useRef(null);

  const swipeProps = useSwipe(
    () => { if (carouselRef.current) carouselRef.current.scrollBy({ left: 200, behavior: 'smooth' }); },
    () => { if (carouselRef.current) carouselRef.current.scrollBy({ left: -200, behavior: 'smooth' }); }
  );

  return (
    <section style={{ ...style, width: '100%' }} {...swipeProps}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionTitle
          title={c.title}
          theme={theme}
          cta={c.ctaLabel}
          ctaAction={c.ctaAction}
        />
        <div
          ref={carouselRef}
          className="sdui-hscroll"
          style={{
            display:       'flex',
            gap:           16,
            overflowX:     'auto',
            paddingBottom: 8,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {renderChildren(node, context)}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function FilterGroupRenderer({ node, context }) {
  const { theme }       = context;
  const { actionCtx }   = useNavigation() || {};
  const c               = node.content || {};
  const behavior        = resolveBehavior(node);
  const [open, setOpen] = useState(withFallback(c.expanded, true));
  const primary         = resolveToken(theme.tokens?.primary || '#2874F0', theme);
  const borderColor     = resolveToken(theme.tokens?.border  || '#E0E0E0', theme);
  const textPrimary     = resolveToken(theme.tokens?.textPrimary || '#212121', theme);

  return (
    <div style={{ borderBottom: `1px solid ${borderColor}` }}>
      <button
        onClick={() => behavior.collapsible && setOpen((v) => !v)}
        style={{
          width:          '100%',
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          background:     'none',
          border:         'none',
          padding:        '12px 0',
          cursor:         behavior.collapsible ? 'pointer' : 'default',
          fontFamily:     'inherit',
        }}
      >
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: open ? primary : textPrimary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {c.label}
        </span>
        {behavior.collapsible && (
          <span style={{ fontSize: 12, color: textPrimary, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>▼</span>
        )}
      </button>
      {open && (
        <div style={{ paddingBottom: 8 }}>
          {c.searchable && (
            <input
              placeholder="Search"
              style={{ width: '100%', border: `1px solid ${borderColor}`, borderRadius: 20, padding: '6px 12px', fontSize: '0.8125rem', outline: 'none', marginBottom: 8, fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          )}
          {renderChildren(node, context)}
        </div>
      )}
    </div>
  );
}

function FilterOptionRenderer({ node, context }) {
  const c = node.content || {};
  if (c.inputType === 'radio') {
    return <RadioRenderer node={{ ...node, content: { ...c, selected: c.checked } }} context={context} />;
  }
  return <CheckboxRenderer node={node} context={context} />;
}

function FilterSidebarRenderer({ node, context }) {
  const { theme }       = context;
  const { actionCtx }   = useNavigation() || {};
  const style           = buildStyleObject(node.containerStyle, theme);
  const c               = node.content || {};
  const behavior        = resolveBehavior(node);
  const isMobile        = context.breakpoint === 'mobile';
  const [open, setOpen] = useState(false);
  const primary         = resolveToken(theme.tokens?.primary || '#2874F0', theme);
  const meeshoPink      = resolveToken(theme.tokens?.meeshoPink || '#F43397', theme);
  const textPrimary     = resolveToken(theme.tokens?.textPrimary || '#212121', theme);
  const borderColor     = resolveToken(theme.tokens?.border || '#E0E0E0', theme);
  const surfaceColor    = resolveToken(theme.tokens?.surface || '#FFFFFF', theme);

  const handleClear = () => {
    const clearAction = node.action?.clearAction;
    if (clearAction) dispatchAction(clearAction, actionCtx);
  };

  // Mobile: show filter button + overlay sheet
  if (isMobile && behavior.mobileMode === 'overlay') {
    return (
      <div>
        <button
          onClick={() => setOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: `1px solid ${borderColor}`, borderRadius: 20, padding: '6px 16px', fontSize: '0.8125rem', color: textPrimary, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          ⊞ Filters
        </button>
        {open && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
            <div onClick={() => setOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            <div style={{ width: 300, backgroundColor: surfaceColor, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: `1px solid ${borderColor}`, flexShrink: 0 }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FILTERS</span>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: textPrimary }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
                {renderChildren(node, context)}
              </div>
              <div style={{ display: 'flex', gap: 12, padding: 16, borderTop: `1px solid ${borderColor}`, flexShrink: 0 }}>
                <button
                  onClick={() => { handleClear(); setOpen(false); }}
                  style={{ flex: 1, padding: '10px', border: `1px solid ${meeshoPink}`, borderRadius: 4, color: meeshoPink, background: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setOpen(false)}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 4, color: '#fff', backgroundColor: meeshoPink, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop/tablet: sidebar
  return (
    <aside style={{ ...style, flexShrink: 0, alignSelf: 'flex-start', position: behavior.sticky ? 'sticky' : 'relative', top: behavior.sticky ? 80 : 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${borderColor}` }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: textPrimary }}>
          {c.title || 'FILTERS'}
        </span>
        {c.clearLabel && (
          <button
            onClick={handleClear}
            style={{ background: 'none', border: 'none', color: primary, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}
          >
            {c.clearLabel}
          </button>
        )}
      </div>
      {renderChildren(node, context)}
    </aside>
  );
}

function SortPanelRenderer({ node, context }) {
  const { theme }      = context;
  const { actionCtx }  = useNavigation() || {};
  const c              = node.content || {};
  const style          = buildStyleObject(node.containerStyle, theme);
  const [selected, setSelected] = useState(
    (c.sortOptions || []).find((o) => o.selected)?.id || 'relevance'
  );
  const meeshoPink    = resolveToken(theme.tokens?.meeshoPink || '#F43397', theme);
  const textPrimary   = resolveToken(theme.tokens?.textPrimary || '#212121', theme);
  const textSecondary = resolveToken(theme.tokens?.textSecondary || '#878787', theme);
  const borderColor   = resolveToken(theme.tokens?.border || '#E0E0E0', theme);
  const isMobile      = context.breakpoint === 'mobile';
  const [sheetOpen, setSheetOpen] = useState(false);
  const surfaceColor  = resolveToken(theme.tokens?.surface || '#FFFFFF', theme);

  function selectSort(opt) {
    setSelected(opt.id);
    if (opt.action) dispatchAction(opt.action, actionCtx);
  }

  // Mobile: sort button + bottom sheet
  if (isMobile) {
    return (
      <div style={{ ...style }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSheetOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: `1px solid ${borderColor}`, borderRadius: 20, padding: '6px 14px', fontSize: '0.8125rem', color: textPrimary, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ⇅ Sort
          </button>
        </div>
        {sheetOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
            <div onClick={() => setSheetOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: surfaceColor, borderRadius: '16px 16px 0 0', padding: '20px 20px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SORT</span>
                <button onClick={() => setSheetOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
              </div>
              {(c.sortOptions || []).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { selectSort(opt); setSheetOpen(false); }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', padding: '14px 0', borderBottom: `1px solid ${borderColor}`, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <span style={{ fontSize: '0.9375rem', color: textPrimary }}>{opt.label}</span>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selected === opt.id ? meeshoPink : borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selected === opt.id && <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: meeshoPink, display: 'block' }} />}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop sort bar
  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.8125rem', color: textSecondary }}>
        {c.totalCount ? `${Number(c.totalCount).toLocaleString('en-IN')} Products` : ''}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.8125rem', color: textSecondary }}>Sort by:</span>
        <select
          value={selected}
          onChange={(e) => {
            const opt = (c.sortOptions || []).find((o) => o.id === e.target.value);
            if (opt) selectSort(opt);
          }}
          style={{ fontSize: '0.8125rem', fontWeight: 600, border: `1px solid ${borderColor}`, borderRadius: 3, padding: '4px 8px', cursor: 'pointer', backgroundColor: surfaceColor, color: textPrimary, fontFamily: 'inherit', outline: 'none' }}
        >
          {(c.sortOptions || []).map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProductGridRenderer({ node, context }) {
  const { theme }   = context;
  const { actionCtx } = useNavigation() || {};
  const style       = buildStyleObject(node.containerStyle, theme);
  const c           = node.content || {};
  const cols        = resolveColumnCount(node.layout, context.breakpoint, 2);
  const gap         = node.layout?.gap || 12;
  const children    = resolveChildren(node, context.schema);
  const isMobile    = context.breakpoint === 'mobile';

  const sortPanel    = children.find((c) => c.type === 'sortPanel');
  const productCards = children.filter((c) => c.type === 'productCard');

  // ── Mobile: horizontal scroll rail ──────────────────────────────────────────
  const mobileCardW = 170;
  const railRef = useRef(null);
  const swipeProps = useSwipe(
    () => { if (railRef.current) railRef.current.scrollBy({ left: mobileCardW * 2 + 8, behavior: 'smooth' }); },
    () => { if (railRef.current) railRef.current.scrollBy({ left: -(mobileCardW * 2 + 8), behavior: 'smooth' }); }
  );

  if (isMobile) {
    return (
      <section style={{ ...style, width: '100%' }} {...swipeProps}>
        {/* Sort bar on mobile */}
        {sortPanel && (
          <div style={{ display: 'flex', gap: 8, padding: '10px 12px', backgroundColor: resolveToken(theme.tokens?.surface || '#FFFFFF', theme), borderBottom: `1px solid ${resolveToken(theme.tokens?.border || '#E0E0E0', theme)}` }}>
            {renderNode(sortPanel, context)}
          </div>
        )}

        {/* Section title */}
        {c.title && (
          <div style={{ padding: '14px 12px 8px', fontWeight: 700, fontSize: '1rem', color: resolveToken(theme.tokens?.textPrimary || '#212121', theme), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {c.title}
              {c.totalCount && (
                <span style={{ fontWeight: 400, fontSize: '0.8125rem', color: resolveToken(theme.tokens?.textSecondary || '#878787', theme), marginLeft: 6 }}>
                  ({Number(c.totalCount).toLocaleString('en-IN')} items)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Horizontal scroll rail */}
        <div
          ref={railRef}
          className="sdui-hscroll"
          style={{
            display:    'flex',
            gap:        10,
            overflowX:  'auto',
            padding:    '0 12px 12px',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
        >
          {productCards.map((child) => (
            <div key={child.id} style={{ minWidth: mobileCardW, maxWidth: mobileCardW, flexShrink: 0, scrollSnapAlign: 'start' }}>
              {renderNode(child, context)}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── Desktop / Tablet: standard grid ─────────────────────────────────────────
  return (
    <div style={{ ...style, display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
      {/* Sort + filter controls */}
      {sortPanel && (
        <div>{renderNode(sortPanel, context)}</div>
      )}

      {/* Title */}
      {c.title && (
        <div style={{ padding: '16px 16px 0', fontWeight: 700, fontSize: '1.125rem', color: resolveToken(theme.tokens?.textPrimary || '#212121', theme) }}>
          {c.title}
          {c.totalCount && (
            <span style={{ fontWeight: 400, fontSize: '0.875rem', color: resolveToken(theme.tokens?.textSecondary || '#878787', theme), marginLeft: 8 }}>
              ({Number(c.totalCount).toLocaleString('en-IN')} items)
            </span>
          )}
        </div>
      )}

      {/* Product grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
        padding: 16,
        flex: 1,
        alignContent: 'start',
      }}>
        {productCards.map((child) => renderNode(child, context))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function AdvertisementRenderer({ node, context }) {
  const { theme }     = context;
  const { actionCtx } = useNavigation() || {};
  const style         = buildStyleObject(node.containerStyle, theme);
  const c             = node.content || {};
  const items         = c.items || [];
  const cols          = context.breakpoint === 'mobile' ? 1 : context.breakpoint === 'tablet' ? 2 : 3;

  return (
    <section style={{ ...style, width: '100%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {c.title && (
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: resolveToken(theme.tokens?.textSecondary || '#878787', theme), textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            {c.title}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
          {items.map((ad) => (
            <div
              key={ad.id}
              onClick={() => ad.action && dispatchAction(ad.action, actionCtx)}
              style={{ borderRadius: 6, overflow: 'hidden', position: 'relative', cursor: 'pointer', backgroundColor: '#f8f8f8', boxShadow: '0 1px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s ease' }}
            >
              <img src={withImageFallback(ad.imageUrl, 400, 200)} alt={ad.headline} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
              <span style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '0.625rem', padding: '2px 6px', borderRadius: 2 }}>
                {ad.badge}
              </span>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: resolveToken(theme.tokens?.textPrimary || '#212121', theme), marginBottom: 2 }}>{ad.brand}</div>
                <div style={{ fontSize: '0.75rem', color: resolveToken(theme.tokens?.textSecondary || '#878787', theme), marginBottom: 4 }}>{ad.headline}</div>
                <div style={{ fontSize: '0.6875rem', color: resolveToken(theme.tokens?.primary || '#2874F0', theme), fontWeight: 600 }}>{ad.discount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function FooterRenderer({ node, context }) {
  const { theme }      = context;
  const { actionCtx }  = useNavigation() || {};
  const style          = buildStyleObject(node.containerStyle, theme);
  const c              = node.content || {};
  const children       = resolveChildren(node, context.schema);
  const footerText     = resolveToken(theme.tokens?.footerText     || '#FFFFFF', theme);
  const footerTextMuted = resolveToken(theme.tokens?.footerTextMuted || '#9BA5B4', theme);
  const borderColor    = 'rgba(255,255,255,0.12)';
  const isMobile       = context.breakpoint === 'mobile';
  const cols           = isMobile ? 2 : 4;

  return (
    <footer style={{ ...style, width: '100%' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? 24 : 40, marginBottom: 32 }}>
          {children.map((col) => renderNode(col, context))}
        </div>
        <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: 20, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
          <span style={{ fontSize: '0.75rem', color: footerTextMuted }}>{c.copyright}</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {(c.bottomLinks || []).map((link) => (
              <a
                key={link.label}
                href="#"
                onClick={(e) => { e.preventDefault(); link.action && dispatchAction(link.action, actionCtx); }}
                style={{ fontSize: '0.75rem', color: footerTextMuted, textDecoration: 'none', transition: 'color 0.15s ease' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumnRenderer({ node, context }) {
  const { theme }     = context;
  const { actionCtx } = useNavigation() || {};
  const c = node.content || {};
  const footerText      = resolveToken(theme.tokens?.footerText     || '#FFFFFF', theme);
  const footerTextMuted = resolveToken(theme.tokens?.footerTextMuted || '#9BA5B4', theme);

  return (
    <div>
      <h3 style={{ color: footerText, fontSize: '0.8125rem', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {c.title}
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(c.links || []).map((link) => (
          <li key={link.label}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); link.action && dispatchAction(link.action, actionCtx); }}
              style={{ color: footerTextMuted, fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s ease' }}
            >
              {link.icon && <span>{link.icon}</span>}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ── COMPONENT MAP ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

/**
 * COMPONENT_MAP
 *
 * This is the ONLY extension point of the rendering engine.
 * To add a new component:
 *   1. Implement MyComponentRenderer({ node, context }) above.
 *   2. Add "myType": MyComponentRenderer here.
 *   3. Register the type in schema validation.allowedTypes.
 * Nothing else needs to change.
 */
const COMPONENT_MAP = {
  // ── Layout
  container:          ContainerRenderer,
  row:                RowRenderer,
  column:             ColumnRenderer,
  stack:              StackRenderer,
  grid:               GridLayoutRenderer,
  horizontalScroller: HorizontalScrollerRenderer,
  verticalScroller:   ColumnRenderer,
  overlay:            OverlayRenderer,
  stickyContainer:    StickyContainerRenderer,
  spacer:             SpacerRenderer,
  divider:            DividerRenderer,

  // ── Primitives
  text:               TextRenderer,
  image:              ImageRenderer,
  button:             ButtonRenderer,
  badge:              BadgeRenderer,
  price:              PriceRenderer,
  rating:             RatingRenderer,
  icon:               IconRenderer,
  chip:               ChipRenderer,
  checkbox:           CheckboxRenderer,
  radio:              RadioRenderer,
  countdown:          CountdownRenderer,
  skeleton:           SkeletonRenderer,
  link:               LinkRenderer,

  // ── Composite business components
  logo:               LogoRenderer,
  searchBox:          SearchBoxRenderer,
  actionGroup:        ActionGroupRenderer,
  productCard:        ProductCardRenderer,
  brandCard:          BrandCardRenderer,
  promoCard:          PromoCardRenderer,
  couponCard:         CouponCardRenderer,
  categoryItem:       CategoryItemRenderer,

  // ── Sections
  header:             HeaderRenderer,
  heroBanner:         HeroBannerRenderer,
  slide:              ({ node, context }) => <SlideRenderer node={node} context={context} isMobile={context.breakpoint === 'mobile'} />,
  categoryGrid:       CategoryGridRenderer,
  couponStrip:        CouponStripRenderer,
  productRail:        ProductRailRenderer,
  productGrid:        ProductGridRenderer,
  promoGrid:          PromoGridRenderer,
  promoBanner:        PromoBannerRenderer,
  brandCarousel:      BrandCarouselRenderer,
  filterSidebar:      FilterSidebarRenderer,
  filterGroup:        FilterGroupRenderer,
  filterOption:       FilterOptionRenderer,
  sortPanel:          SortPanelRenderer,
  advertisement:      AdvertisementRenderer,
  footer:             FooterRenderer,
  footerColumn:       FooterColumnRenderer,
};

// ─────────────────────────────────────────────────────────────────────────────
// ── GLOBAL STYLES  (injected once as a <style> tag) ──────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; padding: 0; }
  button { font-family: inherit; }
  html { scroll-behavior: smooth; }

  /* Keyframes */
  @keyframes sdui-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
  @keyframes sdui-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes sdui-slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Styled scrollbars for horizontal scroll containers */
  .sdui-hscroll {
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  .sdui-hscroll::-webkit-scrollbar {
    height: 4px;
    width:  4px;
  }
  .sdui-hscroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .sdui-hscroll::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius:    9999px;
  }
  .sdui-hscroll::-webkit-scrollbar-thumb:hover {
    background-color: #888;
  }

  /* Vertical page scrollbar — styled but visible */
  :root {
    scrollbar-width: thin;
    scrollbar-color: #d0d0d0 #f8f8f8;
  }
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f8f8f8;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #888;
  }

  /* Mobile touch improvements */
  @media (max-width: 768px) {
    * { -webkit-tap-highlight-color: transparent; }
    button, a { touch-action: manipulation; }
  }

  /* Product card image hover zoom */
  .sdui-product-card:hover img {
    transform: scale(1.05);
  }
`;

// Inject once
if (typeof document !== 'undefined' && !document.getElementById('sdui-global-styles')) {
  const tag = document.createElement('style');
  tag.id = 'sdui-global-styles';
  tag.textContent = GLOBAL_CSS;
  document.head.appendChild(tag);
}
