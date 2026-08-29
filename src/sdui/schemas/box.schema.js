/**
 * Box Component Schema (Interface)
 * 
 * Generic layout box container for holding SDUI child elements.
 */
export const BoxSchema = {
  type: 'Box',
  displayName: 'Box Container',
  category: 'Layout',
  allowedChildren: [], // Can hold any child component
  defaultStyle: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  }
};
