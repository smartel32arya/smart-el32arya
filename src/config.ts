// ─── Site Configuration ───────────────────────────────────────────────────────
// Edit anything here and it'll update across the entire app.

export const SITE_NAME = "سمارت العقارية";
export const SITE_CITY = "المنيا الجديدة";
export const SITE_ADDRESS = "المنيا الجديدة، محافظة المنيا";
export const SITE_COUNTRY = "مصر";
export const WORKING_HOURS = "متاح ٢٤/٧ على مدار الأسبوع";
export const WORKING_DAYS = "متاح ٢٤/٧ على مدار الأسبوع";

// ─── Property Data ────────────────────────────────────────────────────────────
export const NEIGHBORHOODS = [
  "الكل",
  "حي الزهراء",
  "حي القرنفل",
  "الحي الأول",
  "الحي الثاني",
  "الحي الثالث",
  "الحي الرابع",
  "الحي الخامس",
  "الحي السادس",
  "الحي السابع",
  "بيت الوطن",
  "المتميز",
  "الأكثر تميزاً",
];

export const PROPERTY_TYPES = ["الكل", "شقة", "فيلا", "دوبلكس", "تجاري", "محل تجاري", "مكتب إداري", "جراج"];

export const PRICE_RANGES = [
  { label: "الكل", value: "all" },
  { label: "أقل من ٥٠٠ ألف", value: "0-500000" },
  { label: "٥٠٠ ألف - مليون", value: "500000-1000000" },
  { label: "١ - ٢ مليون", value: "1000000-2000000" },
  { label: "٢ - ٤ مليون", value: "2000000-4000000" },
  { label: "أكثر من ٤ مليون", value: "4000000-999999999" },
];

export const SORT_OPTIONS = [
  { label: "الأحدث", value: "newest" },
  { label: "السعر: الأقل أولاً", value: "price-asc" },
  { label: "السعر: الأعلى أولاً", value: "price-desc" },
  { label: "المساحة: الأكبر أولاً", value: "area-desc" },
];

export const AMENITY_SUGGESTIONS = [
  "غاز طبيعي", "جراج", "أمن وحراسة", "مصعد", "مفروشة",
  "تكييف", "خزان مياه", "بدون أقساط", "تشطيب كامل", "تشطيب سوبر لوكس",
  "إنترنت فايبر", "طاقة شمسية", "مدخل خاص", "دور أرضي بحديقة",
  "إطلالة مميزة", "قريبة من المدارس", "قريبة من المواصلات",
];

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = "201022641599"; // without leading +
export const WHATSAPP_DISPLAY = "+20 102 264 1599";
export const WHATSAPP_URL = (message = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
