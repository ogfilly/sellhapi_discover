"use client";
export const runtime = "edge";

import { useState, useRef }  from "react";
import { useRouter }         from "next/navigation";
import Link                  from "next/link";
import { apiRequest }        from "@/lib/api";
import { setStoredToken }    from "@/lib/auth";
import { useAuth }           from "@/hooks/useAuth";
import toast                 from "react-hot-toast";
import { Eye, EyeOff }       from "lucide-react";

type Step = "details" | "otp";

interface SignupForm {
  email:       string;
  password:    string;
  username:    string;
  displayName: string;
}

interface FieldErrors {
  email?:       string;
  password?:    string;
  username?:    string;
  displayName?: string;
  otp?:         string;
}

function validate(form: SignupForm): FieldErrors {
  const e: FieldErrors = {};
  if (!form.displayName.trim())
    e.displayName = "Name is required";
  if (!form.username.trim())
    e.username = "Username is required";
  else if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username))
    e.username = "3–30 chars · letters, numbers and underscores only";
  if (!form.email.trim())
    e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = "Enter a valid email address";
  if (!form.password)
    e.password = "Password is required";
  else if (form.password.length < 6)
    e.password = "At least 6 characters";
  return e;
}

interface AuthResponse {
  data: {
    token:   string;
    creator: { id: string; username: string; displayName: string };
  };
}

export default function SignupPage() {
  const router           = useRouter();
  const { setAuth }      = useAuth();

  const [step,        setStep]        = useState<Step>("details");
  const [isLoading,   setIsLoading]   = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPw,      setShowPw]      = useState(false);
  const [otp,         setOtp]         = useState(["", "", "", "", "", ""]);
  const [errors,      setErrors]      = useState<FieldErrors>({});
  const [form,        setForm]        = useState<SignupForm>({
    email: "", password: "", username: "", displayName: "",
  });

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setField = (field: keyof SignupForm, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  };

  const otpValue = otp.join("");

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next  = [...otp];
    next[index] = digit;
    setOtp(next);
    setErrors(e => ({ ...e, otp: undefined }));
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && index > 0) otpRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next   = ["", "", "", "", "", ""];
    digits.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const lastFilled = Math.min(digits.length, 5);
    otpRefs.current[lastFilled]?.focus();
  };

  const handleSignup = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      await apiRequest({
        method: "POST",
        url:    "/creators/auth/signup",
        data: {
          email:       form.email.toLowerCase().trim(),
          password:    form.password,
          username:    form.username.toLowerCase().trim(),
          displayName: form.displayName.trim(),
        },
      });
      setStep("otp");
      toast.success(`Code sent to ${form.email}`);
    } catch (err: any) {
      const msg = err?.error ?? "Something went wrong";
      if (msg.toLowerCase().includes("email"))         setErrors({ email:    msg });
      else if (msg.toLowerCase().includes("username")) setErrors({ username: msg });
      else toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otpValue.length < 6) {
      setErrors({ otp: "Enter the 6-digit code" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest<AuthResponse>({
        method: "POST",
        url:    "/creators/auth/verify-email",
        data:   { email: form.email.toLowerCase().trim(), otp: otpValue },
      });
      const { token, creator } = res.data;
      setStoredToken(token);
      setAuth(token, creator.id, creator.username);
      toast.success("Welcome to SellHapi Discover!");
      router.push(`/${creator.username}`);
    } catch (err: any) {
      setErrors({ otp: err?.error ?? "Invalid code — try again" });
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
        data:   { email: form.email.toLowerCase().trim() },
      });
      toast.success("New code sent");
      setOtp(["", "", "", "", "", ""]);
      setErrors(e => ({ ...e, otp: undefined }));
      otpRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.error ?? "Failed to resend");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center
                    px-5 py-10">

      <div className="w-full max-w-[350px]">

        {step === "details" ? (
          <>
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9355A6]
                              to-[#C084D8] flex items-center justify-center mb-4
                              shadow-lg shadow-purple-200">
                <span className="text-white text-2xl font-black tracking-tighter">S</span>
              </div>
              <p className="text-zinc-400 text-[13px] text-center leading-snug">
                Sign up to see looks from creators<br/>and shop what they wear
              </p>
            </div>

            {/* Form */}
            <div className="space-y-2.5">
              <Input
                placeholder="Full name"
                value={form.displayName}
                onChange={v => setField("displayName", v)}
                error={errors.displayName}
                autoComplete="name"
              />
              <Input
                placeholder="Username"
                value={form.username}
                onChange={v => setField("username", v.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                error={errors.username}
                autoComplete="username"
              />
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={v => setField("email", v)}
                error={errors.email}
                autoComplete="email"
              />
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={v => setField("password", v)}
                  error={errors.password}
                  autoComplete="new-password"
                  onKeyDown={e => e.key === "Enter" && handleSignup()}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-[21px] -translate-y-1/2 text-zinc-400
                             hover:text-zinc-600 transition cursor-pointer
                             focus-visible:outline-none"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="text-zinc-400 text-[11px] text-center leading-relaxed pt-1">
                By signing up, you agree to our{" "}
                <span className="text-zinc-600 font-medium cursor-pointer hover:underline">
                  Terms
                </span>{" "}
                and{" "}
                <span className="text-zinc-600 font-medium cursor-pointer hover:underline">
                  Privacy Policy
                </span>.
              </p>

              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full h-[42px] bg-[#9355A6] hover:bg-[#7d4690]
                           active:bg-[#6b3880] text-white text-[14px] font-semibold
                           rounded-lg transition-colors disabled:opacity-60
                           disabled:cursor-not-allowed cursor-pointer mt-1"
              >
                {isLoading ? "Creating account…" : "Sign up"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-[12px] font-semibold text-zinc-400 tracking-wider">OR</span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            <p className="text-[13px] text-zinc-500 text-center">
              Already have an account?{" "}
              <Link href="/auth/login"
                className="text-[#9355A6] font-semibold hover:text-[#7d4690] transition">
                Log in
              </Link>
            </p>
          </>
        ) : (
          /* ── OTP step ── */
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9355A6]
                              to-[#C084D8] flex items-center justify-center mb-4
                              shadow-lg shadow-purple-200">
                <span className="text-white text-2xl font-black tracking-tighter">S</span>
              </div>
              <h2 className="text-[15px] font-semibold text-black mb-1">
                Enter confirmation code
              </h2>
              <p className="text-zinc-400 text-[13px] text-center leading-snug">
                Enter the code we sent to<br/>
                <span className="text-black font-medium">{form.email}</span>
              </p>
            </div>

            {/* 6-box OTP */}
            <div className="flex gap-2 justify-center mb-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={`w-11 h-12 rounded-xl border-2 text-center text-[20px]
                              font-bold bg-zinc-50 outline-none transition-all
                              caret-transparent
                              ${errors.otp
                                ? "border-red-400 text-red-500"
                                : digit
                                ? "border-[#9355A6] text-black"
                                : "border-zinc-200 text-black focus:border-[#9355A6]"
                              }`}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-[12px] text-red-500 text-center mb-3">
                {errors.otp}
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={isLoading || otpValue.length < 6}
              className="w-full h-[42px] bg-[#9355A6] hover:bg-[#7d4690]
                         active:bg-[#6b3880] text-white text-[14px] font-semibold
                         rounded-lg transition-colors disabled:opacity-60
                         disabled:cursor-not-allowed cursor-pointer mt-3"
            >
              {isLoading ? "Verifying…" : "Confirm"}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-5">
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[13px] text-[#9355A6] font-semibold hover:text-[#7d4690]
                           transition cursor-pointer disabled:opacity-40"
              >
                {isResending ? "Sending…" : "Resend code"}
              </button>
              <span className="text-zinc-300 text-[13px]">·</span>
              <button
                onClick={() => { setStep("details"); setOtp(["","","","","",""]); }}
                className="text-[13px] text-zinc-500 hover:text-black transition cursor-pointer"
              >
                Change email
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom card — Instagram pattern */}
      {step === "details" && (
        <div className="w-full max-w-[350px] border border-zinc-200 rounded-sm
                        py-4 mt-3 text-center">
          <p className="text-[14px] text-zinc-600">
            Have an account?{" "}
            <Link href="/auth/login"
              className="text-[#9355A6] font-semibold hover:text-[#7d4690] transition">
              Log in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

// ── Shared input ──────────────────────────────────────────────────────────────

interface InputProps {
  placeholder:   string;
  value:         string;
  onChange:      (v: string) => void;
  error?:        string;
  type?:         string;
  autoComplete?: string;
  onKeyDown?:    (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function Input({
  placeholder, value, onChange, error,
  type = "text", autoComplete, onKeyDown,
}: InputProps) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full h-[42px] rounded-lg border bg-zinc-50 px-3
                    text-[13px] text-black placeholder:text-zinc-400
                    outline-none transition-colors
                    focus:bg-white focus:border-zinc-400
                    ${error ? "border-red-400" : "border-zinc-300"}`}
      />
      {error && (
        <p className="text-[11px] text-red-500 mt-1 ml-0.5">{error}</p>
      )}
    </div>
  );
}
