"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/the-word/${slug}`;
    }
    return `https://niyianiya.org/the-word/${slug}`;
  };

  const handleCopy = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(`"${title}" - Read this inspired word by Apostle Niyi Aniya: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareX = () => {
    const url = getShareUrl();
    const text = encodeURIComponent(`"${title}" by Apostle Niyi Aniya`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-widest text-[#777] mr-1">
        Share Word:
      </span>

      {/* WhatsApp - Priority */}
      <button
        onClick={shareWhatsApp}
        className="flex items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <span>WhatsApp</span>
      </button>

      {/* X / Twitter */}
      <button
        onClick={shareX}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <span>X / Twitter</span>
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-[#A1A1A1] hover:text-white border border-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
      >
        <span>{copied ? "✓ Copied!" : "Copy Link"}</span>
      </button>
    </div>
  );
}
