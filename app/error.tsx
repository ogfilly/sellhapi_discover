"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto flex flex-col
                    items-center justify-center px-6 text-center">
      <h2 className="text-[18px] font-bold text-black mb-2">Something went wrong</h2>
      <p className="text-[13px] text-[#999] mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="h-[44px] px-8 bg-[#9355A6] text-white rounded-full
                   text-[14px] font-semibold cursor-pointer hover:bg-[#7d4690] transition"
      >
        Try again
      </button>
    </div>
  );
}
