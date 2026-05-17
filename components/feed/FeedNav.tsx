"use client";

import Link              from "next/link";
import { useAuth }       from "@/hooks/useAuth";
import { Avatar }        from "@/components/ui/Avatar";
import { Plus, Compass } from "lucide-react";

export function FeedNav() {
  const { isAuthenticated, username } = useAuth();

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-zinc-100
                    flex items-center justify-between px-4 h-11">
      <Link
        href="/"
        className="flex items-center gap-2 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-[#9355A6] rounded"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#9355A6]
                        to-[#C084D8] flex items-center justify-center">
          <Compass size={15} className="text-white" />
        </div>
        <span className="text-[15px] font-black text-black tracking-tight">
          Discover
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Link
              href="/new-look"
              className="h-8 px-3 bg-[#9355A6] text-white rounded-full
                         text-[12px] font-bold flex items-center gap-1.5
                         hover:bg-[#7d4690] transition active:bg-[#6b3880]
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-[#9355A6] focus-visible:ring-offset-1"
            >
              <Plus size={13} />
              New Look
            </Link>
            <Link
              href={`/${username}`}
              className="focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-[#9355A6] rounded-full"
              aria-label="Your profile"
            >
              <Avatar src={null} alt="Profile" size="xs" />
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="h-8 px-4 rounded-full text-[13px] font-semibold
                         text-zinc-600 hover:text-black hover:bg-zinc-50
                         transition focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="h-8 px-4 bg-[#9355A6] text-white rounded-full
                         text-[13px] font-semibold hover:bg-[#7d4690]
                         transition active:bg-[#6b3880] focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-[#9355A6]
                         focus-visible:ring-offset-1"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
