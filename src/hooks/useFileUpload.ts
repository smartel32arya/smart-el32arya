import { useState, useCallback } from "react";

export interface FileUploadItem {
  id: string;
  file: File;
  status: "uploading" | "done" | "error";
  progress: number; // 0-100
  url?: string;
  error?: string;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

function validateFile(file: File, type: "image" | "video"): string | null {
  if (type === "image") {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
      return "نوع الملف غير مدعوم. الأنواع المقبولة: JPEG, PNG, WebP";
    if (file.size > MAX_IMAGE_SIZE)
      return "حجم الصورة يتجاوز الحد المسموح (5 MB)";
  } else {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type))
      return "نوع الملف غير مدعوم. الأنواع المقبولة: MP4, MOV, AVI, WebM";
    if (file.size > MAX_VIDEO_SIZE)
      return "حجم الفيديو يتجاوز الحد المسموح (100 MB)";
  }
  return null;
}

function xhrUpload(
  file: File,
  onProgress: (pct: number) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("استجابة غير صالحة من الخادم"));
        }
      } else {
        try {
          const body = JSON.parse(xhr.responseText);
          reject(new Error(body?.message ?? `خطأ ${xhr.status}`));
        } catch {
          reject(new Error(`خطأ ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("فشل الاتصال بالخادم")));
    xhr.addEventListener("abort", () => reject(new Error("تم إلغاء الرفع")));

    xhr.open("POST", `${BASE_URL}/admin/properties/upload`);
    const token = localStorage.getItem("adminToken");
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  });
}

export function useFileUpload() {
  const [items, setItems] = useState<FileUploadItem[]>([]);

  const uploadItem = useCallback(async (id: string, file: File) => {
    try {
      const result = await xhrUpload(file, (progress) => {
        setItems((prev) =>
          prev.map((item) => item.id === id ? { ...item, progress } : item)
        );
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "done", progress: 100, url: result.url } : item
        )
      );
    } catch (err: any) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: "error", progress: 0, error: err?.message ?? "فشل رفع الملف" }
            : item
        )
      );
    }
  }, []);

  const addFiles = useCallback(
    (files: File[], type: "image" | "video") => {
      const newItems: FileUploadItem[] = files.map((file) => {
        const id = crypto.randomUUID();
        const validationError = validateFile(file, type);
        if (validationError)
          return { id, file, status: "error" as const, progress: 0, error: validationError };
        return { id, file, status: "uploading" as const, progress: 0 };
      });

      setItems((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => {
        if (item.status === "uploading") uploadItem(item.id, item.file);
      });
    },
    [uploadItem]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const retryItem = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status: "uploading", progress: 0, error: undefined, url: undefined } : i
        )
      );
      const item = items.find((i) => i.id === id);
      if (item) uploadItem(id, item.file);
    },
    [items, uploadItem]
  );

  const isAnyUploading = items.some((item) => item.status === "uploading");
  const urls = items.filter((item) => item.status === "done").map((item) => item.url!);

  return { items, addFiles, removeItem, retryItem, isAnyUploading, urls };
}
