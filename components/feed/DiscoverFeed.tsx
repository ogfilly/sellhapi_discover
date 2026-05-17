"use client";

import { useState, useCallback } from "react";
import Link                      from "next/link";
import { Compass }               from "lucide-react";
import { useFeed }               from "@/hooks/useFeed";
import { FeedGrid }              from "./FeedGrid";
import { LookViewer }            from "@/components/look/LookViewer";
import { ErrorBoundary }         from "@/components/ui/ErrorBoundary";
import { FeedGridSkeleton }      from "@/components/ui/Skeleton";
import type { FeedLook }         from "@/hooks/useFeed";

interface Props {
  initialLooks: FeedLook[];
}

export function DiscoverFeed({ initialLooks }: Props) {
  const [activeLookId, setActiveLookId] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFeed();

  const looks: FeedLook[] = data?.pages.flatMap(p => p.data) ?? initialLooks;

  const handleLookClick   = useCallback((id: string) => setActiveLookId(id), []);
  const handleViewerClose = useCallback(() => setActiveLookId(null), []);

  if (isLoading) return <FeedGridSkeleton />;
  if (looks.length === 0) return <EmptyFeed />;

  return (
    <>
      <ErrorBoundary>
        <FeedGrid
          looks={looks}
          onLookClick={handleLookClick}
          onLoadMore={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNext={isFetchingNextPage}
        />
      </ErrorBoundary>

      {activeLookId && (
        <ErrorBoundary>
          <LookViewer lookId={activeLookId} onClose={handleViewerClose} />
        </ErrorBoundary>
      )}
    </>
  );
}

function EmptyFeed() {
  return (
    <div className="flex flex-col items-center justify-center
                    min-h-[60vh] px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9355A6]
                      to-[#C084D8] flex items-center justify-center mb-5
                      shadow-lg shadow-purple-100">
        <Compass size={28} className="text-white" />
      </div>
      <h2 className="text-[20px] font-bold text-black mb-2">No looks yet</h2>
      <p className="text-[14px] text-zinc-400 leading-relaxed mb-8 max-w-[260px]">
        Be the first creator to style a look and share it with the world
      </p>
      <Link
        href="/auth/signup"
        className="h-11 px-8 bg-[#9355A6] text-white rounded-full
                   text-[14px] font-bold hover:bg-[#7d4690] transition
                   active:bg-[#6b3880] focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-[#9355A6]
                   focus-visible:ring-offset-2"
      >
        Become a creator
      </Link>
    </div>
  );
}
