"use client";

import Image            from "next/image";
import Link             from "next/link";
import { Avatar }       from "@/components/ui/Avatar";
import type { FeedLook } from "@/hooks/useFeed";
import { formatCount }  from "@/lib/utils";
import { Heart, ShoppingBag } from "lucide-react";

interface Props {
  look:      FeedLook;
  onClick:   (id: string) => void;
  featured?: boolean;
  priority?: boolean;
}

export function FeedItem({ look, onClick, featured = false, priority = false }: Props) {
  return (
    <button
      onClick={() => onClick(look.id)}
      className={`relative w-full overflow-hidden bg-zinc-100 cursor-pointer
                  group focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-inset focus-visible:ring-[#9355A6]
                  ${featured ? "row-span-2" : "row-span-1"}`}
      aria-label={`Look by ${look.creator.displayName}`}
    >
      <div className="absolute inset-0">
        <Image
          src={look.coverImage}
          alt={`Look by ${look.creator.displayName}`}
          fill
          sizes={featured ? "50vw" : "33vw"}
          className="object-cover transition-transform duration-500
                     group-hover:scale-105"
          priority={priority}
        />
      </div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25
                      transition-colors duration-200" />

      <div className="absolute inset-0 flex items-center justify-center
                      gap-4 opacity-0 group-hover:opacity-100
                      transition-opacity duration-200">
        <div className="flex items-center gap-1.5">
          <Heart size={18} className="text-white fill-white" />
          <span className="text-white text-[14px] font-bold">
            {formatCount(look.likeCount)}
          </span>
        </div>
        {look.productCount > 0 && (
          <div className="flex items-center gap-1.5">
            <ShoppingBag size={18} className="text-white fill-white" />
            <span className="text-white text-[14px] font-bold">
              {look.productCount}
            </span>
          </div>
        )}
      </div>

      <Link
        href={`/${look.creator.username}`}
        onClick={e => e.stopPropagation()}
        className="absolute bottom-2 left-2 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-white rounded-full"
        aria-label={`View ${look.creator.displayName}'s profile`}
      >
        <Avatar
          src={look.creator.profilePhoto}
          alt={look.creator.displayName}
          size="xs"
          className="ring-2 ring-white shadow-md"
        />
      </Link>

      {look.productCount > 0 && (
        <div className="absolute top-2 right-2 w-7 h-7 bg-white/90
                        backdrop-blur-sm rounded-full flex items-center
                        justify-center shadow-sm">
          <ShoppingBag size={13} className="text-[#9355A6]" />
        </div>
      )}
    </button>
  );
}
