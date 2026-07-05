import Image from "next/image";
import { CategoriesSection } from "./CategoriesSection";
import { Footer } from "./Footer";
import { GallerySection } from "./GallerySection";
import { HeroOrderActions } from "./HeroOrderActions";
import { NavBar } from "./NavBar";
import { ReviewsSection } from "./ReviewsSection";
import { getPublicImageDimensions } from "@/lib/image-dimensions";
import { getLocalCustomOrderSettings, listLocalCategories, listLocalGalleryImages, listLocalHomePageSections, listLocalReviews, type CmsHomePageSection } from "@/lib/local-cms";

export const dynamic = "force-dynamic";

const whyChooseUs = [
  {
    id: "baked-fresh",
    title: "Serving Since 2013",
    text: "Over a Decade of Sweet Excellence.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5c0-2.8 2.1-5.1 4.8-5.5.8-1.8 2.6-3 4.7-3A5.5 5.5 0 0 1 20 9.5c0 1.4-.5 2.6-1.3 3.6V20H6v-7.1c-.6-.1-1-.1-1-.4Z" />
        <path d="M8 15h8M8 18h8" />
      </svg>
    ),
  },
  {
    id: "custom-magic",
    title: "5000+ Happy Customers",
    text: "One promise—exceptional quality every time.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <path d="M9 9h.01M15 9h.01" />
      </svg>
    ),
  },
  {
    id: "party-ready",
    title: "25,000+ Custom Cake Designs",
    text: "Crafted to Make Every Celebration Unforgettable.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h16" />
        <path d="M5 20v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7" />
        <path d="M5 15c1.3 0 1.3 1.2 2.6 1.2S8.9 15 10.1 15s1.3 1.2 2.6 1.2S14 15 15.3 15s1.3 1.2 2.7 1.2" />
        <path d="M8 11V8M12 11V7M16 11V8" />
        <path d="M8 6.5V6M12 5.5V5M16 6.5V6" />
      </svg>
    ),
  },
];

function DecorativeSprinkles() {
  return (
    <div className="sprinkle-field" aria-hidden="true">
      <span className="dot dot-one" />
      <span className="dot dot-two" />
      <span className="dot dot-three" />
      <span className="dot dot-four" />
      <span className="star star-one" />
      <span className="star star-two" />
      <span className="crumb crumb-one" />
      <span className="crumb crumb-two" />
      <span className="crumb crumb-three" />
    </div>
  );
}

function getWhyUsCards(section?: CmsHomePageSection) {
  const activeCards = section?.whyCards
    ?.filter((card) => card.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));

  return activeCards?.length
    ? activeCards.map((card, index) => ({
        ...card,
        icon: card.iconUrl ? (
          <Image src={card.iconUrl} alt="" width={64} height={64} className="why-icon-img" />
        ) : (
          whyChooseUs[index % whyChooseUs.length].icon
        ),
      }))
    : whyChooseUs;
}

function findSection(sections: CmsHomePageSection[], sectionKey: string) {
  return sections.find((section) => section.sectionKey === sectionKey);
}

function renderHeroTitle(title: string) {
  const highlightedName = "Neha Panwar";
  const nameStart = title.indexOf(highlightedName);

  if (nameStart < 0) return title;

  const before = title.slice(0, nameStart).trim();
  const after = title.slice(nameStart + highlightedName.length).trim();

  return (
    <>
      <span className="block whitespace-nowrap">{before}</span>
      <span className="block whitespace-nowrap text-[#be1919]">
        {highlightedName}
        {after ? ` ${after}` : ""}
      </span>
    </>
  );
}

export default async function Home() {
  const [homeSections, customOrderSettings, reviews, categories] = await Promise.all([
    listLocalHomePageSections({ activeOnly: true }),
    getLocalCustomOrderSettings(),
    listLocalReviews({ activeOnly: true }),
    listLocalCategories({ activeOnly: true }),
  ]);
  const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]));
  const subcategoryLabelById = new Map(
    categories.flatMap((category) => (category.subcategoryCtas ?? []).map((cta) => [cta.id, cta.label] as const)),
  );
  const homeGalleryImages = await Promise.all(
    (await listLocalGalleryImages())
      .filter((image) => image.homeGroups?.length)
      .map(async (image) => {
        const dimensions = await getPublicImageDimensions(image.imageUrl);
        const primarySlug = image.categorySlug ?? image.categorySlugs?.[0] ?? null;
        const subCategory =
          (image.subcategoryCtaIds ?? [])
            .map((ctaId) => subcategoryLabelById.get(ctaId))
            .filter(Boolean)
            .join(", ") || null;

        return {
          src: image.imageUrl,
          alt: image.altText,
          label: image.title,
          slug: image.slug,
          width: dimensions?.width ?? null,
          height: dimensions?.height ?? null,
          groups: image.homeGroups ?? [],
          category: (primarySlug ? categoryNameBySlug.get(primarySlug) : null) ?? primarySlug ?? null,
          subCategory,
          description: image.description ?? null,
        };
      }),
  );
  const heroSection = findSection(homeSections, "hero");
  const whyUsSection = findSection(homeSections, "why-us");
  const categoriesSection = findSection(homeSections, "categories");
  const gallerySection = findSection(homeSections, "gallery");
  const whyUsCards = getWhyUsCards(whyUsSection);

  return (
    <main className="site-shell min-h-screen overflow-hidden text-[#5D4037]">
      <DecorativeSprinkles />

      <NavBar customOrderSettings={customOrderSettings} />

      {heroSection ? (
      <section id="hero" className="relative pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-0 sm:px-8 md:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-0">
          <div className="reveal relative z-10 mx-auto max-w-2xl text-center md:mx-0 md:text-left">
            <h1 className="font-heading text-[2.35rem] leading-[0.95] text-[#5D4037] sm:text-[3.35rem] lg:text-[4.1rem]">
              {renderHeroTitle(heroSection.title)}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#715044] sm:text-lg md:mx-0">
              {heroSection.content ??
                "Serving since 2013, Chef Neha Panwar has created 25,000+ unique cake designs, delighting 5,000+ happy clients with exceptional creativity, premium quality, and a passion for crafting memorable celebrations truly unforgettable."}
            </p>

            <HeroOrderActions
              primaryLabel={heroSection.ctaLabel ?? "Know More"}
              primaryHref={heroSection.ctaHref ?? "/about"}
              secondaryLabel={heroSection.secondaryCtaLabel ?? "Explore our Treat"}
              secondaryHref={heroSection.secondaryCtaHref ?? "/gallery"}
              galleryImages={homeGalleryImages}
              customOrderSettings={customOrderSettings}
            />

          </div>

          <div className="hero-image-static relative mx-auto flex w-full max-w-[760px] justify-center self-end md:-translate-x-6">
            <div className="hero-glow" aria-hidden="true" />
            <div className="floating-cupcake">
              <Image
                src={heroSection.imageUrl || "/Images/neha.png"}
                alt={heroSection.imageAlt || "Chocobee Cake Studio feature"}
                width={1467}
                height={1058}
                priority
                sizes="(max-width: 768px) 88vw, 512px"
                className="cupcake-photo"
              />
              <span className="photo-spark photo-spark-one" aria-hidden="true" />
              <span className="photo-spark photo-spark-two" aria-hidden="true" />
              <span className="photo-spark photo-spark-three" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {whyUsSection ? (
      <section id="why-us" className="relative z-[80] mx-auto -mt-24 -mb-14 max-w-7xl px-5 pb-0 sm:-mt-28 sm:-mb-16 sm:px-8 lg:-mt-32 lg:-mb-20 lg:px-10">
        <div className="reveal grid gap-4 rounded-[28px] border border-white/80 bg-white/62 p-4 shadow-[0_20px_55px_rgba(93,64,55,0.1)] backdrop-blur md:grid-cols-3">
          {whyUsCards.map((item, index) => (
            <article key={item.title} className={`why-card why-card-${index + 1}`}>
              <span className="why-icon">{item.icon}</span>
              <div>
                <h2 className="text-base font-bold">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#765447]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      ) : null}

      {categoriesSection ? (
        <CategoriesSection
          eyebrow={categoriesSection.subtitle}
          title={categoriesSection.title}
          content={categoriesSection.content}
          ctaLabel={categoriesSection.ctaLabel}
          ctaHref={categoriesSection.ctaHref}
          cards={categoriesSection.categoryCards}
        />
      ) : null}

      {gallerySection ? (
        <GallerySection
          eyebrow={gallerySection.subtitle}
          title={gallerySection.title}
          ctaLabel={gallerySection.ctaLabel}
          ctaHref={gallerySection.ctaHref}
          images={homeGalleryImages}
        />
      ) : null}

      {reviews.length ? <ReviewsSection reviews={reviews} /> : null}

      <Footer />
    </main>
  );
}
