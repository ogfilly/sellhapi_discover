"use client";

import { useState, useCallback } from "react";
import { Grid3X3, Heart }        from "lucide-react";
import { CreatorHeader }         from "./CreatorHeader";
import { LookGrid }              from "@/components/look/LookGrid";
import { LookViewer }            from "@/components/look/LookViewer";
import { ErrorBoundary }         from "@/components/ui/ErrorBoundary";
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
  } = useLooks(creator.username);

  const looks: LookSummary[] = data?.pages.flatMap((p) => p.data) ?? initialLooks;

  const handleLookClick   = useCallback((id: string) => setActiveLookId(id), []);
  const handleViewerClose = useCallback(() => setActiveLookId(null), []);

  return (
    <main className="min-h-screen bg-white max-w-[480px] mx-auto">

      {/* ── Top navigation bar ── */}
      <nav
        className="flex items-center justify-between px-4 py-3
                   border-b border-[#F0F0F0] sticky top-0 bg-white z-10"
      >
        <h1 className="text-[15px] font-bold text-black">
          @{creator.username}
        </h1>
        {isOwnProfile && (
          <button
            className="h-[32px] px-4 bg-[#9355A6] text-white rounded-full
                       text-[12px] font-semibold cursor-pointer hover:bg-[#7d4690] transition"
          >
            + New Look
          </button>
        )}
      </nav>

      {/* ── Profile header ── */}
      <CreatorHeader creator={creator} isOwnProfile={isOwnProfile} />

      {/* ── Looks section ── */}
      <section aria-label="Looks">
        {/* Tab bar */}
        <div className="border-t border-b border-[#F0F0F0]">
          <div
            className="flex items-center justify-center py-2.5
                       border-b-2 border-black w-fit mx-auto px-4"
            aria-current="page"
          >
            <Grid3X3 size={18} color="#1A1A1A" aria-hidden />
          </div>
        </div>

        {looks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F8F4FF]
                            flex items-center justify-center mb-4">
              <Heart size={28} color="#9355A6" />
            </div>
            <p className="text-[15px] font-semibold text-black mb-1">No looks yet</p>
            <p className="text-[13px] text-[#999]">
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

      {/* ── Look viewer overlay ── */}
      {activeLookId && (
        <ErrorBoundary>
          <LookViewer lookId={activeLookId} onClose={handleViewerClose} />
        </ErrorBoundary>
      )}
    </main>
  );
}
