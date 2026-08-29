/**
 * Icon Component Schema (Interface)
 */
export const IconSchema = {
  type: 'Icon',
  displayName: 'Icon',
  category: 'Media',
  allowedChildren: [],
  defaultData: {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Information_icon.svg/24px-Information_icon.svg.png',
    altText: 'Icon'
  },
  defaultStyle: {
    width: '14px',
    height: '14px',
    opacity: 0.4,
    cursor: 'pointer'
  }
};
