"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Breadcrumb } from "../Breadcrumb";
import { NavBar } from "../NavBar";
import { WhatsAppEnquiryButton } from "../WhatsAppEnquiryButton";
import { GALLERY_AGE_GROUPS, GALLERY_FILTER_KEYS, GALLERY_FLAVOURS, GALLERY_GENDERS, GALLERY_SIZE_BUCKETS, GALLERY_TIERS, sizeBucketOf } from "@/lib/gallery-filters";

type SubcategoryCta = {
  id: string;
  label: string;
  href: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  showInFilter?: boolean;
};

type Category = {
  name: string;
  slug: string;
  subcategoryCtas?: SubcategoryCta[];
};

type GalleryItem = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  description?: string | null;
  category: string;
  categorySlug?: string | null;
  categoryIds?: string[];
  categorySlugs?: string[];
  subcategoryCtaIds?: string[];
  featured?: boolean;
  altText: string;
  minCakeSizeKg?: number | null;
  gender?: string | null;
  ageGroup?: string | null;
  flavour?: string | null;
  tier?: string | null;
};

type GalleryApiItem = Omit<GalleryItem, "category"> & {
  category?: string | { name?: string; slug?: string };
};

const fallbackCategories: Category[] = [
  { name: "All", slug: "all", subcategoryCtas: [] },
  { name: "Birthday Cakes", slug: "birthday-cakes", subcategoryCtas: [] },
  { name: "Wedding Cakes", slug: "wedding-cakes", subcategoryCtas: [] },
  { name: "Designer Cakes", slug: "designer-cakes", subcategoryCtas: [] },
  { name: "Kids Cakes", slug: "kids-cakes", subcategoryCtas: [] },
  { name: "Cookies", slug: "cookies", subcategoryCtas: [] },
];

const galleryItems: GalleryItem[] = [
  {
    id: "blush-birthday-bloom",
    title: "Blush Birthday Bloom",
    slug: "blush-birthday-bloom",
    category: "Birthday Cakes",
    categorySlug: "birthday-cakes",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    altText: "Blush birthday cake",
  },
  {
    id: "royal-wedding-lace",
    title: "Royal Wedding Lace",
    slug: "royal-wedding-lace",
    category: "Wedding Cakes",
    categorySlug: "wedding-cakes",
    imageUrl: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
    altText: "Royal wedding lace cake",
  },
  {
    id: "little-star-theme-cake",
    title: "Little Star Theme Cake",
    slug: "little-star-theme-cake",
    category: "Kids Cakes",
    categorySlug: "kids-cakes",
    imageUrl: "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?auto=format&fit=crop&w=900&q=85",
    altText: "Little star theme cake",
  },
  {
    id: "chocolate-couture",
    title: "Chocolate Couture",
    slug: "chocolate-couture",
    category: "Designer Cakes",
    categorySlug: "designer-cakes",
    imageUrl: "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=85",
    altText: "Chocolate designer cake",
  },
  {
    id: "honey-butter-cookies",
    title: "Honey Butter Cookies",
    slug: "honey-butter-cookies",
    category: "Cookies",
    categorySlug: "cookies",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
    altText: "Honey butter cookies",
  },
];

const initialVisible = 9;

function toSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function CakeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path d="M5 21h14v-8H5v8Z" fill="currentColor" opacity=".18" />
      <path d="M5 13h14M7 13V9c0-2.8 2.2-5 5-5s5 2.2 5 5v4M5 17h14M8 9h8M5 21h14v-8H5v8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="flex flex-col gap-1 text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-[#be1919]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-[#be1919]/20 bg-white px-2 py-2 text-xs font-bold text-[#5d4037] shadow-sm outline-none transition focus:border-[#be1919]"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubcategoryId, setActiveSubcategoryId] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [items, setItems] = useState<GalleryItem[]>(galleryItems);
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [genderFilter, setGenderFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [flavourFilter, setFlavourFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [enabledFilterFields, setEnabledFilterFields] = useState<string[]>([...GALLERY_FILTER_KEYS]);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { categories?: Category[] };
        const nextCategories = data.categories?.filter((category) => category.name).map((category) => ({
          ...category,
          slug: category.slug || toSlug(category.name),
          subcategoryCtas: category.subcategoryCtas ?? [],
        })) ?? [];

        if (isMounted && nextCategories.length) {
          setCategories([{ name: "All", slug: "all", subcategoryCtas: [] }, ...nextCategories]);
        }
      } catch {
        setCategories(fallbackCategories);
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/gallery-filters", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { fields?: string[] } | null) => {
        if (active && Array.isArray(data?.fields)) setEnabledFilterFields(data.fields);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadImages() {
      try {
        const selectedCategory = categories.find((category) => category.name === activeCategory);
        const categoryParam = activeCategory === "All" ? "" : `?category=${encodeURIComponent(selectedCategory?.slug ?? toSlug(activeCategory))}`;
        const response = await fetch(`/api/gallery${categoryParam}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { images?: GalleryApiItem[] };
        const nextItems =
          data.images?.map((image) => {
            const categoryObject = typeof image.category === "object" ? image.category : null;
            const categoryLabel = typeof image.category === "string" ? image.category : null;
            const primarySlug = categoryObject?.slug ?? image.categorySlug ?? image.categorySlugs?.[0] ?? "";
            const matchedCategory = categories.find((category) => category.slug === primarySlug);
            return {
              ...image,
              category: categoryObject?.name ?? matchedCategory?.name ?? categoryLabel ?? primarySlug ?? "Gallery",
              categorySlug: primarySlug,
            };
          }) ?? [];

        if (isMounted && nextItems.length) {
          setItems(nextItems);
        }
      } catch {
        setItems(galleryItems);
      }
    }

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, categories]);

  const hasAttributeFilters = Boolean(genderFilter || ageFilter || sizeFilter || flavourFilter || tierFilter);

  const applyFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setVisibleCount(initialVisible);
  };

  const filteredItems = useMemo(() => {
    let list =
      activeCategory === "All"
        ? items
        : items.filter((item) => item.category === activeCategory || item.categorySlugs?.includes(toSlug(activeCategory)));

    if (activeSubcategoryId) list = list.filter((item) => item.subcategoryCtaIds?.includes(activeSubcategoryId));
    if (genderFilter) list = list.filter((item) => item.gender === genderFilter);
    if (ageFilter) list = list.filter((item) => item.ageGroup === ageFilter);
    if (flavourFilter) list = list.filter((item) => item.flavour === flavourFilter);
    if (tierFilter) list = list.filter((item) => item.tier === tierFilter);
    if (sizeFilter) list = list.filter((item) => sizeBucketOf(item.minCakeSizeKg) === sizeFilter);
    return list;
  }, [activeCategory, activeSubcategoryId, items, genderFilter, ageFilter, sizeFilter, flavourFilter, tierFilter]);

  const clearAttributeFilters = () => {
    setGenderFilter("");
    setAgeFilter("");
    setSizeFilter("");
    setFlavourFilter("");
    setTierFilter("");
    setVisibleCount(initialVisible);
  };

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category.name);
    setActiveSubcategoryId("");
    setVisibleCount(initialVisible);
    setExpandedCategories((current) =>
      current.includes(category.slug) ? current : [...current, category.slug],
    );
  };

  const toggleCategoryExpanded = (slug: string) => {
    setExpandedCategories((current) =>
      current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug],
    );
  };

  const handleSubcategoryChange = (category: Category, subcategoryId: string) => {
    setActiveCategory(category.name);
    setActiveSubcategoryId((current) => (current === subcategoryId ? "" : subcategoryId));
    setVisibleCount(initialVisible);
  };

  const subcategoryLabelById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => category.subcategoryCtas?.forEach((cta) => map.set(cta.id, cta.label)));
    return map;
  }, [categories]);

  const subCategoryLabel = (item: GalleryItem) =>
    item.subcategoryCtaIds
      ?.map((ctaId) => subcategoryLabelById.get(ctaId))
      .filter(Boolean)
      .join(", ") || null;

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#fff5f0] text-[#5d4037]">
        <section className="relative overflow-hidden px-4 pb-16 pt-48 sm:px-6 lg:px-8 lg:pb-20 lg:pt-56">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(255,183,197,0.5),transparent_20rem),radial-gradient(circle_at_92%_15%,rgba(255,215,0,0.22),transparent_18rem),linear-gradient(120deg,rgba(255,255,255,0.58),transparent)]" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumb items={[{ label: "Gallery" }]} />
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
                    const isActive = activeCategory === category.name;
                    const subcategoryCtas = category.subcategoryCtas
                      ?.filter((cta) => cta.status === "ACTIVE" && cta.showInFilter !== false)
                      .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label)) ?? [];
                    const hasSubcategories = subcategoryCtas.length > 0;
                    const isExpanded = expandedCategories.includes(category.slug);
                    return (
                      <div className="gallery-category-group" key={category.slug}>
                        <div
                          className={`flex items-stretch overflow-hidden rounded-2xl text-sm font-bold transition ${
                            isActive
                              ? "bg-[#be1919] text-white"
                              : "bg-[#fff5f0] text-[#6f4b40] hover:bg-[#ffedf1] hover:text-[#be1919]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleCategoryChange(category)}
                            className="flex flex-1 items-center gap-2 px-4 py-3 text-left"
                            aria-pressed={isActive}
                          >
                            <span className="flex-1">{category.name}</span>
                            {hasSubcategories ? (
                              <span
                                className={`inline-flex min-w-[1.4rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[0.65rem] font-extrabold leading-none ${
                                  isActive ? "bg-white/25 text-white" : "bg-[#be1919]/12 text-[#be1919]"
                                }`}
                                aria-label={`${subcategoryCtas.length} subcategories`}
                              >
                                {subcategoryCtas.length}
                              </span>
                            ) : null}
                          </button>
                          {hasSubcategories ? (
                            <button
                              type="button"
                              onClick={() => toggleCategoryExpanded(category.slug)}
                              className={`flex items-center px-3 transition ${
                                isActive ? "text-white/90 hover:text-white" : "text-[#be1919]/70 hover:text-[#be1919]"
                              }`}
                              aria-expanded={isExpanded}
                              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name} subcategories`}
                            >
                              <ChevronIcon
                                className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          ) : null}
                        </div>
                        {isExpanded && hasSubcategories ? (
                          <div className="gallery-subcategory-ctas" aria-label={`${category.name} subcategories`}>
                            {subcategoryCtas.map((cta) => (
                              <button
                                type="button"
                                className={activeSubcategoryId === cta.id ? "gallery-subcategory-active" : ""}
                                onClick={() => handleSubcategoryChange(category, cta.id)}
                                aria-pressed={activeSubcategoryId === cta.id}
                                key={cta.id}
                              >
                                {cta.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            <section aria-live="polite">
              {enabledFilterFields.length ? (
              <div className="mb-4 rounded-[20px] border border-white/70 bg-white/80 p-3 shadow-[0_10px_30px_rgba(93,64,55,0.08)] backdrop-blur">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5d4037]">Filter Cakes</p>
                  {hasAttributeFilters ? (
                    <button type="button" onClick={clearAttributeFilters} className="text-xs font-extrabold text-[#be1919] underline">
                      Clear filters
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                  {enabledFilterFields.includes("gender") ? <FilterSelect label="Gender" value={genderFilter} onChange={applyFilter(setGenderFilter)} options={GALLERY_GENDERS} /> : null}
                  {enabledFilterFields.includes("age") ? <FilterSelect label="Age" value={ageFilter} onChange={applyFilter(setAgeFilter)} options={GALLERY_AGE_GROUPS} /> : null}
                  {enabledFilterFields.includes("size") ? <FilterSelect label="Size" value={sizeFilter} onChange={applyFilter(setSizeFilter)} options={GALLERY_SIZE_BUCKETS} /> : null}
                  {enabledFilterFields.includes("flavour") ? <FilterSelect label="Flavour" value={flavourFilter} onChange={applyFilter(setFlavourFilter)} options={GALLERY_FLAVOURS} /> : null}
                  {enabledFilterFields.includes("tier") ? <FilterSelect label="Tier" value={tierFilter} onChange={applyFilter(setTierFilter)} options={GALLERY_TIERS} /> : null}
                </div>
              </div>
              ) : null}
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
                    className="group relative cursor-pointer overflow-hidden rounded-[24px] bg-white shadow-[0_16px_40px_rgba(93,64,55,0.12)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_58px_rgba(93,64,55,0.18)] focus-within:ring-2 focus-within:ring-[#be1919]/40"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.altText || item.title}
                        fill
                        sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2d1611]/70 via-[#2d1611]/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex translate-y-4 items-center justify-center gap-3 opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                        <WhatsAppEnquiryButton
                          variant="icon"
                          cakeTitle={item.title}
                          cakeSlug={item.slug}
                          category={item.category}
                          subCategory={subCategoryLabel(item)}
                          imageUrl={item.imageUrl}
                          description={item.description}
                          className="gallery-overlay-wa"
                        />
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-extrabold text-[#5d4037]">{item.title}</h3>
                      <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#fff5f0] px-2 py-0.5 text-[0.68rem] font-bold text-[#7d5b4f]">
                        Min. {item.minCakeSizeKg ?? 0.5} kg
                      </p>
                      <a
                        href={`/cakes/${item.slug}`}
                        aria-label={`View details for ${item.title}`}
                        className="absolute inset-0 rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#be1919]/40"
                      >
                        <span className="sr-only">View {item.title}</span>
                      </a>
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
    </>
  );
}
