import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export type SortOption = "newest" | "price-asc" | "price-desc" | "area-desc";

export interface FiltersState {
  neighborhood: string;
  type: string;
  priceRange: string;
  sort: SortOption;
  page: number;
}

const initialState: FiltersState = {
  neighborhood: "الكل",
  type: "الكل",
  priceRange: "all",
  sort: "newest",
  page: 1,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setNeighborhood(state, action: PayloadAction<string>) {
      state.neighborhood = action.payload;
      state.page = 1; // reset on filter change
    },
    setType(state, action: PayloadAction<string>) {
      state.type = action.payload;
      state.page = 1;
    },
    setPriceRange(state, action: PayloadAction<string>) {
      state.priceRange = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<FiltersState>>) {
      return { ...state, ...action.payload, page: 1 };
    },
    clearFilters() {
      return initialState;
    },
  },
});

export const {
  setNeighborhood,
  setType,
  setPriceRange,
  setSort,
  setPage,
  setFilters,
  clearFilters,
} = filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters;
export const selectNeighborhood = (state: RootState) => state.filters.neighborhood;
export const selectType = (state: RootState) => state.filters.type;
export const selectPriceRange = (state: RootState) => state.filters.priceRange;
export const selectSort = (state: RootState) => state.filters.sort;
export const selectPage = (state: RootState) => state.filters.page;
export const selectHasActiveFilters = (state: RootState) =>
  state.filters.neighborhood !== "الكل" ||
  state.filters.type !== "الكل" ||
  state.filters.priceRange !== "all";

export default filtersSlice.reducer;
