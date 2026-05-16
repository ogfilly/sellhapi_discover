"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type TouchEvent,
}                           from "react";
import Image                from "next/image";
import { useLook }          from "@/hooks/useLooks";
import { Avatar }           from "@/components/ui/Avatar";
import { ProductPin }       from "./ProductPin";
import { ProductSheet }     from "@/components/product/ProductSheet";
import { Skeleton }         from "@/components/ui/Skeleton";
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

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging  = useRef(false);

  const allImages = look
    ? [look.coverImage, ...look.images.filter((i) => i !== look.coverImage)]
    : [];

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, allImages.length - 1));
  }, [allImages.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  }, []);

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
    if (Math.abs(dx) > 50) {
      dx < 0 ? goNext() : goPrev();
    }
  };

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
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, []);

  useEffect(() => {
    if (look) setLiked(look.isLiked);
  }, [look]);

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Look viewer"
      className="fixed inset-0 z-50 bg-black flex flex-col max-w-[480px] mx-auto"
    >
      {/* ── Top bar ── */}
      <div
        className="absolute top-0 left-0 right-0 z-20
                   bg-gradient-to-b from-black/70 to-transparent
                   flex items-center justify-between px-4 py-3"
      >
        <button
          onClick={onClose}
          aria-label="Close look"
          className="w-9 h-9 flex items-center justify-center
                     rounded-full bg-black/20 backdrop-blur-sm cursor-pointer
                     hover:bg-black/40 transition"
        >
          <X size={20} color="white" />
        </button>

        {look && (
          <div className="flex items-center gap-2">
            <Avatar
              src={look.creator.profilePhoto}
              alt={look.creator.displayName}
              size={28}
            />
            <span className="text-white text-[13px] font-medium">
              @{look.creator.username}
            </span>
          </div>
        )}

        <button
          aria-label="Share look"
          className="w-9 h-9 flex items-center justify-center
                     rounded-full bg-black/20 backdrop-blur-sm cursor-pointer
                     hover:bg-black/40 transition"
        >
          <Share2 size={18} color="white" />
        </button>
      </div>

      {/* ── Main image area ── */}
      <div
        className="flex-1 relative overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isLoading || !look ? (
          <Skeleton className="w-full h-full rounded-none" />
        ) : (
          <>
            <div
              className="flex h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {allImages.map((src, i) => (
                <div key={src} className="relative w-full h-full flex-shrink-0">
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
            </div>

            {look.products.slice(0, 5).map((product) => (
              <ProductPin
                key={product.id}
                xPosition={product.xPosition}
                yPosition={product.yPosition}
                label={product.name}
                onClick={() => setShowProducts(true)}
              />
            ))}

            {allImages.length > 1 && (
              <div
                className="absolute bottom-24 left-0 right-0 flex justify-center
                           gap-1.5 pointer-events-none"
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
        <div
          className="absolute bottom-0 left-0 right-0
                     bg-gradient-to-t from-black/80 to-transparent
                     px-4 pb-8 pt-16"
        >
          {look.caption && (
            <p className="text-white text-[13px] mb-4 leading-relaxed line-clamp-2">
              {look.caption}
            </p>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setLiked((l) => !l)}
              aria-label={liked ? "Unlike" : "Like"}
              aria-pressed={liked}
              className="flex items-center gap-1.5 cursor-pointer
                         transition-transform active:scale-90"
            >
              <Heart
                size={26}
                color="white"
                fill={liked ? "white" : "none"}
                strokeWidth={liked ? 0 : 2}
              />
              <span className="text-white text-[13px] font-medium">
                {formatCount(look.likeCount + (liked && !look.isLiked ? 1 : 0))}
              </span>
            </button>

            {look.products.length > 0 && (
              <button
                onClick={() => setShowProducts(true)}
                className="flex items-center gap-2 bg-white text-black
                           px-5 h-[42px] rounded-full text-[13px] font-bold
                           cursor-pointer hover:bg-[#F5F5F5] transition-all
                           active:scale-95 shadow-lg"
              >
                <ShoppingBag size={15} />
                Shop ({look.products.length})
              </button>
            )}
          </div>
        </div>
      )}

      {showProducts && look && (
        <ProductSheet
          products={look.products}
          onClose={() => setShowProducts(false)}
        />
      )}
    </div>
  );
}
