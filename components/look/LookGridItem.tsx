"use client";

import Image            from "next/image";
import { formatCount }  from "@/lib/utils";
import type { LookSummary } from "@/types/look";
import { Heart }        from "lucide-react";

interface Props {
  look:      LookSummary;
  onClick:   (id: string) => void;
  priority?: boolean;
}

export function LookGridItem({ look, onClick, priority = false }: Props) {
  return (
    <button
      onClick={() => onClick(look.id)}
      className="relative aspect-square overflow-hidden bg-zinc-100 cursor-pointer group
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
                 focus-visible:ring-[#9355A6]"
      aria-label={`Look with ${formatCount(look.likeCount)} likes`}
    >
      <Image
        src={look.coverImage}
        alt="Look"
        fill
        sizes="(max-width: 480px) 33vw, 160px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority={priority}
      />

      {/* Hover overlay — Instagram style */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100
                      transition-opacity duration-200 flex items-center justify-center gap-2">
        <Heart size={18} className="text-white fill-white" aria-hidden />
        <span className="text-white text-[14px] font-bold">
          {formatCount(look.likeCount)}
        </span>
      </div>
    </button>
  );
}
