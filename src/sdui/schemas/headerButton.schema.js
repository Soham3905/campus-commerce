export const HeaderButtonSchema = {
  type: 'HeaderButton',
  displayName: 'Header Button',
  category: 'Navigation',
  allowedChildren: [], // Leaf component - no children
  defaultData: {
    label: 'Cart',
    icon: '🛒'
  },
  defaultStyle: {
    padding: '8px 12px',
    borderRadius: 12,
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    gap: 6
  }
};
