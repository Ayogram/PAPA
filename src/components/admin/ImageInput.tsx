"use client";

import { useState } from "react";

interface ImageInputProps {
  name: string;
  label: string;
  defaultValue?: string | null;
}

/** If a YouTube URL is pasted, extract the thumbnail image URL instead */
function resolveYouTubeThumb(raw: string): string {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    if (host !== "youtube.com" && host !== "youtu.be") return raw;

    let id: string | null = null;
    if (host === "youtu.be") {
      id = u.pathname.slice(1).split("?")[0];
    } else if (u.pathname.startsWith("/shorts/")) {
      id = u.pathname.split("/shorts/")[1]?.split("?")[0] ?? null;
    } else if (u.pathname.startsWith("/live/")) {
      id = u.pathname.split("/live/")[1]?.split("?")[0] ?? null;
    } else if (u.pathname.startsWith("/embed/")) {
      id = u.pathname.split("/embed/")[1]?.split("?")[0] ?? null;
    } else {
      id = u.searchParams.get("v");
    }

    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch {
    // not a URL — fall through
  }
  return raw;
}

function isYouTubeUrl(val: string): boolean {
  return val.includes("youtube.com") || val.includes("youtu.be");
}

export default function ImageInput({ name, label, defaultValue }: ImageInputProps) {
  const [value, setValue] = useState(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [ytConverted, setYtConverted] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setValue(data.url);
      setYtConverted(false);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (raw: string) => {
    if (isYouTubeUrl(raw)) {
      const thumb = resolveYouTubeThumb(raw);
      setValue(thumb);
      setYtConverted(thumb !== raw);
    } else {
      setValue(raw);
      setYtConverted(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-widest text-[#A1A1A1]">
          {label}
        </label>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded font-medium ${
              mode === "upload" ? "bg-white text-[#0A0A0A]" : "text-[#A1A1A1] hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded font-medium ${
              mode === "url" ? "bg-white text-[#0A0A0A]" : "text-[#A1A1A1] hover:text-white"
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {/* Hidden input to pass value in form submission */}
      <input type="hidden" name={name} value={value} />

      {mode === "upload" ? (
        <div className="border border-dashed border-[#333] hover:border-[#555] rounded-xl p-4 text-center transition-colors bg-[#0D0D0D]">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            id={`file-${name}`}
            className="hidden"
          />
          <label
            htmlFor={`file-${name}`}
            className="cursor-pointer flex flex-col items-center justify-center space-y-1 text-xs text-[#A1A1A1] hover:text-white"
          >
            <span className="font-bold text-white">
              {isUploading ? "Uploading..." : "Click to select file to upload"}
            </span>
            <span>Saved directly to /public/uploads</span>
          </label>
        </div>
      ) : (
        <div className="space-y-1">
          <input
            type="text"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg or /1.jpeg"
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-2.5 text-white text-xs placeholder-[#555] focus:outline-none focus:border-[#E85D2A]"
          />
          {ytConverted && (
            <p className="text-[11px] text-emerald-400 font-medium">
              ✓ YouTube URL detected — auto-extracted thumbnail
            </p>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Live Preview */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-[#141414] border border-[#262626] rounded-lg mt-2">
          <div className="w-16 h-12 rounded bg-[#262626] overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate font-mono">{value}</p>
            <p className="text-[10px] text-[#A1A1A1]">
              {ytConverted ? "YouTube thumbnail (auto-extracted)" : "Active image path"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setValue(""); setYtConverted(false); }}
            className="text-xs text-red-400 hover:text-red-300 font-bold px-2 py-1"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
