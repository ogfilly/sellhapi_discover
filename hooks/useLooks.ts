import {
  useInfiniteQuery,
  useQuery,
}                              from "@tanstack/react-query";
import { apiRequest }          from "@/lib/api";
import type {
  ApiResponse,
  PaginatedResponse,
}                              from "@/types/api";
import type { Look, LookSummary } from "@/types/look";
import { PAGE_SIZE }           from "@/lib/constants";

export const lookKeys = {
  all:        ["looks"]                          as const,
  byUsername: (username: string) =>
                [...lookKeys.all, username]       as const,
  detail:     (id: string) =>
                [...lookKeys.all, "detail", id]   as const,
};

export function useLooks(username: string) {
  return useInfiniteQuery({
    queryKey:         lookKeys.byUsername(username),
    queryFn:          ({ pageParam = 1 }) =>
      apiRequest<PaginatedResponse<LookSummary>>({
        method: "GET",
        url:    `/creators/${username}/looks`,
        params: { page: pageParam, limit: PAGE_SIZE },
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNext ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
    staleTime:        30_000,
  });
}

export function useLook(lookId: string) {
  return useQuery({
    queryKey: lookKeys.detail(lookId),
    queryFn:  () =>
      apiRequest<ApiResponse<Look>>({
        method: "GET",
        url:    `/looks/${lookId}`,
      }),
    staleTime: 60_000,
    select:    (res) => res.data,
  });
}
