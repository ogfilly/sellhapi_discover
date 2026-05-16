import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto flex flex-col
                    items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[#F8F4FF] flex items-center
                      justify-center mb-6">
        <span className="text-3xl">👤</span>
      </div>
      <h1 className="text-[20px] font-bold text-black mb-2">
        Creator not found
      </h1>
      <p className="text-[14px] text-[#666] mb-8 leading-relaxed">
        The creator you're looking for doesn't exist or may have changed their username.
      </p>
      <Link
        href="/explore"
        className="h-[44px] px-8 bg-[#9355A6] text-white rounded-full
                   text-[14px] font-semibold hover:bg-[#7d4690] transition"
      >
        Explore Creators
      </Link>
    </div>
  );
}
