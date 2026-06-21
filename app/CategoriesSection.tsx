"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const categories = [
  {
    title: "Birthday Cakes",
    description: "Joyful custom layers with playful colors, toppers, and flavors made for every age.",
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=85",
    alt: "Colorful birthday cake with candles",
  },
  {
    title: "Wedding Cakes",
    description: "Elegant tiered cakes with refined finishes, florals, and premium celebration flavors.",
    image: "https://images.unsplash.com/photo-1525257831700-183b9b8bf5cd?auto=format&fit=crop&w=900&q=85",
    alt: "Elegant white wedding cake with flowers",
  },
  {
    title: "Theme Cakes",
    description: "Character, hobby, and event-inspired cakes shaped around your favorite story.",
    image: "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?auto=format&fit=crop&w=900&q=85",
    alt: "Decorated theme cake with colorful frosting",
  },
  {
    title: "Cupcakes",
    description: "Soft, gift-ready cupcake boxes with swirls, sprinkles, fillings, and cute toppers.",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=85",
    alt: "Pink frosted cupcakes in a bakery display",
  },
  {
    title: "Anniversary Cakes",
    description: "Romantic buttercream cakes with gentle colors, golden details, and personal messages.",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=85",
    alt: "Pink celebration cake with buttercream details",
  },
  {
    title: "Baby Shower Cakes",
    description: "Sweet pastel cakes with tiny toppers, soft florals, and charming welcome-baby details.",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=85",
    alt: "Pastel cake with delicate decorations",
  },
];

export function CategoriesSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(() => categories.map(() => false));

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const firstCard = carousel.querySelector<HTMLElement>(".category-card");
      const cardStep = firstCard ? firstCard.offsetWidth + 22 : carousel.clientWidth * 0.86;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      const shouldLoop = carousel.scrollLeft + cardStep >= maxScroll - 8;

      carousel.scrollTo({
        left: shouldLoop ? 0 : carousel.scrollLeft + cardStep,
        behavior: "smooth",
      });
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  function scrollCategories(direction: "previous" | "next") {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      left: direction === "next" ? carousel.clientWidth * 0.86 : -carousel.clientWidth * 0.86,
      behavior: "smooth",
    });
  }

  return (
    <section id="categories" className="categories-section">
      <div className="categories-inner">
        <div className="categories-heading reveal">
          <p className="categories-eyebrow">Made for every celebration</p>
          <h2 className="font-heading">Our Categories</h2>
          <p>
            Pick a cake family, share your theme, and we will shape the details into something sweet, polished,
            and celebration-ready.
          </p>
        </div>

        <div className="categories-carousel-wrap">
          <button
            type="button"
            className="categories-carousel-control categories-carousel-control-prev"
            onClick={() => scrollCategories("previous")}
            aria-label="Previous category"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div className="categories-carousel" ref={carouselRef}>
            {categories.map((category, index) => (
              <article className="category-card reveal" key={category.title}>
                <div className={`category-image-shell ${loaded[index] ? "category-image-loaded" : ""}`}>
                  <Image
                    src={category.image}
                    alt={category.alt}
                    width={900}
                    height={720}
                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 42vw, 360px"
                    className="category-image"
                    onLoad={() =>
                      setLoaded((currentLoaded) =>
                        currentLoaded.map((isLoaded, itemIndex) => (itemIndex === index ? true : isLoaded)),
                      )
                    }
                  />
                </div>

                <div className="category-card-heading">{category.title}</div>

                <div className="category-content">
                  <a href="#contact" className="category-more">
                    Explore More
                  </a>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="categories-carousel-control categories-carousel-control-next"
            onClick={() => scrollCategories("next")}
            aria-label="Next category"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
