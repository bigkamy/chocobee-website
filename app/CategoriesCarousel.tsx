"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type CategoryCard = {
  id?: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageAlt: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

// Renders the category cards. On desktop this is the static grid (styled via
// .categories-grid-static). On phones/tablets (<=767px) the same track becomes a
// horizontal 2-up scroll-snap carousel (<=640px) that auto-advances one card at a time.
export function CategoriesCarousel({
  cards,
  ctaLabel,
  ctaHref,
}: {
  cards: CategoryCard[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || cards.length <= 2) return;

    const mq = window.matchMedia("(max-width: 640px)");
    let timer: number | undefined;

    const advance = () => {
      if (!mq.matches) return;
      const card = track.querySelector<HTMLElement>(".category-card");
      if (!card) return;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      const step = card.getBoundingClientRect().width + gap;
      // Loop back to the start once the last cards are in view.
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: step, behavior: "smooth" });
      }
    };

    const start = () => {
      stop();
      if (mq.matches) timer = window.setInterval(advance, 3500);
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };

    start();
    mq.addEventListener("change", start);
    // Pause while the user is interacting, resume afterwards.
    track.addEventListener("pointerdown", stop);
    track.addEventListener("pointerup", start);
    track.addEventListener("mouseenter", stop);
    track.addEventListener("mouseleave", start);

    return () => {
      stop();
      mq.removeEventListener("change", start);
      track.removeEventListener("pointerdown", stop);
      track.removeEventListener("pointerup", start);
      track.removeEventListener("mouseenter", stop);
      track.removeEventListener("mouseleave", start);
    };
  }, [cards.length]);

  return (
    <div className="categories-grid-static" ref={trackRef}>
      {cards.map((category) => (
        <article className="category-card" key={category.id ?? category.title}>
          <div className="category-image-shell">
            <Image
              src={category.imageUrl}
              alt={category.imageAlt}
              width={900}
              height={720}
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 42vw, 360px"
              className="category-image"
            />
          </div>

          <div className="category-card-heading">{category.title}</div>
          <span className="category-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
            </svg>
          </span>

          <div className="category-content">
            <div className="category-desc-wrap">
              <p>{category.description}</p>
            </div>
            <a href={category.ctaHref ?? ctaHref ?? "#contact"} className="category-more">
              {category.ctaLabel ?? ctaLabel ?? "Explore More"}
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
