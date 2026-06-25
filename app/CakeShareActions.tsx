"use client";

import { useState } from "react";
import { facebookShareUrl, nativeShareOrCopy, twitterShareUrl } from "@/lib/share";
import { resolveCakeUrl } from "@/lib/whatsapp";

type CakeShareActionsProps = {
  cakeTitle: string;
  cakeSlug?: string | null;
};

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h8" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.7 9.7l6.6-3.4M8.7 16.3l6.6-3.4" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 8h2V5h-2.2C11.7 5 10 6.6 10 9v2H8v3h2v6h3v-6h2.2l.5-3H13V9.2c0-.7.3-1.2 1-1.2Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

export function CakeShareActions({ cakeTitle, cakeSlug }: CakeShareActionsProps) {
  const [status, setStatus] = useState("");

  function url() {
    return resolveCakeUrl(cakeSlug);
  }

  async function handleNativeShare() {
    const result = await nativeShareOrCopy({
      title: `${cakeTitle} | Chocobee Cake Studio`,
      text: `Check out ${cakeTitle} by Chocobee Cake Studio`,
      url: url(),
    });
    if (result === "shared") setStatus("");
    else if (result === "copied") setStatus("Link copied to clipboard!");
    else setStatus("Could not share. Please copy the link manually.");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url());
      setStatus("Link copied to clipboard!");
    } catch {
      setStatus("Could not copy the link.");
    }
  }

  function openPopup(href: string) {
    window.open(href, "_blank", "noopener,noreferrer,width=640,height=560");
  }

  return (
    <div className="cake-share-actions">
      <span className="cake-share-label">Share:</span>
      <button type="button" onClick={() => void handleNativeShare()} title="Share this cake" aria-label="Share this cake">
        <ShareIcon />
      </button>
      <button type="button" onClick={() => void handleCopy()} title="Copy cake link" aria-label="Copy cake link">
        <CopyIcon />
      </button>
      <button
        type="button"
        onClick={() => openPopup(facebookShareUrl(url()))}
        title="Share on Facebook"
        aria-label="Share on Facebook"
        className="cake-share-fb"
      >
        <FacebookIcon />
      </button>
      <button
        type="button"
        onClick={() => openPopup(twitterShareUrl(url(), `Check out ${cakeTitle} by Chocobee Cake Studio`))}
        title="Share on X"
        aria-label="Share on X"
        className="cake-share-x"
      >
        <XIcon />
      </button>
      {status ? (
        <span className="cake-share-status" role="status">
          {status}
        </span>
      ) : null}
    </div>
  );
}
