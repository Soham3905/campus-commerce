/**
 * HeroBanner Component Schema (Interface)
 */
export const HeroBannerSchema = {
  type: 'HeroBanner',
  displayName: 'Hero Banner',
  category: 'Marketing',
  allowedChildren: [], // Can hold CTA buttons or text
  defaultData: {
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
    altText: 'Campus Store Sale',
    title: 'Back to Campus Sale',
    subtitle: 'Up to 50% off on all student essentials'
  },
  defaultStyle: {
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    width: '100%'
  }
};
