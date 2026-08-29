/**
 * StoryRow Component Schema (Interface)
 * 
 * Container for horizontal campus stories bar.
 */
export const StoryRowSchema = {
  type: 'StoryRow',
  displayName: 'Story Row',
  category: 'Social',
  allowedChildren: ['StoryCircle'],
  defaultStyle: {
    display: 'flex',
    gap: '15px',
    padding: '10px 4px',
    overflowX: 'auto',
    backgroundColor: '#FFFFFF',
    scrollbarWidth: 'none',
    borderBottom: '1px solid #EFEFEF',
    borderRadius: '24px'
  }
};
