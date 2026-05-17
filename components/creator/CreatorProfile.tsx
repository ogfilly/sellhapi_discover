"use client";

import { useState, useCallback } from "react";
import { Grid3X3, Heart }        from "lucide-react";
import { CreatorHeader }         from "./CreatorHeader";
import { LookGrid }              from "@/components/look/LookGrid";
import { LookViewer }            from "@/components/look/LookViewer";
import { ErrorBoundary }         from "@/components/ui/ErrorBoundary";
import { LookGridSkeleton }      from "@/components/ui/Skeleton";
import { useLooks }              from "@/hooks/useLooks";
import { useAuth }               from "@/hooks/useAuth";
import type { Creator }          from "@/types/creator";
import type { LookSummary }      from "@/types/look";

interface Props {
  creator:      Creator;
  initialLooks: LookSummary[];
}

export function CreatorProfile({ creator, initialLooks }: Props) {
  const [activeLookId, setActiveLookId] = useState<string | null>(null);
  const { username: authUsername }      = useAuth();
  const isOwnProfile                    = authUsername === creator.username;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useLooks(creator.username);

  const looks: LookSummary[] = data?.pages.flatMap(p => p.data) ?? initialLooks;

  const handleLookClick   = useCallback((id: string) => setActiveLookId(id), []);
  const handleViewerClose = useCallback(() => setActiveLookId(null), []);

  return (
    <main className="min-h-screen bg-white max-w-[480px] mx-auto">

      {/* ── Nav bar — Instagram exact ── */}
      <nav className="sticky top-0 z-10 bg-white border-b border-zinc-200
                      flex items-center justify-between px-4 h-11">
        <h1 className="text-[16px] font-bold text-black">
          @{creator.username}
        </h1>
        {isOwnProfile && (
          <button
            className="flex items-center gap-1.5 h-8 px-4 bg-[#9355A6] text-white
                       rounded-lg text-[13px] font-semibold cursor-pointer
                       hover:bg-[#7d4690] transition active:bg-[#6b3880]"
          >
            + New Look
          </button>
        )}
      </nav>

      {/* ── Profile header ── */}
      <CreatorHeader creator={creator} isOwnProfile={isOwnProfile} />

      {/* ── Divider ── */}
      <div className="h-px bg-zinc-200" />

      {/* ── Tabs — Instagram style ── */}
      <div className="flex border-b border-zinc-200">
        <div className="flex-1 flex items-center justify-center py-3
                        border-b-2 border-black">
          <Grid3X3 size={22} className="text-black" aria-hidden />
          <span className="sr-only">Looks grid</span>
        </div>
      </div>

      {/* ── Grid ── */}
      <section aria-label="Looks">
        {isLoading ? (
          <LookGridSkeleton />
        ) : looks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center
                            justify-center mb-4">
              <Heart size={28} className="text-zinc-400" />
            </div>
            <p className="text-[15px] font-semibold text-black mb-1">
              No looks yet
            </p>
            <p className="text-[14px] text-zinc-400">
              {isOwnProfile
                ? "Create your first look to get started"
                : `Looks from ${creator.displayName} will appear here`
              }
            </p>
          </div>
        ) : (
          <ErrorBoundary>
            <LookGrid
              looks={looks}
              onLookClick={handleLookClick}
              onLoadMore={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNext={isFetchingNextPage}
            />
          </ErrorBoundary>
        )}
      </section>

      {/* ── Look viewer ── */}
      {activeLookId && (
        <ErrorBoundary>
          <LookViewer
            lookId={activeLookId}
            onClose={handleViewerClose}
          />
        </ErrorBoundary>
      )}
    </main>
  );
}
