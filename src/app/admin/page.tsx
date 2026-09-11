import prisma from "@/lib/prisma";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  let posts: any[] = [];
  let videos: any[] = [];
  let deletedPosts: any[] = [];
  let deletedVideos: any[] = [];
  let about: any = null;

  try {
    const results = await Promise.all([
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

    posts = results[0];
    videos = results[1];
    deletedPosts = results[2];
    deletedVideos = results[3];
    about = results[4];
  } catch (err) {
    console.error("Admin page DB fetch error:", err);
  }

  return (
    <AdminDashboard
      posts={JSON.parse(JSON.stringify(posts))}
      videos={JSON.parse(JSON.stringify(videos))}
      deletedPosts={JSON.parse(JSON.stringify(deletedPosts))}
      deletedVideos={JSON.parse(JSON.stringify(deletedVideos))}
      about={JSON.parse(JSON.stringify(about))}
    />
  );
}
