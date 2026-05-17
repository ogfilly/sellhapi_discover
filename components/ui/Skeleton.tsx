import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#F0F0F0]",
        className
      )}
    />
  );
}

export function CreatorHeaderSkeleton() {
  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-start gap-5">
        <Skeleton className="w-[80px] h-[80px] rounded-full flex-shrink-0" />
        <div className="flex-1 pt-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-5">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-8 w-24 rounded-[8px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mt-3" />
      <Skeleton className="h-4 w-2/3 mt-1" />
    </div>
  );
}

export function LookGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-[1px] bg-[#F0F0F0]">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-none" />
      ))}
    </div>
  );
}

export function FeedGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-px bg-zinc-200 max-w-[480px] mx-auto
                    auto-rows-[calc(100vw/3)]">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`bg-zinc-100 animate-pulse ${
            i === 3 || i === 9 ? "row-span-2" : "row-span-1"
          }`}
        />
      ))}
    </div>
  );
}
