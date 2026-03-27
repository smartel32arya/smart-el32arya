import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFilters,
  selectHasActiveFilters,
  setNeighborhood,
  setType,
  setPriceRange,
  setSort,
  setPage,
  clearFilters,
  type SortOption,
} from "@/store/slices/filtersSlice";

export interface UsePropertyFiltersReturn {
  neighborhood: string;
  type: string;
  priceRange: string;
  sort: SortOption;
  page: number;
  hasActiveFilters: boolean;
  setNeighborhood: (v: string) => void;
  setType: (v: string) => void;
  setPriceRange: (v: string) => void;
  setSort: (v: SortOption) => void;
  setPage: (p: number) => void;
  clearFilters: () => void;
}

export function usePropertyFilters(): UsePropertyFiltersReturn {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const [searchParams] = useSearchParams();

  const priceRange = useMemo(() => filters.priceRange, [filters.priceRange]);

  // Sync URL search params to Redux on mount
  useEffect(() => {
    const urlNeighborhood = searchParams.get("neighborhood");
    const urlType = searchParams.get("type");
    const urlPriceRange = searchParams.get("priceRange");

    if (urlNeighborhood) dispatch(setNeighborhood(urlNeighborhood));
    if (urlType) dispatch(setType(urlType));
    if (urlPriceRange) dispatch(setPriceRange(urlPriceRange));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    neighborhood: filters.neighborhood,
    type: filters.type,
    priceRange,
    sort: filters.sort,
    page: filters.page,
    hasActiveFilters,
    setNeighborhood: (v: string) => dispatch(setNeighborhood(v)),
    setType: (v: string) => dispatch(setType(v)),
    setPriceRange: (v: string) => dispatch(setPriceRange(v)),
    setSort: (v: SortOption) => dispatch(setSort(v)),
    setPage: (p: number) => dispatch(setPage(p)),
    clearFilters: () => dispatch(clearFilters()),
  };
}
