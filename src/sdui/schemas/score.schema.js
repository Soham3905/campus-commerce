/**
 * Score Component Schema (Interface)
 */
export const ScoreSchema = {
  type: 'Score',
  displayName: 'Score',
  category: 'Review',
  allowedChildren: [],
  defaultData: {
    text: '4.4',
    'out of': '5'
  },
  defaultStyle: {
    fontSize: '10px',
    color: '#e77600',
    fontWeight: 'bold',
    backgroundColor: 'rgba(231,118,0,0.1)',
    borderRadius: '8px',
    padding: '2px 6px',
    display: 'inline-flex',
    alignItems: 'center'
  }
};
