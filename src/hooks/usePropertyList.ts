import { useGetPropertiesQuery } from "@/store/api/propertiesApi";
import type { Property } from "@/data/properties";
import { usePropertyFilters } from "@/hooks/usePropertyFilters";

export interface UsePropertyListReturn {
  properties: Property[];
  total: number;
  totalPages: number;
  isInitialLoad: boolean;
  isRefetching: boolean;
  isError: boolean;
  refetch: () => void;
}

export function usePropertyList(): UsePropertyListReturn {
  const { neighborhood, type, priceRange, sort, page } = usePropertyFilters();

  const { data, isLoading, isFetching, isError, refetch } = useGetPropertiesQuery({
    neighborhood,
    type,
    priceRange,
    sort,
    page,
    pageSize: 12,
    isActive: true,
  });

  const isInitialLoad = isLoading;
  const isRefetching = isFetching && !isLoading;

  return {
    properties: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    isInitialLoad,
    isRefetching,
    isError,
    refetch,
  };
}
