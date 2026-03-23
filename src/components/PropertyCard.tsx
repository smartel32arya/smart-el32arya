import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { Property } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

const PropertyCard = ({ property, priority = false }: PropertyCardProps) => {
  return (
    <Link
      to={`/property/${property.id}`}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading={priority ? "eager" : "lazy"}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {property.featured && (
          <span className="absolute top-4 start-4 gradient-gold text-gold-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            لقطة
          </span>
        )}
        <span className="absolute top-4 end-4 bg-white/95 backdrop-blur-sm text-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
          {property.type}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="text-gold font-black text-xl mb-2">
          {property.priceFormatted}
        </div>

        <h3 className="text-foreground font-bold text-lg mb-3 group-hover:text-gold transition-colors line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 shrink-0 text-gold" />
          <span className="line-clamp-1">{property.neighborhood} - {property.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-5 pt-4 border-t border-border text-muted-foreground text-sm">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-5 h-5 text-gold" />
              <span className="font-semibold">{property.bedrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Bath className="w-5 h-5 text-gold" />
            <span className="font-semibold">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-5 h-5 text-gold" />
            <span className="font-semibold">{property.area} م²</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
