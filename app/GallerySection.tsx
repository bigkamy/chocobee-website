"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { WhatsAppEnquiryButton } from "./WhatsAppEnquiryButton";

const filters = ["All", "Recent Designs", "Most Viewed", "Top on Demand"] as const;

type HomeGalleryImage = {
  src: string;
  alt: string;
  label: string;
  slug?: string | null;
  width?: number | null;
  height?: number | null;
  groups: string[];
  category?: string | null;
  subCategory?: string | null;
  description?: string | null;
};

const defaultGalleryImages: HomeGalleryImage[] = [
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

type GallerySectionProps = {
  eyebrow?: string | null;
  title?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  images?: HomeGalleryImage[] | null;
};

export function GallerySection({ eyebrow, title, ctaLabel, ctaHref, images }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const galleryImages = useMemo(() => (images?.length ? images : defaultGalleryImages), [images]);
  const visibleImages = useMemo(
    () =>
      activeFilter === "All"
        ? galleryImages
        : galleryImages.filter((image) => image.groups.includes(activeFilter)),
    [activeFilter, galleryImages],
  );

  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-heading">
      <div className="gallery-inner">
        <div className="gallery-heading reveal">
          <p>{eyebrow ?? "From Our Studio"}</p>
          <h2 id="gallery-heading" className="font-heading">
            {title ?? "Cake Gallery"}
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
                width={image.width ?? 900}
                height={image.height ?? 760}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 23vw, 18vw"
                className="gallery-image"
              />
              <div className="gallery-card-actions" aria-label={`${image.label} actions`}>
                <WhatsAppEnquiryButton
                  variant="icon"
                  cakeTitle={image.label}
                  cakeSlug={image.slug}
                  category={image.category}
                  subCategory={image.subCategory}
                  imageUrl={image.src}
                  description={image.description}
                  className="gallery-card-wa"
                />
              </div>
              <figcaption>{image.label}</figcaption>
            </figure>
          ))}
        </div>

        <div className="gallery-cta reveal">
          <a href={ctaHref ?? "#contact"}>{ctaLabel ?? "Visit Gallery"}</a>
        </div>
      </div>
    </section>
  );
}
