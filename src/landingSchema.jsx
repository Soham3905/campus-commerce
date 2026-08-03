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
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 8 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 8 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 1, "rowEnd": 8 }
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
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 9, "rowEnd": 28 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 9, "rowEnd": 28 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 9, "rowEnd": 28 }
      },
      "data": {
        "showDots": true,
        "autoPlay": true,
        "autoPLayInterval": 3000,
        "infiniteLoop": true
      },
      "children": [
        {
          "type": "Image",
          "containerStyle": {},
          "data": { "imageUrl": "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg", "altText": "Ad 1" }
        },
        {
          "type": "Image",
          "containerStyle": {},
          "data": { "imageUrl": "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg", "altText": "Ad 2" }
        }
      ]
    },
    {
      "type": "ProductList",
      "containerStyle": {},
      "placement": {
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 29, "rowEnd": 68 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 29, "rowEnd": 68 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 29, "rowEnd": 68 }
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
            "onHover": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "PRODUCT_HOVER_ANALYTICS"
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
            { "type": "Badge", "containerStyle": {}, "data": { "text": "Limited Time Offer" } },
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
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 75, "rowEnd": 100 },
        "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 75, "rowEnd": 100 },
        "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 75, "rowEnd": 100 }
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
        "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 84, "rowEnd": 100 },
        "tablet": { "colStart": 20, "colEnd": 80, "rowStart": 84, "rowEnd": 100 },
        "desktop": { "colStart": 20, "colEnd": 80, "rowStart": 84, "rowEnd": 100 }
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
    }
  ]
}