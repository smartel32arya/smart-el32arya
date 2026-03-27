import { MapPin } from "lucide-react";

interface LocationTagProps {
  neighborhood: string;
  location: string;
}

const LocationTag = ({ neighborhood, location }: LocationTagProps) => (
  <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
    <MapPin className="w-3.5 h-3.5 shrink-0 text-gold" />
    <span className="line-clamp-1">{neighborhood} - {location}</span>
  </div>
);

export default LocationTag;
