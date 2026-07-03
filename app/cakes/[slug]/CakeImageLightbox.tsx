"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.2-3.2M11 8.5v5M8.5 11h5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
    </svg>
  );
}

export function CakeImageLightbox({ imageUrl, altText, title }: { imageUrl: string; altText: string; title: string }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View full image of ${title}`}
        className="group relative block min-h-[32rem] w-full cursor-zoom-in overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(93,64,55,0.14)]"
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-[#be1919] shadow-md backdrop-blur transition group-hover:bg-white">
          <ZoomIcon />
          View full image
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — full image`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2d1611]/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[92vh] max-w-[94vw] rounded-2xl bg-white p-2 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-3"
          >
            <button
              type="button"
              ref={closeButtonRef}
              onClick={() => setOpen(false)}
              aria-label="Close full image"
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#be1919] text-white shadow-lg transition hover:scale-105 hover:bg-[#8f0f0f]"
            >
              <CloseIcon />
            </button>
            {/* Full, uncropped photo — plain img so it hugs the image's natural aspect ratio inside the frame. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={altText}
              className="max-h-[calc(92vh-1.5rem)] w-auto max-w-full rounded-xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
