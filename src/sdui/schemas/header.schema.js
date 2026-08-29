export const HeaderSchema = {
  type: 'Header',
  displayName: 'Navigation Header',
  category: 'Navigation',
  allowedChildren: ['HeaderButton', 'SearchBar', 'Title', 'Icon'],
  defaultStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 24px',
    backgroundColor: '#ffffff'
  }
};
