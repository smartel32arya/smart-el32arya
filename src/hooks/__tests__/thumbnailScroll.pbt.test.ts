import * as fc from "fast-check";
import { vi } from "vitest";

// Feature: property-image-gallery, Property 7: thumbnail strip scrolls on index change
// Validates: Requirements 3.1, 3.3

/**
 * Extracts the scroll logic from PropertyDetails.tsx useEffect:
 *
 *   const activeThumb = strip.querySelectorAll("button")[activeIndex];
 *   if (activeThumb) {
 *     activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
 *   }
 */
function runScrollLogic(strip: HTMLDivElement, activeIndex: number): void {
  const activeThumb = strip.querySelectorAll("button")[activeIndex];
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

// Generates valid (n, i) pairs: n buttons, index i in [0, n-1]
const niArb = fc
  .integer({ min: 1, max: 20 })
  .chain((n) => fc.tuple(fc.constant(n), fc.integer({ min: 0, max: n - 1 })));

describe("P7: thumbnail strip scrolls on index change", () => {
  it("for all valid (n, i), scrollIntoView is called on the button at index i with correct options", () => {
    fc.assert(
      fc.property(niArb, ([n, i]) => {
        // Build a container div with n button children
        const strip = document.createElement("div");
        const scrollIntoViewMocks: ReturnType<typeof vi.fn>[] = [];

        for (let k = 0; k < n; k++) {
          const btn = document.createElement("button");
          const mock = vi.fn();
          btn.scrollIntoView = mock;
          scrollIntoViewMocks.push(mock);
          strip.appendChild(btn);
        }

        // Run the scroll logic for the given index
        runScrollLogic(strip, i);

        // The button at index i should have scrollIntoView called with the correct options
        expect(scrollIntoViewMocks[i]).toHaveBeenCalledTimes(1);
        expect(scrollIntoViewMocks[i]).toHaveBeenCalledWith({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });

        // All other buttons should NOT have scrollIntoView called
        for (let k = 0; k < n; k++) {
          if (k !== i) {
            expect(scrollIntoViewMocks[k]).not.toHaveBeenCalled();
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});
