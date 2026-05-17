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

export function FollowButton({
  creatorId, username, isFollowing, className,
}: Props) {
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
      aria-label={isFollowing ? "Unfollow" : "Follow"}
      aria-pressed={isFollowing}
      className={cn(
        "h-8 rounded-lg text-[13px] font-semibold transition cursor-pointer",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9355A6]",
        isFollowing
          ? "bg-zinc-100 text-black hover:bg-zinc-200"
          : "bg-[#9355A6] text-white hover:bg-[#7d4690] active:bg-[#6b3880]",
        className
      )}
    >
      {mutation.isPending ? "…" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
