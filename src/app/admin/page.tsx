import prisma from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [posts, videos, deletedPosts, deletedVideos, about] = await Promise.all([
    prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.video.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    }),
    prisma.video.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    }),
    prisma.about.findFirst(),
  ]);

  return (
    <AdminDashboard
      posts={posts}
      videos={videos}
      deletedPosts={deletedPosts}
      deletedVideos={deletedVideos}
      about={about}
    />
  );
}
