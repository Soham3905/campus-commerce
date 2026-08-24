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
 * @property {string} [id] - Unique component identifier
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

/**
 * @typedef {SDUIBaseComponent & { type: 'Home' }} SDUIHome
 * @typedef {SDUIBaseComponent & { type: 'Page' }} SDUIPage
 * @typedef {SDUIBaseComponent & { type: 'Header' }} SDUIHeader
 * @typedef {SDUIBaseComponent & { type: 'ProductList' }} SDUIProductList
 * @typedef {SDUIBaseComponent & { type: 'CategoryGrid' }} SDUICategoryGrid
 * @typedef {SDUIBaseComponent & { type: 'StoryRow' }} SDUIStoryRow
 * @typedef {SDUIBaseComponent & { type: 'Box' }} SDUIBox
 * @typedef {SDUIBaseComponent & { type: 'Label' }} SDUILabel
 * @typedef {SDUIBaseComponent & { type: 'Rating' }} SDUIRating
 * @typedef {SDUIBaseComponent & { type: 'HeaderButton', data?: { id?: string, label?: string, icon?: string } }} SDUIHeaderButton
 * @typedef {SDUIBaseComponent & { type: 'Carousel', data?: { autoPlay?: boolean, autoPlayInterval?: number, infiniteLoop?: boolean, showDots?: boolean, minSwipeDistance?: number } }} SDUICarousel
 * @typedef {SDUIBaseComponent & { type: 'CategoryItem', data: { label: string, icon: string } }} SDUICategoryItem
 * @typedef {SDUIBaseComponent & { type: 'SearchBar', data?: { icon?: string, placeholder?: string } }} SDUISearchBar
 * @typedef {SDUIBaseComponent & { type: 'HeroBanner', data: { imageUrl: string, altText?: string, title?: string, subtitle?: string } }} SDUIHeroBanner
 * @typedef {SDUIBaseComponent & { type: 'CountDownTimer', data: { targetDate: string, label?: string, expiredText?: string, showDays?: boolean|string } }} SDUICountDownTimer
 * @typedef {SDUIBaseComponent & { type: 'Text', data: { text: string } }} SDUIText
 * @typedef {SDUIBaseComponent & { type: 'CouponCode', data: { title: string, description: string, copyLabel: string } }} SDUICouponCode
 * @typedef {SDUIBaseComponent & { type: 'StoryCircle', data: { label: string, imageUrl: string } }} SDUIStoryCircle
 * @typedef {SDUIBaseComponent & { type: 'ShareButton', data: { label: string, icon?: string } }} SDUIShareButton
 * @typedef {SDUIBaseComponent & { type: 'NavBar', data: { items: Array<{ label: string, icon: string, isActive: boolean|string, actions?: SDUIActions }> } }} SDUINavBar
 * @typedef {SDUIBaseComponent & { type: 'Footer', data: { sections: Array<{ title: string, links: Array<{ label: string, url: string }> }>, copyrightText: string } }} SDUIFooter
 * @typedef {SDUIBaseComponent & { type: 'ProductCard', data?: { id?: string } }} SDUIProductCard
 * @typedef {SDUIBaseComponent & { type: 'Image', data: { imageUrl: string, altText?: string } }} SDUIImage
 * @typedef {SDUIBaseComponent & { type: 'Sponsored', data: { text: string } }} SDUISponsored
 * @typedef {SDUIBaseComponent & { type: 'Icon', data: { imageUrl?: string, altText?: string } }} SDUIIcon
 * @typedef {SDUIBaseComponent & { type: 'Title', data: { text: string } }} SDUITitle
 * @typedef {SDUIBaseComponent & { type: 'Description', data: { text: string, maxLines?: number } }} SDUIDescription
 * @typedef {SDUIBaseComponent & { type: 'Score', data: { text: string, 'out of'?: string } }} SDUIScore
 * @typedef {SDUIBaseComponent & { type: 'ReviewCount', data: { text: string } }} SDUIReviewCount
 * @typedef {SDUIBaseComponent & { type: 'Badge', data: { text: string } }} SDUIBadge
 * @typedef {SDUIBaseComponent & { type: 'PriceBlock', data: { sellingPrice: string, mrp: string, discount?: string } }} SDUIPriceBlock
 * @typedef {SDUIBaseComponent & { type: 'OfferText', data: { text: string } }} SDUIOfferText
 * @typedef {SDUIBaseComponent & { type: 'DeliveryInfo', data: { prefix?: string, daysOffset?: number } }} SDUIDeliveryInfo
 * @typedef {SDUIBaseComponent & { type: 'Button', data: { label: string } }} SDUIButton
 * @typedef {SDUIBaseComponent & { type: 'IFrame', data?: { src?: string, title?: string, subtitle?: string, badge?: string, height?: string, allowFullScreen?: boolean } }} SDUIIFrame
 */

/**
 * @typedef {SDUIHome | SDUIPage | SDUIHeader | SDUIHeaderButton | SDUIProductList | SDUICarousel | SDUICategoryGrid | SDUICategoryItem | SDUISearchBar | SDUIHeroBanner | SDUICountDownTimer | SDUIBox | SDUIText | SDUICouponCode | SDUIStoryRow | SDUIStoryCircle | SDUIShareButton | SDUINavBar | SDUIFooter | SDUIProductCard | SDUIImage | SDUISponsored | SDUIIcon | SDUITitle | SDUIDescription | SDUIRating | SDUIScore | SDUIReviewCount | SDUIBadge | SDUIPriceBlock | SDUIOfferText | SDUIDeliveryInfo | SDUIButton | SDUIIFrame} AnySDUIComponent
 */
