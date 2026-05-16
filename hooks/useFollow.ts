import {
  useMutation,
  useQueryClient,
}                           from "@tanstack/react-query";
import { apiRequest }       from "@/lib/api";
import { creatorKeys }      from "./useCreator";
import type { Creator }     from "@/types/creator";
import type { ApiResponse } from "@/types/api";

export function useFollow(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isFollowing: boolean) =>
      apiRequest<ApiResponse<null>>({
        method: isFollowing ? "DELETE" : "POST",
        url:    `/creators/${username}/follow`,
      }),

    onMutate: async (isFollowing) => {
      await queryClient.cancelQueries({
        queryKey: creatorKeys.profile(username),
      });

      const previous = queryClient.getQueryData<ApiResponse<Creator>>(
        creatorKeys.profile(username)
      );

      queryClient.setQueryData<ApiResponse<Creator>>(
        creatorKeys.profile(username),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              isFollowing:   !isFollowing,
              followerCount: old.data.followerCount + (isFollowing ? -1 : 1),
            },
          };
        }
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          creatorKeys.profile(username),
          context.previous
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: creatorKeys.profile(username),
      });
    },
  });
}
