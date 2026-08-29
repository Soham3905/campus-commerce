/**
 * Title Component Schema (Interface)
 * 
 * Defines the contract for the Title typography atom component.
 */

export const TitleSchema = {
  type: 'Title',
  displayName: 'Title',
  category: 'Typography',
  allowedChildren: [], // Leaf component
  defaultData: {
    text: 'Product Title'
  },
  defaultStyle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111111'
  }
};
