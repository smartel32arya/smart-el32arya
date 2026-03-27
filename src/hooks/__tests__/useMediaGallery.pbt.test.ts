import { renderHook, act } from "@testing-library/react";
import * as fc from "fast-check";
import { useMediaGallery } from "../useMediaGallery";

// Generates a valid (imageCount, currentIndex) pair
const niArb = fc
  .integer({ min: 1, max: 100 })
  .chain((n) => fc.tuple(fc.constant(n), fc.integer({ min: 0, max: n - 1 })));

// Feature: property-image-gallery, Property 1: goNext wraps correctly
// Validates: Requirements 1.2
describe("P1: goNext wraps correctly", () => {
  it("for all (n, i), goNext produces (i+1) % n", () => {
    fc.assert(
      fc.property(niArb, ([n, i]) => {
        const { result } = renderHook(() => useMediaGallery(n));

        act(() => {
          result.current.setIndex(i);
        });

        act(() => {
          result.current.goNext();
        });

        expect(result.current.activeIndex).toBe((i + 1) % n);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: property-image-gallery, Property 2: goPrev wraps correctly
// Validates: Requirements 1.3
describe("P2: goPrev wraps correctly", () => {
  it("for all (n, i), goPrev produces (i-1+n) % n", () => {
    fc.assert(
      fc.property(niArb, ([n, i]) => {
        const { result } = renderHook(() => useMediaGallery(n));

        act(() => {
          result.current.setIndex(i);
        });

        act(() => {
          result.current.goPrev();
        });

        expect(result.current.activeIndex).toBe((i - 1 + n) % n);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: property-image-gallery, Property 8: ArrowLeft navigates to previous image
// Validates: Requirements 4.1
describe("P8: ArrowLeft navigates to previous image", () => {
  it("for all (n, i) with lightbox open, ArrowLeft produces (i-1+n) % n", () => {
    fc.assert(
      fc.property(niArb, ([n, i]) => {
        const { result, unmount } = renderHook(() => useMediaGallery(n));

        act(() => {
          result.current.openLightbox();
          result.current.setIndex(i);
        });

        act(() => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
        });

        const expected = (i - 1 + n) % n;
        const actual = result.current.activeIndex;

        unmount();

        expect(actual).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: property-image-gallery, Property 9: ArrowRight navigates to next image
// Validates: Requirements 4.2
describe("P9: ArrowRight navigates to next image", () => {
  it("for all (n, i) with lightbox open, ArrowRight produces (i+1) % n", () => {
    fc.assert(
      fc.property(niArb, ([n, i]) => {
        const { result, unmount } = renderHook(() => useMediaGallery(n));

        act(() => {
          result.current.openLightbox();
          result.current.setIndex(i);
        });

        act(() => {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
        });

        const expected = (i + 1) % n;
        const actual = result.current.activeIndex;

        unmount();

        expect(actual).toBe(expected);
      }),
      { numRuns: 100 }
    );
  });
});
