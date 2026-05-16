"use client";

import Image               from "next/image";
import { formatCount }     from "@/lib/utils";
import type { LookSummary } from "@/types/look";
import { Heart }           from "lucide-react";

interface Props {
  look:      LookSummary;
  onClick:   (id: string) => void;
  priority?: boolean;
}

export function LookGridItem({ look, onClick, priority = false }: Props) {
  return (
    <button
      onClick={() => onClick(look.id)}
      className="relative aspect-square bg-[#F0F0F0] overflow-hidden
                 cursor-pointer group focus-visible:outline
                 focus-visible:outline-2 focus-visible:outline-[#9355A6]"
      aria-label={`View look — ${formatCount(look.likeCount)} likes`}
    >
      <Image
        src={look.coverImage}
        alt="Look"
        fill
        sizes="(max-width: 480px) 33vw, 160px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority={priority}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100
                   transition-opacity duration-200 flex items-center justify-center gap-1.5"
        aria-hidden
      >
        <Heart size={16} color="white" fill="white" />
        <span className="text-white text-[13px] font-semibold">
          {formatCount(look.likeCount)}
        </span>
      </div>
    </button>
  );
}
