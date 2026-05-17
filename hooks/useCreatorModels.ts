import { useQuery } from "@tanstack/react-query";
import { apiRequest }  from "@/lib/api";
import type { CreatorModel } from "@/types/garment";

export const modelKeys = {
  all:    ["creator-models"] as const,
  detail: (id: string) => [...modelKeys.all, id] as const,
};

export function useCreatorModels() {
  return useQuery({
    queryKey: modelKeys.all,
    queryFn:  () =>
      apiRequest<{ data: CreatorModel[] }>({
        method: "GET",
        url:    "/creators/me/models",
      }).then(r => r.data),
    staleTime: 30_000,
  });
}

export function useCreatorModel(id: string) {
  return useQuery({
    queryKey: modelKeys.detail(id),
    queryFn:  () =>
      apiRequest<{ data: CreatorModel & { generatedImages?: string[]; latestGenerationId?: string } }>({
        method: "GET",
        url:    `/creators/me/models/${id}`,
      }).then(r => r.data),
    staleTime: 10_000,
    enabled:   !!id,
  });
}
