/**
 * Label Component Schema (Interface)
 * 
 * Layout container for label tags (e.g., Sponsored tag with icon).
 */
export const LabelSchema = {
  type: 'Label',
  displayName: 'Label Container',
  category: 'Layout',
  allowedChildren: ['Sponsored', 'Text', 'Icon'],
  defaultStyle: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px'
  }
};
