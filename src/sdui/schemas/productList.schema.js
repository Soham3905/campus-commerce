/**
 * ProductList Component Schema (Interface)
 * 
 * Container for lists of ProductCard components.
 */
export const ProductListSchema = {
  type: 'ProductList',
  displayName: 'Product List',
  category: 'Commerce',
  allowedChildren: ['ProductCard'],
  defaultStyle: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    overflowX: 'auto',
    width: 'max-content'
  }
};
