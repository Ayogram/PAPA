import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/image-proxy?url=...
 *
 * Server-side image proxy. Fetches any image URL (including Facebook CDN URLs
 * that block cross-origin <img> loads) and pipes the bytes back to the browser
 * with the correct Content-Type. This bypasses Facebook's hotlink/CORS protection.
 */
export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) {
    return new NextResponse("url param required", { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = new URL(rawUrl).href;
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        // Pretend to be a real browser so Facebook CDN serves the image
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://www.facebook.com/",
      },
      redirect: "follow",
    });

    clearTimeout(timer);

    if (!res.ok) {
      return new NextResponse("Image fetch failed", { status: 502 });
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache aggressively — image content doesn't change
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        // Allow the browser to load from any origin
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Proxy error", { status: 502 });
  }
}
