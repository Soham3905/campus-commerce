import { useRef } from 'react';

export default function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance = 50 }) {
  const touchStart = useRef({ x: null, y: null });
  const mouseStart = useRef({ x: null, y: null });

  const handleTouchStart = (e) => {
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (touchStart.current.x === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const distanceX = touchStart.current.x - endX;
    const distanceY = touchStart.current.y - endY;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > minSwipeDistance && onSwipeLeft) onSwipeLeft();
      if (distanceX < -minSwipeDistance && onSwipeRight) onSwipeRight();
    } else {
      if (distanceY > minSwipeDistance && onSwipeUp) onSwipeUp();
      if (distanceY < -minSwipeDistance && onSwipeDown) onSwipeDown();
    }

    touchStart.current = { x: null, y: null };
  };

  const handleMouseDown = (e) => {
    mouseStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e) => {
    if (mouseStart.current.x === null) return;
    const endX = e.clientX;
    const endY = e.clientY;

    const distanceX = mouseStart.current.x - endX;
    const distanceY = mouseStart.current.y - endY;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > minSwipeDistance && onSwipeLeft) onSwipeLeft();
      if (distanceX < -minSwipeDistance && onSwipeRight) onSwipeRight();
    } else {
      if (distanceY > minSwipeDistance && onSwipeUp) onSwipeUp();
      if (distanceY < -minSwipeDistance && onSwipeDown) onSwipeDown();
    }

    mouseStart.current = { x: null, y: null };
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseUp,
    onDragStart: (e) => e.preventDefault()
  };
}
