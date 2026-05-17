"use client";

import {
  useEffect, useRef, useState, useCallback,
  type TouchEvent,
}                           from "react";
import Image                from "next/image";
import { useLook }          from "@/hooks/useLooks";
import { Avatar }           from "@/components/ui/Avatar";
import { ProductPin }       from "./ProductPin";
import { ProductSheet }     from "@/components/product/ProductSheet";
import { formatCount }      from "@/lib/utils";
import { X, Heart, Share2, ShoppingBag } from "lucide-react";

interface Props {
  lookId:  string;
  onClose: () => void;
}

export function LookViewer({ lookId, onClose }: Props) {
  const { data: look, isLoading } = useLook(lookId);

  const [activeIndex,  setActiveIndex]  = useState(0);
  const [liked,        setLiked]        = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging  = useRef(false);

  const allImages = look
    ? [look.coverImage, ...look.images.filter(i => i !== look.coverImage)]
    : [];

  const goNext = useCallback(() =>
    setActiveIndex(i => Math.min(i + 1, allImages.length - 1)),
    [allImages.length]
  );
  const goPrev = useCallback(() =>
    setActiveIndex(i => Math.max(i - 1, 0)),
    []
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goNext, goPrev]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    if (look) setLiked(look.isLiked);
  }, [look]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX;
    touchStartY.current = e.touches[0]!.clientY;
    isDragging.current  = false;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const dx = Math.abs(e.touches[0]!.clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0]!.clientY - touchStartY.current);
    if (dx > dy && dx > 10) isDragging.current = true;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.changedTouches[0]!.clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? goNext() : goPrev();
  };

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Look viewer"
      className="fixed inset-0 z-50 bg-black flex flex-col max-w-[480px] mx-auto"
    >
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center
                      justify-between px-3 py-3
                      bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex
                     items-center justify-center cursor-pointer
                     hover:bg-black/40 transition focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={20} className="text-white" />
        </button>

        {look && (
          <div className="flex items-center gap-2">
            <Avatar
              src={look.creator.profilePhoto}
              alt={look.creator.displayName}
              size="xs"
            />
            <span className="text-white text-[13px] font-semibold">
              @{look.creator.username}
            </span>
          </div>
        )}

        <button
          aria-label="Share look"
          className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-sm flex
                     items-center justify-center cursor-pointer
                     hover:bg-black/40 transition focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-white"
        >
          <Share2 size={18} className="text-white" />
        </button>
      </div>

      {/* ── Image area ── */}
      <div
        className="flex-1 relative overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading || !look ? (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse" />
        ) : (
          <>
            {/* Images — slide with pure Tailwind translate */}
            {allImages.map((src, i) => (
              <div
                key={src}
                aria-hidden={i !== activeIndex}
                className={`absolute inset-0 transition-all duration-300 ease-out ${
                  i === activeIndex
                    ? "opacity-100 translate-x-0 z-10"
                    : i < activeIndex
                    ? "opacity-0 -translate-x-full z-0"
                    : "opacity-0 translate-x-full z-0"
                }`}
              >
                <Image
                  src={src}
                  alt={`Look image ${i + 1}`}
                  fill
                  sizes="480px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Product pins */}
            {look.products.map(product => (
              <ProductPin
                key={product.id}
                xPosition={product.xPosition}
                yPosition={product.yPosition}
                label={product.name}
                onClick={() => setShowProducts(true)}
              />
            ))}

            {/* Image dots */}
            {allImages.length > 1 && (
              <div
                className="absolute bottom-24 left-0 right-0 flex justify-center gap-1.5
                           pointer-events-none z-20"
                aria-hidden
              >
                {allImages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full bg-white transition-all duration-300 ${
                      i === activeIndex ? "w-4 opacity-100" : "w-1.5 opacity-50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Bottom bar ── */}
      {look && (
        <div className="absolute bottom-0 left-0 right-0 z-20
                        bg-gradient-to-t from-black/80 to-transparent
                        px-4 pb-8 pt-16">
          {look.caption && (
            <p className="text-white text-[13px] mb-3 leading-relaxed line-clamp-2">
              {look.caption}
            </p>
          )}

          <div className="flex items-center justify-between">
            {/* Like */}
            <button
              onClick={() => setLiked(l => !l)}
              aria-label={liked ? "Unlike" : "Like"}
              aria-pressed={liked}
              className="flex items-center gap-1.5 cursor-pointer
                         transition-transform active:scale-90"
            >
              <Heart
                size={26}
                className={`transition-all ${
                  liked
                    ? "text-red-500 fill-red-500 scale-110"
                    : "text-white fill-transparent"
                }`}
              />
              <span className="text-white text-[13px] font-medium">
                {formatCount(look.likeCount + (liked && !look.isLiked ? 1 : 0))}
              </span>
            </button>

            {/* Shop CTA */}
            {look.products.length > 0 && (
              <button
                onClick={() => setShowProducts(true)}
                className="flex items-center gap-2 bg-white text-black
                           px-5 h-10 rounded-full text-[13px] font-bold
                           cursor-pointer hover:bg-zinc-100 transition-all
                           active:scale-95 shadow-lg"
              >
                <ShoppingBag size={15} />
                Shop ({look.products.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Product sheet ── */}
      {look && (
        <ProductSheet
          products={look.products}
          isOpen={showProducts}
          onClose={() => setShowProducts(false)}
        />
      )}
    </div>
  );
}
