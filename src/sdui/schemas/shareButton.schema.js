/**
 * ShareButton Component Schema (Interface)
 */
export const ShareButtonSchema = {
  type: 'ShareButton',
  displayName: 'Share Button',
  category: 'Input',
  allowedChildren: [],
  defaultData: {
    label: '',
    icon: '↗'
  },
  defaultStyle: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px solid #E4E7E4',
    backgroundColor: '#FFFFFF',
    color: '#101F26',
    fontSize: '17px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
