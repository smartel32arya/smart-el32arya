import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Property } from "@/data/properties";

export const PAGE_SIZE = 10;
export const FEATURED_MAX = 6;
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

// ─── _id → id mapping helper ─────────────────────────────────────────────────
const mapProperty = (p: any): Property => ({ ...p, id: p._id ?? p.id });

// ─── Response shape ───────────────────────────────────────────────────────────
export interface PropertiesResponse {
  data: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  totalActive?: number;
  totalFeatured?: number;
}

export interface PropertyFilters {
  neighborhood: string;
  type: string;
  priceRange: string;
  sort: "newest" | "price-asc" | "price-desc" | "area-desc";
  page: number;
  pageSize?: number;
  isActive?: boolean;
}

export const propertiesApi = createApi({
  reducerPath: "propertiesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Property"],
  endpoints: (builder) => ({

    // GET /properties
    getProperties: builder.query<PropertiesResponse, PropertyFilters>({
      query: (filters) => {
        const params = new URLSearchParams({
          sort: filters.sort,
          page: String(filters.page),
          pageSize: String(filters.pageSize ?? PAGE_SIZE),
          isActive: "true",
        });
        if (filters.neighborhood !== "الكل") params.set("neighborhood", filters.neighborhood);
        if (filters.type !== "الكل") params.set("type", filters.type);
        if (filters.priceRange !== "all") params.set("priceRange", filters.priceRange);
        return `/properties?${params}`;
      },
      transformResponse: (raw: PropertiesResponse) => ({
        ...raw,
        data: raw.data.map(mapProperty),
      }),
      providesTags: ["Property"],
    }),

    // GET /properties/featured?limit=6
    getFeaturedProperties: builder.query<Property[], void>({
      query: () => `/properties/featured?limit=${FEATURED_MAX}`,
      transformResponse: (raw: Property[]) => raw.map(mapProperty),
      providesTags: ["Property"],
    }),

    // GET /admin/properties
    getAdminProperties: builder.query<PropertiesResponse, PropertyFilters>({
      query: (filters) => {
        const params = new URLSearchParams({
          sort: filters.sort,
          page: String(filters.page),
          pageSize: String(filters.pageSize ?? PAGE_SIZE),
        });
        if (filters.neighborhood !== "الكل") params.set("neighborhood", filters.neighborhood);
        if (filters.type !== "الكل") params.set("type", filters.type);
        if (filters.priceRange !== "all") params.set("priceRange", filters.priceRange);
        if (filters.isActive !== undefined) params.set("isActive", String(filters.isActive));
        return `/admin/properties?${params}`;
      },
      transformResponse: (raw: PropertiesResponse) => ({
        ...raw,
        data: raw.data.map(mapProperty),
      }),
      providesTags: ["Property"],
    }),

    // GET /admin/properties/:id
    getAdminPropertyById: builder.query<Property, string>({
      query: (id) => `/admin/properties/${id}`,
      transformResponse: (raw: any) => mapProperty(raw),
      providesTags: (_r, _e, id) => [{ type: "Property", id }],
    }),

    // GET /properties/:id
    getPropertyById: builder.query<Property, string>({
      query: (id) => `/properties/${id}`,
      transformResponse: (raw: any) => mapProperty(raw),
      providesTags: (_r, _e, id) => [{ type: "Property", id }],
    }),

    // DELETE /admin/properties/:id
    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/properties/${id}`, method: "DELETE" }),
      invalidatesTags: ["Property"],
    }),

    // PUT /admin/properties/:id
    updateProperty: builder.mutation<Property, { id: string; data: object }>({
      query: ({ id, data }) => ({ url: `/admin/properties/${id}`, method: "PUT", body: data }),
      transformResponse: (raw: any) => mapProperty(raw),
      invalidatesTags: (_r, _e, { id }) => ["Property", { type: "Property", id }],
    }),

    // POST /admin/properties
    createProperty: builder.mutation<Property, object>({
      query: (body) => ({ url: "/admin/properties", method: "POST", body }),
      transformResponse: (raw: any) => mapProperty(raw),
      invalidatesTags: ["Property"],
    }),

    // POST /admin/properties/:id/images
    appendPropertyImages: builder.mutation<Property, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/admin/properties/${id}/images`, method: "POST", body: data }),
      transformResponse: (raw: any) => mapProperty(raw),
    }),

    // PUT /admin/properties/:id/images
    replacePropertyImages: builder.mutation<Property, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/admin/properties/${id}/images`, method: "PUT", body: data }),
      transformResponse: (raw: any) => mapProperty(raw),
    }),

    // POST /admin/properties/:id/video
    addPropertyVideo: builder.mutation<Property, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/admin/properties/${id}/video`, method: "POST", body: data }),
      transformResponse: (raw: any) => mapProperty(raw),
    }),

    // PUT /admin/properties/:id/video
    replacePropertyVideo: builder.mutation<Property, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/admin/properties/${id}/video`, method: "PUT", body: data }),
      transformResponse: (raw: any) => mapProperty(raw),
    }),

    // DELETE /admin/properties/:id/video
    deletePropertyVideo: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({ url: `/admin/properties/${id}/video`, method: "DELETE" }),
    }),

  }),
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetFeaturedPropertiesQuery,
  useGetAdminPropertiesQuery,
  useGetAdminPropertyByIdQuery,
  useDeletePropertyMutation,
  useUpdatePropertyMutation,
  useCreatePropertyMutation,
  useAppendPropertyImagesMutation,
  useReplacePropertyImagesMutation,
  useAddPropertyVideoMutation,
  useReplacePropertyVideoMutation,
  useDeletePropertyVideoMutation,
} = propertiesApi;
