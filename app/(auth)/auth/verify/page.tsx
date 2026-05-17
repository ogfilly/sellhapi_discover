"use client";
export const runtime = "edge";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link                           from "next/link";
import { apiRequest }                 from "@/lib/api";
import { setStoredToken }             from "@/lib/auth";
import { useAuth }                    from "@/hooks/useAuth";
import toast                          from "react-hot-toast";

interface AuthResponse {
  data: {
    token:   string;
    creator: { id: string; username: string; displayName: string };
  };
}

function VerifyContent() {
  const router      = useRouter();
  const params      = useSearchParams();
  const { setAuth } = useAuth();

  const email        = params.get("email") ?? "";
  const [otp,         setOtp]         = useState(["", "", "", "", "", ""]);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const refs   = useRef<(HTMLInputElement | null)[]>([]);
  const digits = otp.join("");

  const handleChange = (i: number, val: string) => {
    const d    = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i]    = d;
    setOtp(next);
    setError(null);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft"  && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const d    = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = ["", "", "", "", "", ""];
    d.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    refs.current[Math.min(d.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    if (digits.length < 6) { setError("Enter the 6-digit code"); return; }
    setIsLoading(true);
    try {
      const res = await apiRequest<AuthResponse>({
        method: "POST",
        url:    "/creators/auth/verify-email",
        data:   { email, otp: digits },
      });
      const { token, creator } = res.data;
      await setStoredToken(token);
      setAuth(token, creator.id, creator.username);
      toast.success("Email verified!");
      router.push(`/${creator.username}`);
    } catch (err: any) {
      setError(err?.error ?? "Invalid code — try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await apiRequest({
        method: "POST",
        url:    "/creators/auth/resend-otp",
        data:   { email },
      });
      toast.success("New code sent");
      setOtp(["", "", "", "", "", ""]);
      setError(null);
      refs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.error ?? "Failed to resend");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center
                    justify-center px-5 py-10">
      <div className="w-full max-w-[350px]">

        {/* Logo + header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9355A6]
                          to-[#C084D8] flex items-center justify-center mb-4
                          shadow-lg shadow-purple-200">
            <span className="text-white text-2xl font-black tracking-tighter">S</span>
          </div>
          <h1 className="text-[17px] font-bold text-black mb-1">
            Enter confirmation code
          </h1>
          <p className="text-[13px] text-zinc-400 text-center leading-snug">
            Enter the code we sent to<br/>
            <span className="text-black font-medium">{email || "your email"}</span>
          </p>
        </div>

        {/* 6-box OTP */}
        <div className="flex gap-2 justify-center mb-2" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-11 h-12 rounded-xl border-2 text-center text-[20px]
                          font-bold bg-zinc-50 outline-none transition-all
                          caret-transparent select-none
                          ${error
                            ? "border-red-400 text-red-500"
                            : digit
                            ? "border-[#9355A6] text-black"
                            : "border-zinc-200 text-black focus:border-[#9355A6] focus:bg-white"
                          }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-[12px] text-red-500 text-center mt-1 mb-3">
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={isLoading || digits.length < 6}
          className="w-full h-[42px] bg-[#9355A6] hover:bg-[#7d4690]
                     active:bg-[#6b3880] text-white text-[14px] font-semibold
                     rounded-lg transition-colors disabled:opacity-60
                     disabled:cursor-not-allowed cursor-pointer mt-4"
        >
          {isLoading ? "Verifying…" : "Confirm"}
        </button>

        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-[13px] text-[#9355A6] font-semibold
                       hover:text-[#7d4690] transition cursor-pointer
                       disabled:opacity-40"
          >
            {isResending ? "Sending…" : "Resend code"}
          </button>
          <span className="text-zinc-300 text-[13px]">·</span>
          <Link
            href="/auth/login"
            className="text-[13px] text-zinc-500 hover:text-black transition"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#9355A6] border-t-transparent
                        rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
