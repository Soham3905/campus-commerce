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
  "containerStyle": {
    "background": "linear-gradient(180deg, #F6F6F4 0%, #F6F6F4 100%)",
    "backgroundImage": "linear-gradient(180deg, #F6F6F4 0%, #F6F6F4 100%)",
    "backgroundColor": "#F6F6F4",
    "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "color": "#101F26",
    "display": "flex",
    "flexDirection": "column",
    "minHeight": "100vh",
    "width": "100%",
    "maxWidth": "100%",
    "margin": "0",
    "boxSizing": "border-box",
    "overflowX": "hidden",
    "WebkitFontSmoothing": "antialiased",
    "letterSpacing": "-0.005em",
    "accentColor": "#C4185F"
  },
  "statusCode": 200,
  "statusMessage": "Success",
  "actions": {},
  "children": [
    {
      "type": "Page",
      "containerStyle": {
        "background": "linear-gradient(180deg, #F6F6F4 0%, #F6F6F4 100%)",
        "backgroundImage": "linear-gradient(180deg, #F6F6F4 0%, #F6F6F4 100%)",
        "backgroundColor": "#F6F6F4",
        "display": "grid",
        "gridTemplateColumns": "repeat(99, minmax(0, 1fr))",
        "gridTemplateRows": "none",
        "gridAutoRows": "minmax(0, auto)",
        "gridAutoFlow": "row",
        "alignItems": "start",
        "alignContent": "start",
        "columnGap": "0px",
        "rowGap": "0px",
        "flex": "1 1 auto",
        "width": "100%",
        "maxWidth": "100%",
        "minWidth": "0",
        "boxSizing": "border-box",
        "padding": "0px",
        "overflowX": "hidden"
      },
      "children": [
        {
          "type": "Header",
          "containerStyle": {
            "background": "linear-gradient(180deg, #11404C 0%, #0D3540 100%)",
            "backgroundImage": "linear-gradient(180deg, #11404C 0%, #0D3540 100%)",
            "backgroundColor": "#0D3540",
            "display": "flex",
            "flexDirection": "row",
            "flexWrap": "nowrap",
            "alignItems": "center",
            "justifyContent": "flex-start",
            "gap": "0",
            "padding": "0 max(16px, calc((100% - 1180px) / 2))",
            "height": "46px",
            "minHeight": "46px",
            "width": "100%",
            "maxWidth": "100%",
            "minWidth": "0",
            "boxSizing": "border-box",
            "position": "sticky",
            "top": "0",
            "zIndex": "210",
            "alignSelf": "start",
            "color": "#FFFFFF",
            "borderBottom": "1px solid rgba(255,255,255,0.07)",
            "boxShadow": "none",
            "overflow": "auto hidden",
            "overflowX": "auto",
            "overflowY": "hidden",
            "WebkitOverflowScrolling": "touch",
            "scrollPaddingLeft": "max(16px, calc((100% - 1180px) / 2))"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 1,
              "rowEnd": 2
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 1,
              "rowEnd": 2
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 1,
              "rowEnd": 2
            }
          },
          "children": [
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "gap": "0",
                "padding": "0",
                "height": "46px",
                "flex": "1 1 auto",
                "minWidth": "0",
                "marginRight": "auto",
                "textAlign": "left",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "#FFFFFF",
                "fontSize": "16px",
                "fontWeight": "700",
                "letterSpacing": "0.14em",
                "textTransform": "uppercase",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "logo",
                "label": "SDUI·Commerce",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "home",
                  "actionName": "ON_TAP_LOGO"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": "0",
                "padding": "0 12px",
                "height": "46px",
                "flex": "0 0 auto",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "#FFFFFF",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "boxShadow": "inset 0 -2px 0 #C4185F",
                "marginLeft": "auto"
              },
              "data": {
                "id": "home",
                "label": "Home",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "home",
                  "actionName": "ON_TAP_NAV_HOME"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": "0",
                "padding": "0 12px",
                "height": "46px",
                "flex": "0 0 auto",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "rgba(255,255,255,0.72)",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "categories",
                "label": "Categories",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "categories",
                  "actionName": "ON_TAP_NAV_CATEGORIES"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": "0",
                "padding": "0 12px",
                "height": "46px",
                "flex": "0 0 auto",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "rgba(255,255,255,0.72)",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "deals",
                "label": "Deals",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "deals",
                  "actionName": "ON_TAP_NAV_DEALS"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": "0",
                "padding": "0 12px",
                "height": "46px",
                "flex": "0 0 auto",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "none",
                "borderRadius": "0",
                "color": "rgba(255,255,255,0.72)",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.01em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "orders",
                "label": "Orders",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "orders",
                  "actionName": "ON_TAP_NAV_ORDERS"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "padding": "0 14px",
                "height": "32px",
                "flex": "0 0 auto",
                "marginLeft": "8px",
                "borderRadius": "8px",
                "background": "none",
                "backgroundImage": "none",
                "backgroundColor": "transparent",
                "border": "1px solid rgba(255,255,255,0.28)",
                "color": "#FFFFFF",
                "fontSize": "13px",
                "fontWeight": "600",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "login",
                "label": "Log in",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "login",
                  "actionName": "ON_TAP_LOGIN"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundColor": "#C4185F",
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "padding": "0 14px",
                "height": "32px",
                "flex": "0 0 auto",
                "marginLeft": "8px",
                "borderRadius": "8px",
                "border": "1px solid #C4185F",
                "color": "#FFFFFF",
                "fontSize": "13px",
                "fontWeight": "600",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer"
              },
              "data": {
                "id": "signup",
                "label": "Sign up",
                "icon": ""
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "signup",
                  "actionName": "ON_TAP_SIGNUP"
                }
              }
            }
          ]
        },
        {
          "type": "Header",
          "containerStyle": {
            "background": "linear-gradient(180deg, #0D3540 0%, #08242A 100%)",
            "backgroundImage": "linear-gradient(180deg, #0D3540 0%, #08242A 100%)",
            "backgroundColor": "#08242A",
            "display": "flex",
            "flexDirection": "row",
            "flexWrap": "wrap",
            "alignItems": "center",
            "justifyContent": "flex-start",
            "gap": "10px",
            "rowGap": "10px",
            "padding": "12px max(16px, calc((100% - 1180px) / 2))",
            "minHeight": "68px",
            "width": "100%",
            "maxWidth": "100%",
            "minWidth": "0",
            "boxSizing": "border-box",
            "position": "sticky",
            "top": "46px",
            "zIndex": "200",
            "alignSelf": "start",
            "overflow": "visible",
            "color": "#FFFFFF",
            "borderBottom": "none",
            "boxShadow": "0 8px 20px rgba(10,42,49,0.18)"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 2,
              "rowEnd": 3
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 2,
              "rowEnd": 3
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 2,
              "rowEnd": 3
            }
          },
          "children": [
            {
              "type": "SearchBar",
              "containerStyle": {
                "flex": "1 1 320px",
                "minWidth": "0",
                "maxWidth": "100%",
                "margin": "0",
                "padding": "0 14px",
                "height": "44px",
                "display": "flex",
                "alignItems": "center",
                "border": "1px solid #E4E7E4",
                "borderRadius": "12px",
                "boxShadow": "none",
                "boxSizing": "border-box",
                "fontSize": "15px",
                "color": "#101F26",
                "caretColor": "#C4185F",
                "width": "100%",
                "overflow": "hidden",
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF"
              },
              "data": {
                "placeholder": "Search products, brands and more"
              },
              "actions": {
                "onChange": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_CHANGE_SEARCH",
                  "debounceDuration": 500
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
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": "8px",
                "padding": "0 16px",
                "height": "42px",
                "flex": "0 0 auto",
                "borderRadius": "12px",
                "fontSize": "14px",
                "fontWeight": "600",
                "letterSpacing": "0.005em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundColor": "#C4185F",
                "border": "1px solid #C4185F",
                "color": "#FFFFFF",
                "marginLeft": "auto",
                "boxShadow": "0 2px 10px rgba(196,24,95,0.28)"
              },
              "data": {
                "id": "cart",
                "label": "Cart",
                "icon": "🛒",
                "count": 3
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "cart",
                  "actionName": "ON_TAP_CART_HEADER"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": "8px",
                "padding": "0 16px",
                "height": "42px",
                "flex": "0 0 auto",
                "borderRadius": "12px",
                "fontSize": "14px",
                "fontWeight": "600",
                "letterSpacing": "0.005em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "background": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundImage": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundColor": "#123A44",
                "border": "1px solid rgba(255,255,255,0.16)",
                "color": "#FFFFFF"
              },
              "data": {
                "id": "wishlist",
                "label": "Wishlist",
                "icon": "♥",
                "count": 12
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "wishlist",
                  "actionName": "ON_TAP_WISHLIST_HEADER"
                }
              }
            },
            {
              "type": "HeaderButton",
              "containerStyle": {
                "display": "inline-flex",
                "alignItems": "center",
                "justifyContent": "center",
                "gap": "8px",
                "padding": "0 16px",
                "height": "42px",
                "flex": "0 0 auto",
                "borderRadius": "12px",
                "fontSize": "14px",
                "fontWeight": "600",
                "letterSpacing": "0.005em",
                "whiteSpace": "nowrap",
                "boxSizing": "border-box",
                "cursor": "pointer",
                "background": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundImage": "linear-gradient(180deg, #164955 0%, #123A44 100%)",
                "backgroundColor": "#123A44",
                "border": "1px solid rgba(255,255,255,0.16)",
                "color": "#FFFFFF"
              },
              "data": {
                "id": "favourites",
                "label": "Favourites",
                "icon": "★",
                "count": 5
              },
              "actions": {
                "onTap": {
                  "type": "NAVIGATE",
                  "route": "favourites",
                  "actionName": "ON_TAP_FAVOURITES_HEADER"
                }
              }
            }
          ]
        },
        {
          "type": "StoryRow",
          "containerStyle": {
            "display": "flex",
            "flexDirection": "row",
            "flexWrap": "nowrap",
            "alignItems": "flex-start",
            "justifyContent": "flex-start",
            "gap": "16px",
            "padding": "20px max(16px, calc((100% - 1180px) / 2)) 8px",
            "width": "100%",
            "maxWidth": "100%",
            "minWidth": "0",
            "boxSizing": "border-box",
            "alignSelf": "start",
            "height": "fit-content",
            "backgroundColor": "transparent",
            "overflow": "auto hidden",
            "overflowX": "auto",
            "overflowY": "hidden",
            "WebkitOverflowScrolling": "touch",
            "scrollSnapType": "x proximity",
            "scrollPaddingLeft": "max(16px, calc((100% - 1180px) / 2))"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 3,
              "rowEnd": 4
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 3,
              "rowEnd": 4
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 3,
              "rowEnd": 4
            }
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
              "containerStyle": {
                "width": "76px",
                "flex": "0 0 auto",
                "textAlign": "center",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "color": "#101F26",
                "scrollSnapAlign": "start",
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Sale",
                "imageUrl": "https://picsum.photos/id/2/200/200"
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
              "containerStyle": {
                "width": "76px",
                "flex": "0 0 auto",
                "textAlign": "center",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "color": "#101F26",
                "scrollSnapAlign": "start",
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Trending",
                "imageUrl": "https://picsum.photos/id/3/200/200"
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "width": "76px",
                "flex": "0 0 auto",
                "textAlign": "center",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "color": "#101F26",
                "scrollSnapAlign": "start",
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Electronics",
                "imageUrl": "https://picsum.photos/id/4/200/200"
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "width": "76px",
                "flex": "0 0 auto",
                "textAlign": "center",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "color": "#101F26",
                "scrollSnapAlign": "start",
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Kitchen",
                "imageUrl": "https://picsum.photos/id/30/200/200"
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "width": "76px",
                "flex": "0 0 auto",
                "textAlign": "center",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "color": "#101F26",
                "scrollSnapAlign": "start",
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Fashion",
                "imageUrl": "https://picsum.photos/id/21/200/200"
              }
            },
            {
              "type": "StoryCircle",
              "containerStyle": {
                "width": "76px",
                "flex": "0 0 auto",
                "textAlign": "center",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "color": "#101F26",
                "scrollSnapAlign": "start",
                "borderColor": "#C4185F",
                "accentColor": "#C4185F",
                "--story-ring": "#C4185F",
                "--ring-color": "#C4185F"
              },
              "data": {
                "label": "Beauty",
                "imageUrl": "https://picsum.photos/id/64/200/200"
              }
            }
          ]
        },
        {
          "type": "CategoryGrid",
          "containerStyle": {
            "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
            "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
            "backgroundColor": "#FFFFFF",
            "display": "grid",
            "gridTemplateColumns": "repeat(auto-fit, minmax(84px, 1fr))",
            "gridAutoRows": "minmax(0, auto)",
            "justifyItems": "center",
            "columnGap": "8px",
            "rowGap": "12px",
            "margin": "8px max(16px, calc((100% - 1180px) / 2)) 0",
            "padding": "14px 12px",
            "borderRadius": "16px",
            "border": "1px solid #E4E7E4",
            "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
            "boxSizing": "border-box",
            "minWidth": "0",
            "maxWidth": "100%",
            "alignSelf": "start",
            "width": "auto",
            "overflow": "visible"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 4,
              "rowEnd": 5
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 4,
              "rowEnd": 5
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 4,
              "rowEnd": 5
            }
          },
          "children": [
            {
              "type": "CategoryItem",
              "containerStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "gap": "10px",
                "padding": "12px 4px",
                "width": "100%",
                "maxWidth": "108px",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "letterSpacing": "0.005em",
                "textAlign": "center",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Mobiles",
                "icon": "📱"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_MOBILES"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "gap": "10px",
                "padding": "12px 4px",
                "width": "100%",
                "maxWidth": "108px",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "letterSpacing": "0.005em",
                "textAlign": "center",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Fashion",
                "icon": "👕"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_FASHION"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "gap": "10px",
                "padding": "12px 4px",
                "width": "100%",
                "maxWidth": "108px",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "letterSpacing": "0.005em",
                "textAlign": "center",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Laptops",
                "icon": "💻"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_LAPTOPS"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "gap": "10px",
                "padding": "12px 4px",
                "width": "100%",
                "maxWidth": "108px",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "letterSpacing": "0.005em",
                "textAlign": "center",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Home",
                "icon": "🏠"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_HOME"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "gap": "10px",
                "padding": "12px 4px",
                "width": "100%",
                "maxWidth": "108px",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "letterSpacing": "0.005em",
                "textAlign": "center",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Beauty",
                "icon": "💄"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_BEAUTY"
                }
              }
            },
            {
              "type": "CategoryItem",
              "containerStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "flex-start",
                "gap": "10px",
                "padding": "12px 4px",
                "width": "100%",
                "maxWidth": "108px",
                "borderRadius": "12px",
                "fontSize": "12px",
                "fontWeight": "600",
                "lineHeight": "16px",
                "letterSpacing": "0.005em",
                "textAlign": "center",
                "color": "#101F26",
                "cursor": "pointer",
                "boxSizing": "border-box"
              },
              "data": {
                "label": "Grocery",
                "icon": "🛍️"
              },
              "actions": {
                "onTap": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_TAP_GROCERY"
                }
              }
            }
          ]
        },
        {
          "type": "Carousel",
          "containerStyle": {
            "margin": "20px max(16px, calc((100% - 1180px) / 2)) 0",
            "borderRadius": "16px",
            "overflow": "hidden",
            "border": "1px solid #E4E7E4",
            "boxSizing": "border-box",
            "minWidth": "0",
            "maxWidth": "100%",
            "alignSelf": "start",
            "width": "auto"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 5,
              "rowEnd": 6
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 5,
              "rowEnd": 6
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 5,
              "rowEnd": 6
            }
          },
          "data": {
            "showDots": true,
            "autoPlay": true,
            "autoPlayInterval": 5000,
            "infiniteLoop": true
          },
          "actions": {
            "onSwipeLeft": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "CAROUSEL_SWIPE_LEFT",
              "minSwipeDistance": 50
            },
            "onSwipeRight": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "CAROUSEL_SWIPE_RIGHT",
              "minSwipeDistance": 50
            }
          },
          "children": [
            {
              "type": "Image",
              "containerStyle": {
                "width": "100%",
                "height": "clamp(150px, 24vw, 300px)",
                "display": "block",
                "objectFit": "cover",
                "borderRadius": "16px",
                "maxWidth": "100%"
              },
              "data": {
                "imageUrl": "https://picsum.photos/id/1080/1600/500",
                "altText": "Monsoon electronics sale"
              }
            },
            {
              "type": "Image",
              "containerStyle": {
                "width": "100%",
                "height": "clamp(150px, 24vw, 300px)",
                "display": "block",
                "objectFit": "cover",
                "borderRadius": "16px",
                "maxWidth": "100%"
              },
              "data": {
                "imageUrl": "https://picsum.photos/id/180/1600/500",
                "altText": "Bank offers this week"
              }
            }
          ]
        },
        {
          "type": "HeroBanner",
          "containerStyle": {
            "position": "relative",
            "margin": "16px max(16px, calc((100% - 1180px) / 2)) 0",
            "borderRadius": "16px",
            "overflow": "hidden",
            "minHeight": "clamp(220px, 30vw, 340px)",
            "border": "1px solid #E4E7E4",
            "boxShadow": "0 1px 2px rgba(16,31,38,0.05)",
            "boxSizing": "border-box",
            "minWidth": "0",
            "maxWidth": "100%",
            "alignSelf": "start",
            "width": "auto"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 6,
              "rowEnd": 7
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 6,
              "rowEnd": 7
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 6,
              "rowEnd": 7
            }
          },
          "data": {
            "imageUrl": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=80",
            "title": "Season end sale",
            "subtitle": "Up to 70% off electronics. Ends Sunday.",
            "altText": "Season end sale banner"
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
                "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                "backgroundColor": "#C4185F",
                "position": "absolute",
                "top": "16px",
                "left": "16px",
                "width": "auto",
                "padding": "9px 14px",
                "borderRadius": "10px",
                "border": "1px solid rgba(255,255,255,0.24)",
                "color": "#FFFFFF",
                "textAlign": "left",
                "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                "fontSize": "13px",
                "fontWeight": "600",
                "letterSpacing": "0.04em",
                "boxShadow": "0 4px 16px rgba(196,24,95,0.32)"
              },
              "data": {
                "label": "Flash sale ends in",
                "expiredText": "Sale ended",
                "targetDate": "2026-08-14T23:59:00",
                "showDays": "true",
                "format": "DD:HH:MM:SS"
              },
              "actions": {
                "onHover": {
                  "type": "API_CALL",
                  "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                  "actionName": "ON_HOVER_FLASH_TIMER"
                }
              }
            }
          ]
        },
        {
          "type": "CouponCode",
          "containerStyle": {
            "background": "linear-gradient(180deg, #FFF3DF 0%, #FFF3DF 100%)",
            "backgroundImage": "linear-gradient(180deg, #FFF3DF 0%, #FFF3DF 100%)",
            "backgroundColor": "#FFF3DF",
            "margin": "16px max(16px, calc((100% - 1180px) / 2)) 0",
            "padding": "18px 20px",
            "borderRadius": "16px",
            "border": "1px dashed #E9C489",
            "color": "#8A5209",
            "fontSize": "14px",
            "fontWeight": "500",
            "fontFamily": "'Inter Tight', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            "boxSizing": "border-box",
            "minWidth": "0",
            "maxWidth": "100%",
            "alignSelf": "start",
            "width": "auto",
            "overflow": "visible"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 7,
              "rowEnd": 8
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 7,
              "rowEnd": 8
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 7,
              "rowEnd": 8
            }
          },
          "data": {
            "title": "Save 20% on this order",
            "coupon": "SAVE20",
            "description": "Applies to orders above ₹999.",
            "copyLabel": "Copy code"
          },
          "actions": {
            "onCopy": {
              "type": "COPY_TO_CLIPBOARD",
              "value": "SAVE20"
            }
          }
        },
        {
          "type": "CountDownTimer",
          "containerStyle": {
            "background": "linear-gradient(180deg, #11404C 0%, #0A2A31 100%)",
            "backgroundImage": "linear-gradient(180deg, #11404C 0%, #0A2A31 100%)",
            "backgroundColor": "#0A2A31",
            "margin": "12px max(16px, calc((100% - 1180px) / 2)) 0",
            "padding": "18px 20px",
            "borderRadius": "16px",
            "border": "1px solid rgba(255,255,255,0.08)",
            "color": "#FFFFFF",
            "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
            "fontSize": "17px",
            "fontWeight": "600",
            "letterSpacing": "0.06em",
            "textAlign": "left",
            "boxSizing": "border-box",
            "minWidth": "0",
            "maxWidth": "100%",
            "alignSelf": "start",
            "width": "auto",
            "overflow": "visible"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 8,
              "rowEnd": 9
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 8,
              "rowEnd": 9
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 8,
              "rowEnd": 9
            }
          },
          "data": {
            "label": "Deal of the day ends in",
            "expiredText": "Deal ended",
            "targetDate": "2026-08-13T23:59:00",
            "showDays": "false",
            "format": "HH:MM:SS"
          },
          "actions": {
            "onExpire": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "DEAL_OF_THE_DAY_ENDED"
            }
          }
        },
        {
          "type": "ProductList",
          "containerStyle": {
            "display": "flex",
            "flexDirection": "row",
            "flexWrap": "nowrap",
            "alignItems": "stretch",
            "gap": "14px",
            "padding": "20px max(16px, calc((100% - 1180px) / 2)) 28px",
            "overflow": "auto hidden",
            "overflowX": "auto",
            "overflowY": "hidden",
            "WebkitOverflowScrolling": "touch",
            "scrollSnapType": "x mandatory",
            "scrollPaddingLeft": "max(16px, calc((100% - 1180px) / 2))",
            "scrollbarWidth": "thin",
            "width": "100%",
            "maxWidth": "100%",
            "minWidth": "0",
            "boxSizing": "border-box",
            "alignSelf": "start",
            "height": "auto",
            "minHeight": "552px"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 9,
              "rowEnd": 10
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 9,
              "rowEnd": 10
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 9,
              "rowEnd": 10
            }
          },
          "actions": {
            "onScroll": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "ON_SCROLL_PRODUCT",
              "debounceDuration": 1000
            },
            "onEndReached": {
              "type": "API_CALL",
              "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
              "actionName": "LOAD_MORE_PRODUCTS",
              "nearEndThreshold": 50
            }
          },
          "children": [
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "serenelife-001"
              },
              "actions": {
                "onLongPress": {
                  "type": "SHOW_CONTEXT_MENU",
                  "data": {
                    "title": "Quick actions",
                    "options": [
                      {
                        "label": "Add to wishlist",
                        "icon": "♥",
                        "action": {
                          "type": "API_CALL",
                          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                          "actionName": "ADD_TO_WISHLIST"
                        }
                      },
                      {
                        "label": "Add to cart",
                        "icon": "🛒",
                        "action": {
                          "type": "API_CALL",
                          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                          "actionName": "ADD_TO_CART"
                        }
                      },
                      {
                        "label": "Add to favourites",
                        "icon": "★",
                        "action": {
                          "type": "API_CALL",
                          "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                          "actionName": "ADD_TO_FAVOURITE"
                        }
                      }
                    ]
                  }
                }
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://m.media-amazon.com/images/I/816r5iLd4LL._AC_UL480_FMwebp_QL65_.jpg",
                    "altText": "SereneLife folding shopping cart"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": "Sponsored"
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#FFF3DF",
                    "color": "#8A5209"
                  },
                  "data": {
                    "text": "Limited time offer"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "SereneLife"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Compact folding shopping cart with waterproof liner, 360° swivel wheels and a 70 lb capacity"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
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
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹7,089",
                    "mrp": "₹12,250",
                    "discount": "42%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Up to 5% back with Amazon Pay ICICI card"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 7
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
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
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/serenelife-001"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "aurora-buds-002"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/1010/600/600",
                    "altText": "Aurora Buds Pro wireless earbuds"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#E7EEED",
                    "color": "#0A2A31"
                  },
                  "data": {
                    "text": "Bestseller"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Aurora Audio"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Buds Pro ANC wireless earbuds — 42 hr battery, dual pairing, IPX5 water resistance"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.2",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "12,480"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹2,499",
                    "mrp": "₹4,999",
                    "discount": "50%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "No cost EMI on select cards"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 2
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
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
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/aurora-buds-002"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "kettleworks-003"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/30/600/600",
                    "altText": "Kettleworks electric kettle"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#FDECF2",
                    "color": "#C4185F"
                  },
                  "data": {
                    "text": "Only 3 left"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Kettleworks"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "1L stainless steel electric kettle with auto shut-off and boil-dry protection"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.6",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "2,043"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹1,299",
                    "mrp": "₹1,999",
                    "discount": "35%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Extra 5% off with bank cards"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 4
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
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
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/kettleworks-003"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "nimbus-fryer-004"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/292/600/600",
                    "altText": "Nimbus air fryer"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#FFF3DF",
                    "color": "#8A5209"
                  },
                  "data": {
                    "text": "Deal of the day"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Nimbus"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "4.5L digital air fryer with 8 presets, dishwasher-safe basket and rapid heat circulation"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.3",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "8,912"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹5,499",
                    "mrp": "₹8,999",
                    "discount": "39%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Save ₹500 with coupon SAVE20"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 3
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
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
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/nimbus-fryer-004"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            },
            {
              "type": "ProductCard",
              "containerStyle": {
                "background": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundImage": "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)",
                "backgroundColor": "#FFFFFF",
                "position": "relative",
                "flex": "0 0 auto",
                "width": "clamp(236px, 74vw, 268px)",
                "height": "516px",
                "minHeight": "516px",
                "maxHeight": "516px",
                "alignSelf": "stretch",
                "display": "flex",
                "flexDirection": "column",
                "justifyContent": "flex-start",
                "gap": "8px",
                "padding": "14px",
                "border": "1px solid #E4E7E4",
                "borderRadius": "16px",
                "boxShadow": "0 1px 2px rgba(16,31,38,0.04)",
                "boxSizing": "border-box",
                "minWidth": "0",
                "overflow": "hidden",
                "scrollSnapAlign": "start"
              },
              "data": {
                "id": "volt-charger-005"
              },
              "children": [
                {
                  "type": "Image",
                  "containerStyle": {
                    "height": "176px",
                    "minHeight": "176px",
                    "flex": "0 0 176px",
                    "flexShrink": "0",
                    "width": "100%",
                    "maxHeight": "176px",
                    "objectFit": "contain",
                    "backgroundColor": "#FAFAF8",
                    "borderRadius": "10px",
                    "display": "block",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "imageUrl": "https://picsum.photos/id/1078/600/600",
                    "altText": "Volt 65W GaN charger"
                  }
                },
                {
                  "type": "Label",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "4px",
                    "overflow": "hidden",
                    "fontSize": "10px",
                    "fontWeight": "600",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#8D9A9D",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Sponsored",
                      "data": {
                        "text": " "
                      }
                    }
                  ]
                },
                {
                  "type": "Badge",
                  "containerStyle": {
                    "height": "22px",
                    "minHeight": "22px",
                    "flex": "0 0 22px",
                    "flexShrink": "0",
                    "alignSelf": "flex-start",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "padding": "0 9px",
                    "borderRadius": "999px",
                    "fontSize": "11px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "whiteSpace": "nowrap",
                    "boxSizing": "border-box",
                    "backgroundColor": "#E7EEED",
                    "color": "#0A2A31"
                  },
                  "data": {
                    "text": "Bestseller"
                  }
                },
                {
                  "type": "Title",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "11px",
                    "fontWeight": "700",
                    "letterSpacing": "0.10em",
                    "textTransform": "uppercase",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Volt"
                  }
                },
                {
                  "type": "Description",
                  "containerStyle": {
                    "height": "60px",
                    "minHeight": "60px",
                    "flex": "0 0 60px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "3",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "maxHeight": "60px",
                    "fontSize": "14px",
                    "lineHeight": "20px",
                    "fontWeight": "500",
                    "letterSpacing": "-0.005em",
                    "color": "#101F26",
                    "overflowWrap": "anywhere",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "65W GaN fast charger with two USB-C ports and one USB-A, foldable pins"
                  }
                },
                {
                  "type": "Rating",
                  "containerStyle": {
                    "height": "20px",
                    "minHeight": "20px",
                    "flex": "0 0 20px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "center",
                    "gap": "6px",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "12px",
                    "letterSpacing": "0.02em",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "children": [
                    {
                      "type": "Score",
                      "data": {
                        "text": "4.5",
                        "out of": "5"
                      }
                    },
                    {
                      "type": "ReviewCount",
                      "data": {
                        "text": "5,204"
                      }
                    }
                  ]
                },
                {
                  "type": "PriceBlock",
                  "containerStyle": {
                    "height": "28px",
                    "minHeight": "28px",
                    "flex": "0 0 28px",
                    "flexShrink": "0",
                    "display": "flex",
                    "alignItems": "baseline",
                    "gap": "8px",
                    "overflow": "hidden",
                    "fontFamily": "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
                    "fontSize": "18px",
                    "fontWeight": "600",
                    "letterSpacing": "-0.01em",
                    "color": "#101F26",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "sellingPrice": "₹1,899",
                    "mrp": "₹2,999",
                    "discount": "37%"
                  }
                },
                {
                  "type": "OfferText",
                  "containerStyle": {
                    "height": "16px",
                    "minHeight": "16px",
                    "flex": "0 0 16px",
                    "flexShrink": "0",
                    "display": "-webkit-box",
                    "WebkitLineClamp": "1",
                    "WebkitBoxOrient": "vertical",
                    "overflow": "hidden",
                    "fontSize": "12px",
                    "fontWeight": "600",
                    "color": "#C4185F",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "text": "Free 1 m braided cable included"
                  }
                },
                {
                  "type": "DeliveryInfo",
                  "containerStyle": {
                    "height": "18px",
                    "minHeight": "18px",
                    "flex": "0 0 18px",
                    "flexShrink": "0",
                    "overflow": "hidden",
                    "whiteSpace": "nowrap",
                    "textOverflow": "ellipsis",
                    "fontSize": "12px",
                    "color": "#5E6E72",
                    "boxSizing": "border-box"
                  },
                  "data": {
                    "prefix": "Free delivery",
                    "daysOffset": 2
                  }
                },
                {
                  "type": "Button",
                  "containerStyle": {
                    "height": "44px",
                    "minHeight": "44px",
                    "flex": "0 0 44px",
                    "flexShrink": "0",
                    "background": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundImage": "linear-gradient(180deg, #D42A6E 0%, #C4185F 100%)",
                    "backgroundColor": "#C4185F",
                    "marginTop": "auto",
                    "width": "calc(100% - 52px)",
                    "alignSelf": "flex-end",
                    "display": "flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "padding": "0 16px",
                    "borderRadius": "12px",
                    "border": "none",
                    "color": "#FFFFFF",
                    "fontSize": "14px",
                    "fontWeight": "600",
                    "letterSpacing": "0.01em",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "boxShadow": "0 2px 10px rgba(196,24,95,0.24)"
                  },
                  "data": {
                    "label": "Add to cart"
                  },
                  "actions": {
                    "onTap": {
                      "type": "API_CALL",
                      "endpoint": "https://jsonplaceholder.typicode.com/todos/1",
                      "actionName": "ADD_TO_CART"
                    }
                  }
                },
                {
                  "type": "ShareButton",
                  "containerStyle": {
                    "position": "absolute",
                    "right": "14px",
                    "bottom": "8px",
                    "zIndex": "3",
                    "width": "44px",
                    "height": "44px",
                    "minWidth": "44px",
                    "padding": "0",
                    "margin": "0",
                    "borderRadius": "12px",
                    "display": "inline-flex",
                    "alignItems": "center",
                    "justifyContent": "center",
                    "gap": "0",
                    "backgroundColor": "#FFFFFF",
                    "border": "1px solid #E4E7E4",
                    "color": "#101F26",
                    "fontSize": "17px",
                    "lineHeight": "1",
                    "fontWeight": "600",
                    "cursor": "pointer",
                    "boxSizing": "border-box",
                    "overflow": "hidden",
                    "boxShadow": "none"
                  },
                  "data": {
                    "label": "",
                    "icon": "↗"
                  },
                  "actions": {
                    "onTap": {
                      "type": "OPEN_BOTTOM_SHEET",
                      "data": {
                        "title": "Share this product",
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
                          {
                            "label": "Copy link",
                            "icon": "🔗",
                            "action": {
                              "type": "COPY_TO_CLIPBOARD",
                              "value": "https://example.com/p/volt-charger-005"
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          "type": "Box",
          "containerStyle": {
            "padding": "20px",
            "backgroundColor": "#e0f2fe",
            "borderRadius": "12px",
            "margin": "20px max(16px, calc((100% - 1180px) / 2))",
            "display": "flex",
            "justifyContent": "center",
            "alignItems": "center",
            "border": "2px dashed #0284c7"
          },
          "placement": {
            "mobile": { "colStart": 1, "colEnd": 100, "rowStart": 9, "rowEnd": 10 },
            "tablet": { "colStart": 1, "colEnd": 100, "rowStart": 9, "rowEnd": 10 },
            "desktop": { "colStart": 1, "colEnd": 100, "rowStart": 9, "rowEnd": 10 }
          },
          "children": [
            {
              "type": "Text",
              "data": {
                "text": "This is a demonstration of Box and Text components!"
              },
              "containerStyle": {
                "fontSize": "16px",
                "fontWeight": "bold",
                "color": "#0369a1"
              }
            }
          ]
        },
        {
          "type": "Footer",
          "containerStyle": {
            "background": "linear-gradient(180deg, #0D323B 0%, #0A2A31 100%)",
            "backgroundImage": "linear-gradient(180deg, #0D323B 0%, #0A2A31 100%)",
            "backgroundColor": "#0A2A31",
            "margin": "0",
            "padding": "44px max(16px, calc((100% - 1180px) / 2)) 36px",
            "color": "#CFDDDC",
            "fontSize": "14px",
            "lineHeight": "22px",
            "boxSizing": "border-box",
            "minWidth": "0",
            "maxWidth": "100%",
            "alignSelf": "start",
            "width": "100%",
            "overflow": "visible",
            "borderTop": "1px solid rgba(255,255,255,0.08)"
          },
          "placement": {
            "mobile": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 10,
              "rowEnd": 11
            },
            "tablet": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 10,
              "rowEnd": 11
            },
            "desktop": {
              "colStart": 1,
              "colEnd": 100,
              "rowStart": 10,
              "rowEnd": 11
            }
          },
          "data": {
            "sections": [
              {
                "title": "Get to know us",
                "links": [
                  {
                    "label": "About us",
                    "url": "https://example.com/about"
                  },
                  {
                    "label": "Careers",
                    "url": "https://example.com/careers"
                  },
                  {
                    "label": "Community",
                    "url": "https://example.com/community"
                  }
                ]
              },
              {
                "title": "Let us help you",
                "links": [
                  {
                    "label": "Your orders",
                    "url": "https://example.com/orders"
                  },
                  {
                    "label": "Returns and refunds",
                    "url": "https://example.com/returns"
                  },
                  {
                    "label": "Help centre",
                    "url": "https://example.com/help"
                  }
                ]
              },
              {
                "title": "Connect with us",
                "links": [
                  {
                    "label": "Instagram",
                    "url": "https://instagram.com"
                  },
                  {
                    "label": "Facebook",
                    "url": "https://facebook.com"
                  },
                  {
                    "label": "X",
                    "url": "https://x.com"
                  },
                  {
                    "label": "LinkedIn",
                    "url": "https://linkedin.com"
                  }
                ]
              }
            ],
            "copyrightText": "© 2024–2026, SDUI-Commerce, Inc. or its affiliates"
          }
        }
      ]
    },
    {
      "type": "NavBar",
      "containerStyle": {
        "position": "sticky",
        "bottom": "0",
        "width": "100%",
        "height": "60px",
        "backgroundColor": "#FFFFFF",
        "zIndex": "210",
        "borderTop": "1px solid #E5E7EB",
        "display": "flex"
      },
      "data": {
        "items": [
          {
            "label": "Home",
            "icon": "🏠",
            "isActive": "true",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "home"
              }
            }
          },
          {
            "label": "Categories",
            "icon": "🗂️",
            "isActive": "false",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "categories"
              }
            }
          },
          {
            "label": "Cart",
            "icon": "🛒",
            "isActive": "false",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "cart"
              }
            }
          },
          {
            "label": "Account",
            "icon": "👤",
            "isActive": "false",
            "actions": {
              "onTap": {
                "type": "NAVIGATE",
                "route": "account"
              }
            }
          }
        ]
      }
    }
  ]
}