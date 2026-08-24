import { useCallback, useRef } from "react";

/**
 * Hook to handle long-press interactions
 * @param {Function} onLongPress - Called when the long-press duration expires
 * @param {Function} [onClick] - Called if released before long-press duration
 * @param {number} [ms=600] - Duration threshold in milliseconds
 */
export const useLongPress = (onLongPress, onClick, ms = 600) => {
  const timerRef = useRef();
  const isLongPressStarted = useRef(false);

  const start = useCallback(
    (e) => {
      isLongPressStarted.current = false;
      timerRef.current = setTimeout(() => {
        isLongPressStarted.current = true;
        onLongPress(e);
      }, ms);
    },
    [onLongPress, ms]
  );

  const stop = useCallback(
    (e) => {
      clearTimeout(timerRef.current);
      if (!isLongPressStarted.current && onClick) {
        onClick(e);
      }
    },
    [onClick]
  );

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};
