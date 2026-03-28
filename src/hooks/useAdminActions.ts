import { useState } from "react";
import {
  useDeletePropertyMutation,
} from "@/store/api/propertiesApi";
import { useDispatch } from "react-redux";
import { propertiesApi } from "@/store/api/propertiesApi";

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
  createProperty: (form: PropertyFormState, images: File[], video: File | null) => Promise<void>;
  updateProperty: (
    id: string,
    form: PropertyFormState,
    existingImages: string[],
    newImages: File[],
    existingVideo: string,
    newVideo: File | null,
    videoRemoved: boolean,
    existingImagesModified?: boolean
  ) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  /** 0–100 while uploading, null otherwise */
  uploadProgress: number | null;
}

const BASE_URL = (import.meta.env.VITE_API_URL ?? "") as string;

function getToken(): string | null {
  return localStorage.getItem("adminToken");
}

/** XHR upload with progress tracking. Returns parsed JSON response. */
function xhrUpload(
  method: "POST" | "PUT",
  url: string,
  body: FormData,
  onProgress: (pct: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    const token = getToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let parsed: any;
      try { parsed = JSON.parse(xhr.responseText); } catch { parsed = {}; }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(parsed);
      } else {
        reject(parsed);
      }
    };
    xhr.onerror = () => reject({ message: "Network error" });
    xhr.send(body);
  });
}

export function useAdminActions(): UseAdminActionsReturn {
  const dispatch = useDispatch();
  const [deletePropertyMutation] = useDeletePropertyMutation();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  function buildFormData(
    form: PropertyFormState,
    images: File[],
    video: File | null,
    existingImages?: string[],
    videoRemoved?: boolean,
    existingVideo?: string
  ): FormData {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("neighborhood", form.neighborhood);
    fd.append("type", form.type);
    fd.append("listingType", form.listingType);
    fd.append("location", "المنيا الجديدة");
    fd.append("featured", String(form.featured));
    fd.append("active", String(form.active));
    fd.append("showPrice", String(form.showPrice));
    fd.append("amenities", JSON.stringify(form.amenities));
    if (form.area) fd.append("area", form.area);

    images.forEach((img) => fd.append("images", img));
    if (video) fd.append("video", video);

    // edit-specific fields
    if (existingImages !== undefined) {
      fd.append("existingImages", JSON.stringify(existingImages));
    }
    if (videoRemoved) {
      fd.append("videoUrl", "");
    } else if (existingVideo) {
      fd.append("videoUrl", existingVideo);
    }

    return fd;
  }

  async function createProperty(
    form: PropertyFormState,
    images: File[],
    video: File | null
  ): Promise<void> {
    setIsCreating(true);
    setUploadProgress(0);
    try {
      const fd = buildFormData(form, images, video);
      await xhrUpload("POST", `${BASE_URL}/admin/properties`, fd, setUploadProgress);
      // invalidate RTK-Query cache
      dispatch(propertiesApi.util.invalidateTags(["Property"]));
    } finally {
      setIsCreating(false);
      setUploadProgress(null);
    }
  }

  async function updateProperty(
    id: string,
    form: PropertyFormState,
    existingImages: string[],
    newImages: File[],
    existingVideo: string,
    newVideo: File | null,
    videoRemoved: boolean,
    _existingImagesModified = false
  ): Promise<void> {
    setIsUpdating(true);
    setUploadProgress(0);
    try {
      const fd = buildFormData(
        form,
        newImages,
        newVideo,
        existingImages,
        videoRemoved,
        existingVideo
      );
      await xhrUpload("PUT", `${BASE_URL}/admin/properties/${id}`, fd, setUploadProgress);
      dispatch(propertiesApi.util.invalidateTags(["Property", { type: "Property", id }]));
    } finally {
      setIsUpdating(false);
      setUploadProgress(null);
    }
  }

  return {
    createProperty,
    updateProperty,
    isCreating,
    isUpdating,
    uploadProgress,
  };
}
