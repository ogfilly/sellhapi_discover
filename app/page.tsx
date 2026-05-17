export const runtime = "edge";

import type { Metadata } from "next";
import { serverFetch }   from "@/lib/api";
import { FeedNav }       from "@/components/feed/FeedNav";
import { DiscoverFeed }  from "@/components/feed/DiscoverFeed";
import type { FeedLook } from "@/hooks/useFeed";

export const metadata: Metadata = {
  title:       "SellHapi Discover — Shop looks from creators",
  description: "Discover fashion looks from creators and shop every item they wear.",
  openGraph: {
    type:        "website",
    title:       "SellHapi Discover",
    description: "Shop the exact looks your favourite creators wear.",
    siteName:    "SellHapi Discover",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "SellHapi Discover",
    description: "Shop the exact looks your favourite creators wear.",
  },
};

async function getInitialFeed(): Promise<FeedLook[]> {
  try {
    const res = await serverFetch<{ data: FeedLook[]; meta: unknown }>(
      "/creators/looks",
      { revalidate: 60, tags: ["feed"], params: { limit: 12 } }
    );
    return res.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const initialLooks = await getInitialFeed();

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto">
      <FeedNav />
      <DiscoverFeed initialLooks={initialLooks} />
    </div>
  );
}
