/**
 * Theme Registry — Predefined component visual themes & full component blueprints.
 * Each theme acts as a complete blueprint including:
 *  - style / containerStyle tokens
 *  - defaultData
 *  - defaultPlacement (responsive coordinates)
 *  - defaultChildren (fully populated child hierarchy)
 */

export const PredefinedThemes = {
  // ─── ProductCard Themes ───────────────────────────────────────────────────────
  "product-card-classic": {
    id: "product-card-classic",
    componentType: "ProductCard",
    name: "Classic",
    description: "Standard card with rounded corners, complete product details, and soft shadow",
    tokens: {
      borderRadius: "16px",
      backgroundColor: "#ffffff",
      padding: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      borderColor: "#e5e7eb",
      borderWidth: "1px",
    },
    styles: {
      width: "280px",
      borderRadius: "16px",
      backgroundColor: "#ffffff",
      padding: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      border: "1px solid #e5e7eb",
    },
    defaultData: {
      id: "prod_classic_001",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 32 },
      tablet: { colStart: 1, colEnd: 50, rowStart: 1, rowEnd: 32 },
      desktop: { colStart: 1, colEnd: 33, rowStart: 1, rowEnd: 32 },
    },
    defaultChildren: [
      {
        type: "Image",
        containerStyle: {
          height: "170px",
          width: "100%",
          objectFit: "contain",
          backgroundColor: "#f8fafc",
          borderRadius: "10px",
          display: "block",
        },
        data: {
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
          altText: "AudioPro Wireless Studio Headphones",
        },
      },
      {
        type: "Label",
        containerStyle: {
          display: "flex",
          alignItems: "center",
          gap: "6px",
        },
        children: [
          {
            type: "Sponsored",
            data: { text: "Sponsored" },
          },
        ],
      },
      {
        type: "Badge",
        containerStyle: {
          backgroundColor: "#fef3c7",
          color: "#92400e",
          padding: "2px 8px",
          borderRadius: "999px",
          fontSize: "11px",
          fontWeight: "600",
          alignSelf: "flex-start",
        },
        data: { text: "Limited Time Deal" },
      },
      {
        type: "Title",
        containerStyle: {
          fontSize: "13px",
          fontWeight: "700",
          color: "#0f172a",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        data: { text: "AudioPro ANC Wireless Studio Headphones" },
      },
      {
        type: "Description",
        containerStyle: {
          fontSize: "12px",
          color: "#64748b",
          maxLines: 2,
          lineHeight: "16px",
        },
        data: {
          text: "40mm drivers, active noise cancellation, and 30-hour battery life with fast USB-C charge.",
          maxLines: 2,
        },
      },
      {
        type: "Rating",
        containerStyle: {
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
        },
        children: [
          {
            type: "Score",
            data: { text: "4.4", "out of": "5" },
          },
          {
            type: "ReviewCount",
            data: { text: "850" },
          },
        ],
      },
      {
        type: "PriceBlock",
        containerStyle: {
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
        },
        data: {
          sellingPrice: "₹1,499",
          mrp: "₹3,999",
          discount: "62% OFF",
        },
      },
      {
        type: "OfferText",
        containerStyle: {
          fontSize: "11px",
          fontWeight: "600",
          color: "#059669",
        },
        data: { text: "Mega Student Savings • Extra ₹150 off" },
      },
      {
        type: "DeliveryInfo",
        containerStyle: {
          fontSize: "11px",
          color: "#64748b",
        },
        data: { prefix: "FREE delivery", daysOffset: 2 },
      },
      {
        type: "Button",
        containerStyle: {
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          padding: "9px 16px",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "13px",
          width: "100%",
          cursor: "pointer",
          border: "none",
          marginTop: "4px",
        },
        data: { label: "Add to Cart" },
      },
    ],
  },

  "product-card-minimal": {
    id: "product-card-minimal",
    componentType: "ProductCard",
    name: "Minimal",
    description: "Clean, essential card with streamlined typography and direct buy button",
    tokens: {
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      padding: "12px",
      boxShadow: "none",
      borderColor: "#e2e8f0",
      borderWidth: "1px",
    },
    styles: {
      width: "260px",
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      padding: "12px",
      boxShadow: "none",
      border: "1px solid #e2e8f0",
    },
    defaultData: {
      id: "prod_minimal_001",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 26 },
      tablet: { colStart: 1, colEnd: 50, rowStart: 1, rowEnd: 26 },
      desktop: { colStart: 1, colEnd: 33, rowStart: 1, rowEnd: 26 },
    },
    defaultChildren: [
      {
        type: "Image",
        containerStyle: {
          height: "150px",
          width: "100%",
          objectFit: "contain",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          display: "block",
        },
        data: {
          imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=80",
          altText: "Wireless Earbuds Pro",
        },
      },
      {
        type: "Title",
        containerStyle: {
          fontSize: "13px",
          fontWeight: "700",
          color: "#0f172a",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        data: { text: "Buds Pro ANC Wireless Earbuds" },
      },
      {
        type: "Rating",
        containerStyle: {
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "12px",
        },
        children: [
          {
            type: "Score",
            data: { text: "4.6", "out of": "5" },
          },
        ],
      },
      {
        type: "PriceBlock",
        containerStyle: {
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
        },
        data: {
          sellingPrice: "₹1,299",
          mrp: "₹2,999",
          discount: "56%",
        },
      },
      {
        type: "Button",
        containerStyle: {
          backgroundColor: "#0f172a",
          color: "#ffffff",
          padding: "8px 14px",
          borderRadius: "6px",
          fontWeight: "600",
          fontSize: "12px",
          width: "100%",
          cursor: "pointer",
          border: "none",
          marginTop: "4px",
        },
        data: { label: "Buy Now" },
      },
    ],
  },

  "product-card-featured": {
    id: "product-card-featured",
    componentType: "ProductCard",
    name: "Featured Showcase",
    description: "Elevated showcase card with glowing indigo accent border, rich tags, and badges",
    tokens: {
      borderRadius: "18px",
      backgroundColor: "#ffffff",
      padding: "16px",
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.18), 0 4px 10px -2px rgba(0,0,0,0.04)",
      borderColor: "#818cf8",
      borderWidth: "2px",
    },
    styles: {
      width: "290px",
      borderRadius: "18px",
      backgroundColor: "#ffffff",
      padding: "16px",
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.18), 0 4px 10px -2px rgba(0,0,0,0.04)",
      border: "2px solid #818cf8",
    },
    defaultData: {
      id: "prod_featured_001",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 34 },
      tablet: { colStart: 1, colEnd: 50, rowStart: 1, rowEnd: 34 },
      desktop: { colStart: 1, colEnd: 33, rowStart: 1, rowEnd: 34 },
    },
    defaultChildren: [
      {
        type: "Image",
        containerStyle: {
          height: "175px",
          width: "100%",
          objectFit: "contain",
          backgroundColor: "#f5f3ff",
          borderRadius: "12px",
          display: "block",
        },
        data: {
          imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
          altText: "Aurora Smartwatch Ultra",
        },
      },
      {
        type: "Badge",
        containerStyle: {
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          padding: "3px 10px",
          borderRadius: "999px",
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "0.05em",
          alignSelf: "flex-start",
        },
        data: { text: "TOP CAMPUS CHOICE" },
      },
      {
        type: "Title",
        containerStyle: {
          fontSize: "14px",
          fontWeight: "800",
          color: "#0f172a",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        data: { text: "Aurora Smartwatch Ultra GPS 49mm" },
      },
      {
        type: "Description",
        containerStyle: {
          fontSize: "12px",
          color: "#64748b",
          maxLines: 2,
          lineHeight: "16px",
        },
        data: {
          text: "Retina display, titanium casing, ECG, heart rate monitor, and 3-day extended battery.",
          maxLines: 2,
        },
      },
      {
        type: "PriceBlock",
        containerStyle: {
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
        },
        data: {
          sellingPrice: "₹2,499",
          mrp: "₹5,999",
          discount: "58% OFF",
        },
      },
      {
        type: "Button",
        containerStyle: {
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "#ffffff",
          padding: "10px 16px",
          borderRadius: "10px",
          fontWeight: "700",
          fontSize: "13px",
          width: "100%",
          cursor: "pointer",
          border: "none",
          marginTop: "4px",
          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
        },
        data: { label: "Add to Cart • ₹2,499" },
      },
    ],
  },

  // ─── Header Themes ────────────────────────────────────────────────────────────
  "header-classic": {
    id: "header-classic",
    componentType: "Header",
    name: "Classic Deep Navy",
    description: "Campus commerce signature deep navy header with gold and pink nav accents",
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
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
    },
    defaultChildren: [
      {
        type: "HeaderButton",
        containerStyle: {
          color: "#FFFFFF",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "15px",
          fontWeight: "700",
          letterSpacing: "0.04em",
          cursor: "pointer",
        },
        data: { id: "logo", label: "CampusCommerce", icon: "🎓" },
        actions: { onTap: { type: "NAVIGATE", route: "home" } },
      },
      {
        type: "HeaderButton",
        containerStyle: {
          color: "rgba(255,255,255,0.9)",
          backgroundColor: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
        },
        data: { id: "deals", label: "Deals", icon: "⚡" },
        actions: { onTap: { type: "NAVIGATE", route: "deals" } },
      },
      {
        type: "HeaderButton",
        containerStyle: {
          color: "#ffffff",
          backgroundColor: "#4f46e5",
          border: "none",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: "700",
          cursor: "pointer",
        },
        data: { id: "cart", label: "Cart", icon: "🛒", count: 2 },
        actions: { onTap: { type: "NAVIGATE", route: "cart" } },
      },
    ],
  },

  // ─── HeaderButton Themes ──────────────────────────────────────────────────────
  "header-button-pill": {
    id: "header-button-pill",
    componentType: "HeaderButton",
    name: "Subtle Gray Pill",
    description: "Light background pill with dark text and border",
    tokens: {
      backgroundColor: "#f1f5f9",
      color: "#0f172a",
      borderRadius: "8px",
    },
    styles: {
      backgroundColor: "#f1f5f9",
      color: "#0f172a",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      padding: "6px 12px",
      fontSize: "13px",
      fontWeight: "600",
    },
    defaultData: {
      label: "Shop Now",
      icon: "✨",
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  "header-button-primary": {
    id: "header-button-primary",
    componentType: "HeaderButton",
    name: "Primary Indigo Action",
    description: "Solid indigo button with white text and badge count",
    tokens: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      borderRadius: "8px",
    },
    styles: {
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      borderRadius: "8px",
      border: "none",
      padding: "6px 12px",
      fontSize: "13px",
      fontWeight: "700",
    },
    defaultData: {
      label: "Cart",
      icon: "🛒",
      count: 3,
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  "header-button-ghost": {
    id: "header-button-ghost",
    componentType: "HeaderButton",
    name: "Ghost Text Nav",
    description: "Transparent button with subtle hover styling",
    tokens: {
      backgroundColor: "transparent",
      color: "#334155",
    },
    styles: {
      backgroundColor: "transparent",
      color: "#334155",
      border: "none",
      padding: "6px 10px",
      fontSize: "13px",
      fontWeight: "600",
    },
    defaultData: {
      label: "Deals",
      icon: "⚡",
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  "header-compact": {
    id: "header-compact",
    componentType: "Header",
    name: "Compact Clean White",
    description: "Minimal modern white header with integrated search and quick actions",
    tokens: {
      backgroundColor: "#ffffff",
      color: "#111827",
      padding: "8px 16px",
      borderRadius: "0px",
    },
    styles: {
      backgroundColor: "#ffffff",
      color: "#111827",
      padding: "8px 16px",
      borderBottom: "1px solid #e5e7eb",
      position: "sticky",
      top: "0px",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
    },
    defaultChildren: [
      {
        type: "HeaderButton",
        containerStyle: {
          color: "#0f172a",
          fontSize: "14px",
          fontWeight: "800",
          cursor: "pointer",
        },
        data: { id: "logo", label: "ShopHub", icon: "🛍️" },
        actions: { onTap: { type: "NAVIGATE", route: "home" } },
      },
      {
        type: "SearchBar",
        containerStyle: {
          backgroundColor: "#f1f5f9",
          borderRadius: "8px",
          padding: "4px 10px",
          width: "180px",
        },
        data: { placeholder: "Search gear..." },
      },
      {
        type: "HeaderButton",
        containerStyle: {
          color: "#4f46e5",
          fontSize: "12px",
          fontWeight: "700",
          cursor: "pointer",
        },
        data: { id: "cart", label: "Cart", icon: "🛒", count: 1 },
        actions: { onTap: { type: "NAVIGATE", route: "cart" } },
      },
    ],
  },

  "header-modern": {
    id: "header-modern",
    componentType: "Header",
    name: "Modern Frosted Glass",
    description: "Translucent frosted header with backdrop blur and pill buttons",
    tokens: {
      backgroundColor: "rgba(255, 255, 255, 0.88)",
      color: "#0f172a",
      padding: "10px 20px",
      borderRadius: "0 0 16px 16px",
    },
    styles: {
      backgroundColor: "rgba(255, 255, 255, 0.88)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      color: "#0f172a",
      padding: "10px 20px",
      borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
      position: "sticky",
      top: "0px",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
    },
    defaultChildren: [
      {
        type: "HeaderButton",
        containerStyle: {
          color: "#0f172a",
          fontSize: "15px",
          fontWeight: "800",
          cursor: "pointer",
        },
        data: { id: "logo", label: "Nexus", icon: "✨" },
        actions: { onTap: { type: "NAVIGATE", route: "home" } },
      },
      {
        type: "HeaderButton",
        containerStyle: {
          backgroundColor: "#4f46e5",
          color: "#ffffff",
          padding: "6px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "700",
          cursor: "pointer",
        },
        data: { id: "cart", label: "Cart", icon: "🛒", count: 3 },
        actions: { onTap: { type: "NAVIGATE", route: "cart" } },
      },
    ],
  },

  // ─── Button Themes ────────────────────────────────────────────────────────────
  "button-primary": {
    id: "button-primary",
    componentType: "Button",
    name: "Primary Indigo",
    description: "High conversion bold indigo button with rounded corners",
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
      width: "100%",
    },
    defaultData: {
      label: "Add to Cart",
    },
    defaultPlacement: {},
    defaultChildren: [],
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
      width: "100%",
    },
    defaultData: {
      label: "Quick Buy",
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  "button-outline": {
    id: "button-outline",
    componentType: "Button",
    name: "Outline Clean",
    description: "White surface with crisp border and dark text",
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
      width: "100%",
    },
    defaultData: {
      label: "View Details",
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  // ─── SearchBar Themes ─────────────────────────────────────────────────────────
  "search-classic": {
    id: "search-classic",
    componentType: "SearchBar",
    name: "Classic White Box",
    description: "Full-width white search bar with clear border and subtle shadow",
    tokens: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      borderColor: "#cbd5e1",
    },
    styles: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      padding: "8px 14px",
      width: "100%",
    },
    defaultData: {
      placeholder: "Search products, brands and deals...",
      icon: "🔍",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
    },
    defaultChildren: [],
  },

  "search-pill": {
    id: "search-pill",
    componentType: "SearchBar",
    name: "Rounded Pill",
    description: "Soft pill-shaped input with subtle gray backdrop",
    tokens: {
      backgroundColor: "#f1f5f9",
      borderRadius: "999px",
      borderColor: "#e2e8f0",
    },
    styles: {
      backgroundColor: "#f1f5f9",
      borderRadius: "999px",
      border: "1px solid #e2e8f0",
      padding: "8px 16px",
      width: "100%",
    },
    defaultData: {
      placeholder: "Search campus items, notes & electronics...",
      icon: "⚡",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
    },
    defaultChildren: [],
  },

  // ─── NavBar Themes ───────────────────────────────────────────────────────────
  "navbar-classic": {
    id: "navbar-classic",
    componentType: "NavBar",
    name: "Classic Bottom Dock",
    description: "Standard bottom app dock with labeled navigation icons",
    tokens: {
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb",
    },
    styles: {
      backgroundColor: "#ffffff",
      borderTop: "1px solid #e5e7eb",
      padding: "8px 0",
      position: "sticky",
      bottom: "0px",
    },
    defaultData: {
      items: [
        { label: "Home", icon: "🏠", isActive: true },
        { label: "Categories", icon: "🗂️", isActive: false },
        { label: "Cart", icon: "🛒", isActive: false },
        { label: "Account", icon: "👤", isActive: false },
      ],
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  // ─── CategoryGrid Themes ──────────────────────────────────────────────────────
  "category-grid-circular": {
    id: "category-grid-circular",
    componentType: "CategoryGrid",
    name: "Circular Avatars",
    description: "Classic horizontal scroll of rounded category circles",
    tokens: {
      backgroundColor: "#ffffff",
      padding: "12px",
      borderRadius: "16px",
    },
    styles: {
      backgroundColor: "#ffffff",
      padding: "12px",
      borderRadius: "16px",
    },
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 18 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 18 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 18 },
    },
    defaultChildren: [
      { type: "CategoryItem", data: { label: "Electronics", icon: "💻" } },
      { type: "CategoryItem", data: { label: "Audio", icon: "🎧" } },
      { type: "CategoryItem", data: { label: "Dorm", icon: "🛋️" } },
      { type: "CategoryItem", data: { label: "Fashion", icon: "👕" } },
      { type: "CategoryItem", data: { label: "Books", icon: "📚" } },
      { type: "CategoryItem", data: { label: "Snacks", icon: "☕" } },
    ],
  },

  "category-grid-card": {
    id: "category-grid-card",
    componentType: "CategoryGrid",
    name: "Card Tiles",
    description: "Soft gray container with boxed tile items",
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
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 18 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 18 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 8, rowEnd: 18 },
    },
    defaultChildren: [
      { type: "CategoryItem", data: { label: "Laptops", icon: "💻" } },
      { type: "CategoryItem", data: { label: "Wearables", icon: "⌚" } },
      { type: "CategoryItem", data: { label: "Gaming", icon: "🎮" } },
      { type: "CategoryItem", data: { label: "Backpacks", icon: "🎒" } },
    ],
  },

  // ─── HeroBanner Themes ────────────────────────────────────────────────────────
  "hero-banner-cinematic": {
    id: "hero-banner-cinematic",
    componentType: "HeroBanner",
    name: "Cinematic Visual",
    description: "Full-bleed visual banner with bold headline and gradient overlay",
    tokens: {
      borderRadius: "16px",
    },
    styles: {
      borderRadius: "16px",
      overflow: "hidden",
    },
    defaultData: {
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80",
      title: "Mega Campus Tech Fest",
      subtitle: "Up to 70% off on laptops, headphones & smart study gear",
      altText: "Hero Tech Fest",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 18, rowEnd: 38 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 18, rowEnd: 38 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 18, rowEnd: 38 },
    },
    defaultChildren: [
      {
        type: "Badge",
        containerStyle: {
          backgroundColor: "#cc0c39",
          color: "#ffffff",
          padding: "4px 10px",
          borderRadius: "4px",
          fontSize: "11px",
          fontWeight: "700",
        },
        data: { text: "CAMPUS EXCLUSIVE" },
      },
      {
        type: "Button",
        containerStyle: {
          backgroundColor: "#ffffff",
          color: "#0f172a",
          padding: "8px 18px",
          borderRadius: "8px",
          fontWeight: "700",
          fontSize: "13px",
          border: "none",
          cursor: "pointer",
        },
        data: { label: "Explore Deals →" },
      },
    ],
  },

  // ─── Carousel Themes ─────────────────────────────────────────────────────────
  "carousel-classic": {
    id: "carousel-classic",
    componentType: "Carousel",
    name: "Dynamic Auto Slider",
    description: "Swipeable auto-advancing carousel slider with indicators",
    tokens: {
      borderRadius: "16px",
    },
    styles: {
      borderRadius: "16px",
      overflow: "hidden",
    },
    defaultData: {
      autoPlay: true,
      autoPlayInterval: 3500,
      infiniteLoop: true,
      showDots: true,
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 20, rowEnd: 40 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 20, rowEnd: 40 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 20, rowEnd: 40 },
    },
    defaultChildren: [],
  },

  // ─── ProductList Themes ───────────────────────────────────────────────────────
  "product-list-scroll": {
    id: "product-list-scroll",
    componentType: "ProductList",
    name: "Horizontal Ribbon",
    description: "Smooth horizontal scroll stream for curated product collections",
    tokens: {
      padding: "8px 0",
    },
    styles: {
      padding: "8px 0",
      overflowX: "auto",
    },
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 50, rowEnd: 85 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 50, rowEnd: 85 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 50, rowEnd: 85 },
    },
    defaultChildren: [],
  },

  // ─── CouponCode Themes ────────────────────────────────────────────────────────
  "coupon-ticket": {
    id: "coupon-ticket",
    componentType: "CouponCode",
    name: "Dashed Ticket",
    description: "Classic amber dashed border coupon box with one-click copy",
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
    defaultData: {
      title: "CAMPUS50",
      description: "Get 50% off up to ₹200 on all student gear",
      copyLabel: "Copy Code",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 38, rowEnd: 46 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 38, rowEnd: 46 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 38, rowEnd: 46 },
    },
    defaultChildren: [],
  },

  // ─── CountDownTimer Themes ────────────────────────────────────────────────────
  "timer-urgent": {
    id: "timer-urgent",
    componentType: "CountDownTimer",
    name: "Flash Urgency Crimson",
    description: "High-visibility deal countdown timer with styled digits",
    tokens: {
      borderRadius: "12px",
      backgroundColor: "#fff1f2",
      borderColor: "#fecdd3",
    },
    styles: {
      borderRadius: "12px",
      backgroundColor: "#fff1f2",
      border: "1px solid #fecdd3",
      padding: "10px 14px",
    },
    defaultData: {
      label: "⚡ Flash Deal Ends In:",
      targetDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      expiredText: "Deal Expired!",
      showDays: true,
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  // ─── StoryRow Themes ──────────────────────────────────────────────────────────
  "story-gradient": {
    id: "story-gradient",
    componentType: "StoryRow",
    name: "Gradient Ring Stories",
    description: "Vibrant gradient circle stories row for campus updates",
    tokens: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
    },
    styles: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "8px 12px",
    },
    defaultData: {},
    defaultPlacement: {},
    defaultChildren: [],
  },

  // ─── Box Themes ───────────────────────────────────────────────────────────────
  "box-card": {
    id: "box-card",
    componentType: "Box",
    name: "Elevated Container",
    description: "Clean white box container with subtle border and padding",
    tokens: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      borderColor: "#e2e8f0",
    },
    styles: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      padding: "14px",
    },
    defaultData: {},
    defaultPlacement: {},
    defaultChildren: [],
  },

  // ─── Badge Themes ─────────────────────────────────────────────────────────────
  "badge-deal": {
    id: "badge-deal",
    componentType: "Badge",
    name: "Deal Amber",
    description: "Warm amber tag pill for special offers",
    tokens: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      borderRadius: "999px",
    },
    styles: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
      borderRadius: "999px",
      padding: "2px 8px",
      fontSize: "11px",
      fontWeight: "700",
    },
    defaultData: {
      text: "LIMITED DEAL",
    },
    defaultPlacement: {},
    defaultChildren: [],
  },

  // ─── PriceBlock Themes ────────────────────────────────────────────────────────
  "price-classic": {
    id: "price-classic",
    componentType: "PriceBlock",
    name: "Selling + MRP Strikethrough",
    description: "Standard price presentation with discount tag",
    tokens: {
      color: "#0f172a",
    },
    styles: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
    },
    defaultData: {
      sellingPrice: "₹1,499",
      mrp: "₹2,999",
      discount: "50% OFF",
    },
    defaultPlacement: {},
    defaultChildren: [],
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
