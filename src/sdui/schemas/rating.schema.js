/**
 * Rating Component Schema (Interface)
 * 
 * Molecule container that holds Score and ReviewCount children.
 */
export const RatingSchema = {
  type: 'Rating',
  displayName: 'Rating Container',
  category: 'Review',
  allowedChildren: ['Score', 'ReviewCount'],
  defaultStyle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};
