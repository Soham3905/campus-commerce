/**
 * Action Registry — Central definition of all supported SDUI actions and their configurable fields.
 */

export const ActionRegistry = {
  NAVIGATE: {
    type: "NAVIGATE",
    label: "Navigate Route",
    description: "Navigate to an internal route or page",
    icon: "🧭",
    fields: [
      {
        name: "route",
        label: "Target Route",
        type: "select",
        options: [
          { label: "Home (home)", value: "home" },
          { label: "Categories (categories)", value: "categories" },
          { label: "Deals (deals)", value: "deals" },
          { label: "Orders (orders)", value: "orders" },
          { label: "Cart (cart)", value: "cart" },
          { label: "Wishlist (wishlist)", value: "wishlist" },
          { label: "Account (account)", value: "account" },
          { label: "Login (login)", value: "login" },
          { label: "Sign Up (signup)", value: "signup" },
        ],
        defaultValue: "home",
      },
      {
        name: "actionName",
        label: "Action Identifier",
        type: "text",
        defaultValue: "ON_NAVIGATE",
      },
    ],
  },

  API_CALL: {
    type: "API_CALL",
    label: "API Request",
    description: "Trigger a remote HTTP API call",
    icon: "⚡",
    fields: [
      {
        name: "endpoint",
        label: "Endpoint URL",
        type: "url",
        defaultValue: "https://jsonplaceholder.typicode.com/todos/1",
      },
      {
        name: "actionName",
        label: "Action Identifier",
        type: "text",
        defaultValue: "ON_API_CALL",
      },
      {
        name: "debounceDuration",
        label: "Debounce (ms)",
        type: "number",
        defaultValue: 500,
      },
    ],
  },

  COPY_TO_CLIPBOARD: {
    type: "COPY_TO_CLIPBOARD",
    label: "Copy to Clipboard",
    description: "Copy a text string to the user clipboard",
    icon: "📋",
    fields: [
      {
        name: "value",
        label: "Text Value to Copy",
        type: "text",
        defaultValue: "CAMPUS50",
      },
    ],
  },

  OPEN_BOTTOM_SHEET: {
    type: "OPEN_BOTTOM_SHEET",
    label: "Open Bottom Sheet",
    description: "Display an interactive bottom modal sheet with options",
    icon: "📑",
    fields: [
      {
        name: "data.title",
        label: "Sheet Title",
        type: "text",
        defaultValue: "Share via",
      },
    ],
  },

  SHOW_CONTEXT_MENU: {
    type: "SHOW_CONTEXT_MENU",
    label: "Show Context Menu",
    description: "Open a popup context menu with selectable options",
    icon: "📋",
    fields: [
      {
        name: "data.title",
        label: "Menu Title",
        type: "text",
        defaultValue: "Actions",
      },
    ],
  },

  SHOW_IMAGE_MODAL: {
    type: "SHOW_IMAGE_MODAL",
    label: "Show Image Modal",
    description: "Open a focused modal overlay displaying a full image",
    icon: "🖼️",
    fields: [
      {
        name: "data.imageUrl",
        label: "Image URL",
        type: "image",
        defaultValue: "",
      },
    ],
  },

  SHOW_IMAGE_PREVIEW: {
    type: "SHOW_IMAGE_PREVIEW",
    label: "Show Image Preview",
    description: "Display a preview modal for an image asset",
    icon: "🔍",
    fields: [
      {
        name: "data.imageUrl",
        label: "Image URL",
        type: "image",
        defaultValue: "",
      },
    ],
  },
};

export const SUPPORTED_EVENTS = [
  { key: "onTap", label: "On Tap / Click", description: "Triggered when clicked or tapped" },
  { key: "onLongPress", label: "On Long Press", description: "Triggered after pressing for 600ms" },
  { key: "onHover", label: "On Hover", description: "Triggered when cursor enters" },
  { key: "onHoverOut", label: "On Hover Out", description: "Triggered when cursor leaves" },
  { key: "onChange", label: "On Change", description: "Triggered when input value changes (debounced)" },
  { key: "onSubmit", label: "On Submit", description: "Triggered on Enter key press" },
  { key: "onFocus", label: "On Focus", description: "Triggered when element gains focus" },
  { key: "onBlur", label: "On Blur", description: "Triggered when element loses focus" },
  { key: "onScroll", label: "On Scroll", description: "Triggered during container scroll" },
  { key: "onEndReached", label: "On End Reached", description: "Triggered when scrolled near edge" },
  { key: "onSwipeLeft", label: "On Swipe Left", description: "Triggered on left swipe gesture" },
  { key: "onSwipeRight", label: "On Swipe Right", description: "Triggered on right swipe gesture" },
  { key: "onMount", label: "On Mount", description: "Triggered when component renders on screen" },
  { key: "onUnmount", label: "On Unmount", description: "Triggered when component is removed" },
  { key: "onExpire", label: "On Expire", description: "Triggered when timer reaches zero" },
  { key: "onCopy", label: "On Copy", description: "Triggered when coupon is copied" },
];
