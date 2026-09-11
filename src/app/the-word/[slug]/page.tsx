import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ShareButtons from "./ShareButtons";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PostDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps) {
  const { slug } = await params;
  let post: any = null;
  try {
    post = await prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });
  } catch (err) {
    console.error("Post metadata DB fetch error:", err);
  }

  if (!post) return { title: "Post Not Found | Niyi Aniya" };

  return {
    title: `${post.title} | The Word | Niyi Aniya`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  let post: any = null;
  try {
    post = await prisma.post.findFirst({
      where: { slug, deletedAt: null },
    });
  } catch (err) {
    console.error("Post detail DB fetch error:", err);
  }

  if (!post) {
    notFound();
  }

  // Split body into paragraphs
  const paragraphs = post.body.split(/\n\s*\n/);

  return (
    <article className="bg-[#0A0A0A] text-white min-h-screen pt-32 pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Back */}
        <div className="mb-8">
          <Link
            href="/the-word"
            className="text-xs font-bold uppercase tracking-widest text-[#A1A1A1] hover:text-white transition-colors inline-flex items-center gap-2"
          >
            ← Back to The Word
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#E85D2A] mb-4">
            <span>The Word</span>
            <span>•</span>
            <span className="text-[#A1A1A1]">
              {formatDate(post.date)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-[#A1A1A1] leading-relaxed font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Social Share Bar */}
          <div className="mt-8 pt-6 border-t border-[#222]">
            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </header>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-[#141414] mb-12 border border-[#222]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-invert prose-lg max-w-none text-[#D4D4D4] leading-relaxed space-y-6 text-base sm:text-lg">
          {paragraphs.map((para: string, i: number) => (
            <p key={i} className="leading-relaxed">
              {para.trim()}
            </p>
          ))}
        </div>

        {/* Ministry Sign-off */}
        <div className="mt-16 pt-10 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-extrabold text-white text-base tracking-tight">
              Apostle Niyi Aniya
            </h4>
            <p className="text-xs text-[#A1A1A1] mt-1">
              Spreading the unadulterated Word of God and igniting purpose.
            </p>
          </div>
          <Link
            href="/the-word"
            className="bg-white hover:bg-[#E85D2A] text-[#0A0A0A] hover:text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-colors"
          >
            Explore More Messages
          </Link>
        </div>
      </div>
    </article>
  );
}
