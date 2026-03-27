import { useState, useEffect, useCallback } from "react";

interface UseMediaGalleryReturn {
  activeIndex: number;
  activeTab: "photos" | "video";
  lightboxOpen: boolean;
  goNext: () => void;
  goPrev: () => void;
  openLightbox: () => void;
  closeLightbox: () => void;
  setTab: (tab: "photos" | "video") => void;
  setIndex: (i: number) => void;
}

export function useMediaGallery(imageCount: number): UseMediaGalleryReturn {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"photos" | "video">("photos");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % imageCount);
  }, [imageCount]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + imageCount) % imageCount);
  }, [imageCount]);

  const openLightbox = useCallback(() => setLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const setTab = useCallback((tab: "photos" | "video") => setActiveTab(tab), []);
  const setIndex = useCallback((i: number) => setActiveIndex(i), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Always navigate with arrow keys (gallery + lightbox)
      if (e.key === "ArrowRight") { e.preventDefault(); goPrev(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goNext(); }
      // Escape only closes lightbox
      else if (e.key === "Escape" && lightboxOpen) closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, goNext, goPrev, closeLightbox]);

  return {
    activeIndex,
    activeTab,
    lightboxOpen,
    goNext,
    goPrev,
    openLightbox,
    closeLightbox,
    setTab,
    setIndex,
  };
}
