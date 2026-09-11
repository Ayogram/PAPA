"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { resolveMedia, platformLabel, playModeLabel } from "@/lib/media";
import type { ResolvedMedia } from "@/lib/media";
import type { LinkPreview } from "@/app/api/link-preview/route";

/** Route any external image through our server-side proxy to bypass CDN CORS blocks (e.g. Facebook) */
function proxiedImg(url: string | null | undefined): string {
  if (!url) return "";
  // Local images don't need proxying
  if (url.startsWith("/") || url.startsWith(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost")) {
    return url;
  }
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

interface VideoUrlInputProps {
  /** current saved value (when editing) */
  defaultValue?: string;
  /** called when thumbnail is auto-resolved so the parent can persist it */
  onThumbnailResolved?: (url: string) => void;
}

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; preview: LinkPreview; resolved: ResolvedMedia }
  | { status: "error" };

function isValidUrl(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export default function VideoUrlInput({
  defaultValue = "",
  onThumbnailResolved,
}: VideoUrlInputProps) {
  const [url, setUrl] = useState(defaultValue);
  const [previewState, setPreviewState] = useState<PreviewState>({ status: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Run preview fetch with 300ms debounce
  const fetchPreview = useCallback(async (rawUrl: string) => {
    if (!rawUrl || !isValidUrl(rawUrl)) {
      setPreviewState({ status: "idle" });
      return;
    }

    setPreviewState({ status: "loading" });

    try {
      const res = await fetch(
        `/api/link-preview?url=${encodeURIComponent(rawUrl)}`
      );
      if (!res.ok) throw new Error("preview fetch failed");
      const preview: LinkPreview = await res.json();
      const resolved = resolveMedia(rawUrl);

      setPreviewState({ status: "ready", preview, resolved });

      // Auto-fill thumbnail if OG image found
      if (preview.image && onThumbnailResolved) {
        onThumbnailResolved(preview.image);
      }
    } catch {
      setPreviewState({ status: "error" });
    }
  }, [onThumbnailResolved]);

  const handleChange = (val: string) => {
    setUrl(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPreview(val), 300);
  };

  // Fetch on mount if editing an existing video
  useEffect(() => {
    if (defaultValue) fetchPreview(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1]">
        Video URL *
        <span className="ml-2 text-[#666] normal-case font-normal tracking-normal">
          YouTube · TikTok · Vimeo · Facebook · .mp4
        </span>
      </label>

      <input
        type="url"
        name="videoUrl"
        required
        value={url}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="https://..."
        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E85D2A]"
      />

      {/* Live Preview Card */}
      {previewState.status === "loading" && (
        <div className="flex items-center gap-2 text-[11px] text-[#666] animate-pulse py-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#444] border-t-[#E85D2A] animate-spin" />
          Fetching preview…
        </div>
      )}

      {previewState.status === "ready" && (() => {
        const { preview, resolved } = previewState;
        const badge = platformLabel(resolved.platform);
        const modeLabel = playModeLabel(resolved.playMode, resolved.platform);
        const isInline = resolved.playMode === "inline";

        return (
          <div className="flex gap-3 bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 items-start">
            {/* Thumbnail */}
            <div className="w-24 h-14 rounded-lg overflow-hidden bg-[#1A1A1A] flex-shrink-0">
              {preview.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={proxiedImg(preview.image)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#444]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-white text-xs font-bold truncate leading-snug">
                {preview.title}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#222] text-[#A1A1A1] px-2 py-0.5 rounded">
                  {badge}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isInline ? "text-emerald-400" : "text-[#E85D2A]"
                  }`}
                >
                  {modeLabel}
                </span>
              </div>
              {preview.image && (
                <input type="hidden" name="thumbnail" value={preview.image} />
              )}
            </div>
          </div>
        );
      })()}

      {previewState.status === "error" && (
        <p className="text-[11px] text-[#777]">
          Could not load preview — the video will still work when saved.
        </p>
      )}
    </div>
  );
}
