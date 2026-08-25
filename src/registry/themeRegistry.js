/**
 * Theme Registry — Predefined component visual themes & tokens.
 * Provides curated aesthetic themes matching component implementations.
 */

export const PredefinedThemes = {
  // --- ProductCard Themes ---
  "product-card-classic": {
    id: "product-card-classic",
    componentType: "ProductCard",
    name: "Classic",
    description: "Standard card with rounded corners, subtle shadow, and light background",
    tokens: {
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      padding: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      borderColor: "#e5e7eb",
      borderWidth: "1px",
    },
    styles: {
      width: "280px",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      padding: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      border: "1px solid #e5e7eb",
    },
  },
  "product-card-minimal": {
    id: "product-card-minimal",
    componentType: "ProductCard",
    name: "Minimal",
    description: "Clean borderless card with soft background and compact padding",
    tokens: {
      borderRadius: "8px",
      backgroundColor: "#f9fafb",
      padding: "10px",
      boxShadow: "none",
      borderColor: "transparent",
      borderWidth: "0px",
    },
    styles: {
      width: "260px",
      borderRadius: "8px",
      backgroundColor: "#f9fafb",
      padding: "10px",
      boxShadow: "none",
      border: "1px solid transparent",
    },
  },
  "product-card-featured": {
    id: "product-card-featured",
    componentType: "ProductCard",
    name: "Featured",
    description: "Elevated card with glowing indigo accent border and rich elevation",
    tokens: {
      borderRadius: "16px",
      backgroundColor: "#ffffff",
      padding: "14px",
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 4px 10px -2px rgba(0,0,0,0.04)",
      borderColor: "#c7d2fe",
      borderWidth: "2px",
    },
    styles: {
      width: "290px",
      borderRadius: "16px",
      backgroundColor: "#ffffff",
      padding: "14px",
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 4px 10px -2px rgba(0,0,0,0.04)",
      border: "2px solid #c7d2fe",
    },
  },

  // --- Header Themes ---
  "header-classic": {
    id: "header-classic",
    componentType: "Header",
    name: "Classic Deep Navy",
    description: "Campus commerce navy blue with golden accent elements",
    tokens: {
      backgroundColor: "#0D3540",
      color: "#ffffff",
      padding: "8px 16px",
      borderRadius: "0px",
    },
    styles: {
      backgroundColor: "#0D3540",
      color: "#ffffff",
      padding: "8px 16px",
      position: "sticky",
      top: "0px",
      zIndex: 100,
    },
  },
  "header-compact": {
    id: "header-compact",
    componentType: "Header",
    name: "Compact Clean",
    description: "Minimal white header with slim bottom border",
    tokens: {
      backgroundColor: "#ffffff",
      color: "#111827",
      padding: "6px 12px",
      borderRadius: "0px",
    },
    styles: {
      backgroundColor: "#ffffff",
      color: "#111827",
      padding: "6px 12px",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: "0px",
      zIndex: 100,
    },
  },
  "header-modern": {
    id: "header-modern",
    componentType: "Header",
    name: "Modern Glass",
    description: "Translucent frosted header with blurred backdrop",
    tokens: {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      color: "#0f172a",
      padding: "10px 20px",
      borderRadius: "0 0 12px 12px",
    },
    styles: {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: "#0f172a",
      padding: "10px 20px",
      borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
      position: "sticky",
      top: "0px",
      zIndex: 100,
    },
  },

  // --- Button Themes ---
  "button-primary": {
    id: "button-primary",
    componentType: "Button",
    name: "Primary Indigo",
    description: "High conversion bold indigo button",
    tokens: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "10px 16px",
      fontWeight: "600",
    },
    styles: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "10px 16px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
    },
  },
  "button-secondary": {
    id: "button-secondary",
    componentType: "Button",
    name: "Secondary Slate",
    description: "Subtle dark slate button with soft background",
    tokens: {
      backgroundColor: "#1e293b",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "10px 16px",
      fontWeight: "600",
    },
    styles: {
      backgroundColor: "#1e293b",
      color: "#ffffff",
      borderRadius: "8px",
      padding: "10px 16px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
    },
  },
  "button-outline": {
    id: "button-outline",
    componentType: "Button",
    name: "Outline Clean",
    description: "White surface with crisp dark border",
    tokens: {
      backgroundColor: "#ffffff",
      color: "#111827",
      borderRadius: "8px",
      padding: "9px 15px",
      borderColor: "#d1d5db",
      borderWidth: "1px",
    },
    styles: {
      backgroundColor: "#ffffff",
      color: "#111827",
      borderRadius: "8px",
      padding: "9px 15px",
      border: "1px solid #d1d5db",
      fontWeight: "600",
      cursor: "pointer",
    },
  },

  // --- CategoryGrid Themes ---
  "category-grid-circular": {
    id: "category-grid-circular",
    componentType: "CategoryGrid",
    name: "Circular",
    description: "Classic circular avatars with badges",
    tokens: {
      backgroundColor: "#ffffff",
      padding: "12px",
      borderRadius: "12px",
    },
    styles: {
      backgroundColor: "#ffffff",
      padding: "12px",
      borderRadius: "12px",
    },
  },
  "category-grid-minimal": {
    id: "category-grid-minimal",
    componentType: "CategoryGrid",
    name: "Minimal",
    description: "Clean horizontal strip without container background",
    tokens: {
      backgroundColor: "transparent",
      padding: "4px 0",
      borderRadius: "0px",
    },
    styles: {
      backgroundColor: "transparent",
      padding: "4px 0",
    },
  },
  "category-grid-card": {
    id: "category-grid-card",
    componentType: "CategoryGrid",
    name: "Card Tiles",
    description: "Soft gray container with subtle shadow",
    tokens: {
      backgroundColor: "#f8fafc",
      padding: "14px",
      borderRadius: "16px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
    },
    styles: {
      backgroundColor: "#f8fafc",
      padding: "14px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
    },
  },

  // --- HeroBanner Themes ---
  "hero-banner-cinematic": {
    id: "hero-banner-cinematic",
    componentType: "HeroBanner",
    name: "Cinematic",
    description: "Full-bleed visual banner with rounded corners",
    tokens: {
      borderRadius: "16px",
    },
    styles: {
      borderRadius: "16px",
      overflow: "hidden",
    },
  },
  "hero-banner-split": {
    id: "hero-banner-split",
    componentType: "HeroBanner",
    name: "Split Card",
    description: "Card with bordered outline and elevated shadow",
    tokens: {
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    styles: {
      borderRadius: "20px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
  },

  // --- CouponCode Themes ---
  "coupon-ticket": {
    id: "coupon-ticket",
    componentType: "CouponCode",
    name: "Dashed Ticket",
    description: "Classic coupon style with dashed borders",
    tokens: {
      borderRadius: "12px",
      borderColor: "#f59e0b",
      borderStyle: "dashed",
    },
    styles: {
      borderRadius: "12px",
      border: "1.5px dashed #f59e0b",
      backgroundColor: "#fffbeb",
    },
  },
  "coupon-minimal": {
    id: "coupon-minimal",
    componentType: "CouponCode",
    name: "Clean Minimal",
    description: "Subtle neutral background with dark copy pill",
    tokens: {
      borderRadius: "8px",
      backgroundColor: "#f1f5f9",
    },
    styles: {
      borderRadius: "8px",
      backgroundColor: "#f1f5f9",
    },
  },
};

export const ThemeRegistry = {
  getAll() {
    return Object.values(PredefinedThemes);
  },

  getById(themeId) {
    return PredefinedThemes[themeId] || null;
  },

  getByComponentType(componentType) {
    return Object.values(PredefinedThemes).filter(
      (theme) => theme.componentType === componentType
    );
  },
};

export default ThemeRegistry;
