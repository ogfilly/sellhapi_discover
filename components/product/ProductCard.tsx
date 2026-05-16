"use client";

import Image               from "next/image";
import { formatPrice }     from "@/lib/utils";
import type { LookProduct } from "@/types/product";
import { ShoppingCart, ExternalLink } from "lucide-react";

interface Props {
  product: LookProduct;
  onOrder: (product: LookProduct) => void;
}

export function ProductCard({ product, onOrder }: Props) {
  return (
    <div className="flex items-center gap-3 bg-[#F8F8F8] rounded-[14px] p-3">
      {/* Image */}
      <div className="relative w-[64px] h-[64px] rounded-[10px] bg-[#E8E8E8]
                      overflow-hidden flex-shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F2EDFF] to-[#E8D5F5]" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-black truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <p className="text-[13px] font-bold text-[#9355A6]">
            {formatPrice(product.price, product.currency)}
          </p>
          {product.externalSource && (
            <span className="text-[10px] text-[#666] bg-white border border-[#E0E0E0]
                             px-2 py-0.5 rounded-full font-medium">
              {product.externalSource}
            </span>
          )}
          {product.isInternational && (
            <span className="text-[10px] text-[#666] bg-white border border-[#E0E0E0]
                             px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ExternalLink size={9} />
              International
            </span>
          )}
        </div>
      </div>

      {/* Add to order */}
      <button
        onClick={() => onOrder(product)}
        aria-label={`Order ${product.name}`}
        className="w-10 h-10 bg-[#9355A6] rounded-full flex items-center
                   justify-center cursor-pointer hover:bg-[#7d4690]
                   transition-all active:scale-90 flex-shrink-0
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9355A6]"
      >
        <ShoppingCart size={16} color="white" />
      </button>
    </div>
  );
}
