import { useEffect, useRef, useState } from "react";

interface UseSwipeGestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  minDistance?: number;
}

interface UseSwipeGestureReturn {
  /** Current drag offset in px (0 when not dragging) */
  dragOffset: number;
  /** True while the user's finger is on the screen */
  isDragging: boolean;
}

export function useSwipeGesture(
  ref: React.RefObject<HTMLElement>,
  options: UseSwipeGestureOptions
): UseSwipeGestureReturn {
  const { onSwipeLeft, onSwipeRight, minDistance = 50 } = options;

  const callbacksRef = useRef({ onSwipeLeft, onSwipeRight, minDistance });
  useEffect(() => {
    callbacksRef.current = { onSwipeLeft, onSwipeRight, minDistance };
  });

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startX.current === null || startY.current === null) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      // Only track horizontal-dominant drags
      if (Math.abs(dx) > Math.abs(dy)) {
        setDragOffset(dx);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (startX.current === null || startY.current === null) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;

      startX.current = null;
      startY.current = null;
      setDragOffset(0);
      setIsDragging(false);

      const { onSwipeLeft, onSwipeRight, minDistance } = callbacksRef.current;

      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
      if (Math.abs(deltaX) < minDistance) return;

      if (deltaX < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }); // no deps — re-runs every render to catch late-mounted elements

  return { dragOffset, isDragging };
}
