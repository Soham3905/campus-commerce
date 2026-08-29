/**
 * CategoryGrid Component Schema (Interface)
 * 
 * Container for horizontal / grid category items.
 */
export const CategoryGridSchema = {
  type: 'CategoryGrid',
  displayName: 'Category Grid',
  category: 'Navigation',
  allowedChildren: ['CategoryItem'],
  defaultStyle: {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: '12px',
    padding: '10px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflowX: 'auto',
    scrollbarWidth: 'none'
  }
};
