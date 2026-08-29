/**
 * ProductCard Predefined Themes
 * 
 * Implementations of ProductCardSchema interface contract.
 */

export const productCardThemes = {
  // 1. DEFAULT: Exact Landing Page ProductCard
  landing_schema: {
    id: 'landing_schema',
    name: 'Landing Page Default',
    previewColor: '#FAFAF8',
    config: {
      type: 'ProductCard',
      containerStyle: {
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
        backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
        backgroundColor: '#FFFFFF',
        flex: '0 0 auto',
        height: '516px',
        minHeight: '516px',
        maxHeight: '516px',
        alignSelf: 'stretch',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '14px',
        border: '1px solid #E4E7E4',
        borderRadius: '16px',
        boxShadow: '0 1px 2px rgba(16,31,38,0.04)',
        boxSizing: 'border-box',
      },
      data: {
        id: 'serenelife-001'
      },
      children: [
        {
          type: 'Image',
          containerStyle: {
            height: "176px",
            minHeight: "176px",
            flex: "0 0 176px",
            flexShrink: "0",
            width: "100%",
            maxHeight: "176px",
            objectFit: "contain",
            backgroundColor: "#FAFAF8",
            borderRadius: "10px",
            boxSizing: "border-box"
          },
          data: {
            imageUrl: 'https://m.media-amazon.com/images/I/816r5iLd4LL._AC_UL480_FMwebp_QL65_.jpg',
            altText: 'SereneLife folding cart'
          }
        },
        {
          type: 'Label',
          containerStyle: {
            height: "16px",
            minHeight: "16px",
            flex: "0 0 16px",
            flexShrink: "0",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            overflow: 'hidden',
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color: '#8D9A9D',
            boxSizing: 'border-box'
          },
          children: [
            { type: 'Sponsored', data: { text: 'Sponsored' } }
          ]
        },
        {
          type: "Badge",
          containerStyle: {
            height: "22px",
            minHeight: "22px",
            flex: "0 0 22px",
            flexShrink: "0",
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            padding: "0 9px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: "600",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            backgroundColor: "#FFF3DF",
            color: "#8A5209"
          },
          data: {
            text: "Limited time offer"
          }
        },
        {
          type: "Title",
          containerStyle: {
            height: "16px",
            minHeight: "16px",
            flex: "0 0 16px",
            flexShrink: "0",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "#5E6E72",
            boxSizing: "border-box"
          },
          data: {
            text: "SereneLife"
          }
        },
        {
          type: "Description",
          containerStyle: {
            height: "60px",
            minHeight: "60px",
            flex: "0 0 60px",
            flexShrink: "0",
            display: "-webkit-box",
            WebkitLineClamp: "3",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            maxHeight: "60px",
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: "500",
            letterSpacing: "-0.005em",
            color: "#101F26",
            overflowWrap: "anywhere",
            boxSizing: "border-box"
          },
          data: {
            text: "Compact folding shopping cart with waterproof liner, 360° swivel wheels and a 70 lb capacity"
          }
        },
        {
          type: "Rating",
          containerStyle: {
            height: "20px",
            minHeight: "20px",
            flex: "0 0 20px",
            flexShrink: "0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "12px",
            letterSpacing: "0.02em",
            color: "#5E6E72",
            boxSizing: "border-box"
          },
          children: [
            {
              type: "Score",
              data: {
                text: "4.4",
                "out of": "5"
              }
            },
            {
              type: "ReviewCount",
              data: {
                text: "376"
              }
            }
          ]
        },
        {
          type: "PriceBlock",
          containerStyle: {
            height: "28px",
            minHeight: "28px",
            flex: "0 0 28px",
            flexShrink: "0",
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            overflow: "hidden",
            fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "18px",
            fontWeight: "600",
            letterSpacing: "-0.01em",
            color: "#101F26",
            boxSizing: "border-box"
          },
          data: {
            sellingPrice: "₹7,089",
            mrp: "₹12,250",
            discount: "42%"
          }
        },
        {
          type: "OfferText",
          containerStyle: {
            height: "16px",
            minHeight: "16px",
            flex: "0 0 16px",
            flexShrink: "0",
            display: "-webkit-box",
            WebkitLineClamp: "1",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontSize: "12px",
            fontWeight: "600",
            color: "#C4185F",
            boxSizing: "border-box"
          },
          data: {
            text: "Up to 5% back with Amazon Pay ICICI card"
          }
        },
        {
          type: "DeliveryInfo",
          containerStyle: {
            height: "18px",
            minHeight: "18px",
            flex: "0 0 18px",
            flexShrink: "0",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: "12px",
            color: "#5E6E72",
            boxSizing: "border-box"
          },
          data: {
            prefix: "Free delivery",
            daysOffset: 7
          }
        },
        {
          type: 'Button',
          containerStyle: {
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
          data: { label: 'Add to cart' }
        },
        {
          type: "ShareButton",
          containerStyle: {
            position: "absolute",
            right: "14px",
            bottom: "8px",
            zIndex: "3",
            width: "44px",
            height: "44px",
            minWidth: "44px",
            padding: "0",
            margin: "0",
            borderRadius: "12px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E4E7E4",
            color: "#101F26",
            fontSize: "17px",
            lineHeight: "1",
            fontWeight: "600",
            cursor: "pointer",
            boxSizing: "border-box",
            overflow: "hidden",
            boxShadow: "none"
          },
          data: {
            label: "",
            icon: "↗"
          },
        }
      ]
    }
  },

  // 2. WHITE THEME: Minimal White Store Card
  clean_white: {
    id: 'clean_white',
    name: 'Clean White Store',
    previewColor: '#FFFFFF',
    config: {
      type: 'ProductCard',
      containerStyle: {
        backgroundColor: '#FFFFFF',
        width: '280px',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxSizing: 'border-box'
      },
      data: {
        id: 'product-002'
      },
      children: [
        {
          type: 'Image',
          containerStyle: {
            height: '180px',
            width: '100%',
            objectFit: 'contain',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px'
          },
          data: {
            imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80',
            altText: 'Smart Fitness Watch'
          }
        },
        {
          type: 'Badge',
          containerStyle: {
            alignSelf: 'flex-start',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            backgroundColor: '#EFF6FF',
            color: '#2563EB'
          },
          data: { text: 'Best Seller' }
        },
        {
          type: 'Title',
          containerStyle: {
            fontSize: '12px',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase'
          },
          data: { text: 'TechWear' }
        },
        {
          type: 'Description',
          containerStyle: {
            fontSize: '14px',
            lineHeight: '18px',
            fontWeight: '600',
            color: '#0F172A'
          },
          data: {
            text: 'Pro AMOLED Smartwatch with Heart Rate & GPS Tracking'
          }
        },
        {
          type: 'Rating',
          containerStyle: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          },
          children: [
            { type: 'Score', data: { text: '4.8', 'out of': '5' } },
            { type: 'ReviewCount', data: { text: '1,240' } }
          ]
        },
        {
          type: 'PriceBlock',
          containerStyle: {
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px'
          },
          data: {
            sellingPrice: '₹3,499',
            mrp: '₹6,999',
            discount: '50%'
          }
        },
        {
          type: 'DeliveryInfo',
          containerStyle: {
            fontSize: '12px',
            color: '#16A34A',
            fontWeight: '600'
          },
          data: {
            prefix: 'Prime Free Delivery Tomorrow',
            daysOffset: 1
          }
        },
        {
          type: 'Button',
          containerStyle: {
            width: '100%',
            padding: '10px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          },
          data: { label: 'Buy Now' }
        }
      ]
    }
  },

  // 3. BLACK THEME: Minimal Dark Obsidian
  black_minimal: {
    id: 'black_minimal',
    name: 'Minimal Black',
    previewColor: '#000000',
    config: {
      type: 'ProductCard',
      containerStyle: {
        backgroundColor: '#0F172A',
        width: '280px',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid #1E293B',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: '#FFFFFF',
        boxSizing: 'border-box'
      },
      data: {
        id: 'product-003'
      },
      children: [
        {
          type: 'Image',
          containerStyle: {
            height: '180px',
            width: '100%',
            objectFit: 'contain',
            backgroundColor: '#1E293B',
            borderRadius: '12px'
          },
          data: {
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
            altText: 'Noise Cancelling Headphones'
          }
        },
        {
          type: 'Badge',
          containerStyle: {
            alignSelf: 'flex-start',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            backgroundColor: 'rgba(250, 204, 21, 0.15)',
            color: '#FEF08A'
          },
          data: { text: '⚡ Flash Deal' }
        },
        {
          type: 'Title',
          containerStyle: {
            fontSize: '12px',
            fontWeight: '700',
            color: '#94A3B8',
            textTransform: 'uppercase'
          },
          data: { text: 'AudioLuxe' }
        },
        {
          type: 'Description',
          containerStyle: {
            fontSize: '14px',
            lineHeight: '18px',
            fontWeight: '600',
            color: '#FFFFFF'
          },
          data: {
            text: 'Wireless Over-Ear Studio Headphones with Active Noise Cancellation'
          }
        },
        {
          type: 'Rating',
          containerStyle: {
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          },
          children: [
            { type: 'Score', data: { text: '4.9', 'out of': '5' } },
            { type: 'ReviewCount', data: { text: '890' } }
          ]
        },
        {
          type: 'PriceBlock',
          containerStyle: {
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px'
          },
          data: {
            sellingPrice: '₹4,999',
            mrp: '₹9,999',
            discount: '50%'
          }
        },
        {
          type: 'Button',
          containerStyle: {
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          },
          data: { label: 'Add to Cart' }
        }
      ]
    }
  }
};
