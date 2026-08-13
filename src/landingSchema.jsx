// ─────────────────────────────────────────────────────────────────────────────
// SDUI Landing Page Schema — CampusCommerce
//
// Grid contract: 100 columns × 200 rows  (1 row = 10 px)
//   colEnd = 101  →  spans all 100 columns (grid is 1-indexed, end is exclusive)
//   rowEnd = 201  →  spans all 200 rows
//
// Height arithmetic (row spans × 10 px):
//   Header         6  rows = 60 px   (mobile: 11 rows = 110 px — search wraps)
//   CategoryGrid   8  rows = 80 px
//   StoryRow      10  rows = 100 px
//   HeroBanner    40  rows = 400 px  ← matches the hardcoded img height exactly
//   CouponCode     9  rows = 90 px
//   CountDownTimer 10 rows = 100 px
//   ProductList #1 45 rows = 450 px  ← ProductImage(180) + card content ≈ 430 px
//   ProductList #2 45 rows = 450 px
//   ShareButton    3  rows = 30 px
//   Footer        24  rows = 240 px  (mobile: 19 rows = 190 px)
// ─────────────────────────────────────────────────────────────────────────────

export const fullPageJSON = {
  "type": "Home",
  "containerStyle": {},
  "statusCode": 200,
  "statusMessage": "Success",
  "actions": {
    "onMount": {
      "type": "API_CALL",
      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
      "actionName": "PAGE_MOUNTED"
    }
  },
  "children": [
    {
      "type": "Page",
      "containerStyle": {},
      "children": [

        // ── 1. HEADER ROW 1 (SERVICES) ──────────────────────────────
        {
          "type": "Header",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 1, "rowEnd": 7 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 1, "rowEnd": 6 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 1, "rowEnd": 5 }
          },
          "containerStyle": {
            "background": "rgba(255, 255, 255, 0.92)",
            "backdropFilter": "blur(12px)",
            "WebkitBackdropFilter": "blur(12px)",
            "padding": "4px 10px",
            "gap": "6px",
            "display": "flex",
            "flexWrap": "nowrap",
            "alignItems": "center",
            "overflowX": "auto",
            "scrollbarWidth": "none",
            "borderBottom": "1px solid #f1f5f9"
          },
          "children": [
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "#FFD700", "padding": "4px 8px", "borderRadius": "8px", "color": "#111827", "fontWeight": "bold", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "flipkart", "label": "Flipkart", "icon": "🛍️" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_FLIPKART" } }
            },
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "#F3F4F6", "padding": "4px 8px", "borderRadius": "8px", "color": "#111827", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "minutes", "label": "Minutes", "icon": "🛵" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_MINUTES" } }
            },
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "#F3F4F6", "padding": "4px 8px", "borderRadius": "8px", "color": "#111827", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "travel", "label": "Travel", "icon": "✈️" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_TRAVEL" } }
            },
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "#F3F4F6", "padding": "4px 8px", "borderRadius": "8px", "color": "#111827", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "grocery", "label": "Value 365", "icon": "🛒" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_GROCERY" } }
            }
          ]
        },

        // ── 2. HEADER ROW 2 (NAVIGATION) ────────────────────────────
        {
          "type": "Header",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 7, "rowEnd": 13 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 6, "rowEnd": 11 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 5, "rowEnd": 9 }
          },
          "containerStyle": {
            "background": "rgba(255, 255, 255, 0.92)",
            "backdropFilter": "blur(12px)",
            "WebkitBackdropFilter": "blur(12px)",
            "borderBottom": "1px solid #f1f5f9",
            "padding": "4px 10px",
            "gap": "6px",
            "display": "flex",
            "flexWrap": "nowrap",
            "alignItems": "center",
            "overflowX": "auto",
            "scrollbarWidth": "none"
          },
          "children": [
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "transparent", "padding": "4px 8px", "color": "#111827", "fontWeight": "600", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "home", "label": "HOME", "icon": "🏠" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_HOME" } }
            },
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "transparent", "padding": "4px", "color": "#4b5563", "fontSize": "11px", "maxWidth": "110px", "overflow": "hidden", "whiteSpace": "nowrap", "textOverflow": "ellipsis", "flexShrink": "1" },
              "data": { "id": "location", "label": "Plot No. 25...", "icon": "" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_LOCATION" } }
            },
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "#F3F4F6", "padding": "4px 8px", "borderRadius": "8px", "color": "#111827", "marginLeft": "auto", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "wishlist", "label": "Wishlist", "icon": "❤️" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_WISHLIST" } }
            },
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "#F3F4F6", "padding": "4px 8px", "borderRadius": "8px", "color": "#111827", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "account", "label": "Account", "icon": "👤" },
              "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "OPEN_ACCOUNT" } }
            },
            {
              "type": "HeaderButton",
              "containerStyle": { "backgroundColor": "#F3F4F6", "padding": "4px 8px", "borderRadius": "8px", "color": "#111827", "flexShrink": "0", "fontSize": "11px" },
              "data": { "id": "cart", "label": "Cart", "icon": "🛒" },
              "actions": { "onTap": { "type": "NAVIGATE", "route": "cart", "actionName": "OPEN_CART" } }
            }
          ]
        },
        {
          "type": "Header",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 13, "rowEnd": 20 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 11, "rowEnd": 16 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 9, "rowEnd": 14 }
          },
          "containerStyle": {
            "background": "rgba(255, 255, 255, 0.95)",
            "backdropFilter": "blur(16px)",
            "WebkitBackdropFilter": "blur(16px)",
            "borderBottom": "1px solid #f1f5f9",
            "padding": "5px 12px",
            "position": "sticky",
            "top": "0px",
            "zIndex": "105",
            "display": "flex",
            "alignItems": "stretch",
            "width": "100%",
            "boxSizing": "border-box"
          },
          "children": [
            {
              "type": "SearchBar",
              "containerStyle": {
                "flex": "1",
                "width": "100%",
                "minWidth": "0",
                "padding": "0",
                "backgroundColor": "transparent",
                "border": "none"
              },
              "data": { "placeholder": "Search for Products, Brands and More", "icon": "🔍" },
              "actions": {
                "onChange": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SEARCH_CHANGED", "debounceDuration": 400 },
                "onSubmit": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SEARCH_SUBMITTED" },
                "onFocus": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SEARCH_FOCUSED" },
                "onBlur": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SEARCH_BLURRED" }
              }
            }
          ]
        },


        // ── 4. CATEGORY GRID ────────────────────────────────────────
        {
          "type": "CategoryGrid",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 21, "rowEnd": 31 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 17, "rowEnd": 24 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 15, "rowEnd": 21 }
          },
          "containerStyle": {
            "backgroundColor": "#ffffff",
            "padding": "6px 10px",
            "borderBottom": "1px solid #f1f5f9"
          },
          "children": [
            { "type": "CategoryItem", "containerStyle": { "borderBottom": "3px solid #2874F0", "paddingBottom": "4px" }, "data": { "label": "For You", "icon": "🛍️" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_FORYOU" } } },
            { "type": "CategoryItem", "data": { "label": "Fashion", "icon": "👕" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_FASHION" } } },
            { "type": "CategoryItem", "data": { "label": "Mobiles", "icon": "📱" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_MOBILES" } } },
            { "type": "CategoryItem", "data": { "label": "Electronics", "icon": "💻" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_ELECTRONICS" } } },
            { "type": "CategoryItem", "data": { "label": "Beauty", "icon": "💄" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_BEAUTY" } } },
            { "type": "CategoryItem", "data": { "label": "Home", "icon": "🏠" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_HOME" } } },
            { "type": "CategoryItem", "data": { "label": "Appliances", "icon": "📺" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_APPLIANCES" } } },
            { "type": "CategoryItem", "data": { "label": "Toys", "icon": "🧸" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_TOYS" } } },
            { "type": "CategoryItem", "data": { "label": "Food", "icon": "🍔" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_FOOD" } } },
            { "type": "CategoryItem", "data": { "label": "Auto", "icon": "🚗" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_AUTO" } } },
            { "type": "CategoryItem", "data": { "label": "Sports", "icon": "⚽" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_SPORTS" } } },
            { "type": "CategoryItem", "data": { "label": "Furniture", "icon": "🪑" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_FURNITURE" } } },
            { "type": "CategoryItem", "data": { "label": "Books", "icon": "📚" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_BOOKS" } } },
            { "type": "CategoryItem", "data": { "label": "2 Wheelers", "icon": "🛵" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_2WHEELERS" } } }
          ]
        },

        // ── 3. STORY ROW  (rows 15-25 D/T | 20-30 M) ────────────────────────
        {
          "type": "StoryRow",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 31, "rowEnd": 42 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 24, "rowEnd": 34 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 21, "rowEnd": 29 }
          },
          "children": [
            { "type": "StoryCircle", "data": { "label": "Flash 🔥", "imageUrl": "https://picsum.photos/id/1025/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_FLASH" }, "onDrag": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "DRAG_FLASH" } } },
            { "type": "StoryCircle", "data": { "label": "Trending", "imageUrl": "https://picsum.photos/id/28/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_TRENDING" } } },
            { "type": "StoryCircle", "data": { "label": "New In", "imageUrl": "https://picsum.photos/id/3/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_NEWIN" } } },
            { "type": "StoryCircle", "data": { "label": "Tech", "imageUrl": "https://picsum.photos/id/0/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_TECH" } } },
            { "type": "StoryCircle", "data": { "label": "Shoes", "imageUrl": "https://picsum.photos/id/21/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_SHOES" } } },
            { "type": "StoryCircle", "data": { "label": "Bags", "imageUrl": "https://picsum.photos/id/192/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_BAGS" } } },
            { "type": "StoryCircle", "data": { "label": "Watches", "imageUrl": "https://picsum.photos/id/175/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_WATCHES" } } },
            { "type": "StoryCircle", "data": { "label": "Luxury", "imageUrl": "https://picsum.photos/id/104/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_LUXURY" } } }
          ]
        },

        // ── 4. IMAGE CAROUSEL (18 rows = 180px) ───────────────────────
        {
          "type": "Carousel",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 42, "rowEnd": 62 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 34, "rowEnd": 53 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 29, "rowEnd": 48 }
          },
          "data": {
            "autoPlay": true,
            "autoPlayInterval": 4000,
            "infiniteLoop": true,
            "showDots": true
          },
          "children": [
            {
              "type": "Image",
              "containerStyle": { "objectFit": "cover", "height": "200px" },
              "data": { "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80", "altText": "Festival Banner" }
            },
            {
              "type": "Image",
              "containerStyle": { "objectFit": "cover", "height": "200px" },
              "data": { "imageUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80", "altText": "New Arrivals" }
            },
            {
              "type": "Image",
              "containerStyle": { "objectFit": "cover", "height": "200px" },
              "data": { "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=80", "altText": "Freedom Sale" }
            }
          ]
        },

        // ── 5. COUPONS ROW (9 rows = 90px) ──────────────────────────────────
        {
          "type": "Header",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 63, "rowEnd": 78 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 54, "rowEnd": 67 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 49, "rowEnd": 60 }
          },
          "containerStyle": {
            "overflowX": "auto",
            "scrollbarWidth": "none",
            "padding": "8px 10px",
            "gap": "10px",
            "alignItems": "stretch",
            "backgroundColor": "#f8fafc"
          },
          "children": [
            {
              "type": "CouponCode",
              "containerStyle": { "minWidth": "220px", "flexShrink": "0" },
              "data": {
                "title": "💳 Bank Exclusive Offer",
                "description": "Flat ₹500 OFF on orders above ₹1,999 · Use code CAMPUS500",
                "copyLabel": "Copy Code"
              },
              "actions": { "onCopy": { "type": "COPY_TO_CLIPBOARD", "value": "CAMPUS500" } }
            },
            {
              "type": "CouponCode",
              "containerStyle": { "minWidth": "220px", "flexShrink": "0", "backgroundColor": "#fff0f5", "border": "2px dashed #db7093" },
              "data": {
                "title": "🎉 Welcome Bonus",
                "description": "Get 20% OFF on your first apparel purchase · Use code WELCOME20",
                "copyLabel": "Copy Code"
              },
              "actions": { "onCopy": { "type": "COPY_TO_CLIPBOARD", "value": "WELCOME20" } }
            },
            {
              "type": "CouponCode",
              "containerStyle": { "minWidth": "220px", "flexShrink": "0", "backgroundColor": "#e0ffff", "border": "2px dashed #00ced1" },
              "data": {
                "title": "⚡ Flash Discount",
                "description": "Extra ₹200 OFF on Electronics · Valid till midnight!",
                "copyLabel": "Copy Code"
              },
              "actions": { "onCopy": { "type": "COPY_TO_CLIPBOARD", "value": "FLASH200" } }
            }
          ]
        },

        // ── 6. TIMERS ROW (10 rows = 100px) ────────────────────────────
        {
          "type": "Header",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 79, "rowEnd": 94 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 68, "rowEnd": 80 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 61, "rowEnd": 71 }
          },
          "containerStyle": {
            "overflowX": "auto",
            "scrollbarWidth": "none",
            "padding": "8px 10px",
            "gap": "10px",
            "alignItems": "stretch",
            "backgroundColor": "#f8fafc"
          },
          "children": [
            {
              "type": "CountDownTimer",
              "containerStyle": { "minWidth": "200px", "flexShrink": "0" },
              "data": {
                "label": "⚡ Flash Sale Ends In",
                "expiredText": "Sale is over — check new deals!",
                "targetDate": "2026-12-31T23:59:59",
                "showDays": "true"
              },
              "actions": { "onExpire": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "TIMER_EXPIRED" } }
            },
            {
              "type": "CountDownTimer",
              "containerStyle": { "minWidth": "200px", "flexShrink": "0", "backgroundColor": "#e6f7ff", "border": "1px solid #91d5ff", "color": "#096dd9" },
              "data": {
                "label": "🔥 Daily Deals End In",
                "expiredText": "Deals Ended!",
                "targetDate": "2026-12-31T23:59:59",
                "showDays": "false"
              }
            },
            {
              "type": "CountDownTimer",
              "containerStyle": { "minWidth": "200px", "flexShrink": "0", "backgroundColor": "#fff1f0", "border": "1px solid #ffa39e", "color": "#cf1322" },
              "data": {
                "label": "⏰ Early Bird Offer",
                "expiredText": "Offer Expired!",
                "targetDate": "2026-12-31T23:59:59",
                "showDays": "false"
              }
            }
          ]
        },

        // ── 7. PRODUCT LIST #1 — Top Deals Today  (45 rows = 450px) ──────────
        {
          "type": "ProductList",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 96, "rowEnd": 146 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 82, "rowEnd": 127 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 73, "rowEnd": 118 }
          },
          "actions": {
            "onScroll": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "RAIL1_SCROLLED", "debounceDuration": 600 },
            "onEndReached": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "RAIL1_LOAD_MORE", "nearEndThreshold": 80 }
          },
          "children": [
            {
              "type": "ProductCard",
              "data": { "id": "p1" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P1" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P1" } },
                      { "label": "Add to Cart", "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P1" } },
                      { "label": "Share", "icon": "📤", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_P1" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image", "data": { "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", "altText": "Nike Air Zoom Pegasus 40" } },
                { "type": "Label", "children": [{ "type": "Sponsored", "data": { "text": "Bestseller" } }, { "type": "Icon", "data": { "imageUrl": "", "altText": "info" } }] },
                { "type": "Title", "data": { "text": "Nike Air Zoom Pegasus 40" } },
                { "type": "Description", "data": { "text": "ReactX foam cushioning for daily training — responsive, lightweight and true-to-size.", "maxLines": 2 } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.7", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "18,540" } }] },
                { "type": "Badge", "data": { "text": "🔥 Deal of the Day" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹8,499", "mrp": "₹12,999", "discount": "35%" } },
                { "type": "OfferText", "data": { "text": "Extra 5% off with SBI card" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 2 } },
                { "type": "Button", "data": { "label": "Add to Cart" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p2" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P2" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P2" } },
                      { "label": "Add to Cart", "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P2" } },
                      { "label": "Compare", "icon": "⚖️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "COMPARE_P2" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image", "data": { "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", "altText": "Sony WF-1000XM5 Earbuds" } },
                { "type": "Title", "data": { "text": "Sony WF-1000XM5 Earbuds" } },
                { "type": "Description", "data": { "text": "Industry-leading ANC, 24-hr battery, DSEE Extreme upscaling & Precise Voice Pickup.", "maxLines": 2 } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.8", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "9,120" } }] },
                { "type": "Badge", "containerStyle": { "backgroundColor": "#7c3aed" }, "data": { "text": "Amazon's Choice" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹14,990", "mrp": "₹22,990", "discount": "35%" } },
                { "type": "OfferText", "data": { "text": "No-cost EMI from ₹1,250/mo" } },
                { "type": "DeliveryInfo", "data": { "prefix": "Get it Tomorrow —", "daysOffset": 1 } },
                { "type": "Button", "data": { "label": "Buy Now" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p3" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P3" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P3" } },
                      { "label": "Add to Cart", "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P3" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image", "data": { "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", "altText": "Apple Watch Series 9 GPS" } },
                { "type": "Label", "children": [{ "type": "Sponsored", "data": { "text": "Sponsored" } }, { "type": "Icon", "data": { "imageUrl": "", "altText": "info" } }] },
                { "type": "Title", "data": { "text": "Apple Watch Series 9 GPS" } },
                { "type": "Description", "data": { "text": "S9 chip, brighter Always-On display, Double Tap gesture & Carbon Neutral certified.", "maxLines": 2 } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.6", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "7,390" } }] },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹38,900", "mrp": "₹44,900", "discount": "13%" } },
                { "type": "OfferText", "data": { "text": "Exchange: save ₹3,000 on old watch" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 3 } },
                { "type": "Button", "data": { "label": "Add to Cart" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p4" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P4" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P4" } },
                      { "label": "Add to Cart", "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P4" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image", "data": { "imageUrl": "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=80", "altText": "Samsung Galaxy Tab S9 FE" } },
                { "type": "Title", "data": { "text": "Samsung Galaxy Tab S9 FE" } },
                { "type": "Description", "data": { "text": "10.9\" WUXGA, 8000mAh, IP68 water-resistant, S Pen included, Wi-Fi + LTE.", "maxLines": 2 } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.5", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "5,810" } }] },
                { "type": "Badge", "containerStyle": { "backgroundColor": "#0284c7" }, "data": { "text": "New Launch" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹34,999", "mrp": "₹46,999", "discount": "26%" } },
                { "type": "OfferText", "data": { "text": "10% cashback with HDFC card" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 2 } },
                { "type": "Button", "data": { "label": "Add to Cart" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p5" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P5" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P5" } },
                      { "label": "Add to Cart", "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P5" } },
                      { "label": "Share", "icon": "📤", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_P5" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image", "data": { "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", "altText": "boAt Rockerz 550 Over-Ear" } },
                { "type": "Label", "children": [{ "type": "Sponsored", "data": { "text": "Limited Time" } }] },
                { "type": "Title", "data": { "text": "boAt Rockerz 550 Over-Ear" } },
                { "type": "Description", "data": { "text": "60-hr battery, Bluetooth 5.0, foldable design & ASAP Charge for nonstop music.", "maxLines": 2 } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.3", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "41,680" } }] },
                { "type": "Badge", "containerStyle": { "backgroundColor": "#dc2626" }, "data": { "text": "#1 Bestseller" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹1,499", "mrp": "₹3,990", "discount": "62%" } },
                { "type": "OfferText", "data": { "text": "Buy 2, get extra 15% off" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 3 } },
                { "type": "Button", "data": { "label": "Add to Cart" } }
              ]
            }
          ]
        },

        // ── 8. HERO BANNER  (40 rows = 400px) ────────────────────────────────
        {
          "type": "HeroBanner",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 148, "rowEnd": 188 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 129, "rowEnd": 166 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 120, "rowEnd": 157 }
          },
          "data": {
            "imageUrl": "https://picsum.photos/id/1015/1400/400",
            "title": "Exclusive Deals Unlocked",
            "subtitle": "Get the best prices on top electronics right now.",
            "altText": "Exclusive Banner"
          },
          "actions": {
            "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HERO_TAPPED" }
          }
        },

        // ── 9. SHARE BUTTON  (3 rows = 30px, centered) ───────────────────────
        {
          "type": "Header",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 191, "rowEnd": 196 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 168, "rowEnd": 172 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 159, "rowEnd": 163 }
          },
          "containerStyle": {
            "display": "flex",
            "justifyContent": "center",
            "alignItems": "center",
            "padding": "8px 0"
          },
          "children": [
            {
              "type": "ShareButton",
              "data": { "label": "Share CampusCommerce", "icon": "📤" },
              "actions": {
                "onTap": {
                  "type": "OPEN_BOTTOM_SHEET",
                  "data": {
                    "options": [
                      { "label": "WhatsApp", "icon": "💬", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_WA" } },
                      { "label": "Instagram", "icon": "📸", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_IG" } },
                      { "label": "Twitter", "icon": "🐦", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_TW" } },
                      { "label": "Copy Link", "icon": "🔗", "action": { "type": "COPY_TO_CLIPBOARD", "value": "https://campuscommerce.app" } }
                    ]
                  }
                }
              }
            }
          ]
        },

        // ── 10. SMALL PRODUCT CARDS (RESPONSIVE GRID) (100 rows = 1000px) ──────
        {
          "type": "Header",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 198, "rowEnd": 318 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 174, "rowEnd": 254 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 165, "rowEnd": 245 }
          },
          "containerStyle": {
            "display": "grid",
            "gridTemplateColumns": "repeat(auto-fill, minmax(150px, 1fr))",
            "gap": "12px",
            "padding": "12px",
            "backgroundColor": "#f8fafc",
            "alignContent": "start"
          },
          "children": [
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s1" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://picsum.photos/id/20/400/400", "altText": "Gas Stove" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.3" } }, { "type": "ReviewCount", "data": { "text": "84" } }] },
                { "type": "Title", "data": { "text": "BIGFLAME Power Hexa..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹6,632", "mrp": "₹12,800", "discount": "" } },
                { "type": "OfferText", "data": { "text": "₹6,512 with Bank offer" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s2" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://picsum.photos/id/10/400/400", "altText": "Men Cargos" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.1" } }, { "type": "ReviewCount", "data": { "text": "120" } }] },
                { "type": "Title", "data": { "text": "VeBNoR Men Cargos" } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹524", "mrp": "₹1,999", "discount": "" } },
                { "type": "OfferText", "data": { "text": "Special discount" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s3" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", "altText": "Shoes" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.5" } }, { "type": "ReviewCount", "data": { "text": "210" } }] },
                { "type": "Title", "data": { "text": "RED TAPE Lifestyle Bas..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹1,391", "mrp": "₹9,099", "discount": "" } },
                { "type": "OfferText", "data": { "text": "Limited time deal" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s4" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://picsum.photos/id/30/400/400", "altText": "T-Shirt" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.0" } }, { "type": "ReviewCount", "data": { "text": "56" } }] },
                { "type": "Title", "data": { "text": "visualvortex Yuji Ita..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹137", "mrp": "₹599", "discount": "" } },
                { "type": "OfferText", "data": { "text": "Trending now" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s5" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://picsum.photos/id/40/400/400", "altText": "Smart Watch" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.2" } }, { "type": "ReviewCount", "data": { "text": "340" } }] },
                { "type": "Title", "data": { "text": "Noise Pulse 2 Max..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹1,499", "mrp": "₹5,999", "discount": "" } },
                { "type": "OfferText", "data": { "text": "Lowest price ever" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s6" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://picsum.photos/id/50/400/400", "altText": "Backpack" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.6" } }, { "type": "ReviewCount", "data": { "text": "1.2k" } }] },
                { "type": "Title", "data": { "text": "Skybags 25L Laptop..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹899", "mrp": "₹2,100", "discount": "" } },
                { "type": "OfferText", "data": { "text": "Best seller" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s7" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://picsum.photos/id/60/400/400", "altText": "Headphones" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "4.4" } }, { "type": "ReviewCount", "data": { "text": "800" } }] },
                { "type": "Title", "data": { "text": "boAt Rockerz 450..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹1,299", "mrp": "₹3,990", "discount": "" } },
                { "type": "OfferText", "data": { "text": "Mega savings" } }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": { "width": "100%", "padding": "12px", "backgroundColor": "#fff", "borderRadius": "16px", "boxShadow": "0 8px 20px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)", "border": "1px solid #f1f5f9" },
              "data": { "id": "s8" },
              "children": [
                { "type": "Image", "containerStyle": { "height": "140px", "objectFit": "cover", "borderRadius": "6px" }, "data": { "imageUrl": "https://picsum.photos/id/70/400/400", "altText": "Sunglasses" } },
                { "type": "Rating", "children": [{ "type": "Score", "data": { "text": "3.9" } }, { "type": "ReviewCount", "data": { "text": "23" } }] },
                { "type": "Title", "data": { "text": "Fastrack UV Protect..." } },
                { "type": "PriceBlock", "data": { "sellingPrice": "₹599", "mrp": "₹999", "discount": "" } },
                { "type": "OfferText", "data": { "text": "Hot Deal" } }
              ]
            }
          ]
        },

        // ── 11. FOOTER  (19 rows = 190px) ────────────────────────────
        {
          "type": "Footer",
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 101, "rowStart": 320, "rowEnd": 360 },
            "tablet": { "colStart": 1, "colEnd": 101, "rowStart": 256, "rowEnd": 290 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 247, "rowEnd": 280 }
          },
          "data": {
            "sections": [
              {
                "title": "Get to Know Us",
                "links": [
                  { "label": "About CampusCommerce", "url": "https://example.com/about" },
                  { "label": "Careers", "url": "https://example.com/careers" },
                  { "label": "Press", "url": "https://example.com/press" },
                  { "label": "Sustainability", "url": "https://example.com/green" }
                ]
              },
              {
                "title": "Make Money With Us",
                "links": [
                  { "label": "Sell on Campus", "url": "https://example.com/sell" },
                  { "label": "Affiliate Program", "url": "https://example.com/affiliate" },
                  { "label": "Advertise", "url": "https://example.com/advertise" }
                ]
              },
              {
                "title": "Let Us Help You",
                "links": [
                  { "label": "Returns & Refunds", "url": "https://example.com/returns" },
                  { "label": "Track My Order", "url": "https://example.com/track" },
                  { "label": "Help Center", "url": "https://example.com/help" },
                  { "label": "Contact Us", "url": "https://example.com/contact" }
                ]
              },
              {
                "title": "Connect With Us",
                "links": [
                  { "label": "Instagram", "url": "https://instagram.com" },
                  { "label": "Twitter", "url": "https://twitter.com" },
                  { "label": "LinkedIn", "url": "https://linkedin.com" },
                  { "label": "YouTube", "url": "https://youtube.com" }
                ]
              }
            ],
            "copyrightText": "© 2024–2026 CampusCommerce, Inc. All rights reserved."
          }
        }

      ]
    },

    // ── NAVBAR  (sticky bottom, rendered outside the Page grid) ──────────────
    {
      "type": "NavBar",
      "containerStyle": {
        "position": "sticky",
        "bottom": "0",
        "zIndex": "100"
      },
      "data": {
        "items": [
          { "label": "Home", "icon": "🏠", "isActive": "true", "actions": { "onTap": { "type": "NAVIGATE", "route": "home", "actionName": "NAV_HOME" } } },
          { "label": "Categories", "icon": "🗂️", "isActive": "false", "actions": { "onTap": { "type": "NAVIGATE", "route": "categories", "actionName": "NAV_CATS" } } },
          { "label": "Cart", "icon": "🛒", "isActive": "false", "actions": { "onTap": { "type": "NAVIGATE", "route": "cart", "actionName": "NAV_CART" } } },
          { "label": "Account", "icon": "👤", "isActive": "false", "actions": { "onTap": { "type": "NAVIGATE", "route": "account", "actionName": "NAV_ACCOUNT" } } }
        ]
      }
    }

  ]
};  