"use client";

import { Avatar }       from "@/components/ui/Avatar";
import { FollowButton } from "./FollowButton";
import { formatCount }  from "@/lib/utils";
import type { Creator } from "@/types/creator";
import { BadgeCheck }   from "lucide-react";

interface Props {
  creator:      Creator;
  isOwnProfile: boolean;
}

export function CreatorHeader({ creator, isOwnProfile }: Props) {
  return (
    <section className="px-4 pt-5 pb-4">

      {/* Top row — avatar + stats */}
      <div className="flex items-center gap-6 mb-4">
        <Avatar
          src={creator.profilePhoto}
          alt={creator.displayName}
          size="lg"
          priority
        />

        {/* Stats */}
        <div className="flex items-center gap-6 flex-1">
          <Stat value={creator.lookCount}     label="looks" />
          <Stat value={creator.followerCount} label="followers" />
        </div>
      </div>

      {/* Name + verified */}
      <div className="flex items-center gap-1 mb-0.5">
        <p className="text-[14px] font-semibold text-black leading-snug">
          {creator.displayName}
        </p>
        {creator.isVerified && (
          <BadgeCheck
            size={15}
            className="text-[#9355A6] flex-shrink-0"
            aria-label="Verified creator"
          />
        )}
      </div>

      {/* Bio */}
      {creator.bio && (
        <p className="text-[14px] text-black leading-snug whitespace-pre-line mb-3">
          {creator.bio}
        </p>
      )}

      {/* Action buttons — Instagram style */}
      {!isOwnProfile && (
        <div className="flex gap-2 mt-3">
          <FollowButton
            creatorId={creator.id}
            username={creator.username}
            isFollowing={creator.isFollowing}
            className="flex-1"
          />
          <button
            className="flex-1 h-8 rounded-lg bg-zinc-100 text-black text-[13px]
                       font-semibold cursor-pointer hover:bg-zinc-200 transition"
          >
            Message
          </button>
          <button
            className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center
                       justify-center cursor-pointer hover:bg-zinc-200 transition"
            aria-label="More options"
          >
            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
              <circle cx="2"  cy="2" r="2" fill="#1A1A1A" />
              <circle cx="8"  cy="2" r="2" fill="#1A1A1A" />
              <circle cx="14" cy="2" r="2" fill="#1A1A1A" />
            </svg>
          </button>
        </div>
      )}

      {isOwnProfile && (
        <div className="flex gap-2 mt-3">
          <button
            className="flex-1 h-8 rounded-lg bg-zinc-100 text-black text-[13px]
                       font-semibold cursor-pointer hover:bg-zinc-200 transition"
          >
            Edit profile
          </button>
          <button
            className="flex-1 h-8 rounded-lg bg-zinc-100 text-black text-[13px]
                       font-semibold cursor-pointer hover:bg-zinc-200 transition"
          >
            Share profile
          </button>
        </div>
      )}
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[15px] font-bold text-black leading-tight">
        {formatCount(value)}
      </span>
      <span className="text-[12px] text-black leading-tight">{label}</span>
    </div>
  );
}
