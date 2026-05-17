"use client";

import { useEffect, useState } from "react";
import Image                   from "next/image";
import { RotateCw }            from "lucide-react";
import { apiRequest }          from "@/lib/api";
import type { CreatorModel, FashnCategory } from "@/types/garment";

interface Props {
  model:       CreatorModel;
  garmentUrl:  string;
  category:    FashnCategory;
  onResult:    (url: string) => void;
  onRetry:     () => void;
}

export function TryOnProcessor({ model, garmentUrl, category, onResult, onRetry }: Props) {
  const [status,   setStatus]   = useState<"loading" | "done" | "error">("loading");
  const [resultUrl, setResult]  = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setStatus("loading");
      setError(null);
      try {
        const res = await apiRequest<{ data: { editedImageUrl: string } }>({
          method:  "POST",
          url:     "/creators/me/try-on",
          data:    {
            modelImage:  model.canonicalImageUrl,
            garmentImage: garmentUrl,
            category,
          },
          timeout: 120_000,
        });
        if (!cancelled) {
          setResult(res.data.editedImageUrl);
          setStatus("done");
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.error ?? "Try-on failed");
          setStatus("error");
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [model.canonicalImageUrl, garmentUrl, category]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-5">
        <div className="w-14 h-14 border-[3px] border-zinc-200 border-t-[#9355A6] rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-[15px] font-semibold text-black">Generating try-on</p>
          <p className="text-[13px] text-zinc-500 mt-1">This takes about 30 seconds</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
        <p className="text-[15px] font-semibold text-black">Try-on failed</p>
        <p className="text-[13px] text-zinc-500">{error}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 h-11 px-6 border-2 border-zinc-300 rounded-full
                     text-[14px] font-semibold cursor-pointer hover:border-black transition-colors"
        >
          <RotateCw size={15} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100">
        <Image src={resultUrl!} alt="Try-on result" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 h-11 border-2 border-zinc-200 rounded-full text-[14px] font-semibold
                     text-zinc-700 flex items-center justify-center gap-2 cursor-pointer
                     hover:border-zinc-400 transition-colors"
        >
          <RotateCw size={15} />
          Redo
        </button>
        <button
          onClick={() => onResult(resultUrl!)}
          className="flex-1 h-11 bg-black text-white rounded-full text-[14px] font-semibold
                     cursor-pointer hover:bg-zinc-800 transition-colors"
        >
          Use this
        </button>
      </div>
    </div>
  );
}
