import { useState } from "react";
import { X, LayoutGrid, List, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PropertyCard from "@/components/PropertyCard";
import CustomSelect from "@/components/CustomSelect";
import { SkeletonCard } from "@/components/property/SkeletonCard";
import { ErrorState } from "@/components/common/ErrorState";
import { PRICE_RANGES, SORT_OPTIONS, NEIGHBORHOODS, PROPERTY_TYPES, WHATSAPP_NUMBER } from "@/config";
import { usePropertyList } from "@/hooks/usePropertyList";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";
import { styles } from "@/lib/styles";
import type { SortOption } from "@/store/slices/filtersSlice";

const priceRanges = PRICE_RANGES;
const sortOptions = SORT_OPTIONS;

const Properties = () => {
  const [view, setView] = useState<"grid" | "list">("grid");

  const {
    neighborhood,
    type,
    priceRange,
    sort,
    page,
    hasActiveFilters,
    setNeighborhood,
    setType,
    setPriceRange,
    setSort,
    setPage,
    clearFilters,
  } = usePropertyFilters();

  const { properties, total, totalPages, isInitialLoad, isRefetching, isError, refetch } = usePropertyList();

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader />

      {/* Page Header with Filters */}
      <section className="bg-gradient-to-br from-navy-dark via-navy to-navy-light py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--gold)/0.15),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
              جميع <span className="text-gradient-gold">العقارات</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg">
              تصفح {total} عقار متاح في المنيا الجديدة
            </p>
          </div>

          {/* Filters */}
          <div className={`${styles.glassCard} max-w-5xl mx-auto`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">الحي</label>
                <CustomSelect value={neighborhood} onChange={(v) => setNeighborhood(v)} options={NEIGHBORHOODS.map((n) => ({ label: n, value: n }))} placeholder="اختر الحي" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">نوع العقار</label>
                <CustomSelect value={type} onChange={(v) => setType(v)} options={PROPERTY_TYPES.map((t) => ({ label: t, value: t }))} placeholder="اختر النوع" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">نطاق السعر</label>
                <CustomSelect value={priceRange} onChange={(v) => setPriceRange(v)} options={priceRanges} placeholder="اختر السعر" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block invisible select-none">ترتيب</label>
                <CustomSelect value={sort} onChange={(v) => setSort(v as SortOption)} options={sortOptions} placeholder="ترتيب حسب" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-10 md:py-14">
        <div className="container">

          {/* ── Error State ── */}
          {isError && <ErrorState onRetry={refetch} />}

          {!isError && (
            <>
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {isInitialLoad ? (
                    <div className="h-6 w-24 bg-muted rounded-lg animate-pulse" />
                  ) : (
                    <>
                      <p className="text-foreground font-bold text-lg flex items-center gap-2">
                        {isRefetching && <Loader2 className="w-4 h-4 animate-spin text-gold" />}
                        {total === 0 ? "لا توجد نتائج" : `${total} عقار`}
                      </p>
                      {totalPages > 1 && (
                        <span className="text-muted-foreground text-sm">
                          — صفحة {page} من {totalPages}
                        </span>
                      )}
                    </>
                  )}
                  {hasActiveFilters && !isInitialLoad && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-sm text-gold hover:text-gold-dark font-semibold transition-colors border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/5"
                    >
                      <X className="w-4 h-4" />
                      مسح الفلاتر
                    </button>
                  )}
                </div>

                {/* View Toggle */}
                <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="عرض شبكي"
                    className={`p-3 transition-colors ${view === "grid" ? "bg-gold text-white" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="عرض قائمة"
                    className={`p-3 transition-colors ${view === "list" ? "bg-gold text-white" : "text-muted-foreground hover:bg-secondary"}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* ── Initial Load: Skeleton Grid ── */}
              {isInitialLoad && (
                <div className={view === "grid" ? styles.propertyGrid : "flex flex-col gap-5"}>
                  {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* ── Empty State ── */}
              {!isInitialLoad && total === 0 && (
                <div className="text-center py-24 bg-secondary/30 rounded-3xl px-6">
                  <div className="text-6xl mb-4">🔍</div>
                  {hasActiveFilters ? (
                    <>
                      <p className="text-foreground text-xl font-bold mb-2">لا توجد عقارات مطابقة</p>
                      <p className="text-muted-foreground text-sm mb-6">جرب تغيير معايير البحث</p>
                      <button
                        onClick={clearFilters}
                        className="gradient-gold text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity mb-4"
                      >
                        مسح الفلاتر
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-foreground text-xl font-bold mb-2">لا توجد عقارات متاحة حالياً</p>
                      <p className="text-muted-foreground text-sm mb-6">تابعنا قريباً لعرض أحدث العقارات</p>
                    </>
                  )}
                  <div className="mt-2">
                    <p className="text-muted-foreground text-sm mb-3">هل تبحث عن شيء محدد؟ تواصل معنا مباشرة</p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، أبحث عن عقار ولم أجد ما يناسبني، هل يمكنكم مساعدتي؟")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.724.868.936-3.619-.235-.372A9.818 9.818 0 1112 21.818z"/></svg>
                      تواصل معنا على واتساب
                    </a>
                  </div>
                </div>
              )}

              {/* ── Properties Grid (with refetch dimming) ── */}
              {!isInitialLoad && total > 0 && (
                <>
                  <div
                    aria-busy={isInitialLoad}
                    className={`transition-opacity duration-200 ${isRefetching ? "opacity-40 pointer-events-none" : "opacity-100"} ${
                      view === "grid" ? styles.propertyGrid : "flex flex-col gap-5"
                    }`}
                  >
                    {properties.map((property, i) => (
                      <PropertyCard key={property.id} property={property} priority={i < 3 && page === 1} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav aria-label="التنقل بين الصفحات">
                      <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-12 flex-wrap">
                        <button
                          onClick={() => goToPage(page - 1)}
                          disabled={page === 1 || isRefetching}
                          aria-label="الصفحة السابقة"
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-border font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gold hover:text-gold"
                        >
                          <ChevronRight className="w-4 h-4" />
                          السابق
                        </button>

                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                            const isActive = p === page;
                            const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                            if (!show) {
                              if (p === 2 && page > 3) return <span key={p} className="px-1 text-muted-foreground select-none">...</span>;
                              if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="px-1 text-muted-foreground select-none">...</span>;
                              return null;
                            }
                            return (
                              <button
                                key={p}
                                onClick={() => goToPage(p)}
                                disabled={isRefetching}
                                aria-label={`الصفحة ${p}`}
                                aria-current={isActive ? "page" : undefined}
                                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all disabled:cursor-not-allowed ${
                                  isActive
                                    ? "gradient-gold text-white shadow-lg scale-105"
                                    : "border-2 border-border hover:border-gold hover:text-gold"
                                }`}
                              >
                                {p}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => goToPage(page + 1)}
                          disabled={page === totalPages || isRefetching}
                          aria-label="الصفحة التالية"
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-border font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-gold hover:text-gold"
                        >
                          التالي
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </nav>
                  )}
                </>
              )}
            </>
          )}

        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Properties;
