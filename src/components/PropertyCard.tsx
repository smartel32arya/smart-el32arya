import { Link } from "react-router-dom";
import { MapPin, Maximize2, Phone } from "lucide-react";
import { Property } from "@/data/properties";
import { WHATSAPP_NUMBER, normalizeEgPhone } from "@/config";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

const PropertyCard = ({ property, priority = false }: PropertyCardProps) => {
  const isRent = property.listingType === "rent";

  const handleInquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const phone = normalizeEgPhone(property.contactPhone);
    const text = encodeURIComponent(
      `مرحباً، أريد الاستفسار عن سعر: ${property.title}\n${property.type}${property.area ? ` · ${property.area} م²` : ""} — ${property.neighborhood}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Link
      to={`/property/${property.id}`}
      aria-label={`عرض تفاصيل: ${property.title}`}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading={priority ? "eager" : "lazy"}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* top badges */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between">
          <span className={`text-white text-xs font-black px-3 py-1 rounded-full shadow-md ${isRent ? "bg-blue-500" : "bg-green-600"}`}>
            {isRent ? "للإيجار" : "للبيع"}
          </span>
          {property.featured && (
            <span className="gradient-gold text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
              لقطة ⭐
            </span>
          )}
        </div>

        {/* price bottom */}
        <div className="absolute bottom-3 inset-x-3">
          {property.showPrice ? (
            <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl shadow" dir="rtl">
              <span className="text-gold font-black text-sm">{property.priceFormatted}</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleInquiry}
              className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[#25D366] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow hover:bg-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              استفسر عن السعر
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <h3 className="text-foreground font-bold text-sm leading-snug line-clamp-2 group-hover:text-gold transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <MapPin className="w-3 h-3 shrink-0 text-gold" />
          <span className="line-clamp-1">{property.neighborhood} — {property.location}</span>
        </div>

        <div className="mt-auto pt-2.5 border-t border-border flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            {property.area ? (
              <>
                <Maximize2 className="w-3 h-3 text-gold shrink-0" />
                {property.type} بمساحة {property.area} م²
              </>
            ) : (
              property.type
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
