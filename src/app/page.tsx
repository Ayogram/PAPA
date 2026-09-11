import HeroSlideshow from "@/components/HeroSlideshow";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  let latestPosts: any[] = [];
  try {
    latestPosts = await prisma.post.findMany({
      where: { published: true, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (err) {
    console.error("Home page DB fetch error:", err);
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Dynamic Viewport Hero Section */}
      <section className="relative min-h-[100dvh] w-full flex items-end pb-20 sm:pb-32">
        <HeroSlideshow />

        {/* Content overlaid on the slideshow */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.08] mb-4 sm:mb-6">
              Welcome to <br /> Niyi Aniya
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-[#F5F5F5] mb-8 sm:mb-10 font-medium leading-relaxed max-w-xl">
              Discover the power of the living Word and transform your life today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/the-word"
                className="bg-white text-[#0A0A0A] px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-[#F5F5F5] transition-colors text-center shadow-lg"
              >
                Read Today&apos;s Word
              </Link>
              <Link
                href="/photizo"
                className="bg-transparent border border-white/80 text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-bold uppercase tracking-wider text-xs sm:text-sm hover:bg-white/10 transition-colors backdrop-blur-sm text-center"
              >
                Watch Photizo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Section: Latest from The Word */}
      <section className="py-20 sm:py-32 bg-[#0A0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-16 gap-6">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight max-w-2xl">
              Dig deeper into <br className="hidden md:block" /> God&apos;s Word.
            </h2>
            <Link
              href="/the-word"
              className="text-[#A1A1A1] hover:text-white font-bold uppercase tracking-widest text-xs sm:text-sm transition-colors border-b border-[#A1A1A1] pb-1"
            >
              View all posts &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {latestPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer flex flex-col bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden hover:border-[#444] transition-all p-5">
                <Link href={`/the-word/${post.slug}`}>
                  <div className="w-full aspect-[16/10] bg-[#262626] rounded-xl mb-5 overflow-hidden">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#171717] group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                </Link>
                <div className="text-[11px] font-bold text-[#A1A1A1] tracking-widest uppercase mb-2">
                  {formatDate(post.date)}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-[#E85D2A] transition-colors leading-snug">
                  <Link href={`/the-word/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt && (
                  <p className="text-[#A1A1A1] text-xs line-clamp-3 font-medium leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photizo Section with 6.jpg Background */}
      <section className="relative py-28 sm:py-40 bg-[#0A0A0A] text-white overflow-hidden">
        {/* Background Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/6.jpg"
          alt="Experience Photizo"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-85"
        />
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-black/25 to-[#0A0A0A]/40" />

        {/* Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-3">
            Watch &amp; Listen
          </p>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6">
            Experience Photizo
          </h2>
          <p className="text-base sm:text-xl text-[#D4D4D4] max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Watch the latest teachings and prophetic insights from Niyi Aniya.
          </p>
          <Link
            href="/photizo"
            className="inline-block bg-[#E85D2A] text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold uppercase tracking-wider hover:bg-[#cf4e1f] transition-colors text-xs sm:text-sm shadow-xl"
          >
            Start Watching
          </Link>
        </div>
      </section>
    </div>
  );
}
