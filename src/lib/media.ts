export type VideoSource = {
  type: "iframe" | "video";
  src: string;
};

export const getVideoSource = (url?: string | null): VideoSource | null => {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { type: "video", src: trimmed };
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "drive.google.com" || host === "docs.google.com") {
    const pathId = parsed.pathname.match(/\/file\/d\/([\w-]+)/)?.[1];
    const fileId = pathId || parsed.searchParams.get("id");
    if (fileId) {
      return { type: "iframe", src: `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview` };
    }
  }

  if (host === "youtu.be" || host.endsWith("youtube.com")) {
    const videoId = host === "youtu.be"
      ? parsed.pathname.split("/").filter(Boolean)[0]
      : parsed.pathname.match(/\/(?:embed|v|shorts)\/([\w-]{11})/)?.[1] || parsed.searchParams.get("v");
    if (videoId && /^[\w-]{11}$/.test(videoId)) {
      return { type: "iframe", src: `https://www.youtube.com/embed/${videoId}` };
    }
  }

  if (host.endsWith("vimeo.com")) {
    const videoId = parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
    if (videoId) return { type: "iframe", src: `https://player.vimeo.com/video/${videoId}` };
  }

  return { type: "video", src: trimmed };
};