"use client";

import Image          from "next/image";
import Link           from "next/link";
import { Plus }       from "lucide-react";
import { useCreatorModels } from "@/hooks/useCreatorModels";
import type { CreatorModel } from "@/types/garment";

interface Props {
  onSelect: (model: CreatorModel) => void;
}

export function ModelSelector({ onSelect }: Props) {
  const { data: models, isLoading } = useCreatorModels();

  const active = models?.filter(m => m.status === "active" && m.canonicalImageUrl) ?? [];

  return (
    <div className="px-4 py-6 space-y-4">
      <div>
        <h2 className="text-[16px] font-bold text-black">Choose your model</h2>
        <p className="text-[13px] text-zinc-500 mt-0.5">The model will wear your garment in the try-on</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl bg-zinc-100 animate-pulse aspect-[3/4]" />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
            <Plus size={24} className="text-zinc-400" />
          </div>
          <p className="text-[15px] font-semibold text-black mb-1">No models yet</p>
          <p className="text-[13px] text-zinc-500 mb-5">Create an AI model to start making looks</p>
          <Link
            href="/models/create"
            className="h-11 px-6 bg-[#9355A6] text-white rounded-full text-[14px] font-semibold
                       flex items-center gap-2 hover:bg-[#7d4690] transition-colors"
          >
            <Plus size={16} />
            Create Model
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {active.map(model => (
              <button
                key={model.id}
                onClick={() => onSelect(model)}
                className="group rounded-2xl overflow-hidden border-2 border-transparent
                           hover:border-[#9355A6] transition-all cursor-pointer text-left"
              >
                <div className="aspect-[3/4] relative bg-zinc-100">
                  <Image
                    src={model.canonicalImageUrl!}
                    alt={model.name}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-2 bg-white">
                  <p className="text-[12px] font-semibold text-black truncate">{model.name}</p>
                  <p className="text-[11px] text-zinc-500 capitalize">{model.gender}</p>
                </div>
              </button>
            ))}
          </div>
          <Link
            href="/models/create"
            className="flex items-center justify-center gap-2 h-11 border-2 border-dashed
                       border-zinc-300 rounded-2xl text-[13px] font-medium text-zinc-500
                       hover:border-[#9355A6] hover:text-[#9355A6] transition-colors"
          >
            <Plus size={15} />
            New Model
          </Link>
        </>
      )}
    </div>
  );
}
