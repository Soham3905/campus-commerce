/**
 * StoryCircle Component Schema (Interface)
 */
export const StoryCircleSchema = {
  type: 'StoryCircle',
  displayName: 'Story Circle',
  category: 'Social',
  allowedChildren: [],
  defaultData: {
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    label: 'Campus Life'
  },
  defaultStyle: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    padding: '2px',
    border: '2px solid #e1306c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  }
};
