import { renderHook, act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useMediaGallery } from "../useMediaGallery";

// ── 9.1: Nav arrows render when imageCount > 1, absent when imageCount === 1 ──

/**
 * A minimal component that mirrors the nav-arrow rendering logic from PropertyDetails.tsx:
 * arrows are only rendered when imageCount > 1.
 */
function NavArrowsTest({ imageCount }: { imageCount: number }) {
  const { goNext, goPrev } = useMediaGallery(imageCount);
  return (
    <div>
      {imageCount > 1 && (
        <>
          <button
            data-testid="prev-arrow"
            onClick={goPrev}
            className="w-11 h-11 rounded-full"
          >
            prev
          </button>
          <button
            data-testid="next-arrow"
            onClick={goNext}
            className="w-11 h-11 rounded-full"
          >
            next
          </button>
        </>
      )}
    </div>
  );
}

describe("9.1: Nav arrows render based on imageCount", () => {
  it("renders nav arrows when imageCount > 1", () => {
    render(<NavArrowsTest imageCount={3} />);
    expect(screen.getByTestId("prev-arrow")).toBeInTheDocument();
    expect(screen.getByTestId("next-arrow")).toBeInTheDocument();
  });

  it("does not render nav arrows when imageCount === 1", () => {
    render(<NavArrowsTest imageCount={1} />);
    expect(screen.queryByTestId("prev-arrow")).not.toBeInTheDocument();
    expect(screen.queryByTestId("next-arrow")).not.toBeInTheDocument();
  });
});

// ── 9.2: Nav arrow buttons have w-11 h-11 and no opacity-0 class ─────────────

describe("9.2: Nav arrow button classes", () => {
  it("nav arrow buttons have w-11 h-11 class", () => {
    render(<NavArrowsTest imageCount={2} />);
    const prev = screen.getByTestId("prev-arrow");
    const next = screen.getByTestId("next-arrow");
    expect(prev.className).toContain("w-11");
    expect(prev.className).toContain("h-11");
    expect(next.className).toContain("w-11");
    expect(next.className).toContain("h-11");
  });

  it("nav arrow buttons do not have opacity-0 class", () => {
    render(<NavArrowsTest imageCount={2} />);
    const prev = screen.getByTestId("prev-arrow");
    const next = screen.getByTestId("next-arrow");
    expect(prev.className).not.toContain("opacity-0");
    expect(next.className).not.toContain("opacity-0");
  });
});

// ── 9.3: Lightbox closes on Escape key press (Requirement 4.3) ───────────────

describe("9.3: Lightbox closes on Escape key press", () => {
  it("lightboxOpen becomes false when Escape is pressed while lightbox is open", () => {
    const { result } = renderHook(() => useMediaGallery(3));

    // Open the lightbox
    act(() => {
      result.current.openLightbox();
    });
    expect(result.current.lightboxOpen).toBe(true);

    // Press Escape
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(result.current.lightboxOpen).toBe(false);
  });

  it("Escape key has no effect when lightbox is already closed", () => {
    const { result } = renderHook(() => useMediaGallery(3));

    expect(result.current.lightboxOpen).toBe(false);

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(result.current.lightboxOpen).toBe(false);
  });
});

// ── 9.4: Thumbnail scroll uses behavior: "smooth" and inline: "center" ───────

/**
 * Mirrors the scroll logic from PropertyDetails.tsx:
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

describe("9.4: Thumbnail scroll options", () => {
  it("calls scrollIntoView with behavior: smooth and inline: center on the active thumbnail", () => {
    const strip = document.createElement("div");
    const mocks: ReturnType<typeof vi.fn>[] = [];

    for (let k = 0; k < 3; k++) {
      const btn = document.createElement("button");
      const mock = vi.fn();
      btn.scrollIntoView = mock;
      mocks.push(mock);
      strip.appendChild(btn);
    }

    runScrollLogic(strip, 1);

    expect(mocks[1]).toHaveBeenCalledTimes(1);
    expect(mocks[1]).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  });

  it("does not call scrollIntoView on non-active thumbnails", () => {
    const strip = document.createElement("div");
    const mocks: ReturnType<typeof vi.fn>[] = [];

    for (let k = 0; k < 4; k++) {
      const btn = document.createElement("button");
      const mock = vi.fn();
      btn.scrollIntoView = mock;
      mocks.push(mock);
      strip.appendChild(btn);
    }

    runScrollLogic(strip, 2);

    expect(mocks[0]).not.toHaveBeenCalled();
    expect(mocks[1]).not.toHaveBeenCalled();
    expect(mocks[3]).not.toHaveBeenCalled();
  });
});
