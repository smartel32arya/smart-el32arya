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
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") closeLightbox();
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
