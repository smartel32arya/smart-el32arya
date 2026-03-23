import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { properties as allProperties, type Property } from "@/data/properties";
import type { RootState } from "@/store";

interface PropertiesState {
  items: Property[];
  selectedId: string | null;
}

const initialState: PropertiesState = {
  items: allProperties,
  selectedId: null,
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setSelectedId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
    // Ready for backend: replace local data with fetched data
    setProperties(state, action: PayloadAction<Property[]>) {
      state.items = action.payload;
    },
  },
});

export const { setSelectedId, setProperties } = propertiesSlice.actions;

// Selectors
export const selectAllProperties = (state: RootState) => state.properties.items;
export const selectSelectedId = (state: RootState) => state.properties.selectedId;

export const selectFeaturedProperties = createSelector(
  selectAllProperties,
  (items) => items.filter((p) => p.featured)
);

export const selectPropertyById = (id: string) =>
  createSelector(selectAllProperties, (items) => items.find((p) => p.id === id));

export const selectPropertyStats = createSelector(
  selectAllProperties,
  (items) => ({
    total: items.length,
    active: items.filter((p) => p.active).length,
    inactive: items.filter((p) => !p.active).length,
  })
);

export default propertiesSlice.reducer;
