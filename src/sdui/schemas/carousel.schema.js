/**
 * Carousel Component Schema (Interface)
 */
export const CarouselSchema = {
  type: 'Carousel',
  displayName: 'Carousel Slider',
  category: 'Marketing',
  allowedChildren: ['HeroBanner', 'Image', 'Box'],
  defaultData: {
    autoPlay: true,
    autoPlayInterval: 3000,
    infiniteLoop: true,
    showDots: true
  },
  defaultStyle: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '10px',
    width: '100%'
  }
};
