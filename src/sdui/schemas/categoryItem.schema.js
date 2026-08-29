/**
 * CategoryItem Component Schema (Interface)
 */
export const CategoryItemSchema = {
  type: 'CategoryItem',
  displayName: 'Category Item',
  category: 'Navigation',
  allowedChildren: [],
  defaultData: {
    label: 'Books',
    icon: '📚'
  },
  defaultStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer'
  }
};
