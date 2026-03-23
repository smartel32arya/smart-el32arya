import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export type UserRole = "super_admin" | "property_admin";

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

interface UsersState {
  items: AdminUser[];
}

const initialState: UsersState = {
  items: [
    {
      id: "1",
      name: "يوسف رستم",
      username: "yussef",
      role: "super_admin",
      active: true,
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "أحمد محمد",
      username: "ahmed",
      role: "property_admin",
      active: true,
      createdAt: "2024-03-15",
    },
  ],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<AdminUser>) {
      state.items.push(action.payload);
    },
    updateUser(state, action: PayloadAction<AdminUser>) {
      const idx = state.items.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
    toggleUserActive(state, action: PayloadAction<string>) {
      const user = state.items.find((u) => u.id === action.payload);
      if (user) user.active = !user.active;
    },
  },
});

export const { addUser, updateUser, deleteUser, toggleUserActive } = usersSlice.actions;

export const selectAllUsers = (state: RootState) => state.users.items;
export const selectUserStats = createSelector(selectAllUsers, (items) => ({
  total: items.length,
  superAdmins: items.filter((u) => u.role === "super_admin").length,
  propertyAdmins: items.filter((u) => u.role === "property_admin").length,
  active: items.filter((u) => u.active).length,
}));

export default usersSlice.reducer;
