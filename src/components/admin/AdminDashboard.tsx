"use client";

import { useState } from "react";
import Link from "next/link";
import ImageInput from "./ImageInput";
import VideoUrlInput from "./VideoUrlInput";
import {
  savePostAction,
  deletePostAction,
  restorePostAction,
  permanentDeletePostAction,
  saveVideoAction,
  deleteVideoAction,
  restoreVideoAction,
  permanentDeleteVideoAction,
  saveProductAction,
  deleteProductAction,
  restoreProductAction,
  permanentDeleteProductAction,
  emptyRecycleBinAction,
  saveAboutAction,
  logoutAction,
} from "@/app/admin/actions";

interface AdminDashboardProps {
  posts: any[];
  videos: any[];
  deletedPosts?: any[];
  deletedVideos?: any[];
  about: any | null;
}

export default function AdminDashboard({
  posts,
  videos,
  deletedPosts = [],
  deletedVideos = [],
  about,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "videos" | "about" | "trash">("posts");
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editingVideo, setEditingVideo] = useState<any | null>(null);

  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const totalDeleted = deletedPosts.length + deletedVideos.length;

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    setPostTitle(val);
    if (!isCustomSlug && !editingPost) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
      setPostSlug(generated);
    }
  };

  const startEditPost = (post: any) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setIsCustomSlug(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditPost = () => {
    setEditingPost(null);
    setPostTitle("");
    setPostSlug("");
    setIsCustomSlug(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Top Admin Nav */}
      <header className="border-b border-[#262626] bg-[#121212]/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#0A0A0A] font-extrabold text-sm tracking-tighter">
              N|A
            </Link>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight">Admin Console</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold uppercase tracking-widest bg-[#262626] text-[#A1A1A1] px-2 py-0.5 rounded">
                Live DB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold uppercase tracking-wider text-[#A1A1A1] hover:text-white px-3 py-2 rounded-lg border border-[#262626] hover:border-[#444] transition-colors"
            >
              View Site ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs font-bold uppercase tracking-wider bg-[#262626] hover:bg-red-900/40 text-red-400 px-3 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 sm:gap-6 overflow-x-auto border-t border-[#1C1C1C]">
          {[
            { id: "posts", label: `The Word (${posts.length})` },
            { id: "videos", label: `Photizo Videos (${videos.length})` },
            { id: "about", label: "About Section" },
            { id: "trash", label: `Recycle Bin (${totalDeleted})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setMessage(null);
              }}
              className={`py-3.5 px-3 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#E85D2A] text-white"
                  : tab.id === "trash" && totalDeleted > 0
                  ? "border-transparent text-amber-400/80 hover:text-amber-300"
                  : "border-transparent text-[#777] hover:text-[#bbb]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {message && (
          <div
            className={`mb-8 p-4 rounded-xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                : "bg-red-950/40 border-red-500/30 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* ── TAB 1: THE WORD POSTS ─────────────────────────────────────── */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5 bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 self-start shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold tracking-tight">
                  {editingPost ? "Edit Word Post" : "Create New Post"}
                </h2>
                {editingPost && (
                  <button
                    onClick={cancelEditPost}
                    className="text-xs text-[#A1A1A1] hover:text-white font-bold uppercase"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form
                key={editingPost?.id || "new-post"}
                action={async (formData) => {
                  setLoading(true);
                  setMessage(null);
                  try {
                    const res = await savePostAction(null, formData);
                    if (res?.error) {
                      setMessage({ type: "error", text: res.error });
                    } else {
                      setMessage({ type: "success", text: res?.message || "Post saved successfully!" });
                      cancelEditPost();
                    }
                  } catch (e: any) {
                    setMessage({ type: "error", text: e.message || "An error occurred" });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-5"
              >
                {editingPost && <input type="hidden" name="id" value={editingPost.id} />}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={postTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="E.g. The Power of Grace in Unprecedented Seasons"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E85D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={postSlug}
                    onChange={(e) => {
                      setIsCustomSlug(true);
                      setPostSlug(e.target.value);
                    }}
                    placeholder="the-power-of-grace"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-[#E85D2A]"
                  />
                  <p className="text-[11px] text-[#666] mt-1">
                    Public link will be: /the-word/{postSlug || "your-slug"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={
                      editingPost?.date
                        ? new Date(editingPost.date).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E85D2A]"
                  />
                </div>

                <ImageInput
                  name="coverImage"
                  label="Cover Image"
                  defaultValue={editingPost?.coverImage}
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    Short Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    rows={2}
                    defaultValue={editingPost?.excerpt || ""}
                    placeholder="Brief 1-2 sentence preview for cards and search..."
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#E85D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    Full Body Content *
                  </label>
                  <textarea
                    name="body"
                    required
                    rows={8}
                    defaultValue={editingPost?.body || ""}
                    placeholder="Write or paste the full sermon / teaching message here..."
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 text-white text-sm leading-relaxed focus:outline-none focus:border-[#E85D2A]"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    defaultChecked={editingPost ? editingPost.published : true}
                    className="w-4 h-4 rounded border-[#333] text-[#E85D2A] focus:ring-[#E85D2A]"
                  />
                  <label htmlFor="published" className="text-xs font-bold uppercase tracking-wider text-white cursor-pointer select-none">
                    Publish Immediately
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E85D2A] hover:bg-[#cf4e1f] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingPost ? "Update Post" : "Publish to The Word"}
                </button>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold uppercase tracking-widest text-[#A1A1A1] mb-4">
                Existing Posts ({posts.length})
              </h3>

              {posts.length === 0 ? (
                <div className="p-8 text-center bg-[#141414] border border-[#262626] rounded-2xl text-[#777]">
                  No posts yet. Create your first post using the form.
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#141414] border border-[#262626] hover:border-[#333] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {post.coverImage && (
                        <div className="w-16 h-16 rounded-lg bg-[#262626] overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              post.published
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {post.published ? "Published" : "Draft"}
                          </span>
                          <span className="text-[11px] text-[#666]">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base truncate">{post.title}</h4>
                        <p className="text-xs text-[#777] font-mono truncate">/the-word/{post.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <Link
                        href={`/the-word/${post.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-[#A1A1A1] hover:text-white px-3 py-1.5 rounded bg-[#222]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => startEditPost(post)}
                        className="text-xs font-bold text-white px-3 py-1.5 rounded bg-[#262626] hover:bg-[#333]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Move "${post.title}" to Recycle Bin?`)) {
                            const res = await deletePostAction(post.id);
                            if (res?.message) setMessage({ type: "success", text: res.message });
                          }
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded bg-red-950/30 hover:bg-red-950/60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: PHOTIZO VIDEOS ─────────────────────────────────────── */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-8 self-start shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold tracking-tight">
                  {editingVideo ? "Edit Video" : "Add Photizo Video"}
                </h2>
                {editingVideo && (
                  <button
                    onClick={() => setEditingVideo(null)}
                    className="text-xs text-[#A1A1A1] hover:text-white font-bold uppercase"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form
                key={editingVideo?.id || "new-video"}
                action={async (formData) => {
                  setLoading(true);
                  setMessage(null);
                  try {
                    const res = await saveVideoAction(null, formData);
                    if (res?.error) {
                      setMessage({ type: "error", text: res.error });
                    } else {
                      setMessage({ type: "success", text: res?.message || "Video saved successfully!" });
                      setEditingVideo(null);
                    }
                  } catch (e: any) {
                    setMessage({ type: "error", text: e.message || "An error occurred" });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-5"
              >
                {editingVideo && <input type="hidden" name="id" value={editingVideo.id} />}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingVideo?.title || ""}
                    placeholder="E.g. Photizo: The Breakthrough Anointing"
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E85D2A]"
                  />
                </div>


                <VideoUrlInput
                  defaultValue={editingVideo?.videoUrl || ""}
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={
                      editingVideo?.date
                        ? new Date(editingVideo.date).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E85D2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={editingVideo?.description || ""}
                    placeholder="Key highlights and summary of this sermon/broadcast..."
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl p-3 text-white text-xs focus:outline-none focus:border-[#E85D2A]"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl">
                  <input
                    type="checkbox"
                    id="video-published"
                    name="published"
                    defaultChecked={editingVideo ? editingVideo.published : true}
                    className="w-4 h-4 rounded border-[#333] text-[#E85D2A] focus:ring-[#E85D2A]"
                  />
                  <label htmlFor="video-published" className="text-xs font-bold uppercase tracking-wider text-white cursor-pointer select-none">
                    Publish on Photizo Page
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E85D2A] hover:bg-[#cf4e1f] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingVideo ? "Update Video" : "Add Video"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold uppercase tracking-widest text-[#A1A1A1] mb-4">
                Videos in Library ({videos.length})
              </h3>

              {videos.length === 0 ? (
                <div className="p-8 text-center bg-[#141414] border border-[#262626] rounded-2xl text-[#777]">
                  No videos yet. Add your first video using the form.
                </div>
              ) : (
                videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-[#141414] border border-[#262626] hover:border-[#333] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {vid.thumbnail && (
                        <div className="w-20 h-14 rounded-lg bg-[#262626] overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              vid.published ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-400"
                            }`}
                          >
                            {vid.published ? "Published" : "Draft"}
                          </span>
                          <span className="text-[11px] text-[#666]">
                            {new Date(vid.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base truncate">{vid.title}</h4>
                        <p className="text-xs text-[#777] font-mono truncate">{vid.videoUrl}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => {
                          setEditingVideo(vid);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="text-xs font-bold text-white px-3 py-1.5 rounded bg-[#262626] hover:bg-[#333]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Move video "${vid.title}" to Recycle Bin?`)) {
                            const res = await deleteVideoAction(vid.id);
                            if (res?.message) setMessage({ type: "success", text: res.message });
                          }
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded bg-red-950/30 hover:bg-red-950/60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: ABOUT PAGE ─────────────────────────────────────────── */}
        {activeTab === "about" && (
          <div className="max-w-3xl bg-[#141414] border border-[#262626] rounded-2xl p-6 sm:p-10 shadow-xl">
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">Edit About Profile</h2>
            <p className="text-sm text-[#A1A1A1] mb-8">
              Update Pastor Niyi Aniya&apos;s biography and featured profile portrait shown on the /about page.
            </p>

            <form
              action={async (formData) => {
                setLoading(true);
                setMessage(null);
                try {
                  const res = await saveAboutAction(null, formData);
                  if (res?.error) {
                    setMessage({ type: "error", text: res.error });
                  } else {
                    setMessage({ type: "success", text: res?.message || "About section updated!" });
                  }
                } catch (e: any) {
                  setMessage({ type: "error", text: e.message || "An error occurred" });
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-6"
            >
              <ImageInput
                name="image"
                label="Profile Picture (Shown on About Page)"
                defaultValue={about?.image || "/2.jpeg"}
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1] mb-2">
                  Biography Text *
                </label>
                <textarea
                  name="bio"
                  required
                  rows={10}
                  defaultValue={about?.bio || ""}
                  placeholder="Paste Pastor Niyi Aniya's official biography..."
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl p-4 text-white text-sm leading-relaxed focus:outline-none focus:border-[#E85D2A]"
                />
                <p className="text-[11px] text-[#666] mt-1">
                  Paragraph breaks will be preserved when rendered on the public page.
                </p>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#262626]">
                <Link
                  href="/about"
                  target="_blank"
                  className="text-xs font-bold uppercase tracking-wider text-[#A1A1A1] hover:text-white px-4 py-3"
                >
                  Preview About Page ↗
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#E85D2A] hover:bg-[#cf4e1f] text-white font-bold px-8 py-3.5 rounded-xl uppercase tracking-wider text-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save About Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB 5: RECYCLE BIN ───────────────────────────────────────── */}
        {activeTab === "trash" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141414] border border-[#262626] rounded-2xl p-6 shadow-xl">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Recycle Bin</h2>
                <p className="text-xs text-[#A1A1A1] mt-1">
                  Deleted items are stored here. You can restore them anytime or delete them permanently.
                </p>
              </div>
              {totalDeleted > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm("Are you sure you want to PERMANENTLY delete ALL items in the Recycle Bin? This action cannot be undone.")) {
                      setLoading(true);
                      setMessage(null);
                      const res = await emptyRecycleBinAction();
                      setLoading(false);
                      if (res?.error) {
                        setMessage({ type: "error", text: res.error });
                      } else {
                        setMessage({ type: "success", text: res?.message || "Recycle Bin emptied" });
                      }
                    }
                  }}
                  disabled={loading}
                  className="bg-red-950/40 border border-red-800/40 hover:bg-red-900 text-red-300 px-4 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors shrink-0 disabled:opacity-50"
                >
                  Empty Recycle Bin ({totalDeleted})
                </button>
              )}
            </div>

            {totalDeleted === 0 ? (
              <div className="p-12 text-center bg-[#141414] border border-[#262626] rounded-2xl text-[#777]">
                Recycle Bin is empty. No deleted items found.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Deleted Posts */}
                {deletedPosts.map((post) => (
                  <div
                    key={`post-${post.id}`}
                    className="bg-[#141414] border border-[#262626] hover:border-[#333] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {post.coverImage && (
                        <div className="w-16 h-16 rounded-lg bg-[#262626] overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-950/50 text-blue-400 border border-blue-800/30">
                            The Word Post
                          </span>
                          <span className="text-[11px] text-[#666]">
                            Deleted {new Date(post.deletedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base truncate">{post.title}</h4>
                        <p className="text-xs text-[#777] font-mono truncate">/the-word/{post.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={async () => {
                          const res = await restorePostAction(post.id);
                          if (res?.message) setMessage({ type: "success", text: res.message });
                        }}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-800/30 hover:bg-emerald-950/60"
                      >
                        Restore
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Permanently delete "${post.title}"? This cannot be undone.`)) {
                            const res = await permanentDeletePostAction(post.id);
                            if (res?.message) setMessage({ type: "success", text: res.message });
                          }
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded bg-red-950/30 border border-red-800/30 hover:bg-red-950/60"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                ))}

                {/* Deleted Videos */}
                {deletedVideos.map((vid) => (
                  <div
                    key={`video-${vid.id}`}
                    className="bg-[#141414] border border-[#262626] hover:border-[#333] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {vid.thumbnail && (
                        <div className="w-20 h-14 rounded-lg bg-[#262626] overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-purple-950/50 text-purple-400 border border-purple-800/30">
                            Photizo Video
                          </span>
                          <span className="text-[11px] text-[#666]">
                            Deleted {new Date(vid.deletedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base truncate">{vid.title}</h4>
                        <p className="text-xs text-[#777] font-mono truncate">{vid.videoUrl}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={async () => {
                          const res = await restoreVideoAction(vid.id);
                          if (res?.message) setMessage({ type: "success", text: res.message });
                        }}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded bg-emerald-950/30 border border-emerald-800/30 hover:bg-emerald-950/60"
                      >
                        Restore
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Permanently delete video "${vid.title}"? This cannot be undone.`)) {
                            const res = await permanentDeleteVideoAction(vid.id);
                            if (res?.message) setMessage({ type: "success", text: res.message });
                          }
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded bg-red-950/30 border border-red-800/30 hover:bg-red-950/60"
                      >
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
