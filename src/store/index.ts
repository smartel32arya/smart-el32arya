import { configureStore } from "@reduxjs/toolkit";
import propertiesReducer from "./slices/propertiesSlice";
import filtersReducer from "./slices/filtersSlice";
import usersReducer from "./slices/usersSlice";
import { propertiesApi } from "./api/propertiesApi";
import { usersApi } from "./api/usersApi";

export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    filters: filtersReducer,
    users: usersReducer,
    [propertiesApi.reducerPath]: propertiesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(propertiesApi.middleware)
      .concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
