import Image from "next/image";

const defaultCategories = [
  {
    title: "Birthday Cakes",
    description: "Joyful custom layers with playful colors, toppers, and flavors made for every age.",
    imageUrl: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Colorful birthday cake with candles",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 1,
    status: "ACTIVE",
  },
  {
    title: "Wedding Cakes",
    description: "Elegant tiered cakes with refined finishes, florals, and premium celebration flavors.",
    imageUrl: "https://images.unsplash.com/photo-1525257831700-183b9b8bf5cd?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Elegant white wedding cake with flowers",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 2,
    status: "ACTIVE",
  },
  {
    title: "Theme Cakes",
    description: "Character, hobby, and event-inspired cakes shaped around your favorite story.",
    imageUrl: "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Decorated theme cake with colorful frosting",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 3,
    status: "ACTIVE",
  },
  {
    title: "Cupcakes",
    description: "Soft, gift-ready cupcake boxes with swirls, sprinkles, fillings, and cute toppers.",
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Pink frosted cupcakes in a bakery display",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 4,
    status: "ACTIVE",
  },
  {
    title: "Anniversary Cakes",
    description: "Romantic buttercream cakes with gentle colors, golden details, and personal messages.",
    imageUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Pink celebration cake with buttercream details",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 5,
    status: "ACTIVE",
  },
  {
    title: "Cookies & Brownies",
    description: "Giftable cookie boxes, fudgy brownies, and bite-sized treats for dessert tables.",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh baked cookies on a cooling rack",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 6,
    status: "ACTIVE",
  },
] satisfies CategoryCard[];

type CategoryCard = {
  id?: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageAlt: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

type CategoriesSectionProps = {
  eyebrow?: string | null;
  title?: string | null;
  content?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  cards?: CategoryCard[] | null;
};

export function CategoriesSection({ eyebrow, title, content, ctaLabel, ctaHref, cards }: CategoriesSectionProps) {
  const visibleCards = (cards?.length ? cards : defaultCategories)
    .filter((category) => category.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));

  return (
    <section id="categories" className="categories-section">
      <div className="categories-inner">
        <div className="categories-heading reveal">
          <p className="categories-eyebrow">{eyebrow ?? "Made for every celebration"}</p>
          <h2 className="font-heading">{title ?? "Our Categories"}</h2>
          <p>
            {content ??
              "Pick a cake family, share your theme, and we will shape the details into something sweet, polished, and celebration-ready."}
          </p>
        </div>

        <div className="categories-grid-static">
          {visibleCards.map((category) => (
            <article className="category-card" key={category.title}>
              <div className="category-image-shell">
                <Image
                  src={category.imageUrl}
                  alt={category.imageAlt}
                  width={900}
                  height={720}
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 42vw, 360px"
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
      </div>
    </section>
  );
}
