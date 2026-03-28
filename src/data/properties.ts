import { NEIGHBORHOODS, PROPERTY_TYPES } from "@/config";

export interface Property {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  priceFormatted: string;
  showPrice: boolean;
  location: string;
  neighborhood: string;
  type: string;
  listingType: "sale" | "rent";
  area: number | null;
  image: string;
  images: string[];
  video: string | null;
  amenities: string[];
  featured: boolean;
  active: boolean;
  addedBy: string;
  contactPhone?: string;
  ownerSuspended?: boolean;
  createdAt: string;
}

export const neighborhoods = NEIGHBORHOODS;
export const propertyTypes = PROPERTY_TYPES;
