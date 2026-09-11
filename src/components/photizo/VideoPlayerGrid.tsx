"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import MediaEmbed from "@/components/MediaEmbed";
import { resolveMedia, playModeLabel, platformLabel } from "@/lib/media";

interface VideoItem {
  id: string;
  title: string;
  date: Date | string;
  thumbnail: string | null;
  videoUrl: string;
  description: string | null;
}

export default function VideoPlayerGrid({ videos }: { videos: VideoItem[] }) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  if (videos.length === 0) {
    return (
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-12 text-center text-[#777]">
        No broadcast videos published yet. Check back soon.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {videos.map((video) => {
          const resolved = resolveMedia(video.videoUrl);

          const handleCardClick = () => {
            if (resolved.playMode === "popout") {
              // FB / unknown: open directly in new tab — no modal needed
              window.open(video.videoUrl, "_blank", "noreferrer");
            } else {
              setActiveVideo(video);
            }
          };

          return (
            <div
              key={video.id}
              onClick={handleCardClick}
              className="group cursor-pointer bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#444] transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail via MediaEmbed (static mode — no autoplay on card) */}
              <div className="relative aspect-[16/9] w-full bg-[#1A1A1A] overflow-hidden pointer-events-none">
                <MediaEmbed
                  url={video.videoUrl}
                  thumbnail={video.thumbnail}
                  title={video.title}
                  showBadge={true}
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div
                    suppressHydrationWarning
                    className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1A1] mb-2"
                  >
                    {formatDate(video.date)}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white mb-3 group-hover:text-[#E85D2A] transition-colors leading-snug">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-[#A1A1A1] line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#222] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A1A1A1] group-hover:text-white">
                  <span>
                    {resolved.playMode === "popout"
                      ? `Watch on ${platformLabel(resolved.platform)}`
                      : "Watch Teaching"}
                  </span>
                  <span>{resolved.playMode === "popout" ? "↗" : "▶"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline video modal — only shown for inline-capable sources */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-4xl bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[#222]">
              <h3 className="text-base font-bold text-white truncate pr-4">
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-[#A1A1A1] hover:text-white text-sm font-bold uppercase tracking-widest px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Embed — MediaEmbed handles autoplay on mount */}
            <div className="relative aspect-[16/9] w-full bg-black">
              <MediaEmbed
                url={activeVideo.videoUrl}
                thumbnail={activeVideo.thumbnail}
                title={activeVideo.title}
                showBadge={false}
                autoPlay={true}
              />
            </div>

            {/* Description */}
            {activeVideo.description && (
              <div className="p-6 bg-[#0E0E0E]">
                <p className="text-sm text-[#A1A1A1] leading-relaxed">
                  {activeVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
