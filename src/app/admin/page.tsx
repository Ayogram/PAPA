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
    posts = await prisma.post.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Admin fetch posts error:", err);
  }

  try {
    videos = await prisma.video.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Admin fetch videos error:", err);
  }

  try {
    deletedPosts = await prisma.post.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    });
  } catch (err) {
    console.error("Admin fetch deletedPosts error:", err);
  }

  try {
    deletedVideos = await prisma.video.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    });
  } catch (err) {
    console.error("Admin fetch deletedVideos error:", err);
  }

  try {
    about = await prisma.about.findFirst();
  } catch (err) {
    console.error("Admin fetch about error:", err);
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
