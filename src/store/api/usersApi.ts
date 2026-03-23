import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AdminUser } from "@/store/slices/usersSlice";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface CreateUserPayload {
  name: string;
  username: string;
  password: string;
  role: AdminUser["role"];
  active: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  username?: string;
  password?: string;
  role?: AdminUser["role"];
  active?: boolean;
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
      providesTags: ["User"],
    }),

    createUser: builder.mutation<AdminUser, CreateUserPayload>({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<AdminUser, { id: string; data: UpdateUserPayload }>({
      query: ({ id, data }) => ({ url: `/admin/users/${id}`, method: "PUT", body: data }),
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
