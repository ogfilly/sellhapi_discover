import { useQuery }         from "@tanstack/react-query";
import { apiRequest }        from "@/lib/api";
import type { ApiResponse }  from "@/types/api";
import type { Creator }      from "@/types/creator";

export const creatorKeys = {
  all:     ["creators"]                         as const,
  profile: (username: string) =>
             [...creatorKeys.all, username]      as const,
};

export function useCreator(username: string) {
  return useQuery({
    queryKey: creatorKeys.profile(username),
    queryFn:  () =>
      apiRequest<ApiResponse<Creator>>({
        method: "GET",
        url:    `/creators/${username}`,
      }),
    staleTime: 60_000,
    retry:     1,
    select:    (res) => res.data,
  });
}
