"use client";

import { ShoppingBag } from "lucide-react";

interface Props {
  xPosition: number;
  yPosition: number;
  onClick:   () => void;
  label:     string;
}

// left/top as percentages from pin placement data are the one legitimate exception
// to the no-inline-styles rule — they are positional data, not styling decisions.
// This is how every production image-tagging system works (Instagram, Figma, Pinterest).
export function ProductPin({ xPosition, yPosition, onClick, label }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={`Shop: ${label}`}
      className="absolute z-10 w-9 h-9 -translate-x-1/2 -translate-y-1/2
                 rounded-full bg-white/90 backdrop-blur-sm border-2 border-white
                 shadow-[0_2px_12px_rgba(0,0,0,0.3)]
                 flex items-center justify-center cursor-pointer
                 hover:scale-110 active:scale-95 transition-transform duration-150
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{ left: `${xPosition}%`, top: `${yPosition}%` }}
    >
      <span className="absolute inset-0 rounded-full bg-white/40 animate-ping"
            aria-hidden />
      <ShoppingBag size={15} className="text-[#9355A6] relative z-10" />
    </button>
  );
}
