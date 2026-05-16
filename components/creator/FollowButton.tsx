"use client";

import { useFollow }   from "@/hooks/useFollow";
import { useAuth }     from "@/hooks/useAuth";
import { useRouter }   from "next/navigation";
import { cn }          from "@/lib/utils";

interface Props {
  creatorId:   string;
  username:    string;
  isFollowing: boolean;
  className?:  string;
}

export function FollowButton({ creatorId, username, isFollowing, className }: Props) {
  const { isAuthenticated } = useAuth();
  const router              = useRouter();
  const mutation            = useFollow(username);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/${username}`);
      return;
    }
    mutation.mutate(isFollowing);
  };

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-label={isFollowing ? "Unfollow creator" : "Follow creator"}
      className={cn(
        "h-[32px] px-5 rounded-[8px] text-[13px] font-semibold",
        "cursor-pointer transition-all disabled:opacity-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#9355A6]",
        isFollowing
          ? "bg-white border border-[#E4E4E4] text-black hover:border-[#DC2626] hover:text-[#DC2626]"
          : "bg-[#9355A6] text-white hover:bg-[#7d4690]",
        className
      )}
    >
      {mutation.isPending
        ? "..."
        : isFollowing
        ? "Following"
        : "Follow"
      }
    </button>
  );
}
