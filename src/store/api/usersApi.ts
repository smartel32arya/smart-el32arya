import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AdminUser, UserRole } from "@/store/slices/usersSlice";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const mapUser = (u: any): AdminUser => ({ ...u, id: u._id ?? u.id });

export interface CreateUserPayload {
  name: string;
  username?: string;
  email?: string;
  phone: string;
  password: string;
  role: UserRole;
  active?: boolean;
  expiresAt?: string | null;
}

export interface UpdateUserPayload {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: UserRole;
  active?: boolean;
  expiresAt?: string | null;
}

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("adminToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({

    getUsers: builder.query<AdminUser[], void>({
      query: () => "/admin/users",
      transformResponse: (raw: any[]) => raw.map(mapUser),
      providesTags: ["User"],
    }),

    createUser: builder.mutation<AdminUser, CreateUserPayload>({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      transformResponse: (raw: any) => mapUser(raw),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<AdminUser, { id: string; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({ url: `/admin/users/${id}`, method: "PUT", body: data }),
      transformResponse: (raw: any) => mapUser(raw),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
