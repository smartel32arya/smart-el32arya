import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize, MessageCircle, Phone } from "lucide-react";
import { Property } from "@/data/properties";
import { WHATSAPP_NUMBER } from "@/config";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

const PropertyCard = ({ property, priority = false }: PropertyCardProps) => {
  const waText = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن سعر: ${property.title}\nالتفاصيل: ${[property.type, property.area ? `${property.area} م²` : "", property.bedrooms > 0 ? `${property.bedrooms} غرف` : "", `${property.neighborhood} - ${property.location}`].filter(Boolean).join(" | ")}`
  );

  return (
    <Link
      to={`/property/${property.id}`}
      className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading={priority ? "eager" : "lazy"}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
        />

        {/* dark gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* top badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <span className="bg-white/95 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-full shadow">
            {property.type}
          </span>
          {property.featured && (
            <span className="gradient-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              لقطة
            </span>
          )}
        </div>

        {/* price pinned on image bottom */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between">
          {property.showPrice === false ? (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[#25D366] font-bold text-xs px-3 py-1.5 rounded-full shadow hover:bg-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              استفسر عن السعر
            </a>
          ) : (
            <span className="bg-white/95 backdrop-blur-sm text-gold font-black text-sm px-3 py-1.5 rounded-full shadow">
              {property.priceFormatted}
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* title */}
        <h3 className="text-foreground font-bold text-base group-hover:text-gold transition-colors line-clamp-1 leading-snug">
          {property.title}
        </h3>

        {/* location */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-gold" />
          <span className="line-clamp-1">{property.neighborhood} - {property.location}</span>
        </div>

        {/* divider */}
        <div className="border-t border-border mt-auto pt-3 flex items-center gap-4 text-muted-foreground text-xs">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-gold" />
              <span className="font-semibold">{property.bedrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gold" />
            <span className="font-semibold">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1 mr-auto">
            <Maximize className="w-4 h-4 text-gold" />
            <span className="font-semibold">{property.area} م²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
