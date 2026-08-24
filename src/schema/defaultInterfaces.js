import { fullPageJSON } from "./landingSchema";
import { ensureStableIds } from "../cms/utils/idUtils";
import { createComponent } from "../cms/utils/componentFactory";

export const defaultInterfaces = [
  {
    id: "ecommerce-home",
    name: "E-Commerce Home",
    description: "Complete storefront homepage with headers, stories, categories, carousel, hero banner, coupon, deals, and bottom navigation.",
    icon: "🏪",
    category: "Storefront",
    schema: fullPageJSON,
  },
  {
    id: "product-details",
    name: "Product Details Page",
    description: "Focused product showcase with image gallery, price breakdown, rating score, reviews, and quick buy button.",
    icon: "📱",
    category: "Commerce",
    schema: ensureStableIds({
      type: "Home",
      containerStyle: { backgroundColor: "#F6F6F4", color: "#101F26" },
      children: [
        {
          type: "Page",
          children: [
            createComponent("Header", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
              },
              children: [
                createComponent("HeaderButton", {
                  data: { label: "← Back", icon: "", id: "back_btn" },
                  actions: { onTap: { type: "NAVIGATE", route: "home" } },
                }),
                createComponent("HeaderButton", {
                  data: { label: "Campus Tech", icon: "✨", id: "title_btn" },
                }),
                createComponent("HeaderButton", {
                  data: { label: "Share", icon: "🔗", id: "share_btn" },
                  actions: { onTap: { type: "OPEN_BOTTOM_SHEET", data: { title: "Share Product" } } },
                }),
              ],
            }),
            createComponent("ProductCard", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 7, rowEnd: 65 },
                tablet: { colStart: 20, colEnd: 80, rowStart: 7, rowEnd: 65 },
                desktop: { colStart: 25, colEnd: 75, rowStart: 7, rowEnd: 65 },
              },
              containerStyle: { width: "100%", padding: "16px" },
              children: [
                createComponent("Image", {
                  data: {
                    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                    altText: "Wireless Headphones",
                  },
                }),
                createComponent("Badge", { data: { text: "CAMPUS CHOICE" } }),
                createComponent("Title", { data: { text: "AudioPro Wireless Noise-Cancelling Headphones" } }),
                createComponent("Description", {
                  data: {
                    text: "40 hours battery life with ultra-low latency mode, active noise cancellation, and ergonomic memory-foam ear cushions.",
                    maxLines: 4,
                  },
                }),
                createComponent("Rating", {
                  children: [
                    createComponent("Score", { data: { text: "4.9", "out of": "5" } }),
                    createComponent("ReviewCount", { data: { text: "2,480" } }),
                  ],
                }),
                createComponent("PriceBlock", {
                  data: { sellingPrice: "₹2,499", mrp: "₹4,999", discount: "50%" },
                }),
                createComponent("DeliveryInfo", { data: { prefix: "FREE express delivery", daysOffset: 2 } }),
                createComponent("Button", {
                  data: { label: "Buy Now with 1-Click" },
                  actions: { onTap: { type: "API_CALL", endpoint: "https://jsonplaceholder.typicode.com/todos/1" } },
                }),
              ],
            }),
          ],
        },
      ],
    }),
  },
  {
    id: "category-showcase",
    name: "Category Showcase",
    description: "Category discovery view with search, filter tabs, and multi-card product grid.",
    icon: "🗂️",
    category: "Navigation",
    schema: ensureStableIds({
      type: "Home",
      containerStyle: { backgroundColor: "#F6F6F4" },
      children: [
        {
          type: "Page",
          children: [
            createComponent("Header", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 6 },
              },
              children: [
                createComponent("HeaderButton", {
                  data: { label: "SDUI Categories", icon: "🗂️", id: "cat_logo" },
                }),
              ],
            }),
            createComponent("SearchBar", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 7, rowEnd: 12 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 7, rowEnd: 12 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 7, rowEnd: 12 },
              },
              data: { placeholder: "Search inside categories..." },
            }),
            createComponent("CategoryGrid", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 13, rowEnd: 24 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 13, rowEnd: 24 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 13, rowEnd: 24 },
              },
              children: [
                createComponent("CategoryItem", { data: { label: "Laptops", icon: "💻" } }),
                createComponent("CategoryItem", { data: { label: "Audio", icon: "🎧" } }),
                createComponent("CategoryItem", { data: { label: "Books", icon: "📚" } }),
                createComponent("CategoryItem", { data: { label: "Fashion", icon: "👕" } }),
                createComponent("CategoryItem", { data: { label: "Stationery", icon: "✏️" } }),
                createComponent("CategoryItem", { data: { label: "Snacks", icon: "🍕" } }),
              ],
            }),
          ],
        },
      ],
    }),
  },
  {
    id: "marketing-landing",
    name: "Marketing Landing",
    description: "Promotional landing layout with high-impact hero banner, countdown timer, coupon code, and video iframe.",
    icon: "🚀",
    category: "Marketing",
    schema: ensureStableIds({
      type: "Home",
      containerStyle: { backgroundColor: "#0f172a", color: "#ffffff" },
      children: [
        {
          type: "Page",
          children: [
            createComponent("HeroBanner", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 30 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 30 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 1, rowEnd: 30 },
              },
              data: {
                imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
                title: "Campus Flash Sale",
                subtitle: "Limited time deals on student gear & software licenses",
              },
            }),
            createComponent("CountDownTimer", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 31, rowEnd: 42 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 31, rowEnd: 42 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 31, rowEnd: 42 },
              },
              data: {
                label: "Flash Sale Expires In:",
                targetDate: new Date(Date.now() + 86400000).toISOString(),
                expiredText: "Offer Expired!",
              },
            }),
            createComponent("CouponCode", {
              placement: {
                mobile: { colStart: 1, colEnd: 100, rowStart: 43, rowEnd: 53 },
                tablet: { colStart: 1, colEnd: 100, rowStart: 43, rowEnd: 53 },
                desktop: { colStart: 1, colEnd: 100, rowStart: 43, rowEnd: 53 },
              },
              data: {
                title: "STUDENTVIP",
                description: "Unlock an extra 20% cashback on all orders above ₹999",
                copyLabel: "Copy Code",
              },
            }),
          ],
        },
      ],
    }),
  },
  {
    id: "blank-page",
    name: "Blank Canvas",
    description: "Clean empty SDUI grid canvas to design custom layouts from scratch.",
    icon: "📄",
    category: "General",
    schema: ensureStableIds({
      type: "Home",
      containerStyle: { backgroundColor: "#F6F6F4", color: "#101F26" },
      children: [
        {
          type: "Page",
          children: [],
        },
      ],
    }),
  },
];
