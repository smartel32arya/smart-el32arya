import { Link } from "react-router-dom";
import { Property } from "@/data/properties";
import PriceBadge from "@/components/property/PriceBadge";
import LocationTag from "@/components/property/LocationTag";
import SpecsRibbon from "@/components/property/SpecsRibbon";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

const PropertyCard = ({ property, priority = false }: PropertyCardProps) => (
  <Link
    to={`/property/${property.id}`}
    aria-label={`عرض تفاصيل العقار: ${property.title}`}
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
        <PriceBadge
          priceFormatted={property.priceFormatted}
          showPrice={property.showPrice}
          title={property.title}
          type={property.type}
          area={property.area}
          bedrooms={property.bedrooms}
          neighborhood={property.neighborhood}
          location={property.location}
          contactPhone={property.contactPhone}
        />
      </div>
    </div>

    {/* ── Content ── */}
    <div className="p-4 flex flex-col gap-2 flex-1">
      {/* title */}
      <h3 className="text-foreground font-bold text-base group-hover:text-gold transition-colors line-clamp-1 leading-snug">
        {property.title}
      </h3>

      <LocationTag neighborhood={property.neighborhood} location={property.location} />

      <SpecsRibbon
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        area={property.area}
      />
    </div>
  </Link>
);

export default PropertyCard;
