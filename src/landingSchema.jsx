export const fullPageJSON = {
  "type": "Page",
  "containerStyle": {},
  "statusCode": 200,
  "statusMessage": "Success",
  "actions": {},
  "children": [
    {
      "type": "Header",
      "containerStyle": {},
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 7 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 7 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 7 }
      },
      "children": [
        { "type": "HeaderButton", "data": { "id": "cart", "label": "Cart", "icon": "🛒" } },
        { "type": "HeaderButton", "data": { "id": "wishlist", "label": "Wishlist", "icon": "❤️" } },
        { "type": "HeaderButton", "data": { "id": "favourites", "label": "Favourites", "icon": "⭐" } }
      ]
    },
    {
      "type": "Carousel",
      "containerStyle": {},
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 27, "rowEnd": 47 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 27, "rowEnd": 47 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 27, "rowEnd": 47 }
      },
      "data": {
        "showDots": true,
        "autoPlay": false,
        "autoPlayInterval": 3000,
        "infiniteLoop": true
      },
      "actions": {
        "onSwipeLeft": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "CAROUSEL_SWIPE_LEFT"
        },
        "onSwipeRight": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "CAROUSEL_SWIPE_RIGHT"
        }
      },
      "children": [
        {
          "type": "Image",
          "containerStyle": {
            "borderRadius": "24px",
            "width": "400px",
            "display": "block",
            "margin": "0 auto",
            "objectFit": "cover"
          },
          "data": { "imageUrl": "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg", "altText": "Ad 1" }
        },
        {
          "type": "Image",
          "containerStyle": {
            "borderRadius": "24px",
            "objectFit": "cover"
          },
          "data": { "imageUrl": "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg", "altText": "Ad 2" }
        }
      ]
    },
    {
      "type": "ProductList",
      "containerStyle": {},
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 89, "rowEnd": 140 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 89, "rowEnd": 140 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 89, "rowEnd": 140 }
      },
      "actions": {
        "onScroll": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_SCROLL_PRODUCT"
        },
        "onEndReached": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "LOAD_MORE_PRODUCTS"
        }
      },
      "children": [
        {
          "type": "ProductCard",
          "data": { "id": "serenelife-001" },
          "actions": {
            "onLongPress": {
              "type": "SHOW_CONTEXT_MENU",
              "data": {
                "title": "Quick Actions",
                "options": [
                  {
                    "label": "Add to Wishlist",
                    "icon": "❤️",
                    "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "ADD_TO_WISHLIST" }
                  },
                  {
                    "label": "Add to Cart",
                    "icon": "🛒",
                    "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "ADD_TO_CART" }
                  },
                  {
                    "label": "Add to Favourite",
                    "icon": "⭐",
                    "action": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "ADD_TO_FAVOURITE" }
                  }
                ]
              }
            },
          },
          "children": [
            {
              "type": "Image",
              "data": {
                "imageUrl": "https://m.media-amazon.com/images/I/816r5iLd4LL._AC_UL480_FMwebp_QL65_.jpg",
                "altText": "Image of SereneLife"
              }
            },
            {
              "type": "Label",
              "children": [
                { "type": "Sponsored", "data": { "text": "Sponsored" } },
                { "type": "Icon", "data": { "imageUrl": "", "altText": "Info Icon" } }
              ]
            },
            { "type": "Title", "data": { "text": "SereneLife" } },
            {
              "type": "Description",
              "data": { "text": "SereneLife Small Compact Folding Shopping Cart with Removable Waterproof Liner – 360° Swivel Wheels, Rust‑Proof Steel Frame, 70 lb Capacity – Portable Grocery, Laundry & Travel Cart (Blue)" }
            },
            {
              "type": "Rating",
              "children": [
                { "type": "Score", "data": { "text": "4.4", "out of": "5" } },
                { "type": "ReviewCount", "data": { "text": "376" } }
              ]
            },
            { "type": "Badge", "containerStyle": { "backgroundColor": "#fbbf24" }, "data": { "text": "Limited Time Offer" } },
            { "type": "PriceBlock", "data": { "sellingPrice": "₹7,089", "mrp": "₹12,250", "discount": "42%" } },
            { "type": "OfferText", "data": { "text": "Up to 5% back with Amazon Pay ICICI card" } },
            { "type": "DeliveryInfo", "data": { "prefix": "FREE delivery", "daysOffset": 7 } },
            { "type": "Button", "data": { "label": "Add to Cart" } }
          ]
        }
      ]
    },
    {
      "type": "CategoryGrid",
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 16, "rowEnd": 26 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 16, "rowEnd": 26 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 16, "rowEnd": 26 }
      },
      "children": [
        {
          "type": "CategoryItem",
          "data": {
            "label": "Mobiles",
            "icon": "📱"
          },
          "actions": {
            "onTap": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_TAP_MOBILE"
            },
          }
        },
        {
          "type": "CategoryItem",
          "data": {
            "label": "Fashion",
            "icon": "👕",
          },
          "actions": {
            "onTap": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_TAP_FASHION"
            },
          }
        },
        {
          "type": "CategoryItem",
          "data": { "label": "Laptops", "icon": "💻" },
          "actions": {
            "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "ON_TAP_LAPTOPS" }
          }
        },
        {
          "type": "CategoryItem",
          "data": { "label": "Home", "icon": "🏠" },
          "actions": {
            "onTap": { "type": "API_CALL", "endpoint": "https://jsonplaceholder.typicode.com/todos/1", "actionName": "ON_TAP_HOME" }
          }
        }
      ]
    },
    {
      "type": "SearchBar",
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 8, "rowEnd": 15 },
        "tablet": { "colStart": 20, "colEnd": 80, "rowStart": 8, "rowEnd": 15 },
        "desktop": { "colStart": 20, "colEnd": 80, "rowStart": 8, "rowEnd": 15 }
      },
      "data": {
        "placeholder": "Search for electronics, clothes...",
      },
      "actions": {
        "onChange": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_CHANGE_SEARCH"
        },
        "onSubmit": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_SUBMIT_SEARCH"
        },
        "onFocus": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_FOCUS_SEARCH"
        },
        "onBlur": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_BLUR_SEARCH"
        }
      }
    },
    {
      "type": "HeroBanner",
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 48, "rowEnd": 88 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 48, "rowEnd": 88 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 48, "rowEnd": 88 }
      },
      "data": {
        "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
        "title": "Season End Sale",
        "subtitle": "Get up to 70% off on all electronics!",
        "altText": "Summer Sale Banner"
      },
      "actions": {
        "onMount": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_MOUNT_HERO_BANNER"
        },
        "onError": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_ERROR_HERO_BANNER"
        }
      },
      "children": [
        {
          "type": "CountDownTimer",
          "containerStyle": {
            "width": "300px",
            "background": "linear-gradient(transparent, rgba(0,0,0,0.8))",
            "border": "none",
            "color": "#fff",
            "textAlign": "left"
          },
          "data": {
            "label": "Flash Sale Ends In",
            "expiredText": "Offer Expired",
            "targetDate": "2026-08-12T01:30:00",
            "showDays": "true",
            "format": "DD:HH:MM:SS"
          },
          "actions": {
            "onHover": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "PRODUCT_HOVER_ANALYTICS"
            },
          }
        }
      ]
    },
    {
      "type": "CountDownTimer",
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 80, "rowStart": 140, "rowEnd": 150 },
        "tablet": { "colStart": 1, "colEnd": 30, "rowStart": 140, "rowEnd": 150 },
        "desktop": { "colStart": 1, "colEnd": 30, "rowStart": 140, "rowEnd": 150 }
      },
      "data": {
        "label": "Flash Sale Ends In",
        "expiredText": "Offer Expired",
        "targetDate": "2026-08-10T01:09:00",
        "showDays": "true",
        "format": "DD:HH:MM:SS"
      },
      "actions": {
        "onExpire": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "FLASH_SALE_ENDED"
        }
      }
    },
    {
      "type": "CouponCode",
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 151, "rowEnd": 160 },
        "tablet": { "colStart": 1, "colEnd": 30, "rowStart": 151, "rowEnd": 160 },
        "desktop": { "colStart": 1, "colEnd": 30, "rowStart": 151, "rowEnd": 160 }
      },
      "data": {
        "title": "Special Offer",
        "coupon": "SAVE20",
        "description": "Get 20% OFF on orders above ₹999",
        "copyLabel": "Copy Code"
      },
      "actions": {
        "onCopy": {
          "type": "COPY_TO_CLIPBOARD",
          "value": "SAVE20"
        }
      }
    },
    {
      "type": "StoryRow",
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 165, "rowEnd": 175 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 165, "rowEnd": 175 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 165, "rowEnd": 175 }
      },
      "actions": {
        "onDrop": {
          "type": "API_CALL",
          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
          "actionName": "ON_DROP_STORY"
        }
      },
      "children": [
        {
          "type": "StoryCircle",
          "data": {
            "label": "Sale",
            "imageUrl": "https://picsum.photos/id/2/100/100"
          },
          "actions": {
            "onDrag": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_DRAG_STORY"
            }
          }
        },
        {
          "type": "StoryCircle",
          "data": {
            "label": "Trending",
            "imageUrl": "https://picsum.photos/id/3/100/100"
          }
        },
        {
          "type": "StoryCircle",
          "data": {
            "label": "Electronics",
            "imageUrl": "https://picsum.photos/id/4/100/100"
          }
        }
      ]
    },
    {
      "type": "ShareButton",
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 180, "rowEnd": 185 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 180, "rowEnd": 185 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 180, "rowEnd": 185 }
      },
      "data": {
        "label": "Share",
        "icon": "📤"
      },
      "actions": {
        "onTap": {
          "type": "OPEN_BOTTOM_SHEET",
          "data": {
            "options": [
              {
                "label": "WhatsApp",
                "icon": "💬",
                "action": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_SHARE_WHATSAPP"
                }
              },
              {
                "label": "Instagram",
                "icon": "📸",
                "action": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_SHARE_INSTAGRAM"
                }
              },
              { "label": "Twitter", "icon": "🐦" },
              { "label": "Copy Link", "icon": "🔗" }
            ]
          }
        }
      }
    }
  ]
}