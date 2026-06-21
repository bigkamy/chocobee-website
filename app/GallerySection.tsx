"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const filters = ["All", "Recent Designs", "Most Viewed", "Top on Demand"] as const;

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=85",
    alt: "Pink designer cake with buttercream decorations",
    label: "Signature Cakes",
    groups: ["Recent Designs", "Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=85",
    alt: "Cupcakes with pink frosting",
    label: "Cupcake Boxes",
    groups: ["Most Viewed", "Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
    alt: "Dessert table with cakes and pastries",
    label: "Dessert Tables",
    groups: ["Most Viewed"],
  },
  {
    src: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85",
    alt: "Layer cake with candles",
    label: "Birthday Moments",
    groups: ["Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=85",
    alt: "Pastel cake with delicate decoration",
    label: "Pastel Details",
    groups: ["Recent Designs"],
  },
  {
    src: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=85",
    alt: "Celebration cake with candles",
    label: "Custom Themes",
    groups: ["Most Viewed", "Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85",
    alt: "Assorted cupcakes on a dessert table",
    label: "Party Cupcakes",
    groups: ["Recent Designs"],
  },
  {
    src: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    alt: "Chocolate cake slice with layers",
    label: "Chocolate Layers",
    groups: ["Most Viewed"],
  },
  {
    src: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=85",
    alt: "Cake decorated with fruit and cream",
    label: "Fresh Fruit Cakes",
    groups: ["Recent Designs", "Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=900&q=85",
    alt: "Cupcakes with pastel frosting",
    label: "Pastel Swirls",
    groups: ["Recent Designs"],
  },
  {
    src: "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=85",
    alt: "Decorated cake with berries",
    label: "Berry Specials",
    groups: ["Most Viewed"],
  },
  {
    src: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=900&q=85",
    alt: "Tall cake with cream and fruit",
    label: "Tall Celebration Cakes",
    groups: ["Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=900&q=85",
    alt: "Chocolate dessert cake",
    label: "Chocolate Dreams",
    groups: ["Most Viewed", "Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=900&q=85",
    alt: "Cupcakes with sprinkles",
    label: "Sprinkle Boxes",
    groups: ["Recent Designs"],
  },
  {
    src: "https://images.unsplash.com/photo-1607478900766-efe13248b125?auto=format&fit=crop&w=900&q=85",
    alt: "Pink frosted cake on a table",
    label: "Pink Frosting",
    groups: ["Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=900&q=85",
    alt: "Cake with creamy decoration",
    label: "Cream Finish",
    groups: ["Recent Designs"],
  },
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=85",
    alt: "Donuts and desserts with glaze",
    label: "Dessert Add-ons",
    groups: ["Most Viewed"],
  },
  {
    src: "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85",
    alt: "Chocolate cake with ganache",
    label: "Ganache Cakes",
    groups: ["Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=85",
    alt: "Cupcakes arranged together",
    label: "Mini Treats",
    groups: ["Recent Designs", "Most Viewed"],
  },
  {
    src: "https://images.unsplash.com/photo-1616690710400-a16d146927c5?auto=format&fit=crop&w=900&q=85",
    alt: "Elegant cake with soft frosting",
    label: "Elegant Finishes",
    groups: ["Top on Demand"],
  },
  {
    src: "https://images.unsplash.com/photo-1509474520651-53cf6a80536f?auto=format&fit=crop&w=900&q=85",
    alt: "Dessert slices and cake plates",
    label: "Dessert Platters",
    groups: ["Most Viewed"],
  },
];

type Filter = (typeof filters)[number];

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [wishlistCounts, setWishlistCounts] = useState(() => galleryImages.map((_, index) => 84 + index * 7));
  const visibleImages = useMemo(
    () =>
      activeFilter === "All"
        ? galleryImages
        : galleryImages.filter((image) => image.groups.includes(activeFilter)),
    [activeFilter],
  );

  function handleWishlist(label: string) {
    const imageIndex = galleryImages.findIndex((image) => image.label === label);

    if (imageIndex < 0) {
      return;
    }

    setWishlistCounts((counts) => counts.map((count, index) => (index === imageIndex ? count + 1 : count)));
  }

  async function handleShare(image: (typeof galleryImages)[number]) {
    const shareData = {
      title: `${image.label} by Chocobee Cake Studio`,
      text: `Take a look at this ${image.label.toLowerCase()} design from Chocobee Cake Studio.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        return;
      }
    }

    window.alert(`${shareData.title}\n${shareData.url}`);
  }

  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-heading">
      <div className="gallery-inner">
        <div className="gallery-heading reveal">
          <p>From Our Studio</p>
          <h2 id="gallery-heading" className="font-heading">
            Cake Gallery
          </h2>
        </div>

        <div className="gallery-filter-bar" aria-label="Gallery filters">
          {filters.map((filter) => (
            <button
              type="button"
              className={activeFilter === filter ? "gallery-filter-active" : ""}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              key={filter}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleImages.map((image, index) => (
            <figure className={`gallery-card gallery-card-${(index % 9) + 1} reveal`} key={image.label}>
              <Image
                src={image.src}
                alt={image.alt}
                width={900}
                height={760}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 31vw"
                className="gallery-image"
              />
              <div className="gallery-card-actions" aria-label={`${image.label} engagement actions`}>
                <button type="button" onClick={() => handleWishlist(image.label)} aria-label={`Add ${image.label} to wishlist`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 20s-7.5-4.4-9.2-9.4C1.6 7.2 3.8 4 7.3 4c2 0 3.5 1 4.7 2.6C13.2 5 14.8 4 16.8 4c3.5 0 5.7 3.2 4.5 6.6C19.5 15.6 12 20 12 20Z" />
                  </svg>
                  <span>{wishlistCounts[galleryImages.findIndex((item) => item.label === image.label)]}</span>
                </button>
                <button type="button" onClick={() => void handleShare(image)} aria-label={`Share ${image.label}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.7 9.7l6.6-3.4M8.7 16.3l6.6-3.4" />
                  </svg>
                </button>
                <span className="gallery-views" aria-label={`${(1200 + index * 137).toLocaleString()} views`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
                    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
                  </svg>
                  <span>{(1200 + index * 137).toLocaleString()}</span>
                </span>
              </div>
              <figcaption>{image.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="gallery-cta reveal">
          <a href="#contact">Visit Gallery</a>
        </div>
      </div>
    </section>
  );
}
