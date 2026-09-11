"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm py-3 px-6 rounded-full max-w-md mx-auto font-medium">
        ✓ Thank you for subscribing! You will receive notification on our next release.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address..."
        className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-full px-6 py-3.5 text-white text-xs placeholder-[#666] focus:outline-none focus:border-[#E85D2A]"
      />
      <button
        type="submit"
        className="bg-white hover:bg-[#E85D2A] text-[#0A0A0A] hover:text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-colors shrink-0"
      >
        Notify Me
      </button>
    </form>
  );
}
