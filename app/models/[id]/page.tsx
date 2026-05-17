"use client";

import { useState, useEffect }    from "react";
import Image                      from "next/image";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast                      from "react-hot-toast";
import {
  ArrowLeft, RotateCw, Check, ShieldCheck,
  Sparkles, Loader2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { apiRequest }             from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

type ModelStatus = "generating" | "selecting" | "active" | "failed";
type GenStatus   = "pending" | "processing" | "completed" | "failed";

interface ModelData {
  id: string; name: string; gender: string; ageRange: string; skinTone: string;
  bodyShape: string; canonicalImageUrl?: string; generatedImages?: string[];
  status: ModelStatus; usageCount: number; isLocked?: boolean; version?: number;
  latestGenerationId?: string; createdAt: string;
}

interface GenerationData {
  id: string; status: GenStatus; generationIntent: string; attemptCount: number;
  generatedImages: string[]; riskScore: string | null;
  ranking: { bestIndex: number; bestImageUrl: string; rankedImages: any[] } | null;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ModelDetailPage() {
  const router       = useRouter();
  const { id }       = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const queryClient  = useQueryClient();

  const [activeGenId,        setActiveGenId]        = useState<string | null>(searchParams.get("generationId"));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isSelecting,        setIsSelecting]        = useState(false);
  const [isRegenerating,     setIsRegenerating]     = useState(false);
  const [carouselIdx,        setCarouselIdx]        = useState(0);

  const { data: modelData, isLoading } = useQuery({
    queryKey: ["creator-model", id],
    queryFn:  () =>
      apiRequest<{ data: ModelData }>({ method: "GET", url: `/creators/me/models/${id}` })
        .then(r => r.data),
  });

  const { data: generation } = useQuery({
    queryKey: ["creator-generation", activeGenId],
    queryFn:  () =>
      apiRequest<{ data: GenerationData }>({
        method: "GET",
        url:    `/creators/me/models/generations/${activeGenId}`,
      }).then(r => r.data),
    enabled:       !!activeGenId,
    refetchInterval: (query) => {
      const s = query.state.data?.status;
      return s === "pending" || s === "processing" ? 4000 : false;
    },
  });

  const model      = modelData;
  const isGenerating = generation?.status === "pending" || generation?.status === "processing";
  const genCompleted = generation?.status === "completed";

  useEffect(() => {
    if (model && !activeGenId && model.latestGenerationId) {
      setActiveGenId(model.latestGenerationId);
    }
  }, [model, activeGenId]);

  useEffect(() => {
    if (genCompleted) queryClient.invalidateQueries({ queryKey: ["creator-model", id] });
  }, [genCompleted, id, queryClient]);

  const generatedImages = generation?.generatedImages ?? model?.generatedImages ?? [];
  const recommendedIdx  = generation?.ranking?.bestIndex ?? null;

  const handleSelectCanonical = async () => {
    if (selectedImageIndex === null || !activeGenId) return;
    setIsSelecting(true);
    try {
      const res = await apiRequest<any>({
        method: "POST",
        url:    `/creators/me/models/generations/${activeGenId}/select`,
        data:   { imageIndex: selectedImageIndex },
      });
      toast.success(res.message ?? "Model photo selected!");
      setSelectedImageIndex(null);
      queryClient.invalidateQueries({ queryKey: ["creator-model", id] });
    } catch (err: any) {
      toast.error(err?.error ?? "Failed to select image");
    } finally {
      setIsSelecting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!model) return;
    setIsRegenerating(true);
    try {
      const res = await apiRequest<{ generationId: string }>({
        method: "POST",
        url:    "/creators/me/models/generate",
        data:   {
          modelId:          model.id,
          generationIntent: model.isLocked ? "pose_variation" : "base_model_clean",
        },
      });
      setActiveGenId(res.generationId);
      toast.success("Generating new variation...");
      queryClient.invalidateQueries({ queryKey: ["creator-model", id] });
    } catch (err: any) {
      toast.error(err?.error ?? "Failed to regenerate");
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white max-w-[480px] mx-auto">
        <nav className="sticky top-0 z-10 bg-white border-b border-zinc-200 flex items-center px-4 h-11 gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer">
            <ArrowLeft size={18} className="text-black" />
          </button>
          <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
        </nav>
        <div className="aspect-[3/4] bg-zinc-100 animate-pulse mx-4 mt-6 rounded-2xl" />
      </main>
    );
  }

  if (!model) {
    return (
      <main className="min-h-screen bg-white max-w-[480px] mx-auto flex items-center justify-center">
        <p className="text-[14px] text-zinc-400">Model not found</p>
      </main>
    );
  }

  const displayImage = model.canonicalImageUrl
    ?? (generatedImages.length > 0 ? generatedImages[carouselIdx] : null);

  return (
    <main className="min-h-screen bg-white max-w-[480px] mx-auto pb-10">
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white border-b border-zinc-200 flex items-center justify-between px-4 h-11">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
        >
          <ArrowLeft size={18} className="text-black" />
        </button>
        <div className="flex items-center gap-2">
          <h1 className="text-[15px] font-bold text-black truncate max-w-[180px]">{model.name}</h1>
          {model.isLocked && <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />}
          <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${
            model.status === "active"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : model.status === "failed"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            {model.status}
          </span>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating || isGenerating}
          className="flex items-center gap-1 h-8 px-3 border border-zinc-200 rounded-full
                     text-[12px] font-medium text-zinc-700 cursor-pointer disabled:opacity-40
                     hover:border-zinc-400 transition"
        >
          {isRegenerating ? <Loader2 size={13} className="animate-spin" /> : <RotateCw size={13} />}
          {model.isLocked ? "Variation" : "Regen"}
        </button>
      </nav>

      {/* Hero image */}
      <div className="px-4 pt-5">
        {isGenerating ? (
          <div className="aspect-[3/4] bg-zinc-100 rounded-2xl flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-[3px] border-zinc-300 border-t-[#9355A6] rounded-full animate-spin" />
            <p className="text-[12px] font-mono uppercase tracking-wider text-zinc-500 animate-pulse">
              {generation?.generationIntent?.replace(/_/g, " ") ?? "Generating model"}
            </p>
          </div>
        ) : displayImage ? (
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100">
            <Image src={displayImage} alt={model.name} fill sizes="480px" className="object-cover" />
          </div>
        ) : (
          <div className="aspect-[3/4] bg-zinc-100 rounded-2xl flex flex-col items-center justify-center gap-3">
            <Sparkles size={28} className="text-zinc-300" />
            <p className="text-[13px] text-zinc-400">No image yet</p>
          </div>
        )}
      </div>

      {/* Generated image carousel (for selection) */}
      {generatedImages.length > 0 && !isGenerating && (
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-zinc-500 uppercase tracking-wider">
              {genCompleted ? "Select your model photo" : "Generated images"}
            </p>
            {selectedImageIndex !== null && (
              <button
                onClick={handleSelectCanonical}
                disabled={isSelecting}
                className="flex items-center gap-1 h-8 px-4 bg-[#9355A6] text-white rounded-full
                           text-[12px] font-semibold cursor-pointer disabled:opacity-60 hover:bg-[#7d4690] transition"
              >
                {isSelecting ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                Use this
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {generatedImages.map((img, idx) => (
              <button
                key={img}
                onClick={() => setSelectedImageIndex(selectedImageIndex === idx ? null : idx)}
                className={`relative flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImageIndex === idx
                    ? "border-[#9355A6]"
                    : recommendedIdx === idx
                    ? "border-emerald-400"
                    : "border-zinc-200 hover:border-zinc-400"
                }`}
              >
                <Image src={img} alt={`Image ${idx + 1}`} fill sizes="96px" className="object-cover" />
                {recommendedIdx === idx && (
                  <span className="absolute top-1 left-1 text-[8px] bg-emerald-500 text-white px-1 py-0.5 rounded font-mono uppercase tracking-wider">
                    Best
                  </span>
                )}
                {selectedImageIndex === idx && (
                  <div className="absolute inset-0 bg-[#9355A6]/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#9355A6] flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model info */}
      <div className="px-4 pt-5 space-y-3">
        <div className="flex flex-wrap gap-2">
          {[model.gender, model.ageRange, model.skinTone, model.bodyShape]
            .filter(Boolean)
            .map(attr => (
              <span
                key={attr}
                className="text-[11px] font-medium px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full capitalize"
              >
                {attr}
              </span>
            ))}
        </div>

        {model.canonicalImageUrl && (
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <ShieldCheck size={13} className="text-emerald-600 flex-shrink-0" />
            Model identity locked · version {model.version ?? 1}
          </div>
        )}
      </div>

      {/* CTA — use model for look */}
      {model.status === "active" && model.canonicalImageUrl && (
        <div className="px-4 pt-6">
          <button
            onClick={() => router.push("/new-look")}
            className="w-full h-[50px] bg-[#9355A6] text-white rounded-full text-[15px] font-bold
                       flex items-center justify-center gap-2 cursor-pointer hover:bg-[#7d4690] transition-colors"
          >
            <Sparkles size={16} />
            Create a Look with this Model
          </button>
        </div>
      )}
    </main>
  );
}
