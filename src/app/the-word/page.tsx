import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Word | Niyi Aniya",
  description: "Prophetic teachings, sermon manuscripts, and spiritual revelations by Niyi Aniya.",
};

export default async function TheWordPage() {
  const posts = await prisma.post.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-3">
            Ministry Feed
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter leading-tight">
            The Word
          </h1>
          <p className="text-base sm:text-xl text-[#A1A1A1] max-w-2xl mt-4 leading-relaxed font-medium">
            Dive into inspired revelations, spiritual empowerment, and timeless biblical truth from Niyi Aniya.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-12 text-center text-[#777]">
            <p className="text-lg">No posts published yet. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#444] transition-all duration-300"
              >
                {post.coverImage && (
                  <Link href={`/the-word/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-[#222]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1A1] mb-3">
                      {formatDate(post.date)}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4 group-hover:text-[#E85D2A] transition-colors leading-snug">
                      <Link href={`/the-word/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-[#A1A1A1] text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#222] flex items-center justify-between">
                    <Link
                      href={`/the-word/${post.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#E85D2A] transition-colors flex items-center gap-1.5"
                    >
                      Read Message <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
