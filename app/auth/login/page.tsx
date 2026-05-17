"use client";
export const runtime = "edge";

import { useState }      from "react";
import { useRouter }     from "next/navigation";
import Link              from "next/link";
import { apiRequest }    from "@/lib/api";
import { setStoredToken } from "@/lib/auth";
import { useAuth }       from "@/hooks/useAuth";
import toast             from "react-hot-toast";
import { Eye, EyeOff }  from "lucide-react";

interface FieldErrors {
  email?:    string;
  password?: string;
}

interface AuthResponse {
  data: {
    token:   string;
    creator: { id: string; username: string; displayName: string };
  };
}

export default function LoginPage() {
  const router      = useRouter();
  const { setAuth } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPw,    setShowPw]    = useState(false);
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [errors,    setErrors]    = useState<FieldErrors>({});

  const handleLogin = async () => {
    const e: FieldErrors = {};
    if (!email.trim())    e.email    = "Email is required";
    if (!password.trim()) e.password = "Password is required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setIsLoading(true);
    try {
      const res = await apiRequest<AuthResponse>({
        method: "POST",
        url:    "/creators/auth/login",
        data:   { email: email.toLowerCase().trim(), password },
      });
      const { token, creator } = res.data;
      setStoredToken(token);
      setAuth(token, creator.id, creator.username);
      toast.success(`Welcome back, ${creator.displayName}!`);

      const params = new URLSearchParams(window.location.search);
      router.push(params.get("next") ?? `/${creator.username}`);
    } catch (err: any) {
      const msg = err?.error ?? "Something went wrong";
      if (msg.toLowerCase().includes("verify")) {
        toast.error("Please verify your email first");
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
      } else {
        setErrors({ password: "Incorrect email or password" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center
                    justify-center px-5 py-10">

      <div className="w-full max-w-[350px]">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9355A6]
                          to-[#C084D8] flex items-center justify-center
                          shadow-lg shadow-purple-200">
            <span className="text-white text-2xl font-black tracking-tighter">S</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-2">
          {/* Email */}
          <div>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: undefined })); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Email or username"
              autoComplete="email"
              className={`w-full h-[42px] rounded-lg border bg-zinc-50 px-3
                          text-[13px] text-black placeholder:text-zinc-400
                          outline-none transition-colors focus:bg-white
                          focus:border-zinc-400
                          ${errors.email ? "border-red-400" : "border-zinc-300"}`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 mt-1 ml-0.5">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: undefined })); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Password"
              autoComplete="current-password"
              className={`w-full h-[42px] rounded-lg border bg-zinc-50 px-3 pr-10
                          text-[13px] text-black placeholder:text-zinc-400
                          outline-none transition-colors focus:bg-white
                          focus:border-zinc-400
                          ${errors.password ? "border-red-400" : "border-zinc-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPw(p => !p)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400
                         hover:text-zinc-600 transition cursor-pointer
                         focus-visible:outline-none"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-[11px] text-red-500 mt-1 ml-0.5">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-[42px] bg-[#9355A6] hover:bg-[#7d4690]
                       active:bg-[#6b3880] text-white text-[14px] font-semibold
                       rounded-lg transition-colors disabled:opacity-60
                       disabled:cursor-not-allowed cursor-pointer mt-1"
          >
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-[12px] font-semibold text-zinc-400 tracking-wider">OR</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="text-[13px] text-zinc-600 font-medium hover:text-black transition"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Bottom card */}
      <div className="w-full max-w-[350px] border border-zinc-200 rounded-sm
                      py-4 mt-3 text-center">
        <p className="text-[14px] text-zinc-600">
          Don't have an account?{" "}
          <Link href="/auth/signup"
            className="text-[#9355A6] font-semibold hover:text-[#7d4690] transition">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
