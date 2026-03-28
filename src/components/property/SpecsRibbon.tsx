interface SpecsRibbonProps {
  listingType: "sale" | "rent";
  area?: number | null;
  type?: string;
}

const SpecsRibbon = ({ listingType, area, type }: SpecsRibbonProps) => {
  const listingLabel = listingType === "rent" ? "للإيجار" : "للبيع";
  const label = area ? `${type ?? ""} · ${area} م²` : `${type ?? ""} ${listingLabel}`.trim();

  return (
    <div className="border-t border-border mt-auto pt-3 flex items-center gap-3 text-xs">
      <span className={`font-bold px-2.5 py-1 rounded-full text-xs ${
        listingType === "rent"
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}>
        {label}
      </span>
    </div>
  );
};

export default SpecsRibbon;
