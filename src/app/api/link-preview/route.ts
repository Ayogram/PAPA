import { NextRequest, NextResponse } from "next/server";

export interface LinkPreview {
  title: string;
  image: string | null;
  type: string | null;
  canonicalUrl: string;
}

// Simple in-memory cache — lives as long as the server process
const cache = new Map<string, { data: LinkPreview; ts: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/** Decode HTML entities that appear in attribute values (e.g. &amp; → & in og:image URLs) */
function unescapeHtml(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function extractMeta(html: string, finalUrl: string): LinkPreview {
  const get = (prop: string): string | null => {
    // Match both property="og:…" and name="twitter:…" variants
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']|` +
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
      "i"
    );
    const m = html.match(re);
    return m ? (m[1] ?? m[2] ?? null) : null;
  };

  const title =
    get("og:title") ??
    get("twitter:title") ??
    (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "Untitled");

  const image =
    get("og:image") ??
    get("og:image:secure_url") ??
    get("twitter:image") ??
    get("twitter:image:src") ??
    null;

  const type = get("og:type") ?? null;

  return {
    title: title.replace(/&amp;/g, "&").replace(/&#39;/g, "'").trim(),
    image: image ? resolveImageUrl(unescapeHtml(image), finalUrl) : null,
    type,
    canonicalUrl: get("og:url") ?? finalUrl,
  };
}

function resolveImageUrl(src: string, base: string): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  try {
    return new URL(src, base).href;
  } catch {
    return src;
  }
}

// YouTube auto-thumbnail fallback
function youTubeThumb(url: string): string | null {
  let id: string | null = null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      id =
        u.searchParams.get("v") ??
        u.pathname.split("/shorts/")[1]?.split("?")[0] ??
        u.pathname.split("/live/")[1]?.split("?")[0] ??
        u.pathname.split("/embed/")[1]?.split("?")[0] ??
        null;
    } else if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1).split("?")[0];
    }
  } catch {
    // ignore
  }
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return NextResponse.json({ error: "url param required" }, { status: 400 });
  }

  // Validate URL
  let targetUrl: string;
  try {
    targetUrl = new URL(rawUrl).href;
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Check cache
  const cached = cache.get(targetUrl);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // YouTube fast-path: we already know the thumb URL, skip the fetch
  const ytThumb = youTubeThumb(targetUrl);
  if (ytThumb) {
    const data: LinkPreview = {
      title: "YouTube Video",
      image: ytThumb,
      type: "video",
      canonicalUrl: targetUrl,
    };
    cache.set(targetUrl, { data, ts: Date.now() });
    return NextResponse.json(data);
  }

  // Generic OG fetch
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        // Mimic a browser so FB/TikTok return OG tags
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(timer);

    const finalUrl = res.url ?? targetUrl;
    const contentType = res.headers.get("content-type") ?? "";

    let data: LinkPreview;

    if (contentType.includes("text/html")) {
      // Only read the <head> — usually first 50 KB is enough
      const html = await res.text();
      data = extractMeta(html, finalUrl);
    } else {
      // Direct file (mp4, webm, etc.)
      data = {
        title: finalUrl.split("/").pop()?.split("?")[0] ?? "Video",
        image: null,
        type: contentType.split(";")[0],
        canonicalUrl: finalUrl,
      };
    }

    cache.set(targetUrl, { data, ts: Date.now() });
    return NextResponse.json(data);
  } catch (err: unknown) {
    // Graceful fallback — never return 500
    const fallback: LinkPreview = {
      title: "Video",
      image: null,
      type: null,
      canonicalUrl: targetUrl,
    };
    return NextResponse.json(fallback);
  }
}
