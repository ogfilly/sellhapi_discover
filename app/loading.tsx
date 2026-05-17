import { FeedGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto">
      <div className="h-11 border-b border-zinc-100 flex items-center
                      justify-between px-4">
        <div className="h-5 w-24 bg-zinc-100 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-8 w-20 bg-zinc-100 rounded-full animate-pulse" />
        </div>
      </div>
      <FeedGridSkeleton />
    </div>
  );
}
