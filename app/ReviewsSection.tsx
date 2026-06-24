"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Review = {
  id?: string;
  name: string;
  text: string;
  rating?: number;
  date: string;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const stats = [
  { label: "Rating", value: 4.8, suffix: "+", icon: "star", decimals: 1 },
  { label: "Happy Customers", value: 5000, suffix: "+", icon: "people" },
  { label: "Custom Cake Designs", value: 25000, suffix: "+", icon: "cake" },
  { label: "Serving Since", value: 2013, suffix: "", icon: "calendar" },
];

function StatIcon({ type }: { type: string }) {
  if (type === "people") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.8 10h.1M15.1 10h.1M8.5 14.2c1 1.5 2.1 2.2 3.5 2.2s2.5-.7 3.5-2.2" />
      </svg>
    );
  }

  if (type === "cake") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14v8H5zM7 12V9.5A2.5 2.5 0 0 1 9.5 7H12a2.5 2.5 0 0 1 2.5 2.5V12M12 7V3M9.8 4.2 12 3l2.2 1.2M5 16c2.2 1 3.8 1 6 0s3.8-1 6 0 3.2.9 4 .4" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h14v15H5zM8 3v4M16 3v4M5 10h14" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
    </svg>
  );
}

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <span className="review-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 24 24" aria-hidden="true" className={index < rating ? undefined : "is-empty"}>
          <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
        </svg>
      ))}
    </span>
  );
}

function GoogleMark() {
  return (
    <span className="google-mark" aria-label="Google review">
      <span>G</span>
    </span>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <article className="review-card reveal" style={{ "--review-delay": `${index * 0.04}s` } as React.CSSProperties}>
      <div className="review-card-top">
        <span className="review-avatar" aria-hidden="true">
          {initials(review.name)}
        </span>
        <div>
          <h3>{review.name}</h3>
          <Stars rating={review.rating ?? 5} />
        </div>
        <GoogleMark />
      </div>
      <p>
        <span aria-hidden="true">“</span>
        {review.text}
        <span aria-hidden="true">”</span>
      </p>
      <div className="review-meta">
        <span>{review.date}</span>
        <span>Verified Customer</span>
      </div>
    </article>
  );
}

function Counter({ value, suffix, decimals }: { value: number; suffix: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let animationFrame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        const startedAt = performance.now();
        const duration = 1200;

        const animate = (time: number) => {
          const progress = Math.min((time - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(value * eased);

          if (progress < 1) {
            animationFrame = window.requestAnimationFrame(animate);
          }
        };

        animationFrame = window.requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [value]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString("en-IN", {
        maximumFractionDigits: decimals ?? 0,
        minimumFractionDigits: decimals ?? 0,
      })}
      {suffix}
    </span>
  );
}

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Chocobee Cake Studio",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "5000",
      },
      review: reviews.map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.name,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(review.rating ?? 5),
          bestRating: "5",
        },
        reviewBody: review.text,
      })),
    }),
    [reviews],
  );

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      if (carousel.matches(":hover") || carousel.contains(document.activeElement)) {
        return;
      }

      const firstCard = carousel.querySelector<HTMLElement>(".review-card");
      const cardStep = firstCard ? firstCard.offsetWidth + 18 : carousel.clientWidth;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const shouldLoop = carousel.scrollLeft + cardStep >= maxScroll - 8;

      carousel.scrollTo({
        left: shouldLoop ? 0 : carousel.scrollLeft + cardStep,
        behavior: "smooth",
      });
    }, 3400);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="reviews-section" aria-labelledby="reviews-heading">
      <span className="review-particle review-particle-one" aria-hidden="true" />
      <span className="review-particle review-particle-two" aria-hidden="true" />
      <span className="review-particle review-particle-three" aria-hidden="true" />

      <div className="reviews-inner">
        <div className="reviews-heading reveal">
          <span className="reviews-love-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 20s-7.5-4.4-9.2-9.4C1.6 7.2 3.8 4 7.3 4c2 0 3.5 1 4.7 2.6C13.2 5 14.8 4 16.8 4c3.5 0 5.7 3.2 4.5 6.6C19.5 15.6 12 20 12 20Z" />
            </svg>
          </span>
          <p className="reviews-eyebrow">Google Reviews</p>
          <h2 id="reviews-heading" className="font-heading">
            Loved by Thousands of Happy Customers
          </h2>
        </div>

        <div className="reviews-stats" aria-label="Chocobee Cake Studio customer statistics">
          {stats.map((stat) => (
            <div className="review-stat reveal" key={stat.label}>
              <span className="review-stat-icon">
                <StatIcon type={stat.icon} />
              </span>
              <strong>
                <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="reviews-grid" ref={carouselRef}>
          {reviews.map((review, index) => (
            <ReviewCard review={review} index={index} key={review.id ?? review.name} />
          ))}
        </div>

      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
