import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight, MapPin, BedDouble, Bath, Maximize,
  MessageCircle, Send, CheckCircle2, AlertCircle, ArrowLeft,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useGetPropertyByIdQuery } from "@/store/api/propertiesApi";
import { WHATSAPP_NUMBER, WHATSAPP_URL } from "@/config";

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
  const [activeImage, setActiveImage] = useState(0);
  const [name, setName] = useState("");
  const [msgText, setMsgText] = useState("");

  const { data: property, isLoading, isError, refetch } = useGetPropertyByIdQuery(id ?? "");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const specs = [
      property.type,
      property.area ? `${property.area} م²` : "",
      property.bedrooms > 0 ? `${property.bedrooms} غرف` : "",
      property.bathrooms ? `${property.bathrooms} حمام` : "",
      property.priceFormatted,
      `${property.neighborhood} - ${property.location}`,
    ].filter(Boolean).join(" | ");

    const text = [
      `مرحباً، أنا ${name || "أحد العملاء"}`,
      `أريد الاستفسار عن: ${property.title}`,
      `التفاصيل: ${specs}`,
      msgText ? `الرسالة: ${msgText}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
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

          {/* ── Not Found ── */}
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
                {/* Image Gallery */}
                <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                  <img
                    src={property.images[activeImage] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-72 sm:h-96 md:h-[500px] object-cover"
                    loading="eager"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                  />
                  {property.images.length > 1 && (
                    <div className="flex gap-3 p-4 overflow-x-auto bg-secondary/50">
                      {property.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`shrink-0 w-24 h-20 rounded-xl overflow-hidden transition-all ${
                            i === activeImage
                              ? "ring-2 ring-gold shadow-lg scale-105"
                              : "opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }} />
                        </button>
                      ))}
                    </div>
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
                  <div className="text-gold font-black text-3xl md:text-4xl">{property.priceFormatted}</div>
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
                            `التفاصيل: ${[property.type, property.area ? `${property.area} م²` : "", property.bedrooms > 0 ? `${property.bedrooms} غرف` : "", property.bathrooms ? `${property.bathrooms} حمام` : "", property.priceFormatted, `${property.neighborhood} - ${property.location}`].filter(Boolean).join(" | ")}`,
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
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن: ${property.title}\nالتفاصيل: ${[property.type, property.area ? `${property.area} م²` : "", property.bedrooms > 0 ? `${property.bedrooms} غرف` : "", property.bathrooms ? `${property.bathrooms} حمام` : "", property.priceFormatted, `${property.neighborhood} - ${property.location}`].filter(Boolean).join(" | ")}`)}`}
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
