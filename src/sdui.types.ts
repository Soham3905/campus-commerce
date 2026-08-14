// SDUI (Server-Driven UI) Interface Definitions
// These TypeScript interfaces define the schema for all SDUI components used in the application.

// -----------------------------------------------------------------------------
// Core Shared Interfaces
// -----------------------------------------------------------------------------

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface GridPlacement {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
}

export interface SDUIAction {
  type: 'API_CALL' | 'COPY_TO_CLIPBOARD' | 'NAVIGATE' | 'OPEN_BOTTOM_SHEET' | 'SHOW_CONTEXT_MENU';
  actionName?: string;
  endpoint?: string;
  value?: string;
  route?: string;
  debounceDuration?: number;
  minSwipeDistance?: number;
  nearEndThreshold?: number;
  data?: any;
}

export interface SDUIActions {
  onTap?: SDUIAction;
  onLongPress?: SDUIAction;
  onHover?: SDUIAction;
  onHoverOut?: SDUIAction;
  onMount?: SDUIAction;
  onUnmount?: SDUIAction;
  onScroll?: SDUIAction;
  onEndReached?: SDUIAction;
  onSwipeLeft?: SDUIAction;
  onSwipeRight?: SDUIAction;
  onSwipeUp?: SDUIAction;
  onSwipeDown?: SDUIAction;
  onDrag?: SDUIAction;
  onDrop?: SDUIAction;
  onFocus?: SDUIAction;
  onBlur?: SDUIAction;
  onSubmit?: SDUIAction;
  onChange?: SDUIAction;
  onError?: SDUIAction;
  onExpire?: SDUIAction;
  onCopy?: SDUIAction;
}

// Base component interface that all SDUI components extend
export interface SDUIBaseComponent {
  type: keyof typeof ComponentType;
  containerStyle?: Record<string, string | number>; // Equivalent to React.CSSProperties in JSON
  placement?: Partial<Record<DeviceType, GridPlacement>>;
  actions?: SDUIActions;
  children?: AnySDUIComponent[];
  data?: any;
}

// -----------------------------------------------------------------------------
// Component Types Enum
// -----------------------------------------------------------------------------

export enum ComponentType {
  Home = 'Home',
  Page = 'Page',
  Header = 'Header',
  HeaderButton = 'HeaderButton',
  ProductList = 'ProductList',
  Carousel = 'Carousel',
  CategoryGrid = 'CategoryGrid',
  CategoryItem = 'CategoryItem',
  SearchBar = 'SearchBar',
  HeroBanner = 'HeroBanner',
  CountDownTimer = 'CountDownTimer',
  Box = 'Box',
  Text = 'Text',
  CouponCode = 'CouponCode',
  StoryRow = 'StoryRow',
  StoryCircle = 'StoryCircle',
  ShareButton = 'ShareButton',
  NavBar = 'NavBar',
  Footer = 'Footer',
  ProductCard = 'ProductCard',
  Image = 'Image',
  Label = 'Label',
  Sponsored = 'Sponsored',
  Icon = 'Icon',
  Title = 'Title',
  Description = 'Description',
  Rating = 'Rating',
  Score = 'Score',
  ReviewCount = 'ReviewCount',
  Badge = 'Badge',
  PriceBlock = 'PriceBlock',
  OfferText = 'OfferText',
  DeliveryInfo = 'DeliveryInfo',
  Button = 'Button'
}

// -----------------------------------------------------------------------------
// Specific Component Interfaces
// -----------------------------------------------------------------------------

// Layout Components
export interface SDUIHome extends SDUIBaseComponent { type: 'Home'; }
export interface SDUIPage extends SDUIBaseComponent { type: 'Page'; }
export interface SDUIHeader extends SDUIBaseComponent { type: 'Header'; }
export interface SDUIProductList extends SDUIBaseComponent { type: 'ProductList'; }
export interface SDUICategoryGrid extends SDUIBaseComponent { type: 'CategoryGrid'; }
export interface SDUIStoryRow extends SDUIBaseComponent { type: 'StoryRow'; }
export interface SDUIBox extends SDUIBaseComponent { type: 'Box'; }
export interface SDUILabel extends SDUIBaseComponent { type: 'Label'; }
export interface SDUIRating extends SDUIBaseComponent { type: 'Rating'; }

// Interactive & Data Components
export interface SDUIHeaderButton extends SDUIBaseComponent {
  type: 'HeaderButton';
  data?: {
    id?: string;
    label?: string;
    icon?: string;
  };
}

export interface SDUICarousel extends SDUIBaseComponent {
  type: 'Carousel';
  data?: {
    autoPlay?: boolean;
    autoPlayInterval?: number;
    infiniteLoop?: boolean;
    showDots?: boolean;
    minSwipeDistance?: number;
  };
}

export interface SDUICategoryItem extends SDUIBaseComponent {
  type: 'CategoryItem';
  data: {
    label: string;
    icon: string;
  };
}

export interface SDUISearchBar extends SDUIBaseComponent {
  type: 'SearchBar';
  data?: {
    icon?: string;
    placeholder?: string;
  };
}

export interface SDUIHeroBanner extends SDUIBaseComponent {
  type: 'HeroBanner';
  data: {
    imageUrl: string;
    altText?: string;
    title?: string;
    subtitle?: string;
  };
}

export interface SDUICountDownTimer extends SDUIBaseComponent {
  type: 'CountDownTimer';
  data: {
    targetDate: string; // ISO 8601 string
    label?: string;
    expiredText?: string;
    showDays?: 'true' | 'false' | boolean;
  };
}

export interface SDUIText extends SDUIBaseComponent {
  type: 'Text';
  data: {
    text: string;
  };
}

export interface SDUICouponCode extends SDUIBaseComponent {
  type: 'CouponCode';
  data: {
    title: string;
    description: string;
    copyLabel: string;
  };
}

export interface SDUIStoryCircle extends SDUIBaseComponent {
  type: 'StoryCircle';
  data: {
    label: string;
    imageUrl: string;
  };
}

export interface SDUIShareButton extends SDUIBaseComponent {
  type: 'ShareButton';
  data: {
    label: string;
    icon?: string;
  };
}

export interface SDUINavBar extends SDUIBaseComponent {
  type: 'NavBar';
  data: {
    items: Array<{
      label: string;
      icon: string;
      isActive: 'true' | 'false' | boolean;
      actions?: SDUIActions;
    }>;
  };
}

export interface SDUIFooter extends SDUIBaseComponent {
  type: 'Footer';
  data: {
    sections: Array<{
      title: string;
      links: Array<{
        label: string;
        url: string;
      }>;
    }>;
    copyrightText: string;
  };
}

export interface SDUIProductCard extends SDUIBaseComponent {
  type: 'ProductCard';
  data: {
    id: string;
  };
}

export interface SDUIImage extends SDUIBaseComponent {
  type: 'Image';
  data: {
    imageUrl: string;
    altText?: string;
  };
}

export interface SDUISponsored extends SDUIBaseComponent {
  type: 'Sponsored';
  data: {
    text: string;
  };
}

export interface SDUIIcon extends SDUIBaseComponent {
  type: 'Icon';
  data: {
    imageUrl?: string;
    altText?: string;
  };
}

export interface SDUITitle extends SDUIBaseComponent {
  type: 'Title';
  data: {
    text: string;
  };
}

export interface SDUIDescription extends SDUIBaseComponent {
  type: 'Description';
  data: {
    text: string;
    maxLines?: number;
  };
}

export interface SDUIScore extends SDUIBaseComponent {
  type: 'Score';
  data: {
    text: string;
    'out of'?: string;
  };
}

export interface SDUIReviewCount extends SDUIBaseComponent {
  type: 'ReviewCount';
  data: {
    text: string;
  };
}

export interface SDUIBadge extends SDUIBaseComponent {
  type: 'Badge';
  data: {
    text: string;
  };
}

export interface SDUIPriceBlock extends SDUIBaseComponent {
  type: 'PriceBlock';
  data: {
    sellingPrice: string;
    mrp: string;
    discount?: string;
  };
}

export interface SDUIOfferText extends SDUIBaseComponent {
  type: 'OfferText';
  data: {
    text: string;
  };
}

export interface SDUIDeliveryInfo extends SDUIBaseComponent {
  type: 'DeliveryInfo';
  data: {
    prefix?: string;
    daysOffset?: number;
  };
}

export interface SDUIButton extends SDUIBaseComponent {
  type: 'Button';
  data: {
    label: string;
  };
}

// -----------------------------------------------------------------------------
// Union Type for All Components
// -----------------------------------------------------------------------------

export type AnySDUIComponent =
  | SDUIHome
  | SDUIPage
  | SDUIHeader
  | SDUIHeaderButton
  | SDUIProductList
  | SDUICarousel
  | SDUICategoryGrid
  | SDUICategoryItem
  | SDUISearchBar
  | SDUIHeroBanner
  | SDUICountDownTimer
  | SDUIBox
  | SDUIText
  | SDUICouponCode
  | SDUIStoryRow
  | SDUIStoryCircle
  | SDUIShareButton
  | SDUINavBar
  | SDUIFooter
  | SDUIProductCard
  | SDUIImage
  | SDUISponsored
  | SDUIIcon
  | SDUITitle
  | SDUIDescription
  | SDUIRating
  | SDUIScore
  | SDUIReviewCount
  | SDUIBadge
  | SDUIPriceBlock
  | SDUIOfferText
  | SDUIDeliveryInfo
  | SDUIButton;
