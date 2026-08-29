/**
 * Page Component Schema (Interface)
 * 
 * Grid canvas layout for coordinate-placed SDUI pages.
 */
export const PageSchema = {
  type: 'Page',
  displayName: 'Grid Page Canvas',
  category: 'Layout',
  allowedChildren: [], // Can hold any child component
  defaultStyle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(100, 1fr)',
    gridTemplateRows: 'repeat(200, 10px)',
    gap: '0px',
    padding: '5px',
    height: '100%'
  }
};
