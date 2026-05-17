import { useInfiniteQuery } from "@tanstack/react-query";
import { apiRequest }        from "@/lib/api";
import type { LookSummary }  from "@/types/look";
import { PAGE_SIZE }         from "@/lib/constants";

export interface FeedLook extends LookSummary {
  creator: {
    id:           string;
    username:     string;
    displayName:  string;
    profilePhoto: string | null;
    isVerified:   boolean;
  };
}

interface CursorMeta {
  hasNext:    boolean;
  nextCursor: string | null;
  limit:      number;
  total:      null;
}

export const feedKeys = {
  all: ["feed"] as const,
};

export function useFeed() {
  return useInfiniteQuery({
    queryKey:         feedKeys.all,
    queryFn:          ({ pageParam }) =>
      apiRequest<{ data: FeedLook[]; meta: CursorMeta }>({
        method: "GET",
        url:    "/creators/looks",
        params: {
          limit: PAGE_SIZE,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
      }),
    getNextPageParam: lastPage => lastPage.meta.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime:        30_000,
  });
}
