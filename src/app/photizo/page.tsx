import prisma from "@/lib/prisma";
import VideoPlayerGrid from "@/components/photizo/VideoPlayerGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Photizo Video Library | Niyi Aniya",
  description: "Watch prophetic messages, power sessions, and life-transforming broadcasts by Niyi Aniya.",
};

export default async function PhotizoPage() {
  const videos = await prisma.video.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-3">
            Video Archive
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-tight">
            Photizo
          </h1>
          <p className="text-base sm:text-xl text-[#A1A1A1] max-w-2xl mt-4 leading-relaxed font-medium">
            Step into illuminated understanding. Experience the full archive of prophetic messages, spiritual teachings, and conferences.
          </p>
        </div>

        {/* Video Grid with interactive modal */}
        <VideoPlayerGrid videos={videos} />
      </div>
    </div>
  );
}
