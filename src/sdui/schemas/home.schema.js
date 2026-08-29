/**
 * Home Component Schema (Interface)
 * 
 * Root container layout for SDUI home pages.
 */
export const HomeSchema = {
  type: 'Home',
  displayName: 'Home Layout',
  category: 'Layout',
  allowedChildren: [], // Can hold any child section
  defaultStyle: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh',
    boxSizing: 'border-box'
  }
};
