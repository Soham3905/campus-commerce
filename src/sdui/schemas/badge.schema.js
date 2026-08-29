/**
 * Badge Component Schema (Interface)
 * 
 * Defines the contract for the Badge atom component.
 */

export const BadgeSchema = {
  type: 'Badge',
  displayName: 'Badge',
  category: 'Commerce',
  allowedChildren: [], // Leaf component
  defaultData: {
    text: 'Deal of the day'
  },
  defaultStyle: {
    backgroundColor: '#cc0c39',
    color: '#ffffff',
    padding: '4px 10px',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '16px',
    display: 'inline-block'
  }
};
