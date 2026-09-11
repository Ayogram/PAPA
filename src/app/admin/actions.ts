"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { loginAdminAction, logoutAdminAction, isAuthenticated, requestPasswordReset, resetPasswordWithToken } from "@/lib/auth";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// ── Auth Actions ──────────────────────────────────────────────────────────
export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  const result = await loginAdminAction(password);

  if (!result.success) {
    return {
      error: result.error || "Authentication failed",
      expired: result.expired || false,
    };
  }

  redirect("/admin");
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  return await requestPasswordReset(email);
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const token = formData.get("token") as string;
  const newPassword = formData.get("newPassword") as string;
  return await resetPasswordWithToken(token, newPassword);
}

export async function logoutAction() {
  await logoutAdminAction();
  redirect("/admin/login");
}

// ── Post Actions (The Word) ───────────────────────────────────────────────
export async function savePostAction(prevState: any, formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  const id = formData.get("id") as string | null;
  const title = (formData.get("title") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const dateStr = formData.get("date") as string;
  const coverImage = (formData.get("coverImage") as string)?.trim() || null;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const body = (formData.get("body") as string)?.trim();
  const published = formData.get("published") === "on" || formData.get("published") === "true";

  if (!title) return { error: "Title is required" };
  if (!body) return { error: "Body content is required" };

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  const postDate = dateStr ? new Date(dateStr) : new Date();

  try {
    if (id) {
      // Check slug uniqueness excluding current post
      const existing = await prisma.post.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const updated = await prisma.post.update({
        where: { id },
        data: {
          title,
          slug,
          date: postDate,
          coverImage,
          excerpt,
          body,
          published,
        },
      });

      revalidatePath("/the-word");
      revalidatePath(`/the-word/${updated.slug}`);
      revalidatePath("/");
      return { success: true, message: "Post updated successfully", post: updated };
    } else {
      // Create new
      const existing = await prisma.post.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const created = await prisma.post.create({
        data: {
          title,
          slug,
          date: postDate,
          coverImage,
          excerpt,
          body,
          published,
        },
      });

      revalidatePath("/the-word");
      revalidatePath(`/the-word/${created.slug}`);
      revalidatePath("/");
      return { success: true, message: "Post created successfully", post: created };
    }
  } catch (err: any) {
    console.error("Save post error:", err);
    return { error: err.message || "Failed to save post" };
  }
}

export async function deletePostAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/the-word");
    revalidatePath(`/the-word/${post.slug}`);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Moved to Recycle Bin" };
  } catch (err: any) {
    console.error("Delete post error:", err);
    return { error: "Failed to move post to Recycle Bin" };
  }
}

export async function restorePostAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath("/the-word");
    revalidatePath(`/the-word/${post.slug}`);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Post restored successfully" };
  } catch (err: any) {
    console.error("Restore post error:", err);
    return { error: "Failed to restore post" };
  }
}

export async function permanentDeletePostAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    const post = await prisma.post.delete({ where: { id } });
    revalidatePath("/the-word");
    revalidatePath(`/the-word/${post.slug}`);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Post permanently deleted" };
  } catch (err: any) {
    console.error("Permanent delete post error:", err);
    return { error: "Failed to permanently delete post" };
  }
}

// ── Video Actions (Photizo) ───────────────────────────────────────────────
export async function saveVideoAction(prevState: any, formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  const id = formData.get("id") as string | null;
  const title = (formData.get("title") as string)?.trim();
  const dateStr = formData.get("date") as string;
  const videoUrl = (formData.get("videoUrl") as string)?.trim();
  let thumbnail = (formData.get("thumbnail") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const published = formData.get("published") === "on" || formData.get("published") === "true";

  if (!title) return { error: "Title is required" };
  if (!videoUrl) return { error: "Video URL is required" };

  // If no custom thumbnail is provided, try extracting YouTube thumbnail
  if (!thumbnail && videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
    let videoId = "";
    if (videoUrl.includes("youtu.be/")) {
      videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (videoUrl.includes("v=")) {
      videoId = videoUrl.split("v=")[1]?.split("&")[0] || "";
    }
    if (videoId) {
      thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }

  const videoDate = dateStr ? new Date(dateStr) : new Date();

  try {
    if (id) {
      await prisma.video.update({
        where: { id },
        data: {
          title,
          date: videoDate,
          videoUrl,
          thumbnail,
          description,
          published,
        },
      });
    } else {
      await prisma.video.create({
        data: {
          title,
          date: videoDate,
          videoUrl,
          thumbnail,
          description,
          published,
        },
      });
    }

    revalidatePath("/photizo");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Video saved successfully" };
  } catch (err: any) {
    console.error("Save video error:", err);
    return { error: err.message || "Failed to save video" };
  }
}

export async function deleteVideoAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    await prisma.video.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/photizo");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Moved to Recycle Bin" };
  } catch (err: any) {
    console.error("Delete video error:", err);
    return { error: "Failed to move video to Recycle Bin" };
  }
}

export async function restoreVideoAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    await prisma.video.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath("/photizo");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Video restored successfully" };
  } catch (err: any) {
    console.error("Restore video error:", err);
    return { error: "Failed to restore video" };
  }
}

export async function permanentDeleteVideoAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    await prisma.video.delete({ where: { id } });
    revalidatePath("/photizo");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Video permanently deleted" };
  } catch (err: any) {
    console.error("Permanent delete video error:", err);
    return { error: "Failed to permanently delete video" };
  }
}

// ── Product Actions (Store) ───────────────────────────────────────────────
export async function saveProductAction(prevState: any, formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  const id = formData.get("id") as string | null;
  const name = (formData.get("name") as string)?.trim();
  const price = (formData.get("price") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || null;
  const link = (formData.get("link") as string)?.trim() || null;
  const published = formData.get("published") === "on" || formData.get("published") === "true";

  if (!name) return { error: "Product name is required" };
  if (!price) return { error: "Price is required" };

  try {
    if (id) {
      await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          image,
          link,
          published,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name,
          price,
          image,
          link,
          published,
        },
      });
    }

    revalidatePath("/store");
    revalidatePath("/admin");
    return { success: true, message: "Product saved successfully" };
  } catch (err: any) {
    console.error("Save product error:", err);
    return { error: err.message || "Failed to save product" };
  }
}

export async function deleteProductAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath("/store");
    revalidatePath("/admin");
    return { success: true, message: "Moved to Recycle Bin" };
  } catch (err: any) {
    console.error("Delete product error:", err);
    return { error: "Failed to move product to Recycle Bin" };
  }
}

export async function restoreProductAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    await prisma.product.update({
      where: { id },
      data: { deletedAt: null },
    });
    revalidatePath("/store");
    revalidatePath("/admin");
    return { success: true, message: "Product restored successfully" };
  } catch (err: any) {
    console.error("Restore product error:", err);
    return { error: "Failed to restore product" };
  }
}

export async function permanentDeleteProductAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/store");
    revalidatePath("/admin");
    return { success: true, message: "Product permanently deleted" };
  } catch (err: any) {
    console.error("Permanent delete product error:", err);
    return { error: "Failed to permanently delete product" };
  }
}

export async function emptyRecycleBinAction() {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  try {
    await Promise.all([
      prisma.post.deleteMany({ where: { deletedAt: { not: null } } }),
      prisma.video.deleteMany({ where: { deletedAt: { not: null } } }),
      prisma.product.deleteMany({ where: { deletedAt: { not: null } } }),
    ]);

    revalidatePath("/the-word");
    revalidatePath("/photizo");
    revalidatePath("/store");
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Recycle Bin emptied successfully" };
  } catch (err: any) {
    console.error("Empty recycle bin error:", err);
    return { error: "Failed to empty Recycle Bin" };
  }
}

// ── About Actions (Single row upsert) ─────────────────────────────────────
export async function saveAboutAction(prevState: any, formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  const bio = (formData.get("bio") as string)?.trim();
  const image = (formData.get("image") as string)?.trim() || null;

  if (!bio) return { error: "Bio cannot be empty" };

  try {
    const existing = await prisma.about.findFirst();
    if (existing) {
      await prisma.about.update({
        where: { id: existing.id },
        data: { bio, image },
      });
    } else {
      await prisma.about.create({
        data: { bio, image },
      });
    }

    revalidatePath("/about");
    return { success: true, message: "About information updated successfully" };
  } catch (err: any) {
    console.error("Save about error:", err);
    return { error: err.message || "Failed to update about info" };
  }
}
