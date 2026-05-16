"use client";

import { useEffect, useRef, useCallback } from "react";
import { LookGridItem }                   from "./LookGridItem";
import { LookGridSkeleton }               from "@/components/ui/Skeleton";
import type { LookSummary }               from "@/types/look";

interface Props {
  looks:           LookSummary[];
  onLookClick:     (id: string) => void;
  onLoadMore?:     () => void;
  hasNextPage?:    boolean;
  isFetchingNext?: boolean;
}

export function LookGrid({
  looks,
  onLookClick,
  onLoadMore,
  hasNextPage,
  isFetchingNext,
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
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px",
      threshold:  0.1,
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  if (looks.length === 0) return null;

  return (
    <>
      <div
        className="grid grid-cols-3 gap-[1px] bg-[#F0F0F0]"
        role="list"
        aria-label="Looks"
      >
        {looks.map((look, index) => (
          <div key={look.id} role="listitem">
            <LookGridItem
              look={look}
              onClick={onLookClick}
              priority={index < 6}
            />
          </div>
        ))}
      </div>

      <div ref={sentinelRef} className="h-1" aria-hidden />

      {isFetchingNext && (
        <div className="grid grid-cols-3 gap-[1px] bg-[#F0F0F0]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#F0F0F0] animate-pulse" />
          ))}
        </div>
      )}
    </>
  );
}
