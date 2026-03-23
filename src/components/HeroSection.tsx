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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="المنيا الجديدة"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/80 via-navy/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center px-4">
        <div className="inline-block mb-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-gold/30">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
            منصة عقارية موثوقة
          </span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 animate-fade-in-up leading-tight"
          style={{ animationDelay: "0.1s" }}
        >
          اعثر على عقارك المثالي
          <br />
          <span className="text-gradient-gold">في المنيا الجديدة</span>
        </h1>
        <p
          className="text-white/90 text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 animate-fade-in-up font-medium"
          style={{ animationDelay: "0.2s" }}
        >
          أكبر منصة عقارية متخصصة - شقق، فلل، دوبلكس، ومحلات تجارية
        </p>

        {/* Search Bar */}
        <div
          className="glass-card rounded-3xl p-6 md:p-8 max-w-5xl mx-auto animate-fade-in-up shadow-2xl"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-center gap-2 mb-6 text-foreground">
            <SlidersHorizontal className="w-5 h-5 text-gold" />
            <span className="font-bold text-base">ابحث عن عقارك</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">الحي</label>
              <CustomSelect
                value={neighborhood}
                onChange={(v) => dispatch(setNeighborhood(v))}
                options={NEIGHBORHOODS.map((n) => ({ label: n, value: n }))}
                placeholder="اختر الحي"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">نوع العقار</label>
              <CustomSelect
                value={type}
                onChange={(v) => dispatch(setType(v))}
                options={PROPERTY_TYPES.map((t) => ({ label: t, value: t }))}
                placeholder="اختر النوع"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">نطاق السعر</label>
              <CustomSelect
                value={priceRange}
                onChange={(v) => dispatch(setPriceRange(v))}
                options={priceRanges.map((p) => ({ label: p.label, value: p.value }))}
                placeholder="اختر السعر"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block invisible select-none">بحث</label>
              <button
                onClick={handleSearch}
                className="w-full h-[54px] gradient-gold text-gold-foreground font-bold rounded-xl px-6 text-base hover:opacity-90 hover:shadow-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Search className="w-5 h-5" />
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
