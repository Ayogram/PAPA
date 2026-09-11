"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions";
import Link from "next/link";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

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
            Enter the administrative password to manage ministry content
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 shadow-2xl">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm p-3 rounded-lg font-medium">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                Admin Password
              </label>
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
              className="w-full bg-white text-[#0A0A0A] hover:bg-[#E85D2A] hover:text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors duration-200 disabled:opacity-50"
            >
              {isPending ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#262626] text-center">
            <Link href="/" className="text-xs font-medium text-[#A1A1A1] hover:text-white transition-colors">
              ← Return to public website
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#555] mt-8">
          Secured with protected server session cookies
        </p>
      </div>
    </div>
  );
}
