/**
 * Image Component Schema (Interface)
 * 
 * Defines the contract for the Image atom component.
 */

export const ImageSchema = {
  type: 'Image',
  displayName: 'Image',
  category: 'Media',
  allowedChildren: [], // Leaf component - no children
  defaultData: {
    imageUrl: 'https://m.media-amazon.com/images/I/816r5iLd4LL._AC_UL480_FMwebp_QL65_.jpg',
    altText: 'Product image'
  },
  defaultStyle: {
    width: '100%',
    height: '180px',
    objectFit: 'contain',
  }
};
