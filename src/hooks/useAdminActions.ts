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
  buildCreateFormData: (form: PropertyFormState, images: File[], video: File | null) => FormData;
  buildUpdateFormData: (
    form: PropertyFormState,
    existingImages: string[],
    newImages: File[],
    existingVideo: string,
    newVideo: File | null
  ) => FormData;
  createProperty: (fd: FormData) => Promise<void>;
  updateProperty: (id: string, fd: FormData) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
}

function appendCommonFields(fd: FormData, form: PropertyFormState): void {
  fd.append("title", form.title);
  fd.append("description", form.description);
  fd.append("price", form.price);
  fd.append("neighborhood", form.neighborhood);
  fd.append("type", form.type);
  fd.append("listingType", form.listingType);
  if (form.area) fd.append("area", form.area);
  fd.append("location", "المنيا الجديدة");
  fd.append("featured", String(form.featured));
  fd.append("active", String(form.active));
  fd.append("showPrice", String(form.showPrice));
  fd.append("amenities", JSON.stringify(form.amenities));
}

export function useAdminActions(): UseAdminActionsReturn {
  const [createPropertyMutation, { isLoading: isCreating }] = useCreatePropertyMutation();
  const [updatePropertyMutation, { isLoading: isUpdating }] = useUpdatePropertyMutation();

  function buildCreateFormData(
    form: PropertyFormState,
    images: File[],
    video: File | null
  ): FormData {
    const fd = new FormData();
    appendCommonFields(fd, form);
    images.forEach((img) => fd.append("images", img));
    if (video) fd.append("video", video);
    return fd;
  }

  function buildUpdateFormData(
    form: PropertyFormState,
    existingImages: string[],
    newImages: File[],
    existingVideo: string,
    newVideo: File | null
  ): FormData {
    const fd = new FormData();
    appendCommonFields(fd, form);
    fd.append("existingImages", JSON.stringify(existingImages));
    newImages.forEach((img) => fd.append("images", img));
    if (newVideo) {
      fd.append("video", newVideo);
    } else if (existingVideo) {
      fd.append("videoUrl", existingVideo);
    } else {
      fd.append("videoUrl", "");
    }
    return fd;
  }

  async function createProperty(fd: FormData): Promise<void> {
    await createPropertyMutation(fd).unwrap();
  }

  async function updateProperty(id: string, fd: FormData): Promise<void> {
    await updatePropertyMutation({ id, data: fd }).unwrap();
  }

  return {
    buildCreateFormData,
    buildUpdateFormData,
    createProperty,
    updateProperty,
    isCreating,
    isUpdating,
  };
}
