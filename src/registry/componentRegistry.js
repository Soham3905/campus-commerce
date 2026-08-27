/**
 * Component Registry — Central Single Source of Truth for all SDUI components.
 * Defines metadata, editable fields, capabilities, allowed children, and sensible defaults.
 */

export const ComponentCategories = {
  ALL: "All",
  NAVIGATION: "Navigation",
  COMMERCE: "Commerce",
  MEDIA: "Media",
  CONTENT: "Content",
  LAYOUT: "Layout",
  UTILITY: "Utility",
};

export const ComponentRegistry = {
  // --- LAYOUT ---
  Home: {
    type: "Home",
    label: "Home Container",
    category: ComponentCategories.LAYOUT,
    description: "Root container for an entire SDUI screen page",
    icon: "🏠",
    canHaveChildren: true,
    allowedChildren: ["Page", "NavBar", "Header", "Box"],
    defaultData: {},
    defaultPlacement: {},
    defaultContainerStyle: {
      backgroundColor: "#F6F6F4",
      fontFamily: "'Inter Tight', Inter, sans-serif",
      color: "#101F26",
    },
    fields: [],
    supportedEvents: ["onMount", "onUnmount"],
  },

  Page: {
    type: "Page",
    label: "Grid Page",
    category: ComponentCategories.LAYOUT,
    description: "100-column by 200-row responsive grid container",
    icon: "📐",
    canHaveChildren: true,
    allowedChildren: null, // Any child allowed
    forbiddenChildren: ["Home", "Page"], // A page grid shouldn't nest another root/page inside it
    defaultData: {},
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [],
    supportedEvents: [],
  },

  Box: {
    type: "Box",
    label: "Box Wrapper",
    category: ComponentCategories.LAYOUT,
    description: "Generic flexible container box for custom layouts",
    icon: "📦",
    canHaveChildren: true,
    allowedChildren: null,
    forbiddenChildren: ["Home", "Page"], // A wrapper box shouldn't contain a full root/page
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 20 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 20 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 20 },
    },
    defaultContainerStyle: {
      padding: "12px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
    },
    fields: [],
    supportedEvents: ["onTap", "onHover", "onHoverOut"],
  },

  // --- NAVIGATION ---
  Header: {
    type: "Header",
    label: "Header Bar",
    category: ComponentCategories.NAVIGATION,
    description: "Top navigation or sticky utility bar",
    icon: "🔝",
    canHaveChildren: true,
    allowedChildren: ["HeaderButton", "SearchBar", "Title", "Text", "Image", "Icon", "Badge"],
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
    },
    defaultContainerStyle: {
      backgroundColor: "#0D3540",
      padding: "8px 16px",
      color: "#FFFFFF",
      position: "sticky",
      top: "0px",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    fields: [],
    supportedEvents: [],
  },

  HeaderButton: {
    type: "HeaderButton",
    label: "Header Button",
    category: ComponentCategories.NAVIGATION,
    description: "Nav item or action pill inside a header",
    icon: "🔘",
    canHaveChildren: false,
    allowedChildren: [],
    allowedParents: ["Header", "Box"],
    defaultData: {
      id: "nav_btn",
      label: "Shop Now",
      icon: "✨",
      count: undefined,
    },
    defaultPlacement: {},
    defaultContainerStyle: {
      color: "#0f172a",
      backgroundColor: "#f1f5f9",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "6px 12px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
    },
    fields: [
      { name: "label", label: "Button Label", type: "text" },
      { name: "icon", label: "Icon / Emoji", type: "text" },
      { name: "count", label: "Badge Count", type: "number" },
    ],
    supportedEvents: ["onTap"],
  },

  SearchBar: {
    type: "SearchBar",
    label: "Search Bar",
    category: ComponentCategories.NAVIGATION,
    description: "Live search input with debounced querying",
    icon: "🔍",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      placeholder: "Search products, brands and deals...",
      icon: "🔍",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 6, rowEnd: 10 },
    },
    defaultContainerStyle: {
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      padding: "6px 12px",
      border: "1px solid #E4E7E4",
      width: "100%",
    },
    fields: [
      { name: "placeholder", label: "Placeholder Text", type: "text" },
      { name: "icon", label: "Search Icon", type: "text" },
    ],
    supportedEvents: ["onChange", "onSubmit", "onFocus", "onBlur"],
  },

  NavBar: {
    type: "NavBar",
    label: "Bottom Navigation",
    category: ComponentCategories.NAVIGATION,
    description: "Fixed or floating bottom navigation bar",
    icon: "🧭",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      items: [
        { label: "Home", icon: "🏠", isActive: true, actions: { onTap: { type: "NAVIGATE", route: "home" } } },
        { label: "Categories", icon: "🗂️", isActive: false, actions: { onTap: { type: "NAVIGATE", route: "categories" } } },
        { label: "Cart", icon: "🛒", isActive: false, actions: { onTap: { type: "NAVIGATE", route: "cart" } } },
        { label: "Account", icon: "👤", isActive: false, actions: { onTap: { type: "NAVIGATE", route: "account" } } },
      ],
    },
    defaultPlacement: {},
    defaultContainerStyle: {
      position: "sticky",
      bottom: "0px",
      backgroundColor: "#ffffff",
      padding: "8px 0",
      borderTop: "1px solid #e5e7eb",
      zIndex: 90,
    },
    fields: [],
    supportedEvents: [],
  },

  // --- COMMERCE ---
  ProductList: {
    type: "ProductList",
    label: "Product List Row",
    category: ComponentCategories.COMMERCE,
    description: "Horizontal scrolling row of product cards",
    icon: "🛍️",
    canHaveChildren: true,
    allowedChildren: ["ProductCard"],
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 50, rowEnd: 85 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 50, rowEnd: 85 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 50, rowEnd: 85 },
    },
    defaultContainerStyle: {
      overflowX: "auto",
      scrollbarWidth: "none",
    },
    fields: [],
    supportedEvents: ["onScroll", "onEndReached"],
  },

  ProductCard: {
    type: "ProductCard",
    label: "Product Card",
    category: ComponentCategories.COMMERCE,
    description: "E-commerce product card with image, title, price, and ratings",
    icon: "🏷️",
    canHaveChildren: true,
    allowedChildren: ["Image", "Label", "Sponsored", "Title", "Description", "Rating", "Score", "ReviewCount", "Badge", "PriceBlock", "OfferText", "DeliveryInfo", "Button", "ShareButton", "Icon"],
    defaultData: {
      id: "prod_001",
    },
    defaultPlacement: {},
    defaultContainerStyle: {
      width: "280px",
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      padding: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
    fields: [
      { name: "id", label: "Product SKU / ID", type: "text" },
    ],
    supportedEvents: ["onTap", "onHover", "onHoverOut", "onLongPress"],
  },

  CategoryGrid: {
    type: "CategoryGrid",
    label: "Category Grid",
    category: ComponentCategories.COMMERCE,
    description: "Scrollable horizontal grid of category icons and labels",
    icon: "🍱",
    canHaveChildren: true,
    allowedChildren: ["CategoryItem"],
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 15, rowEnd: 25 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 15, rowEnd: 25 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 15, rowEnd: 25 },
    },
    defaultContainerStyle: {
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      padding: "10px",
    },
    fields: [],
    supportedEvents: ["onScroll"],
  },

  CategoryItem: {
    type: "CategoryItem",
    label: "Category Item",
    category: ComponentCategories.COMMERCE,
    description: "Single category circle icon and label",
    icon: "🔘",
    canHaveChildren: false,
    allowedChildren: [],
    allowedParents: ["CategoryGrid", "Box"],
    defaultData: {
      label: "Electronics",
      icon: "💻",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "label", label: "Category Name", type: "text" },
      { name: "icon", label: "Icon / Emoji", type: "text" },
    ],
    supportedEvents: ["onTap"],
  },

  PriceBlock: {
    type: "PriceBlock",
    label: "Price Block",
    category: ComponentCategories.COMMERCE,
    description: "Formatted selling price, MRP, and discount percentage",
    icon: "💰",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      sellingPrice: "₹1,499",
      mrp: "₹2,999",
      discount: "50%",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "sellingPrice", label: "Selling Price", type: "text" },
      { name: "mrp", label: "Original M.R.P", type: "text" },
      { name: "discount", label: "Discount Text", type: "text" },
    ],
    supportedEvents: [],
  },

  CouponCode: {
    type: "CouponCode",
    label: "Coupon Code",
    category: ComponentCategories.COMMERCE,
    description: "Discount coupon box with interactive one-click copy button",
    icon: "🎟️",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      title: "CAMPUS50",
      description: "Get 50% off up to ₹200 on all student gear",
      copyLabel: "Copy Code",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 40, rowEnd: 48 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 40, rowEnd: 48 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 40, rowEnd: 48 },
    },
    defaultContainerStyle: {},
    fields: [
      { name: "title", label: "Coupon Code", type: "text" },
      { name: "description", label: "Description", type: "text" },
      { name: "copyLabel", label: "Button Label", type: "text" },
    ],
    supportedEvents: ["onCopy"],
  },

  DeliveryInfo: {
    type: "DeliveryInfo",
    label: "Delivery Info",
    category: ComponentCategories.COMMERCE,
    description: "Calculated delivery date and shipping badge",
    icon: "🚚",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      prefix: "FREE delivery",
      daysOffset: 3,
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "prefix", label: "Prefix Label", type: "text" },
      { name: "daysOffset", label: "Days from Today", type: "number" },
    ],
    supportedEvents: [],
  },

  OfferText: {
    type: "OfferText",
    label: "Offer Text",
    category: ComponentCategories.COMMERCE,
    description: "Promotional badge or special deal text",
    icon: "🏷️",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "Bank Offer: Extra 10% off on ICICI Cards",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "text", label: "Offer Text", type: "text" },
    ],
    supportedEvents: [],
  },

  // --- MEDIA ---
  HeroBanner: {
    type: "HeroBanner",
    label: "Hero Banner",
    category: ComponentCategories.MEDIA,
    description: "High-impact visual banner with headline, subtitle, and image",
    icon: "🖼️",
    canHaveChildren: true,
    allowedChildren: ["Button", "Badge", "Text"],
    defaultData: {
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80",
      title: "Mega Campus Tech Fest",
      subtitle: "Up to 70% off on laptops, accessories & smart gear",
      altText: "Hero Banner",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 25, rowEnd: 45 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 25, rowEnd: 45 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 25, rowEnd: 45 },
    },
    defaultContainerStyle: {
      borderRadius: "16px",
      overflow: "hidden",
    },
    fields: [
      { name: "title", label: "Headline Title", type: "text" },
      { name: "subtitle", label: "Subtitle Text", type: "text" },
      { name: "imageUrl", label: "Image URL", type: "image" },
      { name: "altText", label: "Alt Text", type: "text" },
    ],
    supportedEvents: ["onTap", "onError"],
  },

  Carousel: {
    type: "Carousel",
    label: "Carousel Slider",
    category: ComponentCategories.MEDIA,
    description: "Auto-playing touch-swipeable slider for banners or cards",
    icon: "🎠",
    canHaveChildren: true,
    allowedChildren: ["HeroBanner", "ProductCard", "Image", "Box"],
    maxChildren: 10,
    defaultData: {
      autoPlay: true,
      autoPlayInterval: 3500,
      infiniteLoop: true,
      showDots: true,
      minSwipeDistance: 50,
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 20, rowEnd: 40 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 20, rowEnd: 40 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 20, rowEnd: 40 },
    },
    defaultContainerStyle: {
      borderRadius: "12px",
    },
    fields: [
      { name: "autoPlay", label: "Auto Play", type: "checkbox" },
      { name: "autoPlayInterval", label: "Interval (ms)", type: "number" },
      { name: "infiniteLoop", label: "Infinite Loop", type: "checkbox" },
      { name: "showDots", label: "Show Indicators", type: "checkbox" },
    ],
    supportedEvents: ["onSwipeLeft", "onSwipeRight"],
  },

  Image: {
    type: "Image",
    label: "Image",
    category: ComponentCategories.MEDIA,
    description: "Responsive image component with contain/cover modes",
    icon: "📷",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      altText: "Product showcase",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "imageUrl", label: "Image URL", type: "image" },
      { name: "altText", label: "Alt Text", type: "text" },
    ],
    supportedEvents: ["onTap"],
  },

  StoryRow: {
    type: "StoryRow",
    label: "Story Row",
    category: ComponentCategories.MEDIA,
    description: "Instagram-style circular avatar stories row",
    icon: "⭕",
    canHaveChildren: true,
    allowedChildren: ["StoryCircle"],
    maxChildren: 20,
    defaultData: {},
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 10, rowEnd: 18 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 10, rowEnd: 18 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 10, rowEnd: 18 },
    },
    defaultContainerStyle: {
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
    },
    fields: [],
    supportedEvents: ["onScroll"],
  },

  StoryCircle: {
    type: "StoryCircle",
    label: "Story Circle",
    category: ComponentCategories.MEDIA,
    description: "Circular story avatar item with border gradient",
    icon: "🟣",
    canHaveChildren: false,
    allowedChildren: [],
    allowedParents: ["StoryRow", "Box"],
    defaultData: {
      label: "New Drops",
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&auto=format&fit=crop&q=80",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "label", label: "Story Label", type: "text" },
      { name: "imageUrl", label: "Avatar Image URL", type: "image" },
    ],
    supportedEvents: ["onTap"],
  },

  IFrame: {
    type: "IFrame",
    label: "Embedded IFrame / Video",
    category: ComponentCategories.MEDIA,
    description: "Responsive embedded web frame, YouTube video, or interactive widget",
    icon: "📺",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      title: "Campus Video",
      height: "240px",
      allowFullScreen: true,
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 90, rowEnd: 110 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 90, rowEnd: 110 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 90, rowEnd: 110 },
    },
    defaultContainerStyle: {},
    fields: [
      { name: "src", label: "Embed URL", type: "url" },
      { name: "title", label: "Frame Title", type: "text" },
      { name: "height", label: "Height (e.g. 240px)", type: "text" },
      { name: "allowFullScreen", label: "Allow Full Screen", type: "checkbox" },
    ],
    supportedEvents: [],
  },

  Icon: {
    type: "Icon",
    label: "Icon Image",
    category: ComponentCategories.MEDIA,
    description: "Small inline icon image",
    icon: "ℹ️",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png",
      altText: "Info",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "imageUrl", label: "Icon Image URL", type: "image" },
      { name: "altText", label: "Alt Text", type: "text" },
    ],
    supportedEvents: ["onTap"],
  },

  // --- CONTENT ---
  Title: {
    type: "Title",
    label: "Heading Title",
    category: ComponentCategories.CONTENT,
    description: "Bold section title or heading",
    icon: "🔤",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "Featured Deals & Offers",
    },
    defaultPlacement: {},
    defaultContainerStyle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#111827",
    },
    fields: [
      { name: "text", label: "Heading Text", type: "text" },
    ],
    supportedEvents: ["onTap"],
  },

  Description: {
    type: "Description",
    label: "Paragraph Description",
    category: ComponentCategories.CONTENT,
    description: "Descriptive body copy with multi-line clamping",
    icon: "📝",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "Explore handpicked products tailored for students and creators with instant doorstep delivery.",
      maxLines: 2,
    },
    defaultPlacement: {},
    defaultContainerStyle: {
      fontSize: "13px",
      color: "#4b5563",
    },
    fields: [
      { name: "text", label: "Text Content", type: "textarea" },
      { name: "maxLines", label: "Max Lines Clamped", type: "number" },
    ],
    supportedEvents: [],
  },

  Text: {
    type: "Text",
    label: "Inline Text",
    category: ComponentCategories.CONTENT,
    description: "Basic inline text span",
    icon: "📄",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "Campus Commerce SDUI",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "text", label: "Text Content", type: "text" },
    ],
    supportedEvents: [],
  },

  Badge: {
    type: "Badge",
    label: "Badge Pill",
    category: ComponentCategories.CONTENT,
    description: "Promotional badge or tag pill",
    icon: "🏷️",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "HOT DEAL",
    },
    defaultPlacement: {},
    defaultContainerStyle: {
      backgroundColor: "#cc0c39",
      color: "#ffffff",
    },
    fields: [
      { name: "text", label: "Badge Label", type: "text" },
    ],
    supportedEvents: [],
  },

  CountDownTimer: {
    type: "CountDownTimer",
    label: "Countdown Timer",
    category: ComponentCategories.CONTENT,
    description: "Live countdown timer with custom expiration callback",
    icon: "⏳",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      label: "Deal Ends In:",
      targetDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      expiredText: "Deal Expired!",
      showDays: true,
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 45, rowEnd: 55 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 45, rowEnd: 55 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 45, rowEnd: 55 },
    },
    defaultContainerStyle: {},
    fields: [
      { name: "label", label: "Header Label", type: "text" },
      { name: "targetDate", label: "Target ISO Date", type: "text" },
      { name: "expiredText", label: "Expired Message", type: "text" },
      { name: "showDays", label: "Show Days", type: "checkbox" },
    ],
    supportedEvents: ["onExpire"],
  },

  Rating: {
    type: "Rating",
    label: "Rating Block",
    category: ComponentCategories.CONTENT,
    description: "Container for score stars and review count",
    icon: "⭐",
    canHaveChildren: true,
    allowedChildren: ["Score", "ReviewCount"],
    maxChildren: 2,
    defaultData: {},
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [],
    supportedEvents: [],
  },

  Score: {
    type: "Score",
    label: "Star Score",
    category: ComponentCategories.CONTENT,
    description: "Star rating numerical score (e.g., 4.5 / 5)",
    icon: "✨",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "4.8",
      "out of": "5",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "text", label: "Score Value", type: "text" },
      { name: "out of", label: "Scale Out Of", type: "text" },
    ],
    supportedEvents: [],
  },

  ReviewCount: {
    type: "ReviewCount",
    label: "Review Count",
    category: ComponentCategories.CONTENT,
    description: "Total customer reviews count",
    icon: "💬",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "1,240",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "text", label: "Review Count", type: "text" },
    ],
    supportedEvents: [],
  },

  Sponsored: {
    type: "Sponsored",
    label: "Sponsored Tag",
    category: ComponentCategories.CONTENT,
    description: "Subtle sponsored advertisement label",
    icon: "📣",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      text: "Sponsored",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "text", label: "Tag Text", type: "text" },
    ],
    supportedEvents: [],
  },

  Button: {
    type: "Button",
    label: "Action Button",
    category: ComponentCategories.CONTENT,
    description: "Full-width call to action button",
    icon: "🔘",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      label: "Add to Cart",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "label", label: "Button Label", type: "text" },
    ],
    supportedEvents: ["onTap"],
  },

  ShareButton: {
    type: "ShareButton",
    label: "Share Button",
    category: ComponentCategories.CONTENT,
    description: "Compact sharing button with icon",
    icon: "🔗",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      label: "Share",
      icon: "↗️",
    },
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [
      { name: "label", label: "Button Label", type: "text" },
      { name: "icon", label: "Icon", type: "text" },
    ],
    supportedEvents: ["onTap"],
  },

  Label: {
    type: "Label",
    label: "Label Group",
    category: ComponentCategories.CONTENT,
    description: "Inline flex container for icons and text tags",
    icon: "🏷️",
    canHaveChildren: true,
    allowedChildren: ["Sponsored", "Icon", "Text", "Badge"],
    defaultData: {},
    defaultPlacement: {},
    defaultContainerStyle: {},
    fields: [],
    supportedEvents: [],
  },

  Footer: {
    type: "Footer",
    label: "Footer Section",
    category: ComponentCategories.CONTENT,
    description: "Multi-column website footer with links and copyright",
    icon: "🔻",
    canHaveChildren: false,
    allowedChildren: [],
    defaultData: {
      sections: [
        {
          title: "About Campus Commerce",
          links: [
            { label: "About Us", url: "#" },
            { label: "Careers", url: "#" },
            { label: "Press Releases", url: "#" },
          ],
        },
        {
          title: "Help & Support",
          links: [
            { label: "Your Account", url: "#" },
            { label: "Returns Centre", url: "#" },
            { label: "100% Purchase Protection", url: "#" },
          ],
        },
      ],
      copyrightText: "© 2026 CampusCommerce SDUI. All rights reserved.",
    },
    defaultPlacement: {
      mobile: { colStart: 1, colEnd: 100, rowStart: 160, rowEnd: 195 },
      tablet: { colStart: 1, colEnd: 100, rowStart: 160, rowEnd: 195 },
      desktop: { colStart: 1, colEnd: 100, rowStart: 160, rowEnd: 195 },
    },
    defaultContainerStyle: {},
    fields: [
      { name: "copyrightText", label: "Copyright Notice", type: "text" },
    ],
    supportedEvents: [],
  },
};
