import PropertyCard from "./PropertyCard";
import { useGetFeaturedPropertiesQuery } from "@/store/api/propertiesApi";
import { WHATSAPP_NUMBER } from "@/config";
import { SkeletonCard } from "@/components/property/SkeletonCard";
import { ErrorState } from "@/components/common/ErrorState";
import { styles } from "@/lib/styles";

const FeaturedProperties = () => {
  const { data: properties = [], isLoading, isError, refetch } = useGetFeaturedPropertiesQuery();
  const isInitialLoad = isLoading;

  return (
    <section id="properties" className="py-14 md:py-28 bg-background">
      <div className="container">
        <div className={`text-center mb-12 md:mb-16 transition-opacity duration-300 ${isInitialLoad ? "opacity-0" : "opacity-100"}`}>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            عقارات <span className="text-gradient-gold">لقطة</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            اكتشف أفضل العقارات المتاحة في المنيا الجديدة بأسعار تنافسية
          </p>
        </div>

        {isInitialLoad && (
          <>
            {/* Heading skeleton */}
            <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-3">
              <div className="h-10 md:h-14 w-64 bg-muted rounded-2xl animate-pulse" />
              <div className="h-5 w-96 max-w-full bg-muted rounded-xl animate-pulse" />
            </div>
            <div className={styles.propertyGrid}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </>
        )}

        {isError && <ErrorState onRetry={refetch} />}

        {!isInitialLoad && !isError && properties.length === 0 && (
          <div className="text-center py-20 bg-secondary rounded-3xl px-6">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-foreground font-black text-xl mb-2">لا توجد لقطات معروضة حالياً</p>
            <p className="text-muted-foreground text-base mb-8 max-w-md mx-auto">
              تابعنا على واتساب لتكون أول من يعرف بأحدث العقارات والعروض المميزة
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("مرحباً، أريد متابعة أحدث العقارات والعروض المميزة")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.882l6.186-1.443A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.724.868.936-3.619-.235-.372A9.818 9.818 0 1112 21.818z"/></svg>
              تواصل معنا على واتساب
            </a>
          </div>
        )}

        {!isInitialLoad && !isError && properties.length > 0 && (
          <div className={styles.propertyGrid}>
            {properties.map((property, i) => (
              <PropertyCard key={property.id} property={property} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
