import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight, MapPin, BedDouble, Bath, Maximize,
  MessageCircle, Send, CheckCircle2, AlertCircle, ArrowLeft,
  Play, Image, ChevronLeft, ChevronRight, X, ZoomIn,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useGetPropertyByIdQuery } from "@/store/api/propertiesApi";
import { WHATSAPP_NUMBER } from "@/config";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-muted rounded-xl animate-pulse ${className}`} />
);

const PropertyDetailsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <div className="lg:col-span-2 space-y-8">
      <Skeleton className="w-full h-[400px] rounded-2xl" />
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-border space-y-2 text-center">
            <Skeleton className="w-8 h-8 mx-auto rounded-full" />
            <Skeleton className="h-6 w-10 mx-auto" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border p-7 space-y-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
    <div>
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <Skeleton className="h-6 w-40" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-[54px] w-full" />)}
        <Skeleton className="h-[54px] w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"photos" | "video">("photos");
  const [lightbox, setLightbox] = useState(false);
  const [name, setName] = useState("");
  const [msgText, setMsgText] = useState("");

  const { data: property, isLoading, isError, refetch } = useGetPropertyByIdQuery(id ?? "");

  // Use property's own contact number if available, fallback to site default
  const contactNumber = property?.contactPhone || WHATSAPP_NUMBER;

  useEffect(() => {
    if (!lightbox || !property) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  setActiveIndex((i) => (i + 1) % property.images.length);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i - 1 + property.images.length) % property.images.length);
      if (e.key === "Escape")     setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, property]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = [
      property.type,
      property.area ? `${property.area} م²` : "",
      property.bedrooms > 0 ? `${property.bedrooms} غرف` : "",
      property.bathrooms ? `${property.bathrooms} حمام` : "",
      property.showPrice !== false ? property.priceFormatted : "أريد معرفة السعر",
      `${property.neighborhood} - ${property.location}`,
    ].filter(Boolean).join(" | ");

    const text = [
      `مرحباً، أنا ${name || "أحد العملاء"}`,
      `أريد الاستفسار عن: ${property.title}`,
      `التفاصيل: ${specs}`,
      msgText ? `الرسالة: ${msgText}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${contactNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <SiteHeader />

      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm mb-8 transition-colors font-semibold group"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            العودة للعقارات
          </Link>

          {/* ── Loading ── */}
          {isLoading && <PropertyDetailsSkeleton />}

          {/* ── Error ── */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-foreground font-bold text-xl">تعذّر تحميل بيانات العقار</p>
              <p className="text-muted-foreground text-sm">تحقق من اتصالك وحاول مجدداً</p>
              <button
                onClick={refetch}
                className="gradient-gold text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* ── Lightbox ── */}
          {lightbox && property && (
            <div
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
              onClick={() => setLightbox(false)}
            >
              {/* close */}
              <button className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10">
                <X className="w-5 h-5" />
              </button>

              {/* counter */}
              <span className="absolute top-4 start-4 bg-white/10 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                {activeIndex + 1} / {property.images.length}
              </span>

              {/* image */}
              <img
                src={property.images[activeIndex] || "/placeholder.svg"}
                alt={property.title}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl select-none"
                onClick={(e) => e.stopPropagation()}
              />

              {/* prev */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i - 1 + property.images.length) % property.images.length); }}
                    className="absolute start-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % property.images.length); }}
                    className="absolute end-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* thumbnails strip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/60 rounded-2xl overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                    className={`shrink-0 rounded-lg overflow-hidden transition-all ${i === activeIndex ? "ring-2 ring-gold opacity-100" : "opacity-40 hover:opacity-70"}`}
                    style={{ width: 56, height: 40 }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
          {!isLoading && !isError && !property && (
            <div className="text-center py-32">
              <p className="text-foreground font-bold text-xl mb-4">العقار غير موجود</p>
              <Link to="/properties" className="text-gold hover:underline font-semibold">
                العودة للعقارات
              </Link>
            </div>
          )}

          {/* ── Content ── */}
          {!isLoading && !isError && property && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* ── Media Gallery ── */}
                <div className="rounded-3xl overflow-hidden border border-border shadow-lg bg-black">

                  {/* Tab bar — only show if video exists */}
                  {property.video && (
                    <div className="flex bg-black/90 border-b border-white/10">
                      <button
                        onClick={() => setActiveTab("photos")}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors ${
                          activeTab === "photos"
                            ? "text-gold border-b-2 border-gold"
                            : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        <Image className="w-4 h-4" />
                        الصور ({property.images.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("video")}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors ${
                          activeTab === "video"
                            ? "text-gold border-b-2 border-gold"
                            : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        <Play className="w-4 h-4" />
                        فيديو
                      </button>
                    </div>
                  )}

                  {/* ── Video tab ── */}
                  {activeTab === "video" && property.video && (
                    <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
                      <video
                        src={property.video}
                        controls
                        className="w-full h-full object-contain"
                        poster={property.images[0] || "/placeholder.svg"}
                      />
                    </div>
                  )}

                  {/* ── Photos tab ── */}
                  {activeTab === "photos" && (
                    <>
                      {/* Main image */}
                      <div className="relative bg-black group" style={{ aspectRatio: "16/9" }}>
                        <img
                          src={property.images[activeIndex] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover cursor-zoom-in"
                          loading="eager"
                          onClick={() => setLightbox(true)}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                        />

                        {/* zoom hint */}
                        <button
                          onClick={() => setLightbox(true)}
                          className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>

                        {/* counter badge */}
                        <span className="absolute top-4 start-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          {activeIndex + 1} / {property.images.length}
                        </span>

                        {/* nav arrows */}
                        {property.images.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveIndex((i) => (i - 1 + property.images.length) % property.images.length)}
                              className="absolute top-1/2 start-3 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setActiveIndex((i) => (i + 1) % property.images.length)}
                              className="absolute top-1/2 end-3 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnails */}
                      {property.images.length > 1 && (
                        <div className="flex gap-2 p-3 overflow-x-auto bg-black/80 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {property.images.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveIndex(i)}
                              className={`shrink-0 rounded-xl overflow-hidden transition-all duration-200 ${
                                i === activeIndex
                                  ? "ring-2 ring-gold opacity-100 scale-105"
                                  : "opacity-50 hover:opacity-80"
                              }`}
                              style={{ width: 80, height: 56 }}
                            >
                              <img
                                src={img || "/placeholder.svg"}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                              />
                            </button>
                          ))}

                          {/* video thumbnail shortcut */}
                          {property.video && (
                            <button
                              onClick={() => setActiveTab("video")}
                              className="shrink-0 rounded-xl overflow-hidden opacity-60 hover:opacity-100 transition-all relative bg-black"
                              style={{ width: 80, height: 56 }}
                            >
                              <img
                                src={property.images[0] || "/placeholder.svg"}
                                alt="video"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <Play className="w-5 h-5 text-white fill-white" />
                              </div>
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Title & Price */}
                <div className="bg-white rounded-2xl border border-border p-6 shadow-md">
                  {property.featured && (
                    <span className="inline-block gradient-gold text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                      لقطة
                    </span>
                  )}
                  <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground text-base mb-5">
                    <MapPin className="w-5 h-5 text-gold" />
                    <span className="font-semibold">{property.neighborhood} - {property.location}</span>
                  </div>
                  {property.showPrice === false ? (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                      <p className="text-amber-800 font-black text-lg mb-1">لمعرفه السعر عند الجدية - تواصل معنا</p>
                      <p className="text-amber-700 text-sm mb-4">هذا العقار بسعر خاص — تواصل معنا الآن واحصل على السعر فوراً</p>
                      <a
                        href={`https://wa.me/${contactNumber}?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن سعر العقار:\n${property.title}\nالتفاصيل: ${[property.type, property.area ? `${property.area} م²` : "", property.bedrooms > 0 ? `${property.bedrooms} غرف` : "", property.bathrooms ? `${property.bathrooms} حمام` : "", `${property.neighborhood} - ${property.location}`].filter(Boolean).join(" | ")}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <MessageCircle className="w-5 h-5" />
                        اسأل عن السعر عبر واتساب
                      </a>
                    </div>
                  ) : (
                    <div className="text-gold font-black text-3xl md:text-4xl">{property.priceFormatted}</div>
                  )}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                  {property.bedrooms > 0 && (
                    <div className="bg-white rounded-2xl p-6 text-center border border-border shadow-md hover:shadow-lg transition-shadow">
                      <BedDouble className="w-8 h-8 mx-auto text-gold mb-2" />
                      <div className="text-foreground font-black text-2xl">{property.bedrooms}</div>
                      <div className="text-muted-foreground text-sm font-semibold">غرف نوم</div>
                    </div>
                  )}
                  <div className="bg-white rounded-2xl p-6 text-center border border-border shadow-md hover:shadow-lg transition-shadow">
                    <Bath className="w-8 h-8 mx-auto text-gold mb-2" />
                    <div className="text-foreground font-black text-2xl">{property.bathrooms}</div>
                    <div className="text-muted-foreground text-sm font-semibold">حمامات</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 text-center border border-border shadow-md hover:shadow-lg transition-shadow">
                    <Maximize className="w-8 h-8 mx-auto text-gold mb-2" />
                    <div className="text-foreground font-black text-2xl">{property.area}</div>
                    <div className="text-muted-foreground text-sm font-semibold">متر مربع</div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-border p-7 md:p-8 shadow-md">
                  <h2 className="font-black text-2xl text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1 h-8 gradient-gold rounded-full inline-block" />
                    الوصف
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed">{property.description}</p>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-2xl border border-border p-7 md:p-8 shadow-md">
                  <h2 className="font-black text-2xl text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-8 gradient-gold rounded-full inline-block" />
                    المميزات
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-3 text-base text-foreground bg-secondary/50 rounded-xl p-4">
                        <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                        <span className="font-semibold">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder - removed */}
              </div>

              {/* Sidebar - Contact */}
              <div>
                <div className="bg-white rounded-3xl border border-border shadow-xl p-6 md:p-7 lg:sticky lg:top-24">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="font-black text-xl text-foreground mb-1">تواصل مع المعلن</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      سيتم فتح واتساب برسالتك جاهزة
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSend}>
                    <div>
                      <label className="text-sm font-bold text-foreground mb-2 block">الاسم الكامل</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="أدخل اسمك"
                        className="w-full bg-secondary text-foreground rounded-xl px-5 h-[54px] border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all text-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-foreground mb-2 block">رسالتك</label>
                      <textarea
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        placeholder={`أريد الاستفسار عن: ${property.title}`}
                        rows={4}
                        className="w-full bg-secondary text-foreground rounded-xl px-5 py-4 border-2 border-border focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none resize-none transition-all text-base"
                      />
                    </div>

                    {/* Preview */}
                    {(name || msgText) && (
                      <div className="bg-[#25D366]/5 border-2 border-[#25D366]/20 rounded-xl p-3 text-sm text-foreground/80 leading-relaxed animate-fade-in">
                        <p className="text-xs font-bold text-[#25D366] mb-1.5 uppercase tracking-wider">معاينة الرسالة</p>
                        <p className="whitespace-pre-line text-xs">
                          {[
                            `مرحباً، أنا ${name || "..."}`,
                            `أريد الاستفسار عن: ${property.title}`,
                            `التفاصيل: ${[property.type, property.area ? `${property.area} م²` : "", property.bedrooms > 0 ? `${property.bedrooms} غرف` : "", property.bathrooms ? `${property.bathrooms} حمام` : "", property.showPrice !== false ? property.priceFormatted : "السعر غير معروض", `${property.neighborhood} - ${property.location}`].filter(Boolean).join(" | ")}`,
                            msgText ? `الرسالة: ${msgText}` : "",
                          ].filter(Boolean).join("\n")}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base rounded-2xl h-[54px] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                      <Send className="w-4 h-4" />
                      إرسال عبر واتساب
                    </button>
                  </form>

                  {/* Direct WhatsApp */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <a
                      href={`https://wa.me/${contactNumber}?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${property.title}\nالتفاصيل: ${[property.type, property.area ? `${property.area} م²` : "", property.bedrooms > 0 ? `${property.bedrooms} غرف` : "", property.bathrooms ? `${property.bathrooms} حمام` : "", property.showPrice !== false ? property.priceFormatted : "أريد معرفة السعر", `${property.neighborhood} - ${property.location}`].filter(Boolean).join(" | ")}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between w-full bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-2xl px-5 py-4 transition-all border-2 border-border hover:border-[#25D366]/40"
                    >
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        <div>
                          <p className="font-bold text-sm leading-tight">تواصل مباشرة</p>
                          <p className="text-muted-foreground text-xs">رد فوري خلال دقائق</p>
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PropertyDetails;
