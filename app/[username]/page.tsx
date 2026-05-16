import { Suspense }        from "react";
import { notFound }        from "next/navigation";
import type { Metadata }   from "next";
import { serverFetch }     from "@/lib/api";
import { CreatorProfile }  from "@/components/creator/CreatorProfile";
import {
  CreatorHeaderSkeleton,
  LookGridSkeleton,
}                          from "@/components/ui/Skeleton";
import type { ApiResponse } from "@/types/api";
import type { Creator }    from "@/types/creator";
import type { LookSummary } from "@/types/look";

interface Props {
  params: Promise<{ username: string }>;
}

interface CreatorPageData {
  data:  Creator;
  looks: LookSummary[];
}

async function fetchCreatorPage(username: string): Promise<CreatorPageData | null> {
  try {
    const result = await serverFetch<CreatorPageData>(`/creators/${username}`, {
      revalidate: 60,
      tags:       [`creator-${username}`],
    });
    console.log("[fetchCreatorPage] success:", JSON.stringify(result).slice(0, 200));
    return result;
  } catch (err) {
    console.error("[fetchCreatorPage] error:", err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data         = await fetchCreatorPage(username);
  if (!data) return { title: "Creator not found — SellHapi Discover" };

  const { data: creator } = data;
  return {
    title:       `${creator.displayName} (@${creator.username}) — SellHapi Discover`,
    description: creator.bio
      ?? `Shop looks from ${creator.displayName} on SellHapi Discover`,
    openGraph: {
      type:   "profile",
      title:  creator.displayName,
      images: creator.profilePhoto ? [{ url: creator.profilePhoto }] : [],
    },
    twitter: {
      card:  "summary",
      title: `${creator.displayName} on SellHapi Discover`,
    },
  };
}

export default async function CreatorPage({ params }: Props) {
  const { username } = await params;
  const data         = await fetchCreatorPage(username);
  if (!data) return notFound();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white max-w-[480px] mx-auto">
          <CreatorHeaderSkeleton />
          <LookGridSkeleton />
        </div>
      }
    >
      <CreatorProfile creator={data.data} initialLooks={data.looks} />
    </Suspense>
  );
}
