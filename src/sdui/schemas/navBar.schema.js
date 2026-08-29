/**
 * NavBar Component Schema (Interface)
 * 
 * Mobile bottom navigation bar contract.
 */
export const NavBarSchema = {
  type: 'NavBar',
  displayName: 'Bottom Navigation Bar',
  category: 'Navigation',
  allowedChildren: [],
  defaultData: {
    items: [
      { icon: '🏠', label: 'Home', isActive: 'true', actions: { onTap: { type: 'NAVIGATE', route: '/home' } } },
      { icon: '🔍', label: 'Explore', isActive: 'false', actions: { onTap: { type: 'NAVIGATE', route: '/explore' } } },
      { icon: '🛒', label: 'Cart', isActive: 'false', actions: { onTap: { type: 'NAVIGATE', route: '/cart' } } },
      { icon: '👤', label: 'Profile', isActive: 'false', actions: { onTap: { type: 'NAVIGATE', route: '/profile' } } }
    ]
  },
  defaultStyle: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E5E7EB',
    padding: '8px 0',
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100
  }
};
