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

export const PROPERTY_TYPES = ["الكل", "شقة", "فيلا", "مخازن", "محل تجاري", "مكتب إداري", "جراج", "قطع أرض"];

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
  "تكييف", "خزان مياه", "خالصه الأقساط", "علي الطوب الاحمر", "تشطيب سوبر لوكس",
  "إنترنت", "مدخل خاص", "دور أرضي بحديقة",
  "إطلالة مميزة", "قريبة من المدارس", "قريبة من المواصلات", "غير مجروحه", "عليها أقساط", "موقع مميز", "اسانسير", "تشطيب جهاز", "تشطيب جمعية"
];

// ─── WhatsApp ─────────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = "201022641599"; // without leading +
export const WHATSAPP_DISPLAY = "+20 102 264 1599";
export const WHATSAPP_URL = (message = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ""}`;


// ─── Phone Numbers ────────────────────────────────────────────────────────────
export const PHONE_NUMBERS = [
  { display: "+20 111 193 8563", number: "201111938563" },
  { display: "+20 109 067 2990", number: "201090672990" },
  { display: "+20 111 458 8211", number: "201114588211" },
];