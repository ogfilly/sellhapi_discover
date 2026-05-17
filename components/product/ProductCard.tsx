"use client";

import Image             from "next/image";
import { formatPrice }   from "@/lib/utils";
import type { LookProduct } from "@/types/product";
import { ExternalLink, Check } from "lucide-react";
import { cn }            from "@/lib/utils";

interface Props {
  product:   LookProduct;
  selected:  boolean;
  onToggle:  (product: LookProduct) => void;
}

export function ProductCard({ product, selected, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle(product)}
      aria-pressed={selected}
      aria-label={`${selected ? "Remove" : "Add"} ${product.name}`}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-2xl text-left",
        "transition-all duration-150 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9355A6]",
        selected
          ? "bg-[#F8F4FF] ring-2 ring-[#9355A6]"
          : "bg-zinc-50 hover:bg-zinc-100"
      )}
    >
      {/* Image */}
      <div className="relative w-16 h-16 rounded-xl bg-zinc-200 overflow-hidden flex-shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F2EDFF] to-[#E8D5F5]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-black truncate mb-0.5">
          {product.name}
        </p>
        <p className="text-[14px] font-bold text-[#9355A6]">
          {formatPrice(product.price, product.currency)}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {product.externalSource && (
            <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200
                             px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ExternalLink size={9} aria-hidden />
              {product.externalSource}
            </span>
          )}
          {product.isInternational && (
            <span className="text-[10px] text-zinc-500 bg-white border border-zinc-200
                             px-2 py-0.5 rounded-full font-medium">
              International
            </span>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
        selected
          ? "bg-[#9355A6]"
          : "bg-white border-2 border-zinc-300"
      )}>
        {selected && <Check size={14} className="text-white" />}
      </div>
    </button>
  );
}
