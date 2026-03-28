import {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
} from "@/store/api/propertiesApi";

export interface PropertyFormState {
  title: string;
  description: string;
  price: string;
  neighborhood: string;
  type: string;
  area: string;
  listingType: "sale" | "rent";
  amenities: string[];
  featured: boolean;
  active: boolean;
  showPrice: boolean;
}

export interface UseAdminActionsReturn {
  createProperty: (form: PropertyFormState, images: string[], video: string | null) => Promise<void>;
  updateProperty: (id: string, form: PropertyFormState, images: string[], video: string | null) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
}

export function useAdminActions(): UseAdminActionsReturn {
  const [createPropertyMutation, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updatePropertyMutation, { isLoading: isUpdating }] = useUpdatePropertyMutation();

  async function createProperty(
    form: PropertyFormState,
    images: string[],
    video: string | null
  ): Promise<void> {
    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),     price: Number(form.price),
      neighborhood: form.neighborhood,
      type: form.type,
      listingType: form.listingType,
      location: "المنيا الجديدة",
      featured: form.featured,
      active: form.active,
      showPrice: form.showPrice,
      amenities: form.amenities,
      ...(form.area ? { area: Number(form.area) } : {}),
      images,
      video,
    };
    await createPropertyMutation(body).unwrap();
  }

  async function updateProperty(
    id: string,
    form: PropertyFormState,
    images: string[],
    video: string | null
  ): Promise<void> {
    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      neighborhood: form.neighborhood,
      type: form.type,
      listingType: form.listingType,
      location: "المنيا الجديدة",
      featured: form.featured,
      active: form.active,
      showPrice: form.showPrice,
      amenities: form.amenities,
      ...(form.area ? { area: Number(form.area) } : {}),
      images,
      video,
    };
    await updatePropertyMutation({ id, data: body }).unwrap();
  }

  return {
    createProperty,
    updateProperty,
    isCreating,
    isUpdating,
  };
}
