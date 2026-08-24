// SDUI (Server-Driven UI) Interface and Type Definitions in JavaScript
// Using JSDoc typedefs and runtime frozen constants for pure JavaScript projects.

/**
 * @typedef {'mobile' | 'tablet' | 'desktop'} DeviceType
 */

/**
 * @typedef {Object} GridPlacement
 * @property {number} colStart - Starting grid column (1-based index)
 * @property {number} colEnd - Ending grid column
 * @property {number} rowStart - Starting grid row (1-based index)
 * @property {number} rowEnd - Ending grid row
 */

/**
 * @typedef {'API_CALL' | 'COPY_TO_CLIPBOARD' | 'NAVIGATE' | 'OPEN_BOTTOM_SHEET' | 'SHOW_CONTEXT_MENU' | 'SHOW_IMAGE_MODAL' | 'SHOW_IMAGE_PREVIEW'} ActionTypeName
 */

/**
 * @typedef {Object} SDUIAction
 * @property {ActionTypeName} type - The action type
 * @property {string} [actionName] - Action name/identifier for API calls or telemetry
 * @property {string} [endpoint] - Target URL endpoint for API_CALL
 * @property {string} [value] - Text value to copy for COPY_TO_CLIPBOARD
 * @property {string} [route] - Navigation target route for NAVIGATE
 * @property {number} [debounceDuration] - Debounce period in milliseconds
 * @property {number} [minSwipeDistance] - Minimum swipe distance threshold
 * @property {number} [nearEndThreshold] - Threshold for end reaching events
 * @property {*} [data] - Optional payload/metadata for the action
 */

/**
 * @typedef {Object} SDUIActions
 * @property {SDUIAction} [onTap]
 * @property {SDUIAction} [onLongPress]
 * @property {SDUIAction} [onHover]
 * @property {SDUIAction} [onHoverOut]
 * @property {SDUIAction} [onMount]
 * @property {SDUIAction} [onUnmount]
 * @property {SDUIAction} [onScroll]
 * @property {SDUIAction} [onEndReached]
 * @property {SDUIAction} [onSwipeLeft]
 * @property {SDUIAction} [onSwipeRight]
 * @property {SDUIAction} [onSwipeUp]
 * @property {SDUIAction} [onSwipeDown]
 * @property {SDUIAction} [onDrag]
 * @property {SDUIAction} [onDrop]
 * @property {SDUIAction} [onFocus]
 * @property {SDUIAction} [onBlur]
 * @property {SDUIAction} [onSubmit]
 * @property {SDUIAction} [onChange]
 * @property {SDUIAction} [onError]
 * @property {SDUIAction} [onExpire]
 * @property {SDUIAction} [onCopy]
 */

/**
 * @typedef {Object} SDUIBaseComponent
 * @property {string} type - Component type name matching ComponentType
 * @property {Object<string, string|number>} [containerStyle] - Inline styles applied to the component wrapper
 * @property {Partial<Record<DeviceType, GridPlacement>>} [placement] - Grid placement per device
 * @property {SDUIActions} [actions] - Event actions map
 * @property {AnySDUIComponent[]} [children] - Nested SDUI child components
 * @property {*} [data] - Component payload data
 */

// -----------------------------------------------------------------------------
// Runtime Enums / Constants
// -----------------------------------------------------------------------------

/**
 * Component Type Constants
 * @readonly
 * @enum {string}
 */
export const ComponentType = Object.freeze({
  Home: 'Home',
  Page: 'Page',
  Header: 'Header',
  HeaderButton: 'HeaderButton',
  ProductList: 'ProductList',
  Carousel: 'Carousel',
  CategoryGrid: 'CategoryGrid',
  CategoryItem: 'CategoryItem',
  SearchBar: 'SearchBar',
  HeroBanner: 'HeroBanner',
  CountDownTimer: 'CountDownTimer',
  Box: 'Box',
  Text: 'Text',
  CouponCode: 'CouponCode',
  StoryRow: 'StoryRow',
  StoryCircle: 'StoryCircle',
  ShareButton: 'ShareButton',
  NavBar: 'NavBar',
  Footer: 'Footer',
  ProductCard: 'ProductCard',
  Image: 'Image',
  Label: 'Label',
  Sponsored: 'Sponsored',
  Icon: 'Icon',
  Title: 'Title',
  Description: 'Description',
  Rating: 'Rating',
  Score: 'Score',
  ReviewCount: 'ReviewCount',
  Badge: 'Badge',
  PriceBlock: 'PriceBlock',
  OfferText: 'OfferText',
  DeliveryInfo: 'DeliveryInfo',
  Button: 'Button',
  IFrame: 'IFrame',
});

/**
 * Action Type Constants
 * @readonly
 * @enum {string}
 */
export const ActionType = Object.freeze({
  API_CALL: 'API_CALL',
  COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
  NAVIGATE: 'NAVIGATE',
  OPEN_BOTTOM_SHEET: 'OPEN_BOTTOM_SHEET',
  SHOW_CONTEXT_MENU: 'SHOW_CONTEXT_MENU',
  SHOW_IMAGE_MODAL: 'SHOW_IMAGE_MODAL',
  SHOW_IMAGE_PREVIEW: 'SHOW_IMAGE_PREVIEW',
});

// -----------------------------------------------------------------------------
// Specific Component Interfaces (JSDoc Type Definitions)
// -----------------------------------------------------------------------------

/**
 * @typedef {SDUIBaseComponent & { type: 'Home' }} SDUIHome
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'Page' }} SDUIPage
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'Header' }} SDUIHeader
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'ProductList' }} SDUIProductList
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'CategoryGrid' }} SDUICategoryGrid
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'StoryRow' }} SDUIStoryRow
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'Box' }} SDUIBox
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'Label' }} SDUILabel
 */

/**
 * @typedef {SDUIBaseComponent & { type: 'Rating' }} SDUIRating
 */

/**
 * @typedef {Object} SDUIHeaderButtonData
 * @property {string} [id]
 * @property {string} [label]
 * @property {string} [icon]
 *
 * @typedef {SDUIBaseComponent & { type: 'HeaderButton', data?: SDUIHeaderButtonData }} SDUIHeaderButton
 */

/**
 * @typedef {Object} SDUICarouselData
 * @property {boolean} [autoPlay]
 * @property {number} [autoPlayInterval]
 * @property {boolean} [infiniteLoop]
 * @property {boolean} [showDots]
 * @property {number} [minSwipeDistance]
 *
 * @typedef {SDUIBaseComponent & { type: 'Carousel', data?: SDUICarouselData }} SDUICarousel
 */

/**
 * @typedef {Object} SDUICategoryItemData
 * @property {string} label
 * @property {string} icon
 *
 * @typedef {SDUIBaseComponent & { type: 'CategoryItem', data: SDUICategoryItemData }} SDUICategoryItem
 */

/**
 * @typedef {Object} SDUISearchBarData
 * @property {string} [icon]
 * @property {string} [placeholder]
 *
 * @typedef {SDUIBaseComponent & { type: 'SearchBar', data?: SDUISearchBarData }} SDUISearchBar
 */

/**
 * @typedef {Object} SDUIHeroBannerData
 * @property {string} imageUrl
 * @property {string} [altText]
 * @property {string} [title]
 * @property {string} [subtitle]
 *
 * @typedef {SDUIBaseComponent & { type: 'HeroBanner', data: SDUIHeroBannerData }} SDUIHeroBanner
 */

/**
 * @typedef {Object} SDUICountDownTimerData
 * @property {string} targetDate - ISO 8601 string
 * @property {string} [label]
 * @property {string} [expiredText]
 * @property {boolean|string} [showDays]
 *
 * @typedef {SDUIBaseComponent & { type: 'CountDownTimer', data: SDUICountDownTimerData }} SDUICountDownTimer
 */

/**
 * @typedef {Object} SDUITextData
 * @property {string} text
 *
 * @typedef {SDUIBaseComponent & { type: 'Text', data: SDUITextData }} SDUIText
 */

/**
 * @typedef {Object} SDUICouponCodeData
 * @property {string} title
 * @property {string} description
 * @property {string} copyLabel
 *
 * @typedef {SDUIBaseComponent & { type: 'CouponCode', data: SDUICouponCodeData }} SDUICouponCode
 */

/**
 * @typedef {Object} SDUIStoryCircleData
 * @property {string} label
 * @property {string} imageUrl
 *
 * @typedef {SDUIBaseComponent & { type: 'StoryCircle', data: SDUIStoryCircleData }} SDUIStoryCircle
 */

/**
 * @typedef {Object} SDUIShareButtonData
 * @property {string} label
 * @property {string} [icon]
 *
 * @typedef {SDUIBaseComponent & { type: 'ShareButton', data: SDUIShareButtonData }} SDUIShareButton
 */

/**
 * @typedef {Object} SDUINavBarItem
 * @property {string} label
 * @property {string} icon
 * @property {boolean|string} isActive
 * @property {SDUIActions} [actions]
 *
 * @typedef {Object} SDUINavBarData
 * @property {SDUINavBarItem[]} items
 *
 * @typedef {SDUIBaseComponent & { type: 'NavBar', data: SDUINavBarData }} SDUINavBar
 */

/**
 * @typedef {Object} SDUIFooterLink
 * @property {string} label
 * @property {string} url
 *
 * @typedef {Object} SDUIFooterSection
 * @property {string} title
 * @property {SDUIFooterLink[]} links
 *
 * @typedef {Object} SDUIFooterData
 * @property {SDUIFooterSection[]} sections
 * @property {string} copyrightText
 *
 * @typedef {SDUIBaseComponent & { type: 'Footer', data: SDUIFooterData }} SDUIFooter
 */

/**
 * @typedef {Object} SDUIProductCardData
 * @property {string} id
 *
 * @typedef {SDUIBaseComponent & { type: 'ProductCard', data: SDUIProductCardData }} SDUIProductCard
 */

/**
 * @typedef {Object} SDUIImageData
 * @property {string} imageUrl
 * @property {string} [altText]
 *
 * @typedef {SDUIBaseComponent & { type: 'Image', data: SDUIImageData }} SDUIImage
 */

/**
 * @typedef {Object} SDUISponsoredData
 * @property {string} text
 *
 * @typedef {SDUIBaseComponent & { type: 'Sponsored', data: SDUISponsoredData }} SDUISponsored
 */

/**
 * @typedef {Object} SDUIIconData
 * @property {string} [imageUrl]
 * @property {string} [altText]
 *
 * @typedef {SDUIBaseComponent & { type: 'Icon', data: SDUIIconData }} SDUIIcon
 */

/**
 * @typedef {Object} SDUITitleData
 * @property {string} text
 *
 * @typedef {SDUIBaseComponent & { type: 'Title', data: SDUITitleData }} SDUITitle
 */

/**
 * @typedef {Object} SDUIDescriptionData
 * @property {string} text
 * @property {number} [maxLines]
 *
 * @typedef {SDUIBaseComponent & { type: 'Description', data: SDUIDescriptionData }} SDUIDescription
 */

/**
 * @typedef {Object} SDUIScoreData
 * @property {string} text
 * @property {string} [out of]
 *
 * @typedef {SDUIBaseComponent & { type: 'Score', data: SDUIScoreData }} SDUIScore
 */

/**
 * @typedef {Object} SDUIReviewCountData
 * @property {string} text
 *
 * @typedef {SDUIBaseComponent & { type: 'ReviewCount', data: SDUIReviewCountData }} SDUIReviewCount
 */

/**
 * @typedef {Object} SDUIBadgeData
 * @property {string} text
 *
 * @typedef {SDUIBaseComponent & { type: 'Badge', data: SDUIBadgeData }} SDUIBadge
 */

/**
 * @typedef {Object} SDUIPriceBlockData
 * @property {string} sellingPrice
 * @property {string} mrp
 * @property {string} [discount]
 *
 * @typedef {SDUIBaseComponent & { type: 'PriceBlock', data: SDUIPriceBlockData }} SDUIPriceBlock
 */

/**
 * @typedef {Object} SDUIOfferTextData
 * @property {string} text
 *
 * @typedef {SDUIBaseComponent & { type: 'OfferText', data: SDUIOfferTextData }} SDUIOfferText
 */

/**
 * @typedef {Object} SDUIDeliveryInfoData
 * @property {string} [prefix]
 * @property {number} [daysOffset]
 *
 * @typedef {SDUIBaseComponent & { type: 'DeliveryInfo', data: SDUIDeliveryInfoData }} SDUIDeliveryInfo
 */

/**
 * @typedef {Object} SDUIButtonData
 * @property {string} label
 *
 * @typedef {SDUIBaseComponent & { type: 'Button', data: SDUIButtonData }} SDUIButton
 */

/**
 * @typedef {Object} SDUIIFrameData
 * @property {string} [src]
 * @property {string} [title]
 * @property {string} [subtitle]
 * @property {string} [badge]
 * @property {string} [height]
 * @property {boolean} [allowFullScreen]
 *
 * @typedef {SDUIBaseComponent & { type: 'IFrame', data?: SDUIIFrameData }} SDUIIFrame
 */

/**
 * @typedef {SDUIHome
 *  | SDUIPage
 *  | SDUIHeader
 *  | SDUIHeaderButton
 *  | SDUIProductList
 *  | SDUICarousel
 *  | SDUICategoryGrid
 *  | SDUICategoryItem
 *  | SDUISearchBar
 *  | SDUIHeroBanner
 *  | SDUICountDownTimer
 *  | SDUIBox
 *  | SDUIText
 *  | SDUICouponCode
 *  | SDUIStoryRow
 *  | SDUIStoryCircle
 *  | SDUIShareButton
 *  | SDUINavBar
 *  | SDUIFooter
 *  | SDUIProductCard
 *  | SDUIImage
 *  | SDUISponsored
 *  | SDUIIcon
 *  | SDUITitle
 *  | SDUIDescription
 *  | SDUIRating
 *  | SDUIScore
 *  | SDUIReviewCount
 *  | SDUIBadge
 *  | SDUIPriceBlock
 *  | SDUIOfferText
 *  | SDUIDeliveryInfo
 *  | SDUIButton
 *  | SDUIIFrame
 * } AnySDUIComponent
 */
