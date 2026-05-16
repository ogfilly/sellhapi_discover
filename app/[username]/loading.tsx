import {
  CreatorHeaderSkeleton,
  LookGridSkeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto">
      <div className="h-[44px] border-b border-[#F0F0F0]" />
      <CreatorHeaderSkeleton />
      <div className="border-t border-[#F0F0F0]">
        <div className="flex justify-center py-2 border-b border-[#F0F0F0]">
          <div className="w-5 h-5 bg-[#F0F0F0] rounded animate-pulse" />
        </div>
        <LookGridSkeleton />
      </div>
    </div>
  );
}
