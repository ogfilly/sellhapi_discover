"use client";

import { ShoppingBag } from "lucide-react";

interface Props {
  xPosition: number;
  yPosition: number;
  onClick:   () => void;
  label:     string;
}

export function ProductPin({ xPosition, yPosition, onClick, label }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={`Shop product: ${label}`}
      style={{
        position:  "absolute",
        left:      `${xPosition}%`,
        top:       `${yPosition}%`,
        transform: "translate(-50%, -50%)",
      }}
      className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm
                 border-2 border-white shadow-[0_2px_12px_rgba(0,0,0,0.3)]
                 flex items-center justify-center cursor-pointer
                 transition-transform duration-200
                 hover:scale-110 active:scale-95
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
    >
      <span
        className="absolute inset-0 rounded-full bg-white/40 animate-ping"
        aria-hidden
      />
      <ShoppingBag size={15} color="#9355A6" className="relative z-10" />
    </button>
  );
}
