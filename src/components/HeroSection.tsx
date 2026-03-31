import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { PRICE_RANGES, NEIGHBORHOODS, PROPERTY_TYPES } from "@/config";
import CustomSelect from "@/components/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setNeighborhood,
  setType,
  setPriceRange,
  selectNeighborhood,
  selectType,
  selectPriceRange,
} from "@/store/slices/filtersSlice";

const priceRanges = PRICE_RANGES;

const HeroSection = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [bgLoaded, setBgLoaded] = useState(false);

  const neighborhood = useAppSelector(selectNeighborhood);
  const type = useAppSelector(selectType);
  const priceRange = useAppSelector(selectPriceRange);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (neighborhood !== "الكل") params.set("neighborhood", neighborhood);
    if (type !== "الكل") params.set("type", type);
    if (priceRange !== "all") params.set("priceRange", priceRange);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!bgLoaded && (
          <div className="absolute inset-0 bg-navy-dark animate-pulse" />
        )}
        <img
          src={heroBg}
          alt="المنيا الجديدة"
          className={`w-full h-full object-cover scale-105 transition-opacity duration-700 ${bgLoaded ? "opacity-100" : "opacity-0"}`}
          loading="eager"
          onLoad={() => setBgLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/80 via-navy/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center px-4 py-12 sm:py-16">
        <div className="inline-block mb-4 sm:mb-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-gold/30">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse shrink-0"></span>
            منصة عقارية موثوقة
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6 animate-fade-in-up leading-tight"
          style={{ animationDelay: "0.1s" }}
        >
          أكبر منصة عقارية
          <br />
          <span className="text-gradient-gold">في المنيا</span>
        </h1>

        <p
          className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 sm:mb-12 animate-fade-in-up font-medium"
          style={{ animationDelay: "0.2s" }}
        >
          بيع · شراء · إيجار · إدارة عقارات
        </p>

        {/* Search Bar */}
        <div
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-5xl mx-auto animate-fade-in-up shadow-2xl"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-2 mb-4 sm:mb-6 text-foreground">
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gold shrink-0" />
            <span className="font-bold text-sm sm:text-base">ابحث عن عقارك</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 items-end">
            <div>
              <label className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2 block">الحي</label>
              <CustomSelect
                value={neighborhood}
                onChange={(v) => dispatch(setNeighborhood(v))}
                options={NEIGHBORHOODS.map((n) => ({ label: n, value: n }))}
                placeholder="اختر الحي"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2 block">نوع العقار</label>
              <CustomSelect
                value={type}
                onChange={(v) => dispatch(setType(v))}
                options={PROPERTY_TYPES.map((t) => ({ label: t, value: t }))}
                placeholder="اختر النوع"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2 block">نطاق السعر</label>
              <CustomSelect
                value={priceRange}
                onChange={(v) => dispatch(setPriceRange(v))}
                options={priceRanges.map((p) => ({ label: p.label, value: p.value }))}
                placeholder="اختر السعر"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2 block invisible select-none">بحث</label>
              <button
                onClick={handleSearch}
                className="w-full h-[48px] sm:h-[54px] gradient-gold text-gold-foreground font-bold rounded-xl px-4 sm:px-6 text-sm sm:text-base hover:opacity-90 hover:shadow-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                ابحث الآن
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
