import { BedDouble, Bath, Maximize } from "lucide-react";

interface SpecsRibbonProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
}

const SpecsRibbon = ({ bedrooms, bathrooms, area }: SpecsRibbonProps) => (
  <div className="border-t border-border mt-auto pt-3 flex items-center gap-4 text-muted-foreground text-xs">
    {bedrooms > 0 && (
      <div className="flex items-center gap-1">
        <BedDouble className="w-4 h-4 text-gold" />
        <span className="font-semibold">{bedrooms}</span>
      </div>
    )}
    <div className="flex items-center gap-1">
      <Bath className="w-4 h-4 text-gold" />
      <span className="font-semibold">{bathrooms}</span>
    </div>
    <div className="flex items-center gap-1 mr-auto">
      <Maximize className="w-4 h-4 text-gold" />
      <span className="font-semibold">{area} م²</span>
    </div>
  </div>
);

export default SpecsRibbon;
