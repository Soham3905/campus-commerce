/**
 * ProductCard Component Schema (Interface)
 * 
 * Defines the contract and allowed child elements for ProductCard.
 */

export const ProductCardSchema = {
  type: 'ProductCard',
  displayName: 'Product Card',
  category: 'Commerce',
  allowedChildren: [
    'Image',
    'Label',
    'Badge',
    'Title',
    'Description',
    'Rating',
    'PriceBlock',
    'OfferText',
    'DeliveryInfo',
    'Button',
    'ShareButton'
  ],
  defaultStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E4E7E4',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '280px',
    boxSizing: 'border-box'
  }
};
