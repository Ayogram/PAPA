"use client";

import { useActionState, useState } from "react";
import { loginAction, forgotPasswordAction, resetPasswordAction } from "../actions";
import Link from "next/link";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [forgotState, forgotFormAction, isForgotPending] = useActionState(forgotPasswordAction, null);
  const [resetState, resetFormAction, isResetPending] = useActionState(resetPasswordAction, null);

  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [resetCode, setResetCode] = useState("");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
            <span className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-white text-[#0A0A0A] font-extrabold text-xl tracking-tighter shadow-lg">
              N|A
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="text-sm text-[#A1A1A1] mt-2">
            {mode === "login" && "Enter the administrative password to manage ministry content"}
            {mode === "forgot" && "Reset your admin password via registered email"}
            {mode === "reset" && "Enter your 6-digit code and set your new password"}
          </p>
        </div>

        {/* Box Container */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 shadow-2xl">
          {/* MODE 1: LOGIN FORM */}
          {mode === "login" && (
            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm font-medium border ${
                    state?.expired
                      ? "bg-amber-950/50 border-amber-500/40 text-amber-300"
                      : "bg-red-950/40 border-red-500/30 text-red-400"
                  }`}
                >
                  {state.error}
                  {state?.expired && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors"
                      >
                        Reset Expired Password Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1]">
                    Admin Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs text-[#E85D2A] hover:underline font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password..."
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#E85D2A] transition-colors pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-[#A1A1A1] hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-white text-[#0A0A0A] hover:bg-[#E85D2A] hover:text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </button>
            </form>
          )}

          {/* MODE 2: FORGOT PASSWORD FORM */}
          {mode === "forgot" && (
            <form action={forgotFormAction} className="space-y-6">
              {forgotState?.message && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm font-medium border ${
                    forgotState.success
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                      : "bg-red-950/40 border-red-500/30 text-red-400"
                  }`}
                >
                  {forgotState.message}
                  {forgotState.token && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setResetCode(forgotState.token || "");
                          setMode("reset");
                        }}
                        className="bg-white text-black hover:bg-[#E85D2A] hover:text-white font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors"
                      >
                        Proceed to Enter New Password →
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                  Registered Ministry Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue="olaniyianiya1@gmail.com"
                  placeholder="olaniyianiya1@gmail.com"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#E85D2A] text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-1/3 bg-[#262626] hover:bg-[#333] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isForgotPending}
                  className="w-2/3 bg-[#E85D2A] hover:bg-[#cf4e1f] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isForgotPending ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Send Reset Code"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: RESET PASSWORD FORM */}
          {mode === "reset" && (
            <form action={resetFormAction} className="space-y-6">
              {resetState?.message && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm font-medium border ${
                    resetState.success
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                      : "bg-red-950/40 border-red-500/30 text-red-400"
                  }`}
                >
                  {resetState.message}
                  {resetState.success && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="bg-white text-black font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider transition-colors"
                      >
                        Back to Login
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="token" className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                  6-Digit Reset Code
                </label>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit code..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-white text-sm font-mono tracking-widest focus:outline-none focus:border-[#E85D2A]"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                  New Admin Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter new password (min 6 chars)..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E85D2A]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="w-1/3 bg-[#262626] hover:bg-[#333] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isResetPending}
                  className="w-2/3 bg-[#E85D2A] hover:bg-[#cf4e1f] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isResetPending ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Set New Password"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#262626] text-center">
            <Link href="/" className="text-xs font-medium text-[#A1A1A1] hover:text-white transition-colors">
              ← Return to public website
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#555] mt-8">
          Secured with 30-day password expiration policy
        </p>
      </div>
    </div>
  );
}
