"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { resolveMedia, platformLabel, playModeLabel, Platform } from "@/lib/media";

// Lazy-load ReactPlayer — it's heavy and only needed after the user clicks play
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

/** Route any external image through our server-side proxy to bypass CDN CORS blocks (e.g. Facebook) */
function proxiedImg(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/")) return url;
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

interface MediaEmbedProps {
  url: string;
  thumbnail?: string | null;
  title?: string;
  /** Show platform badge on the card */
  showBadge?: boolean;
  /** Auto start playback on mount (used in modal) */
  autoPlay?: boolean;
}

const PLATFORM_COLORS: Record<Platform, string> = {
  youtube: "bg-red-600",
  tiktok: "bg-[#010101]",
  vimeo: "bg-[#1ab7ea]",
  facebook: "bg-[#1877f2]",
  direct: "bg-[#444]",
  unknown: "bg-[#555]",
};

export default function MediaEmbed({
  url,
  thumbnail,
  title = "Watch Video",
  showBadge = true,
  autoPlay = false,
}: MediaEmbedProps) {
  const [playing, setPlaying] = useState(autoPlay);

  const resolved = resolveMedia(url);
  const { platform, embedUrl, playMode } = resolved;

  const thumb = thumbnail || null;

  const handleClick = useCallback(() => {
    if (playMode === "popout") {
      window.open(url, "_blank", "noreferrer");
    } else {
      setPlaying(true);
    }
  }, [playMode, url]);

  // Build clean iframe autoplay URL for YouTube & Vimeo
  const iframeSrc = embedUrl.includes("?")
    ? `${embedUrl}&autoplay=1`
    : `${embedUrl}?autoplay=1`;

  return (
    <div className="relative w-full aspect-[16/9] bg-[#111] rounded-xl overflow-hidden group">
      {/* ── INLINE PLAYER (shown after click / autoplay) ── */}
      {playing && playMode === "inline" ? (
        <div className="absolute inset-0 w-full h-full">
          {platform === "youtube" || platform === "vimeo" ? (
            <iframe
              src={iframeSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : platform === "direct" ? (
            <video
              src={embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : (
            <ReactPlayer
              url={embedUrl}
              playing
              controls
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
              config={{
                youtube: { playerVars: { rel: 0, modestbranding: 1, autoplay: 1 } },
                facebook: { appId: process.env.NEXT_PUBLIC_FB_APP_ID },
              } as any}
            />
          )}
        </div>
      ) : (
        /* ── THUMBNAIL + PLAY BUTTON (both inline and popout) ── */
        <button
          onClick={handleClick}
          aria-label={`Play: ${title}`}
          className="absolute inset-0 w-full h-full focus:outline-none"
        >
          {/* Thumbnail */}
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={proxiedImg(thumb)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#444]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                />
              </svg>
            </div>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 text-[#0A0A0A] group-hover:bg-[#E85D2A] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-110">
              {playMode === "popout" ? (
                /* External link icon for popout */
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              ) : (
                /* Play triangle */
                <svg className="w-6 h-6 ml-0.5 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </div>
          </div>

          {/* Platform badge */}
          {showBadge && (
            <div className="absolute top-3 right-3">
              <span
                className={`${PLATFORM_COLORS[platform]} text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded`}
              >
                {platformLabel(platform)}
              </span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
