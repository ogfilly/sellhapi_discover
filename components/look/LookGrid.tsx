"use client";

import { useEffect, useRef, useCallback } from "react";
import { LookGridItem }                  from "./LookGridItem";
import type { LookSummary }              from "@/types/look";

interface Props {
  looks:           LookSummary[];
  onLookClick:     (id: string) => void;
  onLoadMore?:     () => void;
  hasNextPage?:    boolean;
  isFetchingNext?: boolean;
}

export function LookGrid({
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
      rootMargin: "300px",
      threshold:  0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <>
      <div
        className="grid grid-cols-3 gap-px bg-zinc-200"
        role="list"
        aria-label="Looks"
      >
        {looks.map((look, i) => (
          <div key={look.id} role="listitem">
            <LookGridItem
              look={look}
              onClick={onLookClick}
              priority={i < 9}
            />
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-px" aria-hidden />

      {isFetchingNext && (
        <div className="grid grid-cols-3 gap-px bg-zinc-200">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-square bg-zinc-100 animate-pulse" />
          ))}
        </div>
      )}
    </>
  );
}
