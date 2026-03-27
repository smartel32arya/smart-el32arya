import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

// ── SkeletonCard ──────────────────────────────────────────────────────────────
import { SkeletonCard } from "@/components/property/SkeletonCard";

describe("SkeletonCard", () => {
  it("has aria-hidden and aria-busy attributes", () => {
    const { container } = render(<SkeletonCard />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveAttribute("aria-busy", "true");
  });
});

// ── LocationTag ───────────────────────────────────────────────────────────────
import LocationTag from "@/components/property/LocationTag";

describe("LocationTag", () => {
  it("renders neighborhood and location", () => {
    render(<LocationTag neighborhood="حي الزهراء" location="المنيا الجديدة" />);
    expect(screen.getByText(/حي الزهراء/)).toBeInTheDocument();
    expect(screen.getByText(/المنيا الجديدة/)).toBeInTheDocument();
  });
});

// ── SpecsRibbon ───────────────────────────────────────────────────────────────
import SpecsRibbon from "@/components/property/SpecsRibbon";

describe("SpecsRibbon", () => {
  it("renders bathrooms and area", () => {
    render(<SpecsRibbon bedrooms={3} bathrooms={2} area={150} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it("omits bedrooms when zero", () => {
    render(<SpecsRibbon bedrooms={0} bathrooms={1} area={80} />);
    // BedDouble icon should not be rendered — check by querying for the bedroom count text
    // When bedrooms=0 the block is not rendered, so "0" should not appear as a standalone spec
    const items = screen.queryAllByText("0");
    expect(items).toHaveLength(0);
  });
});

// ── ErrorState ────────────────────────────────────────────────────────────────
import { ErrorState } from "@/components/common/ErrorState";

describe("ErrorState", () => {
  it("shows 401 message", () => {
    render(<ErrorState statusCode={401} />);
    expect(screen.getByText("يجب تسجيل الدخول أولاً")).toBeInTheDocument();
  });

  it("shows 404 message", () => {
    render(<ErrorState statusCode={404} />);
    expect(screen.getByText("العنصر المطلوب غير موجود")).toBeInTheDocument();
  });

  it("shows 500 message", () => {
    render(<ErrorState statusCode={500} />);
    expect(screen.getByText("حدث خطأ في الخادم، حاول مجدداً لاحقاً")).toBeInTheDocument();
  });

  it("shows 403 expired message when apiMessage contains the phrase", () => {
    render(<ErrorState statusCode={403} apiMessage="انتهت صلاحية الحساب" />);
    expect(screen.getByText("انتهت صلاحية حسابك")).toBeInTheDocument();
  });

  it("shows generic 403 message for other 403 errors", () => {
    render(<ErrorState statusCode={403} apiMessage="forbidden" />);
    expect(screen.getByText("غير مصرح بالوصول لهذا العقار")).toBeInTheDocument();
  });

  it("renders login button for 401 when onLogin provided", () => {
    render(<ErrorState statusCode={401} onLogin={() => {}} />);
    expect(screen.getByText("تسجيل الدخول")).toBeInTheDocument();
  });

  it("renders retry button when onRetry provided", () => {
    render(<ErrorState statusCode={500} onRetry={() => {}} />);
    expect(screen.getByText("إعادة المحاولة")).toBeInTheDocument();
  });
});

// ── PropertyCard aria-label ───────────────────────────────────────────────────
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/data/properties";

const mockProperty: Property = {
  id: "1",
  title: "شقة فاخرة",
  description: "وصف",
  price: 1000000,
  priceFormatted: "١,٠٠٠,٠٠٠ ج.م",
  showPrice: true,
  location: "المنيا الجديدة",
  neighborhood: "حي الزهراء",
  type: "شقة",
  bedrooms: 3,
  bathrooms: 2,
  area: 150,
  image: "/placeholder.svg",
  images: [],
  video: null,
  amenities: [],
  featured: false,
  active: true,
  addedBy: "1",
  createdAt: "2024-01-01T00:00:00.000Z",
};

describe("PropertyCard", () => {
  it("has aria-label containing the property title", () => {
    render(
      <MemoryRouter>
        <PropertyCard property={mockProperty} />
      </MemoryRouter>
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", expect.stringContaining("شقة فاخرة"));
  });

  it("renders the price when showPrice is true", () => {
    render(
      <MemoryRouter>
        <PropertyCard property={mockProperty} />
      </MemoryRouter>
    );
    expect(screen.getByText("١,٠٠٠,٠٠٠ ج.م")).toBeInTheDocument();
  });

  it("renders WhatsApp CTA when showPrice is false", () => {
    render(
      <MemoryRouter>
        <PropertyCard property={{ ...mockProperty, showPrice: false }} />
      </MemoryRouter>
    );
    expect(screen.getByText("استفسر عن السعر")).toBeInTheDocument();
  });
});
