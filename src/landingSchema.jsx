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
        "mobile": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 1,
          "rowEnd": 8
        },
        "tablet": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 1,
          "rowEnd": 8
        },
        "desktop": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 1,
          "rowEnd": 8
        }
      },
      "children": [
        {
          "type": "HeaderButton",
          "data": {
            "id": "cart",
            "label": "Cart",
            "icon": "🛒"
          },
        },
        {
          "type": "HeaderButton",
          "data": {
            "id": "wishlist",
            "label": "Wishlist",
            "icon": "❤️",
          },
        },
        {
          "type": "HeaderButton",
          "data": {
            "id": "favourites",
            "label": "Favourites",
            "icon": "⭐",
          },
        }
      ]
    },
    {
      "type": "Carousel",
      "containerStyle": {},
      "placement": {
        "mobile": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 9,
          "rowEnd": 28
        },
        "tablet": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 9,
          "rowEnd": 28
        },
        "desktop": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 9,
          "rowEnd": 28
        }
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
          "data": {
            "imageUrl": "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
            "altText": "Ad 1"
          }
        },
        {
          "type": "Image",
          "containerStyle": {},
          "data": {
            "imageUrl": "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg",
            "altText": "Ad 2"
          }
        }
      ]
    },
    {
      "type": "ProductList",
      "containerStyle": {},
      "placement": {
        "mobile": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 29,
          "rowEnd": 68
        },
        "tablet": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 29,
          "rowEnd": 68
        },
        "desktop": {
          "colStart": 1,
          "colEnd": 100,
          "rowStart": 29,
          "rowEnd": 68
        }
      },
      "children": [
        {
          "type": "ProductCard",
          "data": {
            "id": "serenelife-001",
          },
          "actions": {
            "onLongPress": {
              "type": "SHOW_CONTEXT_MENU",
              "data": {
                "title": "Quick Actions",
                "options": [
                  {
                    "label": "Add to Wishlist",
                    "icon": "❤️",
                    "action": {
                      "type": "API_CALL",
                      "actionName": "ADD_TO_WISHLIST",
                      "endpoint": "http://localhost:4000/api/action",
                      "method": "POST",
                      "payload": [
                        {
                          "requestConfig": [
                            {
                              "requestKeyName": "productId",
                              "getValueFrom": "componentData",
                              "getValueFromKey": "id",
                              "type": "string"
                            },
                            {
                              "requestKeyName": "quantity",
                              "getValueFrom": "static",
                              "value": 1,
                              "type": "Number",
                            }
                          ]
                        }
                      ]
                    }
                  },
                  {
                    "label": "Add to Cart",
                    "icon": "🛒",
                    "action": {
                      "type": "API_CALL",
                      "actionName": "ADD_TO_CART",
                      "endpoint": "http://localhost:4000/api/action",
                      "method": "POST",
                      "payload": [
                        {
                          "requestConfig": [
                            {
                              "requestKeyName": "productId",
                              "getValueFrom": "componentData",
                              "getValueFromKey": "id",
                              "type": "string"
                            },
                            {
                              "requestKeyName": "quantity",
                              "getValueFrom": "redux",
                              "getValueFromKey": "cartCount",
                              // "value" : 1,
                              "type": "Number",
                            }
                          ]
                        }
                      ]
                    }
                  },
                  {
                    "label": "Add to Favourite",
                    "icon": "⭐",
                    "action": {
                      "type": "API_CALL",
                      "actionName": "ADD_TO_FAVOURITE",
                      "endpoint": "http://localhost:4000/api/action",
                      "method": "POST",
                      "payload": [
                        {
                          "requestConfig": [
                            {
                              "requestKeyName": "productId",
                              "getValueFrom": "componentData",
                              "getValueFromKey": "id",
                              "type": "string"
                            },
                            {
                              "requestKeyName": "currentCount",
                              "getValueFrom": "express",
                              "getValueFromKey": "favouritesCount",
                              "type": "Number"
                            }
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            }
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
                {
                  "type": "Sponsored",
                  "data": {
                    "text": "Sponsored"
                  }
                },
                {
                  "type": "Icon",
                  "data": {
                    "imageUrl": "",
                    "altText": "Info Icon"
                  }
                }
              ]
            },
            {
              "type": "Title",
              "data": {
                "text": "SereneLife"
              },
            },
            {
              "type": "Description",
              "data": {
                "text": "SereneLife Small Compact Folding Shopping Cart with Removable Waterproof Liner – 360° Swivel Wheels, Rust‑Proof Steel Frame, 70 lb Capacity – Portable Grocery, Laundry & Travel Cart (Blue)"
              }
            },
            {
              "type": "Rating",
              "children": [
                {
                  "type": "Score",
                  "data": {
                    "text": "4.4",
                    "out of": "5"
                  }
                },
                {
                  "type": "ReviewCount",
                  "data": {
                    "text": "376"
                  }
                }
              ]
            },
            {
              "type": "Badge",
              "containerStyle": {
              },
              "data": {
                "text": "Limited Time Offer"
              }
            },
            {
              "type": "PriceBlock",
              "data": {
                "sellingPrice": "₹7,089",
                "mrp": "₹12,250",
                "discount": "42%"
              }
            },
            {
              "type": "OfferText",
              "data": {
                "text": "Up to 5% back with Amazon Pay ICICI card"
              }
            },
            {
              "type": "DeliveryInfo",
              "data": {
                "prefix": "FREE delivery",
                "daysOffset": 7
              }
            },
            {
              "type": "Button",
              "data": {
                "label": "Add to Cart"
              }
            }
          ]
        }
      ]
    }
  ]
}