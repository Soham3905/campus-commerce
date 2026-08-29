/**
 * IFrame Component Schema (Interface)
 */
export const IFrameSchema = {
  type: 'IFrame',
  displayName: 'Embedded IFrame',
  category: 'Media',
  allowedChildren: [],
  defaultData: {
    src: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    title: 'Embedded Video / Map',
    allowFullScreen: true
  },
  defaultStyle: {
    width: '100%',
    height: '220px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#000000',
    boxSizing: 'border-box'
  }
};
