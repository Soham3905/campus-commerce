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

        // ── 1. HEADER  (rows 1-7 D/T | 1-12 M) ──────────────────────────────
        {
          "type": "Header",
          "containerStyle": {
            "backgroundColor": "#131921",
            "padding": "10px 12px",
            "gap": "10px",
            "display": "flex",
            "flexWrap": "wrap",
            "alignItems": "center"
          },
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 1, "rowEnd": 12 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 1, "rowEnd": 7 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 1, "rowEnd": 7 }
          },
          "children": [
            {
              "type": "HeaderButton",
              "data": { "id": "location", "label": "India", "icon": "📍" },
              "actions": {
                "onTap": {
                  "type": "OPEN_BOTTOM_SHEET",
                  "data": {
                    "options": [
                      { "label": "Mumbai",    "icon": "🏙️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SET_LOC_MUM" } },
                      { "label": "Delhi",     "icon": "🏛️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SET_LOC_DEL" } },
                      { "label": "Bangalore", "icon": "🌆", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SET_LOC_BLR" } },
                      { "label": "Chennai",   "icon": "🌊", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SET_LOC_CHN" } }
                    ]
                  }
                }
              }
            },
            {
              "type": "SearchBar",
              "containerStyle": { "flex": "1", "minWidth": "0", "padding": "4px" },
              "data": { "placeholder": "Search campus, electronics, fashion, books..." },
              "actions": {
                "onChange": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "SEARCH_CHANGED",
                  "debounceDuration": 400
                },
                "onSubmit": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "SEARCH_SUBMITTED"
                },
                "onFocus": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "SEARCH_FOCUSED"
                },
                "onBlur": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "SEARCH_BLURRED"
                }
              }
            },
            {
              "type": "HeaderButton",
              "data": { "id": "wishlist", "label": "Wishlist", "icon": "❤️" },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "OPEN_WISHLIST"
                }
              }
            },
            {
              "type": "HeaderButton",
              "data": { "id": "cart", "label": "Cart", "icon": "🛒" },
              "actions": {
                "onTap": { "type": "NAVIGATE", "route": "cart", "actionName": "OPEN_CART" }
              }
            },
            {
              "type": "HeaderButton",
              "data": { "id": "account", "label": "Account", "icon": "👤" },
              "actions": {
                "onTap": { "type": "NAVIGATE", "route": "account", "actionName": "OPEN_ACCOUNT" }
              }
            }
          ]
        },

        // ── 2. CATEGORY GRID  (rows 7-15 D/T | 12-20 M) ─────────────────────
        {
          "type": "CategoryGrid",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 12, "rowEnd": 20 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 7,  "rowEnd": 15 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 7,  "rowEnd": 15 }
          },
          "children": [
            { "type": "CategoryItem", "data": { "label": "Mobiles",  "icon": "📱" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_MOBILES"  } } },
            { "type": "CategoryItem", "data": { "label": "Fashion",  "icon": "👗" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_FASHION"  } } },
            { "type": "CategoryItem", "data": { "label": "Laptops",  "icon": "💻" }, "actions": { "onTap": { "type": "NAVIGATE", "route": "categories", "actionName": "CAT_LAPTOPS" } } },
            { "type": "CategoryItem", "data": { "label": "Home",     "icon": "🏠" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_HOME"     } } },
            { "type": "CategoryItem", "data": { "label": "Sports",   "icon": "⚽" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_SPORTS"   } } },
            { "type": "CategoryItem", "data": { "label": "Books",    "icon": "📚" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_BOOKS"    } } },
            { "type": "CategoryItem", "data": { "label": "Beauty",   "icon": "💄" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_BEAUTY"   } } },
            { "type": "CategoryItem", "data": { "label": "Kitchen",  "icon": "🍳" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_KITCHEN"  } } },
            { "type": "CategoryItem", "data": { "label": "Travel",   "icon": "✈️" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_TRAVEL"   } } },
            { "type": "CategoryItem", "data": { "label": "Toys",     "icon": "🧸" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CAT_TOYS"     } } }
          ]
        },

        // ── 3. STORY ROW  (rows 15-25 D/T | 20-30 M) ────────────────────────
        {
          "type": "StoryRow",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 20, "rowEnd": 30 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 15, "rowEnd": 25 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 15, "rowEnd": 25 }
          },
          "children": [
            { "type": "StoryCircle", "data": { "label": "Flash 🔥",  "imageUrl": "https://picsum.photos/id/1025/80/80" }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_FLASH"    }, "onDrag": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "DRAG_FLASH" } } },
            { "type": "StoryCircle", "data": { "label": "Trending",  "imageUrl": "https://picsum.photos/id/28/80/80"   }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_TRENDING" } } },
            { "type": "StoryCircle", "data": { "label": "New In",    "imageUrl": "https://picsum.photos/id/3/80/80"    }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_NEWIN"    } } },
            { "type": "StoryCircle", "data": { "label": "Tech",      "imageUrl": "https://picsum.photos/id/0/80/80"    }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_TECH"     } } },
            { "type": "StoryCircle", "data": { "label": "Shoes",     "imageUrl": "https://picsum.photos/id/21/80/80"   }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_SHOES"    } } },
            { "type": "StoryCircle", "data": { "label": "Bags",      "imageUrl": "https://picsum.photos/id/192/80/80"  }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_BAGS"     } } },
            { "type": "StoryCircle", "data": { "label": "Watches",   "imageUrl": "https://picsum.photos/id/175/80/80"  }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_WATCHES"  } } },
            { "type": "StoryCircle", "data": { "label": "Luxury",    "imageUrl": "https://picsum.photos/id/104/80/80"  }, "actions": { "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "STORY_LUXURY"   } } }
          ]
        },

        // ── 4. HERO BANNER  (40 rows = 400px — matches hardcoded img height) ─
        {
          "type": "HeroBanner",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 30, "rowEnd": 70 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 25, "rowEnd": 65 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 25, "rowEnd": 65 }
          },
          "data": {
            "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
            "title": "Great Indian Festival — Up to 70% Off",
            "subtitle": "Electronics · Fashion · Home. Shop the biggest sale of the year.",
            "altText": "Great Indian Festival Sale Banner"
          },
          "actions": {
            "onTap":   { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HERO_TAPPED" },
            "onError": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HERO_IMG_ERROR" }
          }
        },

        // ── 5. COUPON CODE  (9 rows = 90px) ──────────────────────────────────
        {
          "type": "CouponCode",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 70, "rowEnd": 79 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 65, "rowEnd": 74 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 65, "rowEnd": 74 }
          },
          "data": {
            "title": "💳 Bank Exclusive Offer",
            "description": "Flat ₹500 OFF on orders above ₹1,999 · Use code CAMPUS500 at checkout",
            "copyLabel": "Copy Code"
          },
          "actions": {
            "onCopy": { "type": "COPY_TO_CLIPBOARD", "value": "CAMPUS500" }
          }
        },

        // ── 6. COUNTDOWN TIMER  (10 rows = 100px) ────────────────────────────
        {
          "type": "CountDownTimer",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 79, "rowEnd": 89 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 74, "rowEnd": 84 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 74, "rowEnd": 84 }
          },
          "data": {
            "label": "⚡ Flash Sale Ends In",
            "expiredText": "Sale is over — check new deals!",
            "targetDate": "2026-12-31T23:59:59",
            "showDays": "true"
          },
          "actions": {
            "onExpire": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "TIMER_EXPIRED"
            }
          }
        },

        // ── 7. PRODUCT LIST #1 — Top Deals Today  (45 rows = 450px) ──────────
        {
          "type": "ProductList",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 89,  "rowEnd": 134 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 84,  "rowEnd": 129 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 84,  "rowEnd": 129 }
          },
          "actions": {
            "onScroll":     { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "RAIL1_SCROLLED",  "debounceDuration": 600 },
            "onEndReached": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "RAIL1_LOAD_MORE", "nearEndThreshold": 80  }
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
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P1"    } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P1"  } },
                      { "label": "Share",           "icon": "📤", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_P1" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",  "altText": "Nike Air Zoom Pegasus 40" } },
                { "type": "Label",        "children": [{ "type": "Sponsored", "data": { "text": "Bestseller" } }, { "type": "Icon", "data": { "imageUrl": "", "altText": "info" } }] },
                { "type": "Title",        "data": { "text": "Nike Air Zoom Pegasus 40" } },
                { "type": "Description",  "data": { "text": "ReactX foam cushioning for daily training — responsive, lightweight and true-to-size.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.7", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "18,540" } }] },
                { "type": "Badge",        "data": { "text": "🔥 Deal of the Day" } },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹8,499",  "mrp": "₹12,999", "discount": "35%" } },
                { "type": "OfferText",    "data": { "text": "Extra 5% off with SBI card" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 2 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
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
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P2"      } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P2"    } },
                      { "label": "Compare",         "icon": "⚖️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "COMPARE_P2" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", "altText": "Sony WF-1000XM5 Earbuds" } },
                { "type": "Title",        "data": { "text": "Sony WF-1000XM5 Earbuds" } },
                { "type": "Description",  "data": { "text": "Industry-leading ANC, 24-hr battery, DSEE Extreme upscaling & Precise Voice Pickup.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.8", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "9,120" } }] },
                { "type": "Badge",        "containerStyle": { "backgroundColor": "#7c3aed" }, "data": { "text": "Amazon's Choice" } },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹14,990", "mrp": "₹22,990", "discount": "35%" } },
                { "type": "OfferText",    "data": { "text": "No-cost EMI from ₹1,250/mo" } },
                { "type": "DeliveryInfo", "data": { "prefix": "Get it Tomorrow —", "daysOffset": 1 } },
                { "type": "Button",       "data": { "label": "Buy Now" } }
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
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P3"   } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P3" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", "altText": "Apple Watch Series 9 GPS" } },
                { "type": "Label",        "children": [{ "type": "Sponsored", "data": { "text": "Sponsored" } }, { "type": "Icon", "data": { "imageUrl": "", "altText": "info" } }] },
                { "type": "Title",        "data": { "text": "Apple Watch Series 9 GPS" } },
                { "type": "Description",  "data": { "text": "S9 chip, brighter Always-On display, Double Tap gesture & Carbon Neutral certified.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.6", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "7,390" } }] },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹38,900", "mrp": "₹44,900", "discount": "13%" } },
                { "type": "OfferText",    "data": { "text": "Exchange: save ₹3,000 on old watch" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 3 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
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
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P4"   } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P4" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=80", "altText": "Samsung Galaxy Tab S9 FE" } },
                { "type": "Title",        "data": { "text": "Samsung Galaxy Tab S9 FE" } },
                { "type": "Description",  "data": { "text": "10.9\" WUXGA, 8000mAh, IP68 water-resistant, S Pen included, Wi-Fi + LTE.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.5", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "5,810" } }] },
                { "type": "Badge",        "containerStyle": { "backgroundColor": "#0284c7" }, "data": { "text": "New Launch" } },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹34,999", "mrp": "₹46,999", "discount": "26%" } },
                { "type": "OfferText",    "data": { "text": "10% cashback with HDFC card" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 2 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
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
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P5"    } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P5"  } },
                      { "label": "Share",           "icon": "📤", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_P5" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", "altText": "boAt Rockerz 550 Over-Ear" } },
                { "type": "Label",        "children": [{ "type": "Sponsored", "data": { "text": "Limited Time" } }] },
                { "type": "Title",        "data": { "text": "boAt Rockerz 550 Over-Ear" } },
                { "type": "Description",  "data": { "text": "60-hr battery, Bluetooth 5.0, foldable design & ASAP Charge for nonstop music.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.3", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "41,680" } }] },
                { "type": "Badge",        "containerStyle": { "backgroundColor": "#dc2626" }, "data": { "text": "#1 Bestseller" } },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹1,499",  "mrp": "₹3,990",  "discount": "62%" } },
                { "type": "OfferText",    "data": { "text": "Buy 2, get extra 15% off" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 3 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
              ]
            }
          ]
        },

        // ── 8. PRODUCT LIST #2 — Tech Picks  (45 rows = 450px) ───────────────
        {
          "type": "ProductList",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 134, "rowEnd": 179 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 129, "rowEnd": 174 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 129, "rowEnd": 174 }
          },
          "actions": {
            "onScroll":     { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "RAIL2_SCROLLED",  "debounceDuration": 600 },
            "onEndReached": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "RAIL2_LOAD_MORE", "nearEndThreshold": 80  }
          },
          "children": [
            {
              "type": "ProductCard",
              "data": { "id": "p6" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P6" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P6"   } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P6" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", "altText": "Apple iPad Air M2 11-inch" } },
                { "type": "Title",        "data": { "text": "Apple iPad Air 11\" (M2, 2024)" } },
                { "type": "Description",  "data": { "text": "Liquid Retina display, M2 chip, 5G, USB-C & Apple Pencil Pro compatible.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.8", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "6,450" } }] },
                { "type": "Badge",        "containerStyle": { "backgroundColor": "#059669" }, "data": { "text": "Top Pick" } },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹59,900", "mrp": "₹69,900", "discount": "14%" } },
                { "type": "OfferText",    "data": { "text": "Student education pricing available" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 2 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p7" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P7" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P7"   } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P7" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", "altText": "Dell XPS 13 Ultra Laptop" } },
                { "type": "Label",        "children": [{ "type": "Sponsored", "data": { "text": "Sponsored" } }, { "type": "Icon", "data": { "imageUrl": "", "altText": "info" } }] },
                { "type": "Title",        "data": { "text": "Dell XPS 13 Ultra Laptop" } },
                { "type": "Description",  "data": { "text": "Intel Core Ultra 7, 16GB LPDDR5X, 512GB SSD, 13.4\" InfinityEdge touch display.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.6", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "2,880" } }] },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹1,19,990", "mrp": "₹1,49,990", "discount": "20%" } },
                { "type": "OfferText",    "data": { "text": "No-cost EMI from ₹9,999/mo" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 4 } },
                { "type": "Button",       "data": { "label": "Buy Now" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p8" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P8" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P8"    } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P8"  } },
                      { "label": "Share",           "icon": "📤", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_P8" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", "altText": "JBL Flip 6 Portable Speaker" } },
                { "type": "Title",        "data": { "text": "JBL Flip 6 Portable Speaker" } },
                { "type": "Description",  "data": { "text": "12-hr playtime, IP67 waterproof, bold JBL Pro Sound & PartyBoost compatible.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.5", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "24,310" } }] },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹9,999",  "mrp": "₹13,999", "discount": "29%" } },
                { "type": "OfferText",    "data": { "text": "Combo offer: buy 2 for ₹17,999" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 2 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p9" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P9" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P9"   } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P9" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80", "altText": "Kindle Paperwhite Signature Edition" } },
                { "type": "Title",        "data": { "text": "Kindle Paperwhite Signature Ed." } },
                { "type": "Description",  "data": { "text": "32GB, 6.8\" display, wireless charging, auto-adjusting front light, no ads.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.7", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "15,620" } }] },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹16,999", "mrp": "₹21,999", "discount": "23%" } },
                { "type": "OfferText",    "data": { "text": "3 months Kindle Unlimited free" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 2 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
              ]
            },
            {
              "type": "ProductCard",
              "data": { "id": "p10" },
              "actions": {
                "onHover": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "HOVER_P10" },
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick Actions",
                    "options": [
                      { "label": "Add to Wishlist", "icon": "❤️", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "WL_P10"   } },
                      { "label": "Add to Cart",     "icon": "🛒", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "CART_P10" } }
                    ]
                  }
                }
              },
              "children": [
                { "type": "Image",        "data": { "imageUrl": "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400&q=80", "altText": "Xiaomi 43-inch 4K Smart TV" } },
                { "type": "Title",        "data": { "text": "Xiaomi 43\" 4K Smart Google TV" } },
                { "type": "Description",  "data": { "text": "4K UHD, Dolby Vision, 30W Dolby Atmos speakers, Google TV OS & Chromecast built-in.", "maxLines": 2 } },
                { "type": "Rating",       "children": [{ "type": "Score", "data": { "text": "4.4", "out of": "5" } }, { "type": "ReviewCount", "data": { "text": "33,450" } }] },
                { "type": "Badge",        "containerStyle": { "backgroundColor": "#f59e0b" }, "data": { "text": "Value Pick" } },
                { "type": "PriceBlock",   "data": { "sellingPrice": "₹24,999", "mrp": "₹39,999", "discount": "38%" } },
                { "type": "OfferText",    "data": { "text": "Free wall mount installation" } },
                { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 5 } },
                { "type": "Button",       "data": { "label": "Add to Cart" } }
              ]
            }
          ]
        },

        // ── 9. SHARE BUTTON  (3 rows = 30px, centered) ───────────────────────
        {
          "type": "ShareButton",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 179, "rowEnd": 182 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 174, "rowEnd": 177 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 174, "rowEnd": 177 }
          },
          "data": { "label": "Share CampusCommerce", "icon": "📤" },
          "actions": {
            "onTap": {
              "type": "OPEN_BOTTOM_SHEET",
              "data": {
                "options": [
                  { "label": "WhatsApp",  "icon": "💬", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_WA" } },
                  { "label": "Instagram", "icon": "📸", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_IG" } },
                  { "label": "Twitter",   "icon": "🐦", "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "SHARE_TW" } },
                  { "label": "Copy Link", "icon": "🔗", "action": { "type": "COPY_TO_CLIPBOARD", "value": "https://campuscommerce.app"                                        } }
                ]
              }
            }
          }
        },

        // ── 10. FOOTER  (24 rows D/T | 19 rows M) ────────────────────────────
        {
          "type": "Footer",
          "placement": {
            "mobile":  { "colStart": 1, "colEnd": 101, "rowStart": 182, "rowEnd": 201 },
            "tablet":  { "colStart": 1, "colEnd": 101, "rowStart": 177, "rowEnd": 201 },
            "desktop": { "colStart": 1, "colEnd": 101, "rowStart": 177, "rowEnd": 201 }
          },
          "data": {
            "sections": [
              {
                "title": "Get to Know Us",
                "links": [
                  { "label": "About CampusCommerce", "url": "https://example.com/about"    },
                  { "label": "Careers",              "url": "https://example.com/careers"  },
                  { "label": "Press",                "url": "https://example.com/press"    },
                  { "label": "Sustainability",       "url": "https://example.com/green"    }
                ]
              },
              {
                "title": "Make Money With Us",
                "links": [
                  { "label": "Sell on Campus",    "url": "https://example.com/sell"      },
                  { "label": "Affiliate Program", "url": "https://example.com/affiliate" },
                  { "label": "Advertise",         "url": "https://example.com/advertise" }
                ]
              },
              {
                "title": "Let Us Help You",
                "links": [
                  { "label": "Returns & Refunds", "url": "https://example.com/returns" },
                  { "label": "Track My Order",    "url": "https://example.com/track"   },
                  { "label": "Help Center",       "url": "https://example.com/help"    },
                  { "label": "Contact Us",        "url": "https://example.com/contact" }
                ]
              },
              {
                "title": "Connect With Us",
                "links": [
                  { "label": "Instagram", "url": "https://instagram.com" },
                  { "label": "Twitter",   "url": "https://twitter.com"   },
                  { "label": "LinkedIn",  "url": "https://linkedin.com"  },
                  { "label": "YouTube",   "url": "https://youtube.com"   }
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
          { "label": "Home",       "icon": "🏠", "isActive": "true",  "actions": { "onTap": { "type": "NAVIGATE", "route": "home",       "actionName": "NAV_HOME"    } } },
          { "label": "Categories", "icon": "🗂️", "isActive": "false", "actions": { "onTap": { "type": "NAVIGATE", "route": "categories", "actionName": "NAV_CATS"    } } },
          { "label": "Cart",       "icon": "🛒", "isActive": "false", "actions": { "onTap": { "type": "NAVIGATE", "route": "cart",       "actionName": "NAV_CART"    } } },
          { "label": "Account",    "icon": "👤", "isActive": "false", "actions": { "onTap": { "type": "NAVIGATE", "route": "account",    "actionName": "NAV_ACCOUNT" } } }
        ]
      }
    }

  ]
};