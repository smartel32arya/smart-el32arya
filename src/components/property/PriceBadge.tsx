import { Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/config";

interface PriceBadgeProps {
  priceFormatted: string;
  showPrice: boolean;
  title: string;
  type: string;
  area: number;
  bedrooms: number;
  neighborhood: string;
  location: string;
  contactPhone?: string;
}

const PriceBadge = ({
  priceFormatted,
  showPrice,
  title,
  type,
  area,
  bedrooms,
  neighborhood,
  location,
  contactPhone,
}: PriceBadgeProps) => {
  if (!showPrice) {
    const phone = contactPhone || WHATSAPP_NUMBER;
    const waText = encodeURIComponent(
      `مرحباً، أريد الاستفسار عن سعر: ${title}\nالتفاصيل: ${[type, area ? `${area} م²` : "", bedrooms > 0 ? `${bedrooms} غرف` : "", `${neighborhood} - ${location}`].filter(Boolean).join(" | ")}`
    );
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(`https://wa.me/${phone}?text=${waText}`, "_blank", "noopener,noreferrer");
        }}
        className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[#25D366] font-bold text-xs px-3 py-1.5 rounded-full shadow hover:bg-white transition-colors"
      >
        <Phone className="w-3.5 h-3.5" />
        استفسر عن السعر
      </button>
    );
  }

  return (
    <span className="bg-white/95 backdrop-blur-sm text-gold font-black text-sm px-3 py-1.5 rounded-full shadow">
      {priceFormatted}
    </span>
  );
};

export default PriceBadge;
