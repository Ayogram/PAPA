import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Niyi Aniya | Ministry",
  description: "Learn about Apostle Niyi Aniya, his apostolic mandate, and the vision of transformation.",
};

const defaultBio = `Apostle Niyi Aniya is the Founder and Senior Pastor of Waterbrooks Ministry International, a Lagos-based Christian ministry dedicated to raising spiritually sound, purpose-driven believers and leaders.

With a strong passion for discipleship, youth development, and practical Christian living, he is known for his prophetic insight, heartfelt prayers, and clear teaching of God's Word. Through his apostolic mandate, he has inspired countless lives across nations to walk in divine purpose, spiritual authority, and supernatural grace.

Marked by deep revelation, prophetic precision, and the manifestation of God's tangible presence, his ministry equips believers to be conduits of heaven's kingdom on earth, discover their purpose, and live out the God-life with integrity and excellence.`;

export default async function AboutPage() {
  const about = await prisma.about.findFirst();

  const bioText = about?.bio || defaultBio;
  const profileImage = about?.image || "/2.jpeg";
  const paragraphs = bioText.split(/\n\s*\n/);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="mb-16 sm:mb-20">
          <p className="text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-3">
            Ministry Leadership
          </p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none">
            About Niyi Aniya
          </h1>
        </div>

        {/* Hero Profile Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24 sm:mb-32">
          {/* Main Portrait */}
          <div className="lg:col-span-5">
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#141414] border border-[#262626] shadow-2xl relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profileImage}
                alt="Apostle Niyi Aniya"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Biography Text */}
          <div className="lg:col-span-7 space-y-8">
            <div className="border-l-2 border-[#E85D2A] pl-6 sm:pl-8 py-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                &ldquo;A mandate to illuminate minds, empower spirits, and establish believers in supernatural authority.&rdquo;
              </h2>
            </div>

            <div className="text-[#D4D4D4] text-base sm:text-lg leading-relaxed space-y-6 font-medium">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p.trim()}</p>
              ))}
            </div>

            <div className="pt-8 border-t border-[#222] flex flex-wrap gap-4">
              <Link
                href="/the-word"
                className="bg-white text-[#0A0A0A] hover:bg-[#E85D2A] hover:text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Read His Teachings
              </Link>
              <Link
                href="/photizo"
                className="bg-transparent border border-white/40 hover:border-white text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Watch Broadcasts
              </Link>
            </div>
          </div>
        </div>

        {/* Visual Gallery Grid */}
        <section className="pt-16 border-t border-[#222]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-2">
                Moments & Ministry
              </p>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Photo Gallery
              </h3>
            </div>
            <span className="text-xs text-[#777] uppercase tracking-widest font-mono">
              Archived Portraits
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { src: "/1.jpeg", caption: "Ministry Session" },
              { src: "/2.jpeg", caption: "Apostolic Council" },
              { src: "/3.jpeg", caption: "Word Exhortation" },
              { src: "/4.jpeg", caption: "Spiritual Impartation" },
            ].map((img, i) => (
              <div
                key={i}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#141414] border border-[#222]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
