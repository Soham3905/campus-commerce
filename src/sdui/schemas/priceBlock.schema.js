/**
 * PriceBlock Component Schema (Interface)
 */
export const PriceBlockSchema = {
  type: 'PriceBlock',
  displayName: 'Price Block',
  category: 'Commerce',
  allowedChildren: [],
  defaultData: {
    sellingPrice: '₹7,089',
    mrp: '₹12,250',
    discount: '42%'
  },
  defaultStyle: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px'
  }
};
