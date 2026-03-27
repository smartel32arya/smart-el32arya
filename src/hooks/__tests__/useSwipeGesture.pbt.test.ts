import { renderHook } from "@testing-library/react";
import * as fc from "fast-check";
import { useRef } from "react";
import { useSwipeGesture } from "../useSwipeGesture";

// ---------------------------------------------------------------------------
// jsdom polyfills for Touch / TouchEvent
// ---------------------------------------------------------------------------

// jsdom does not implement Touch or TouchEvent. We provide minimal stubs so
// that dispatchEvent works correctly with the hook's event listeners.

if (typeof (globalThis as Record<string, unknown>).Touch === "undefined") {
  class TouchStub {
    identifier: number;
    target: EventTarget;
    clientX: number;
    clientY: number;
    constructor(init: { identifier: number; target: EventTarget; clientX: number; clientY: number }) {
      this.identifier = init.identifier;
      this.target = init.target;
      this.clientX = init.clientX;
      this.clientY = init.clientY;
    }
  }
  (globalThis as Record<string, unknown>).Touch = TouchStub;
}

if (typeof (globalThis as Record<string, unknown>).TouchEvent === "undefined") {
  class TouchEventStub extends Event {
    touches: Touch[];
    changedTouches: Touch[];
    constructor(type: string, init: { touches?: Touch[]; changedTouches?: Touch[]; bubbles?: boolean }) {
      super(type, { bubbles: init.bubbles ?? true });
      this.touches = init.touches ?? [];
      this.changedTouches = init.changedTouches ?? [];
    }
  }
  (globalThis as Record<string, unknown>).TouchEvent = TouchEventStub;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Creates a real DOM element, attaches it to document.body, renders the hook
 * with a ref pointing to that element, then simulates a swipe gesture.
 *
 * Returns the vi.fn() spies so the caller can assert on them.
 */
function runSwipe(startX: number, startY: number, endX: number, endY: number) {
  const onSwipeLeft = vi.fn();
  const onSwipeRight = vi.fn();

  const el = document.createElement("div");
  document.body.appendChild(el);

  const { unmount } = renderHook(() => {
    const ref = useRef<HTMLElement>(el);
    useSwipeGesture(ref, { onSwipeLeft, onSwipeRight });
  });

  // Simulate touchstart
  el.dispatchEvent(
    new TouchEvent("touchstart", {
      touches: [new Touch({ identifier: 1, target: el, clientX: startX, clientY: startY })],
      changedTouches: [new Touch({ identifier: 1, target: el, clientX: startX, clientY: startY })],
      bubbles: true,
    })
  );

  // Simulate touchend
  el.dispatchEvent(
    new TouchEvent("touchend", {
      touches: [],
      changedTouches: [new Touch({ identifier: 1, target: el, clientX: endX, clientY: endY })],
      bubbles: true,
    })
  );

  unmount();
  document.body.removeChild(el);

  return { onSwipeLeft, onSwipeRight };
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

// Produces a left swipe: deltaX <= -50, |deltaX| > |deltaY|
// startX is fixed at 300 so endX = startX + deltaX stays positive.
const leftSwipeArb = fc
  .integer({ min: 50, max: 500 }) // abs(deltaX)
  .chain((absDx) =>
    fc.integer({ min: 0, max: absDx - 1 }).map((absDy) => ({
      startX: 300,
      startY: 200,
      endX: 300 - absDx,   // deltaX = -absDx  (right-to-left)
      endY: 200 + absDy,   // |deltaY| < |deltaX|
    }))
  );

// Produces a right swipe: deltaX >= 50, |deltaX| > |deltaY|
const rightSwipeArb = fc
  .integer({ min: 50, max: 500 })
  .chain((absDx) =>
    fc.integer({ min: 0, max: absDx - 1 }).map((absDy) => ({
      startX: 300,
      startY: 200,
      endX: 300 + absDx,   // deltaX = +absDx  (left-to-right)
      endY: 200 + absDy,
    }))
  );

// Produces a vertical-dominant gesture: |deltaY| > |deltaX|
// deltaX can be anything (including >= 50) — the vertical dominance should suppress callbacks.
const verticalGestureArb = fc
  .integer({ min: 1, max: 500 }) // abs(deltaY)
  .chain((absDy) =>
    fc.integer({ min: 0, max: absDy - 1 }).map((absDx) => ({
      startX: 300,
      startY: 200,
      endX: 300 + absDx,
      endY: 200 + absDy,
    }))
  );

// Produces a sub-threshold horizontal swipe: |deltaX| < 50, |deltaX| > |deltaY|
// absDx in [1, 49], absDy in [0, absDx - 1]
const subThresholdArb = fc
  .integer({ min: 1, max: 49 })
  .chain((absDx) =>
    fc.tuple(
      fc.integer({ min: 0, max: absDx - 1 }),
      fc.boolean()
    ).map(([absDy, goLeft]) => ({
      startX: 300,
      startY: 200,
      endX: goLeft ? 300 - absDx : 300 + absDx,
      endY: 200 + absDy,
    }))
  );

// ---------------------------------------------------------------------------
// Property 3: right-to-left swipe calls onSwipeLeft
// Feature: property-image-gallery, Property 3: right-to-left swipe (deltaX <= -50, |deltaX| > |deltaY|) calls onSwipeLeft
// Validates: Requirements 2.2, 2.1, 2.4
// ---------------------------------------------------------------------------
describe("P3: right-to-left swipe calls onSwipeLeft", () => {
  it("for all swipes with deltaX <= -50 and |deltaX| > |deltaY|, onSwipeLeft is called exactly once", () => {
    fc.assert(
      fc.property(leftSwipeArb, ({ startX, startY, endX, endY }) => {
        const { onSwipeLeft, onSwipeRight } = runSwipe(startX, startY, endX, endY);
        expect(onSwipeLeft).toHaveBeenCalledTimes(1);
        expect(onSwipeRight).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: left-to-right swipe calls onSwipeRight
// Feature: property-image-gallery, Property 4: left-to-right swipe (deltaX >= 50, |deltaX| > |deltaY|) calls onSwipeRight
// Validates: Requirements 2.3, 2.1, 2.4
// ---------------------------------------------------------------------------
describe("P4: left-to-right swipe calls onSwipeRight", () => {
  it("for all swipes with deltaX >= 50 and |deltaX| > |deltaY|, onSwipeRight is called exactly once", () => {
    fc.assert(
      fc.property(rightSwipeArb, ({ startX, startY, endX, endY }) => {
        const { onSwipeLeft, onSwipeRight } = runSwipe(startX, startY, endX, endY);
        expect(onSwipeRight).toHaveBeenCalledTimes(1);
        expect(onSwipeLeft).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: vertical-dominant gestures call neither callback
// Feature: property-image-gallery, Property 5: vertical-dominant gestures (|deltaY| > |deltaX|) call neither callback
// Validates: Requirements 2.5
// ---------------------------------------------------------------------------
describe("P5: vertical-dominant gestures are ignored", () => {
  it("for all gestures with |deltaY| > |deltaX|, neither callback is called", () => {
    fc.assert(
      fc.property(verticalGestureArb, ({ startX, startY, endX, endY }) => {
        const { onSwipeLeft, onSwipeRight } = runSwipe(startX, startY, endX, endY);
        expect(onSwipeLeft).not.toHaveBeenCalled();
        expect(onSwipeRight).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 6: sub-threshold swipes call neither callback
// Feature: property-image-gallery, Property 6: sub-threshold swipes (|deltaX| < 50) call neither callback
// Validates: Requirements 2.6
// ---------------------------------------------------------------------------
describe("P6: sub-threshold swipes are ignored", () => {
  it("for all horizontal swipes with |deltaX| < 50, neither callback is called", () => {
    fc.assert(
      fc.property(subThresholdArb, ({ startX, startY, endX, endY }) => {
        const { onSwipeLeft, onSwipeRight } = runSwipe(startX, startY, endX, endY);
        expect(onSwipeLeft).not.toHaveBeenCalled();
        expect(onSwipeRight).not.toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });
});
