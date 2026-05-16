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
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-start gap-5">

        {/* Avatar */}
        <Avatar
          src={creator.profilePhoto}
          alt={creator.displayName}
          size={80}
        />

        {/* Stats + actions */}
        <div className="flex-1 pt-1">
          {/* Name + verified */}
          <div className="flex items-center gap-1.5 mb-2">
            <h2 className="text-[16px] font-bold text-black leading-tight">
              {creator.displayName}
            </h2>
            {creator.isVerified && (
              <BadgeCheck
                size={17}
                className="text-[#9355A6] flex-shrink-0"
                aria-label="Verified creator"
              />
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 mb-3">
            <Stat label="looks"     value={creator.lookCount} />
            <Stat label="followers" value={creator.followerCount} />
          </div>

          {/* CTA */}
          {!isOwnProfile && (
            <FollowButton
              creatorId={creator.id}
              username={creator.username}
              isFollowing={creator.isFollowing}
            />
          )}
        </div>
      </div>

      {/* Bio */}
      {creator.bio && (
        <p className="text-[13px] text-black mt-3 leading-relaxed whitespace-pre-line">
          {creator.bio}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-[15px] font-bold text-black leading-tight">
        {formatCount(value)}
      </p>
      <p className="text-[12px] text-[#666]">{label}</p>
    </div>
  );
}
