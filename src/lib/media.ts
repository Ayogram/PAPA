/**
 * media.ts — Universal media URL resolver
 *
 * resolveMedia(url) classifies any video link into:
 *   - platform: which service it belongs to
 *   - kind:     'video' | 'short' | 'live' | 'direct'
 *   - embedUrl: the correct embed/player URL (for inline sources)
 *   - playMode: 'inline' | 'popout'
 *
 * INLINE sources (react-player can embed reliably):
 *   YouTube (watch / shorts / live), TikTok, Vimeo, direct .mp4/.webm/.m3u8
 *
 * POPOUT sources (open original URL in new tab):
 *   Facebook video / watch / reel / share — Facebook reels are NOT reliably
 *   embeddable via iframe. Meta's own FB video plugin only works for public
 *   Page videos, not Reels or personal shares, and silently breaks on mobile.
 *   The correct stable behavior is to show the real OG thumbnail (fetched
 *   server-side) and open the FB app / web on click. This is intentional.
 *
 *   Any other unrecognised URL also gets popout as the safe default.
 */

export type Platform =
  | "youtube"
  | "tiktok"
  | "vimeo"
  | "facebook"
  | "direct"
  | "unknown";

export type PlayMode = "inline" | "popout";

export interface ResolvedMedia {
  platform: Platform;
  kind: "video" | "short" | "live" | "direct" | "unknown";
  embedUrl: string;   // = original url for popout sources
  playMode: PlayMode;
}

export function resolveMedia(rawUrl: string): ResolvedMedia {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return fallback(rawUrl);
  }

  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;

  // ── YouTube ──────────────────────────────────────────────────────────────
  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    let videoId: string | null = null;
    let kind: ResolvedMedia["kind"] = "video";

    if (host === "youtu.be") {
      videoId = path.slice(1).split("?")[0];
    } else if (path.startsWith("/shorts/")) {
      videoId = path.split("/shorts/")[1]?.split("?")[0] ?? null;
      kind = "short";
    } else if (path.startsWith("/live/")) {
      videoId = path.split("/live/")[1]?.split("?")[0] ?? null;
      kind = "live";
    } else if (path.startsWith("/embed/")) {
      videoId = path.split("/embed/")[1]?.split("?")[0] ?? null;
    } else {
      videoId = url.searchParams.get("v");
    }

    if (videoId) {
      return {
        platform: "youtube",
        kind,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
        playMode: "inline",
      };
    }
  }

  // ── TikTok ───────────────────────────────────────────────────────────────
  if (host === "tiktok.com" || host === "vm.tiktok.com") {
    // react-player handles TikTok embed URLs natively
    return {
      platform: "tiktok",
      kind: "video",
      embedUrl: rawUrl,
      playMode: "inline",
    };
  }

  // ── Vimeo ────────────────────────────────────────────────────────────────
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const videoId = path.split("/").filter(Boolean)[0];
    if (videoId && /^\d+$/.test(videoId)) {
      return {
        platform: "vimeo",
        kind: "video",
        embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
        playMode: "inline",
      };
    }
  }

  // ── Direct media files ───────────────────────────────────────────────────
  const directExts = [".mp4", ".webm", ".m3u8", ".ogg", ".mov"];
  if (directExts.some((ext) => path.toLowerCase().endsWith(ext))) {
    return {
      platform: "direct",
      kind: "direct",
      embedUrl: rawUrl,
      playMode: "inline",
    };
  }

  // ── Facebook — ALWAYS popout (see module docstring) ──────────────────────
  if (
    host === "facebook.com" ||
    host === "fb.com" ||
    host === "fb.watch" ||
    host === "m.facebook.com"
  ) {
    return {
      platform: "facebook",
      kind: "video",
      embedUrl: rawUrl, // open original URL
      playMode: "popout",
    };
  }

  // ── Unknown / anything else — safe popout ────────────────────────────────
  return fallback(rawUrl);
}

function fallback(rawUrl: string): ResolvedMedia {
  return {
    platform: "unknown",
    kind: "unknown",
    embedUrl: rawUrl,
    playMode: "popout",
  };
}

/** Human-readable platform label for badges */
export function platformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    youtube: "YouTube",
    tiktok: "TikTok",
    vimeo: "Vimeo",
    facebook: "Facebook",
    direct: "Video",
    unknown: "External",
  };
  return labels[platform] ?? "Video";
}

/** Behaviour hint shown in admin and optionally on public cards */
export function playModeLabel(mode: PlayMode, platform: Platform): string {
  if (mode === "inline") return "▶ Plays inline";
  if (platform === "facebook") return "↗ Opens on Facebook";
  return "↗ Opens in new tab";
}
