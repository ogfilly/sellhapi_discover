"use client";

import { useEffect, useRef, useCallback } from "react";
import { FeedItem }                       from "./FeedItem";
import type { FeedLook }                  from "@/hooks/useFeed";

interface Props {
  looks:           FeedLook[];
  onLookClick:     (id: string) => void;
  onLoadMore?:     () => void;
  hasNextPage?:    boolean;
  isFetchingNext?: boolean;
}

// Instagram Explore pattern: every 7 items, index 3 is featured (row-span-2)
function isFeatured(index: number): boolean {
  return index % 7 === 3;
}

export function FeedGrid({
  looks, onLookClick, onLoadMore, hasNextPage, isFetchingNext,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasNextPage && !isFetchingNext) {
        onLoadMore?.();
      }
    },
    [hasNextPage, isFetchingNext, onLoadMore]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "400px",
      threshold:  0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (looks.length === 0) return null;

  return (
    <>
      <div
        className="grid grid-cols-3 gap-px bg-zinc-200
                   auto-rows-[calc(100vw/3)] max-w-[480px] mx-auto"
        role="list"
        aria-label="Discover looks"
      >
        {looks.map((look, i) => (
          <div
            key={look.id}
            role="listitem"
            className={isFeatured(i) ? "row-span-2" : "row-span-1"}
          >
            <FeedItem
              look={look}
              onClick={onLookClick}
              featured={isFeatured(i)}
              priority={i < 9}
            />
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-px" aria-hidden />

      {isFetchingNext && (
        <div className="grid grid-cols-3 gap-px bg-zinc-200 max-w-[480px] mx-auto">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-100 animate-pulse" />
          ))}
        </div>
      )}
    </>
  );
}
