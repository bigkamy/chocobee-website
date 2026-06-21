"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Footer } from "../Footer";
import { NavBar } from "../NavBar";

type Category =
  | "All"
  | "Birthday Cakes"
  | "Wedding Cakes"
  | "Kids Theme Cakes"
  | "Designer Cakes"
  | "Cookies";

type GalleryItem = {
  id: number;
  title: string;
  image: string;
  category: Exclude<Category, "All">;
};

const categories: Category[] = [
  "All",
  "Birthday Cakes",
  "Wedding Cakes",
  "Kids Theme Cakes",
  "Designer Cakes",
  "Cookies",
];

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Blush Birthday Bloom",
    category: "Birthday Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    title: "Royal Wedding Lace",
    category: "Wedding Cakes",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    title: "Little Star Theme Cake",
    category: "Kids Theme Cakes",
    image: "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    title: "Chocolate Couture",
    category: "Designer Cakes",
    image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    title: "Honey Butter Cookies",
    category: "Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    title: "Berry Celebration Cake",
    category: "Birthday Cakes",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    title: "Ivory Floral Wedding",
    category: "Wedding Cakes",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    title: "Candy Castle Cake",
    category: "Kids Theme Cakes",
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 9,
    title: "Gold Drip Signature",
    category: "Designer Cakes",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 10,
    title: "Classic Choco Chip Box",
    category: "Cookies",
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 11,
    title: "Pastel Rosette Cake",
    category: "Birthday Cakes",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 12,
    title: "Pearl Anniversary Tier",
    category: "Wedding Cakes",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 13,
    title: "Dreamy Unicorn Theme",
    category: "Kids Theme Cakes",
    image: "https://images.unsplash.com/photo-1626803775151-61d756612f97?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 14,
    title: "Velvet Designer Slice",
    category: "Designer Cakes",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 15,
    title: "Celebration Cookie Set",
    category: "Cookies",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=900&q=85",
  },
];

const initialVisible = 9;

function CakeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M5 21h14v-8H5v8Z" fill="currentColor" opacity=".18" />
      <path d="M5 13h14M7 13V9c0-2.8 2.2-5 5-5s5 2.2 5 5v4M5 17h14M8 9h8M5 21h14v-8H5v8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M2.8 12s3.3-6 9.2-6 9.2 6 9.2 6-3.3 6-9.2 6-9.2-6-9.2-6Z" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <path d="M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" fill="none" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M12 20s-7.3-4.4-9.2-9.1C1.4 7.4 3.6 4.5 6.7 4.5c1.8 0 3.3 1 4.1 2.2.8-1.2 2.3-2.2 4.1-2.2 3.1 0 5.3 2.9 3.9 6.4C17.3 15.6 12 20 12 20Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-1a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM8.7 15.4l6.6-3.8M8.8 18.6l6.4 3.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path d="M12 3.5a8.4 8.4 0 0 0-7.2 12.8L4 20.5l4.3-1A8.5 8.5 0 1 0 12 3.5Z" fill="currentColor" opacity=".2" />
      <path d="M4.8 16.3A8.4 8.4 0 1 1 8.3 19.5L4 20.5l.8-4.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <path d="M9 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.4.5c.8 1.3 1.8 2.2 3.2 2.8l.5-.6c.2-.2.4-.3.7-.2l1.6.8c.3.1.4.3.4.6v.4c0 .4-.2.7-.5.9-.5.4-1.2.5-1.9.4-2.9-.6-5.5-2.8-6.5-5.6-.3-.8-.2-1.6.2-2.3Z" fill="currentColor" />
    </svg>
  );
}

export function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [visibleCount, setVisibleCount] = useState(initialVisible);

  const filteredItems = useMemo(() => {
    return activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setVisibleCount(initialVisible);
  };

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#fff5f0] text-[#5d4037]">
      <section className="relative overflow-hidden px-4 pb-10 pt-44 sm:px-6 lg:px-8 lg:pb-14 lg:pt-48">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(255,183,197,0.5),transparent_20rem),radial-gradient(circle_at_92%_15%,rgba(255,215,0,0.22),transparent_18rem),linear-gradient(120deg,rgba(255,255,255,0.58),transparent)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#be1919]">Cakes & Cookies Gallery</p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-[#5d4037] sm:text-5xl lg:text-6xl">
              Our Delicious Creations
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#7d5b4f] sm:text-base">
              Browse signature cakes, custom themes, elegant wedding tiers, and handcrafted cookies made for sweet celebrations.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(220px,25%)_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[28px] border border-white/70 bg-white/78 p-4 shadow-[0_18px_44px_rgba(93,64,55,0.1)] backdrop-blur">
                <div className="mb-4 flex items-center gap-2 text-[#be1919]">
                  <CakeIcon />
                  <h2 className="text-lg font-extrabold text-[#5d4037]">Categories</h2>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {categories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryChange(category)}
                        className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                          isActive
                            ? "bg-[#be1919] text-white shadow-[0_12px_26px_rgba(190,25,25,0.24)]"
                            : "bg-[#fff5f0] text-[#6f4b40] hover:-translate-y-0.5 hover:bg-[#ffedf1] hover:text-[#be1919]"
                        }`}
                        aria-pressed={isActive}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <section aria-live="polite">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-[#7d5b4f]">
                  Showing <span className="text-[#be1919]">{visibleItems.length}</span> of {filteredItems.length} designs
                </p>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#be1919] shadow-sm">
                  {activeCategory}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleItems.map((item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-[24px] bg-white shadow-[0_16px_40px_rgba(93,64,55,0.12)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_58px_rgba(93,64,55,0.18)]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2d1611]/70 via-[#2d1611]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-x-4 bottom-4 flex translate-y-4 items-center justify-center gap-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button type="button" className="rounded-full bg-white/92 p-3 text-[#be1919] shadow-lg transition hover:scale-110" aria-label={`View ${item.title}`}>
                          <EyeIcon />
                        </button>
                        <button type="button" className="rounded-full bg-white/92 p-3 text-[#be1919] shadow-lg transition hover:scale-110" aria-label={`Like ${item.title}`}>
                          <HeartIcon />
                        </button>
                        <button type="button" className="rounded-full bg-white/92 p-3 text-[#be1919] shadow-lg transition hover:scale-110" aria-label={`Share ${item.title}`}>
                          <ShareIcon />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#be1919]">{item.category}</p>
                      <h3 className="mt-2 text-lg font-extrabold text-[#5d4037]">{item.title}</h3>
                    </div>
                  </article>
                ))}
              </div>

              {visibleCount < filteredItems.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + 6)}
                    className="rounded-full border border-[#be1919]/20 bg-white px-7 py-3 text-sm font-extrabold text-[#be1919] shadow-[0_12px_30px_rgba(93,64,55,0.1)] transition hover:-translate-y-0.5 hover:bg-[#be1919] hover:text-white"
                  >
                    Load More
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/910000000000?text=Hi%20Chocobee%20Cake%20Studio%2C%20I%20want%20to%20order%20from%20the%20gallery."
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_rgba(37,211,102,0.35)] transition hover:-translate-y-1"
        aria-label="Order on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
      </main>
      <Footer />
    </>
  );
}
