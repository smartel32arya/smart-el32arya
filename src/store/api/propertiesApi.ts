import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { properties as localData } from "@/data/properties";
import type { Property } from "@/data/properties";
export const PAGE_SIZE = 10;
export const FEATURED_MAX = 6;
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

// ─── Response shape ───────────────────────────────────────────────────────────
export interface PropertiesResponse {
  data: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PropertyFilters {
  neighborhood: string;
  type: string;
  priceRange: string;
  sort: "newest" | "price-asc" | "price-desc" | "area-desc";
  page: number;
}

// ─── Local mock ───────────────────────────────────────────────────────────────
// Mirrors the exact response shape the backend will return.
// Remove once VITE_API_URL is set.
function mockFetch(filters: PropertyFilters): PropertiesResponse {
  let result = [...localData];

  if (filters.neighborhood !== "الكل")
    result = result.filter((p) => p.neighborhood === filters.neighborhood);
  if (filters.type !== "الكل")
    result = result.filter((p) => p.type === filters.type);
  if (filters.priceRange !== "all") {
    const [min, max] = filters.priceRange.split("-").map(Number);
    result = result.filter((p) => p.price >= min && p.price <= max);
  }
  if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
  else if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
  else if (filters.sort === "area-desc") result.sort((a, b) => b.area - a.area);

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);
  const data = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return { data, total, page, pageSize: PAGE_SIZE, totalPages };
}

// ─────────────────────────────────────────────────────────────────────────────

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

    /**
     * GET /properties
     * Query params: neighborhood, type, priceRange, sort, page, pageSize
     *
     * To switch to real backend: set VITE_API_URL in .env and remove the mock block.
     */
    getProperties: builder.query<PropertiesResponse, PropertyFilters>({
      queryFn: async (filters, _api, _extra, baseQuery) => {
        if (!BASE_URL) {
          await new Promise((r) => setTimeout(r, 800));
          return { data: mockFetch(filters) };
        }

        const params = new URLSearchParams({
          sort: filters.sort,
          page: String(filters.page),
          pageSize: String(PAGE_SIZE),
        });
        if (filters.neighborhood !== "الكل") params.set("neighborhood", filters.neighborhood);
        if (filters.type !== "الكل") params.set("type", filters.type);
        if (filters.priceRange !== "all") params.set("priceRange", filters.priceRange);

        const result = await baseQuery(`/properties?${params}`);
        if (result.error) return { error: result.error };
        return { data: result.data as PropertiesResponse };
      },
      providesTags: ["Property"],
    }),

    /**
     * GET /properties/featured?limit=6
     * Returns featured properties (max FEATURED_MAX).
     */
    getFeaturedProperties: builder.query<Property[], void>({
      queryFn: async (_arg, _api, _extra, baseQuery) => {
        if (!BASE_URL) {
          await new Promise((r) => setTimeout(r, 600));
          const data = localData.filter((p) => p.featured).slice(0, FEATURED_MAX);
          return { data };
        }
        const result = await baseQuery(`/properties/featured?limit=${FEATURED_MAX}`);
        if (result.error) return { error: result.error };
        return { data: result.data as Property[] };
      },
      providesTags: ["Property"],
    }),

    /**
     * GET /properties/:id
     */
    getPropertyById: builder.query<Property, string>({
      queryFn: async (id, _api, _extra, baseQuery) => {
        if (!BASE_URL) {
          await new Promise((r) => setTimeout(r, 800));
          const found = localData.find((p) => p.id === id);
          if (found) return { data: found };
          return { error: { status: "CUSTOM_ERROR" as const, error: "Not found" } };
        }
        const result = await baseQuery(`/properties/${id}`);
        if (result.error) return { error: result.error };
        return { data: result.data as Property };
      },
      providesTags: (_r, _e, id) => [{ type: "Property", id }],
    }),

    /**
     * DELETE /properties/:id
     */
    deleteProperty: builder.mutation<void, string>({
      queryFn: async (id, _api, _extra, baseQuery) => {
        if (!BASE_URL) {
          await new Promise((r) => setTimeout(r, 400));
          return { data: undefined };
        }
        const result = await baseQuery({ url: `/properties/${id}`, method: "DELETE" });
        if (result.error) return { error: result.error };
        return { data: undefined };
      },
      invalidatesTags: ["Property"],
    }),

    /**
     * PUT /properties/:id  (application/json — no image upload)
     */
    updateProperty: builder.mutation<void, { id: string; data: Partial<Property> }>({
      queryFn: async ({ id, data }, _api, _extra, baseQuery) => {
        if (!BASE_URL) {
          await new Promise((r) => setTimeout(r, 500));
          return { data: undefined };
        }
        const result = await baseQuery({ url: `/properties/${id}`, method: "PUT", body: data });
        if (result.error) return { error: result.error };
        return { data: undefined };
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: "Property", id }],
    }),

    /**
     * POST /admin/properties  (multipart/form-data with images)
     */
    createProperty: builder.mutation<Property, FormData>({
      queryFn: async (formData, _api, _extra, baseQuery) => {
        if (!BASE_URL) {
          await new Promise((r) => setTimeout(r, 600));
          // mock: return a fake property so UI can react
          return { data: { id: Date.now().toString() } as unknown as Property };
        }
        const result = await baseQuery({
          url: "/admin/properties",
          method: "POST",
          body: formData,
        });
        if (result.error) return { error: result.error };
        return { data: result.data as Property };
      },
      invalidatesTags: ["Property"],
    }),

  }),
});

export const { useGetPropertiesQuery, useGetPropertyByIdQuery, useGetFeaturedPropertiesQuery, useDeletePropertyMutation, useUpdatePropertyMutation, useCreatePropertyMutation } = propertiesApi;
