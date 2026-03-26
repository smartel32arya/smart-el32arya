import { NEIGHBORHOODS, PROPERTY_TYPES } from "@/config";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

export interface Property {
  id: string;
  title: string;
  price: number;
  priceFormatted: string;
  location: string;
  neighborhood: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  images: string[];
  description: string;
  amenities: string[];
  featured: boolean;
  active: boolean;
  showPrice?: boolean;
  video?: string;
}

export const properties: Property[] = [
  {
    id: "1",
    title: "شقة فاخرة بإطلالة مميزة",
    price: 2500000,
    priceFormatted: "٢,٥٠٠,٠٠٠ ج.م",
    location: "المنيا الجديدة",
    neighborhood: "حي الزهراء",
    type: "شقة",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: property1,
    images: [property1, property4],
    description: "شقة فاخرة في قلب حي الزهراء بالمنيا الجديدة، تتميز بتشطيبات عالية الجودة وإطلالة رائعة. تضم ٣ غرف نوم واسعة، ٢ حمام، وريسبشن كبير. الشقة جاهزة للسكن الفوري مع جميع المرافق متاحة.",
    amenities: ["مصعد", "جراج خاص", "أمن وحراسة", "حديقة", "تكييف مركزي"],
    featured: true,
    active: true,
  },
  {
    id: "2",
    title: "فيلا مستقلة بحديقة خاصة",
    price: 5800000,
    priceFormatted: "٥,٨٠٠,٠٠٠ ج.م",
    location: "المنيا الجديدة",
    neighborhood: "الحي الثامن",
    type: "فيلا",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    image: property2,
    images: [property2, property4],
    description: "فيلا مستقلة فخمة في الحي الثامن بالمنيا الجديدة، مساحة أرض ٥٠٠ متر مربع ومساحة بناء ٣٥٠ متر مربع. تتميز بتصميم معماري عصري وحديقة خاصة واسعة مع مسبح. ٥ غرف نوم و٤ حمامات.",
    amenities: ["مسبح خاص", "حديقة واسعة", "جراج ٢ سيارات", "غرفة خادمة", "تراس"],
    featured: true,
    active: true,
  },
  {
    id: "3",
    title: "دوبلكس بتشطيب سوبر لوكس",
    price: 3200000,
    priceFormatted: "٣,٢٠٠,٠٠٠ ج.م",
    location: "المنيا الجديدة",
    neighborhood: "حي الزهراء",
    type: "دوبلكس",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    image: property3,
    images: [property3, property4],
    description: "دوبلكس رائع بمساحة ٢٥٠ متر مربع في حي الزهراء. الطابق الأول يضم ريسبشن واسع ومطبخ مجهز وغرفة معيشة. الطابق الثاني يضم ٤ غرف نوم و٣ حمامات. تشطيب سوبر لوكس.",
    amenities: ["تراس خاص", "مصعد", "غرفة غسيل", "مطبخ مجهز", "خزان مياه"],
    featured: true,
    active: true,
  },
  {
    id: "4",
    title: "شقة استوديو للاستثمار",
    price: 850000,
    priceFormatted: "٨٥٠,٠٠٠ ج.م",
    location: "المنيا الجديدة",
    neighborhood: "الحي الأول",
    type: "شقة",
    bedrooms: 1,
    bathrooms: 1,
    area: 70,
    image: property4,
    images: [property4],
    description: "شقة استوديو مثالية للاستثمار في الحي الأول بالمنيا الجديدة. تشطيب كامل، مساحة ٧٠ متر مربع. موقع مميز قريب من جميع الخدمات والمواصلات.",
    amenities: ["مصعد", "أمن وحراسة", "قريبة من المواصلات"],
    featured: false,
    active: true,
  },
  {
    id: "5",
    title: "محل تجاري على الشارع الرئيسي",
    price: 1800000,
    priceFormatted: "١,٨٠٠,٠٠٠ ج.م",
    location: "المنيا الجديدة",
    neighborhood: "المحور المركزي",
    type: "تجاري",
    bedrooms: 0,
    bathrooms: 1,
    area: 120,
    image: property5,
    images: [property5],
    description: "محل تجاري مميز على المحور المركزي بالمنيا الجديدة. واجهة زجاجية عريضة ومساحة ١٢٠ متر مربع. مثالي للمطاعم أو المحلات التجارية الكبرى.",
    amenities: ["واجهة زجاجية", "موقف سيارات", "كهرباء ٣ فاز", "مدخل مستقل"],
    featured: false,
    active: true,
  },
  {
    id: "6",
    title: "بنتهاوس بإطلالة بانورامية",
    price: 4200000,
    priceFormatted: "٤,٢٠٠,٠٠٠ ج.م",
    location: "المنيا الجديدة",
    neighborhood: "الحي الثامن",
    type: "شقة",
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    image: property6,
    images: [property6, property4],
    description: "بنتهاوس فاخر في الحي الثامن بإطلالة بانورامية مذهلة على المنيا الجديدة. تراس واسع خاص، ٣ غرف نوم، وتشطيب ألترا سوبر لوكس. فرصة استثمارية لا تُعوض.",
    amenities: ["تراس بانورامي", "تكييف مركزي", "جاكوزي", "مصعد خاص", "أمن ٢٤ ساعة"],
    featured: true,
    active: true,
  },
];

export const neighborhoods = NEIGHBORHOODS;
export const propertyTypes = PROPERTY_TYPES;
