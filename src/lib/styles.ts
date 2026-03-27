export const styles = {
  // Gold gradient button (used in HeroSearchForm, SiteHeader CTA, etc.)
  gradientBtn: "gradient-gold text-gold-foreground font-bold hover:opacity-90 shadow-lg hover:shadow-xl transition-all",

  // Glass card container (used in HeroSearchForm, FilterBar section)
  glassCard: "glass-card rounded-3xl p-6 md:p-8 shadow-2xl",

  // Section heading (used in FeaturedProperties, Index "Why Us", etc.)
  sectionHeading: "text-3xl md:text-5xl font-black text-foreground",

  // Muted label (used in FilterBar labels, form labels)
  mutedLabel: "text-sm font-semibold text-foreground mb-2 block",

  // Responsive property grid
  propertyGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",

  // Card container
  card: "bg-white rounded-2xl border border-border shadow-md",
} as const;
