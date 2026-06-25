// Reusable share helpers for cake cards / detail pages (native share, copy, social links).

export type ShareData = {
  title: string;
  text?: string;
  url: string;
};

export type ShareResult = "shared" | "copied" | "failed";

/** Use the Web Share API when available (mobile), otherwise copy the link to the clipboard. */
export async function nativeShareOrCopy(data: ShareData): Promise<ShareResult> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(data);
      return "shared";
    } catch {
      // user dismissed the share sheet — fall through to copy as a convenience
    }
  }

  try {
    await navigator.clipboard.writeText(data.url);
    return "copied";
  } catch {
    return "failed";
  }
}

export function facebookShareUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function twitterShareUrl(url: string, text: string): string {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}
