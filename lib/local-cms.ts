import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type CmsStatus = "ACTIVE" | "INACTIVE";

export type CmsCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsGalleryImage = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
  publicId?: string | null;
  categoryId?: string | null;
  categorySlug?: string | null;
  categoryIds?: string[];
  categorySlugs?: string[];
  homeGroups?: string[];
  tags?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  altText: string;
  keywords?: string | null;
  featured: boolean;
  status: CmsStatus;
  createdAt: string;
};

export type CmsHomePageSection = {
  id: string;
  sectionKey: string;
  label: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  displayOrder: number;
  status: CmsStatus;
  updatedAt: string;
  categoryCards?: CmsHomeCategoryCard[];
  whyCards?: CmsHomeWhyCard[];
};

export type CmsHomeCategoryCard = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageAlt: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsHomeWhyCard = {
  id: string;
  title: string;
  text: string;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsFooterLink = {
  id: string;
  label: string;
  href: string;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsFooterSocialLink = CmsFooterLink & {
  type: "instagram" | "facebook" | "whatsapp" | "google";
};

export type CmsFooterSettings = {
  id: string;
  logoUrl: string;
  logoAlt: string;
  addressLines: string[];
  phoneLabel: string;
  phoneHref: string;
  emailLabel: string;
  emailHref: string;
  hoursLabel: string;
  quickLinks: CmsFooterLink[];
  categoryLinks: CmsFooterLink[];
  socialLinks: CmsFooterSocialLink[];
  formTitle: string;
  formNameLabel: string;
  formPhoneLabel: string;
  formMessageLabel: string;
  formSubmitLabel: string;
  formSuccessMessage: string;
  formErrorMessage: string;
  copyrightText: string;
  creditText: string;
  updatedAt: string;
};

type CmsData = {
  categories: CmsCategory[];
  galleryImages: CmsGalleryImage[];
  homePageSections: CmsHomePageSection[];
  footerSettings: CmsFooterSettings;
};

const cmsPath = path.join(process.cwd(), "data", "cms.json");

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const defaultCategories: CmsCategory[] = [
  {
    id: "birthday-cakes",
    name: "Birthday Cakes",
    slug: "birthday-cakes",
    description: "Custom birthday cakes for joyful celebrations.",
    displayOrder: 1,
    status: "ACTIVE",
  },
  {
    id: "wedding-cakes",
    name: "Wedding Cakes",
    slug: "wedding-cakes",
    description: "Elegant wedding cakes with premium finishes.",
    displayOrder: 2,
    status: "ACTIVE",
  },
  {
    id: "designer-cakes",
    name: "Designer Cakes",
    slug: "designer-cakes",
    description: "Creative designer cakes for special themes.",
    displayOrder: 3,
    status: "ACTIVE",
  },
  {
    id: "kids-cakes",
    name: "Kids Cakes",
    slug: "kids-cakes",
    description: "Fun kids cakes with colorful theme designs.",
    displayOrder: 4,
    status: "ACTIVE",
  },
  {
    id: "cookies",
    name: "Cookies",
    slug: "cookies",
    description: "Handcrafted cookies for gifting and dessert tables.",
    displayOrder: 5,
    status: "ACTIVE",
  },
];

export const defaultGalleryImages: CmsGalleryImage[] = [
  {
    id: "chocolate-truffle-cake",
    title: "Chocolate Truffle Cake",
    slug: "chocolate-truffle-cake",
    description: "Rich chocolate truffle cake finished for birthdays and premium celebrations.",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    categoryId: "birthday-cakes",
    categorySlug: "birthday-cakes",
    categoryIds: ["birthday-cakes"],
    categorySlugs: ["birthday-cakes"],
    homeGroups: ["Recent Designs", "Top on Demand"],
    tags: "chocolate, birthday, truffle",
    seoTitle: "Chocolate Truffle Cake | Chocobee Cake Studio",
    metaDescription: "Explore a premium chocolate truffle cake design by Chocobee Cake Studio.",
    altText: "Chocolate truffle birthday cake by Chocobee Cake Studio",
    keywords: "chocolate cake, truffle cake, birthday cake",
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "royal-wedding-lace-cake",
    title: "Royal Wedding Lace Cake",
    slug: "royal-wedding-lace-cake",
    description: "Elegant wedding cake with soft lace-inspired detailing.",
    imageUrl: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
    categoryId: "wedding-cakes",
    categorySlug: "wedding-cakes",
    categoryIds: ["wedding-cakes"],
    categorySlugs: ["wedding-cakes"],
    homeGroups: ["Most Viewed", "Top on Demand"],
    tags: "wedding, lace, elegant",
    seoTitle: "Royal Wedding Lace Cake | Chocobee Cake Studio",
    metaDescription: "View a premium lace-style wedding cake design from Chocobee Cake Studio.",
    altText: "Royal wedding lace cake design",
    keywords: "wedding cake, lace cake, designer wedding cake",
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "kids-candy-theme-cake",
    title: "Kids Candy Theme Cake",
    slug: "kids-candy-theme-cake",
    description: "A colorful candy theme cake made for kids parties.",
    imageUrl: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=85",
    categoryId: "kids-cakes",
    categorySlug: "kids-cakes",
    categoryIds: ["kids-cakes"],
    categorySlugs: ["kids-cakes"],
    homeGroups: ["Recent Designs"],
    tags: "kids, candy, birthday",
    seoTitle: "Kids Candy Theme Cake | Chocobee Cake Studio",
    metaDescription: "Discover a colorful kids candy theme cake by Chocobee Cake Studio.",
    altText: "Kids candy theme cake",
    keywords: "kids cake, theme cake, candy cake",
    featured: false,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
];

export const defaultHomeCategoryCards: CmsHomeCategoryCard[] = [
  {
    id: "birthday-cakes",
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
    id: "wedding-cakes",
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
    id: "theme-cakes",
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
    id: "cupcakes",
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
    id: "anniversary-cakes",
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
    id: "cookies-brownies",
    title: "Cookies & Brownies",
    description: "Giftable cookie boxes, fudgy brownies, and bite-sized treats for dessert tables.",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh baked cookies on a cooling rack",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 6,
    status: "ACTIVE",
  },
];

export const defaultHomeWhyCards: CmsHomeWhyCard[] = [
  {
    id: "baked-fresh",
    title: "Baked Fresh",
    text: "Small-batch cakes, cupcakes, and fillings made with premium ingredients.",
    displayOrder: 1,
    status: "ACTIVE",
  },
  {
    id: "custom-magic",
    title: "Custom Magic",
    text: "Colors, toppers, flavors, and themes designed around your celebration.",
    displayOrder: 2,
    status: "ACTIVE",
  },
  {
    id: "party-ready",
    title: "Party Ready",
    text: "Neat packaging, careful timing, and desserts that photograph beautifully.",
    displayOrder: 3,
    status: "ACTIVE",
  },
];

export const defaultHomePageSections: CmsHomePageSection[] = [
  {
    id: "hero",
    sectionKey: "hero",
    label: "Hero",
    title: "Meet the Chef Neha Panwar",
    subtitle: "Serving since 2013",
    content:
      "Control the first home page section, including headline, supporting text, image, and primary action.",
    imageUrl: "/Images/neha.png?v=2",
    imageAlt: "Chef Neha Panwar",
    ctaLabel: "Know More",
    ctaHref: "/about",
    secondaryCtaLabel: "Explore our Treat",
    secondaryCtaHref: "/gallery",
    displayOrder: 1,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "why-us",
    sectionKey: "why-us",
    label: "Why Us",
    title: "Baked Fresh, Custom Magic, Party Ready",
    subtitle: "Trust highlights",
    content: "Manage the home page trust cards and short selling points section.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 2,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    whyCards: defaultHomeWhyCards,
  },
  {
    id: "categories",
    sectionKey: "categories",
    label: "Our Categories",
    title: "Our Categories",
    subtitle: "Made for every celebration",
    content: "Control the category slider section title, copy, imagery, ordering, and visibility.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    categoryCards: defaultHomeCategoryCards,
    displayOrder: 3,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gallery",
    sectionKey: "gallery",
    label: "Cake Gallery",
    title: "Cake Gallery",
    subtitle: "From Our Studio",
    content: "Manage the home page gallery intro and call-to-action content.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: "Visit Gallery",
    ctaHref: "/gallery",
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 4,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "reviews",
    sectionKey: "reviews",
    label: "Reviews",
    title: "Customer Reviews",
    subtitle: "Sweet words",
    content: "Control visibility for the home page reviews section.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 5,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
];

export const defaultFooterSettings: CmsFooterSettings = {
  id: "footer",
  logoUrl: "/Images/CB_logo.png",
  logoAlt: "Chocobee Cake Studio",
  addressLines: ["Crossing Republik, Ghaziabad, Gaur City 1 & 2, Noida Extension"],
  phoneLabel: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  emailLabel: "hello@chocobeecake.studio",
  emailHref: "mailto:hello@chocobeecake.studio",
  hoursLabel: "10 AM - 10 PM",
  quickLinks: [
    { id: "home", label: "Home", href: "/", displayOrder: 1, status: "ACTIVE" },
    { id: "cakes-cookies", label: "Cakes & Cookies", href: "/gallery", displayOrder: 2, status: "ACTIVE" },
    { id: "custom-orders", label: "Custom Orders", href: "/contact", displayOrder: 3, status: "ACTIVE" },
    { id: "gallery", label: "Gallery", href: "/gallery", displayOrder: 4, status: "ACTIVE" },
    { id: "about-us", label: "About Us", href: "/about", displayOrder: 5, status: "ACTIVE" },
    { id: "contact-us", label: "Contact Us", href: "/contact", displayOrder: 6, status: "ACTIVE" },
    { id: "privacy-policy", label: "Privacy Policy", href: "/privacy-policy", displayOrder: 7, status: "ACTIVE" },
    { id: "terms", label: "Terms & Conditions", href: "/terms-and-conditions", displayOrder: 8, status: "ACTIVE" },
  ],
  categoryLinks: [
    { id: "wedding-cakes", label: "Wedding Cakes", href: "/gallery", displayOrder: 1, status: "ACTIVE" },
    { id: "theme-cakes", label: "Theme Cakes", href: "/gallery", displayOrder: 2, status: "ACTIVE" },
    { id: "birthday-cakes", label: "Birthday Cakes", href: "/gallery", displayOrder: 3, status: "ACTIVE" },
    { id: "anniversary-cakes", label: "Anniversary Cakes", href: "/gallery", displayOrder: 4, status: "ACTIVE" },
    { id: "cupcakes", label: "Cupcakes", href: "/gallery", displayOrder: 5, status: "ACTIVE" },
    { id: "kids-cakes", label: "Kids Cakes", href: "/gallery", displayOrder: 6, status: "ACTIVE" },
  ],
  socialLinks: [
    { id: "instagram", type: "instagram", label: "Instagram", href: "https://instagram.com", displayOrder: 1, status: "ACTIVE" },
    { id: "facebook", type: "facebook", label: "Facebook", href: "https://facebook.com", displayOrder: 2, status: "ACTIVE" },
    { id: "whatsapp", type: "whatsapp", label: "WhatsApp", href: "https://wa.me/", displayOrder: 3, status: "ACTIVE" },
    { id: "google", type: "google", label: "Google Reviews", href: "/#reviews-heading", displayOrder: 4, status: "ACTIVE" },
  ],
  formTitle: "Reach Us",
  formNameLabel: "Name",
  formPhoneLabel: "Phone",
  formMessageLabel: "Message",
  formSubmitLabel: "Submit",
  formSuccessMessage: "Thank you. We will reach out shortly.",
  formErrorMessage: "Please fill all required details correctly.",
  copyrightText: "© 2026 Chocobee Cake Studio. All Rights Reserved.",
  creditText: "Designed with love by Chocobee",
  updatedAt: new Date().toISOString(),
};

function normalizeFooterLinks(links: CmsFooterLink[] | undefined, fallback: CmsFooterLink[]) {
  return (links?.length ? links : fallback)
    .map((link, index) => ({
      ...link,
      id: link.id || slugify(link.label || `footer-link-${index + 1}`),
      label: link.label || `Footer Link ${index + 1}`,
      href: link.href || "#",
      displayOrder: link.displayOrder ?? index + 1,
      status: link.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function normalizeFooterSocialLinks(links: CmsFooterSocialLink[] | undefined, fallback: CmsFooterSocialLink[]) {
  return (links?.length ? links : fallback)
    .map((link, index) => ({
      ...link,
      id: link.id || slugify(link.label || `social-link-${index + 1}`),
      type: link.type ?? "instagram",
      label: link.label || `Social Link ${index + 1}`,
      href: link.href || "#",
      displayOrder: link.displayOrder ?? index + 1,
      status: link.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function normalizeFooterSettings(settings?: Partial<CmsFooterSettings>): CmsFooterSettings {
  return {
    ...defaultFooterSettings,
    ...settings,
    id: "footer",
    logoUrl: settings?.logoUrl ?? defaultFooterSettings.logoUrl,
    logoAlt: settings?.logoAlt ?? defaultFooterSettings.logoAlt,
    addressLines: Array.isArray(settings?.addressLines) ? settings.addressLines : defaultFooterSettings.addressLines,
    quickLinks: normalizeFooterLinks(settings?.quickLinks, defaultFooterSettings.quickLinks),
    categoryLinks: normalizeFooterLinks(settings?.categoryLinks, defaultFooterSettings.categoryLinks),
    socialLinks: normalizeFooterSocialLinks(settings?.socialLinks, defaultFooterSettings.socialLinks),
    updatedAt: settings?.updatedAt ?? new Date().toISOString(),
  };
}

async function ensureCmsFile() {
  await mkdir(path.dirname(cmsPath), { recursive: true });

  try {
    const raw = await readFile(cmsPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<CmsData>;
    const data: CmsData = {
      categories: parsed.categories?.map((category) => ({ ...category, description: category.description ?? null })) ?? defaultCategories,
      galleryImages: (parsed.galleryImages ?? defaultGalleryImages).map((image) => ({
        ...image,
        categoryIds: image.categoryIds?.length ? image.categoryIds : image.categoryId ? [image.categoryId] : [],
        categorySlugs: image.categorySlugs?.length ? image.categorySlugs : image.categorySlug ? [image.categorySlug] : [],
        homeGroups: image.homeGroups ?? [],
      })),
      homePageSections: (parsed.homePageSections ?? defaultHomePageSections).map((section) => ({
        ...section,
        id: section.id || section.sectionKey,
        sectionKey: section.sectionKey || section.id,
        subtitle: section.subtitle ?? null,
        content: section.content ?? null,
        imageUrl: section.imageUrl ?? null,
        imageAlt: section.imageAlt ?? null,
        ctaLabel: section.ctaLabel ?? null,
        ctaHref: section.ctaHref ?? null,
        secondaryCtaLabel: section.secondaryCtaLabel ?? null,
        secondaryCtaHref: section.secondaryCtaHref ?? null,
        categoryCards: section.sectionKey === "categories"
          ? (section.categoryCards?.length ? section.categoryCards : defaultHomeCategoryCards)
              .map((card, index) => ({
                ...card,
                id: card.id || slugify(card.title || `category-card-${index + 1}`),
                description: card.description ?? null,
                imageUrl: card.imageUrl,
                imageAlt: card.imageAlt || card.title,
                ctaLabel: card.ctaLabel ?? section.ctaLabel ?? "Explore More",
                ctaHref: card.ctaHref ?? section.ctaHref ?? "#contact",
                displayOrder: card.displayOrder ?? index + 1,
                status: card.status ?? "ACTIVE",
              }))
          : section.categoryCards ?? [],
        whyCards: section.sectionKey === "why-us"
          ? (section.whyCards?.length ? section.whyCards : defaultHomeWhyCards)
              .map((card, index) => ({
                ...card,
                id: card.id || slugify(card.title || `why-card-${index + 1}`),
                title: card.title || `Why Card ${index + 1}`,
                text: card.text || "",
                displayOrder: card.displayOrder ?? index + 1,
                status: card.status ?? "ACTIVE",
              }))
          : section.whyCards ?? [],
        updatedAt: section.updatedAt ?? new Date().toISOString(),
      })),
      footerSettings: normalizeFooterSettings(parsed.footerSettings),
    };
    await writeCmsData(data);
    return data;
  } catch {
    const initialData: CmsData = {
      categories: defaultCategories,
      galleryImages: defaultGalleryImages,
      homePageSections: defaultHomePageSections,
      footerSettings: defaultFooterSettings,
    };
    await writeCmsData(initialData);
    return initialData;
  }
}

async function writeCmsData(data: CmsData) {
  await mkdir(path.dirname(cmsPath), { recursive: true });
  await writeFile(cmsPath, JSON.stringify(data, null, 2));
}

export async function listLocalCategories({ activeOnly = false } = {}) {
  const data = await ensureCmsFile();
  return data.categories
    .filter((category) => (activeOnly ? category.status === "ACTIVE" : true))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

export async function createLocalCategory(input: Omit<CmsCategory, "id">) {
  const data = await ensureCmsFile();
  const slug = input.slug || slugify(input.name);
  const category: CmsCategory = { ...input, id: slug, slug };

  data.categories = [...data.categories.filter((item) => item.id !== category.id), category];
  await writeCmsData(data);
  return category;
}

export async function updateLocalCategory(id: string, input: Partial<Omit<CmsCategory, "id">>) {
  const data = await ensureCmsFile();
  let updated: CmsCategory | undefined;

  data.categories = data.categories.map((category) => {
    if (category.id !== id) return category;
    const nextSlug = input.slug ?? category.slug;
    updated = { ...category, ...input, id: nextSlug, slug: nextSlug };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalCategory(id: string) {
  const data = await ensureCmsFile();
  data.categories = data.categories.filter((category) => category.id !== id);
  data.galleryImages = data.galleryImages.map((image) => {
    const categoryIds = (image.categoryIds ?? []).filter((categoryId) => categoryId !== id);
    const categorySlugs = (image.categorySlugs ?? []).filter((categorySlug) => categorySlug !== id);
    return {
      ...image,
      categoryId: image.categoryId === id ? categoryIds[0] ?? null : image.categoryId,
      categorySlug: image.categorySlug === id ? categorySlugs[0] ?? null : image.categorySlug,
      categoryIds,
      categorySlugs,
    };
  });
  await writeCmsData(data);
}

function resolveImageCategories(categories: CmsCategory[], categoryIds?: string[] | null, fallbackCategoryId?: string | null) {
  const requestedIds = categoryIds?.length ? categoryIds : fallbackCategoryId ? [fallbackCategoryId] : [];
  const resolved = requestedIds
    .map((categoryId) => categories.find((item) => item.id === categoryId || item.slug === categoryId))
    .filter((category): category is CmsCategory => Boolean(category));

  return {
    categoryId: resolved[0]?.id ?? fallbackCategoryId ?? null,
    categorySlug: resolved[0]?.slug ?? null,
    categoryIds: resolved.map((category) => category.id),
    categorySlugs: resolved.map((category) => category.slug),
  };
}

export async function listLocalGalleryImages(options: { category?: string | null; q?: string | null; sort?: string | null } = {}) {
  const data = await ensureCmsFile();
  const query = options.q?.toLowerCase().trim();

  return data.galleryImages
    .filter((image) => image.status === "ACTIVE")
    .filter((image) =>
      options.category
        ? image.categorySlug === options.category ||
          image.categoryId === options.category ||
          image.categorySlugs?.includes(options.category) ||
          image.categoryIds?.includes(options.category)
        : true,
    )
    .filter((image) =>
      query
        ? [image.title, image.description, image.tags, image.keywords].filter(Boolean).some((value) => value?.toLowerCase().includes(query))
        : true,
    )
    .sort((a, b) => {
      if (options.sort === "featured") return Number(b.featured) - Number(a.featured);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export async function listAllLocalGalleryImages() {
  const data = await ensureCmsFile();
  return data.galleryImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLocalGalleryImageBySlug(slug: string) {
  const data = await ensureCmsFile();
  return data.galleryImages.find((image) => image.slug === slug && image.status === "ACTIVE") ?? null;
}

export async function createLocalGalleryImage(input: Omit<CmsGalleryImage, "id" | "createdAt">) {
  const data = await ensureCmsFile();
  const slug = input.slug || slugify(input.title);
  const categories = resolveImageCategories(data.categories, input.categoryIds, input.categoryId);
  const image: CmsGalleryImage = {
    ...input,
    id: slug,
    slug,
    ...categories,
    createdAt: new Date().toISOString(),
  };

  data.galleryImages = [...data.galleryImages.filter((item) => item.id !== image.id), image];
  await writeCmsData(data);
  return image;
}

export async function updateLocalGalleryImage(id: string, input: Partial<Omit<CmsGalleryImage, "id" | "createdAt">>) {
  const data = await ensureCmsFile();
  let updated: CmsGalleryImage | undefined;

  data.galleryImages = data.galleryImages.map((image) => {
    if (image.id !== id) return image;
    const categories = resolveImageCategories(
      data.categories,
      input.categoryIds ?? image.categoryIds,
      input.categoryId ?? image.categoryId,
    );
    const nextSlug = input.slug ?? image.slug;
    updated = {
      ...image,
      ...input,
      id: nextSlug,
      slug: nextSlug,
      ...categories,
    };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalGalleryImage(id: string) {
  const data = await ensureCmsFile();
  data.galleryImages = data.galleryImages.filter((image) => image.id !== id);
  await writeCmsData(data);
}

export async function listAllLocalHomePageSections() {
  const data = await ensureCmsFile();
  return data.homePageSections.sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

export async function listLocalHomePageSections({ activeOnly = false } = {}) {
  const sections = await listAllLocalHomePageSections();
  return sections.filter((section) => (activeOnly ? section.status === "ACTIVE" : true));
}

export async function createLocalHomePageSection(input: Omit<CmsHomePageSection, "id" | "updatedAt">) {
  const data = await ensureCmsFile();
  const sectionKey = input.sectionKey || slugify(input.label);
  const section: CmsHomePageSection = {
    ...input,
    id: sectionKey,
    sectionKey,
    updatedAt: new Date().toISOString(),
  };

  data.homePageSections = [...data.homePageSections.filter((item) => item.id !== section.id), section];
  await writeCmsData(data);
  return section;
}

export async function updateLocalHomePageSection(id: string, input: Partial<Omit<CmsHomePageSection, "id" | "updatedAt">>) {
  const data = await ensureCmsFile();
  let updated: CmsHomePageSection | undefined;

  data.homePageSections = data.homePageSections.map((section) => {
    if (section.id !== id) return section;
    const nextSectionKey = input.sectionKey ?? section.sectionKey;
    updated = {
      ...section,
      ...input,
      id: nextSectionKey,
      sectionKey: nextSectionKey,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalHomePageSection(id: string) {
  const data = await ensureCmsFile();
  data.homePageSections = data.homePageSections.filter((section) => section.id !== id);
  await writeCmsData(data);
}

export async function getLocalFooterSettings() {
  const data = await ensureCmsFile();
  return data.footerSettings;
}

export async function updateLocalFooterSettings(input: Partial<CmsFooterSettings>) {
  const data = await ensureCmsFile();
  const footerSettings = normalizeFooterSettings({
    ...data.footerSettings,
    ...input,
    updatedAt: new Date().toISOString(),
  });

  data.footerSettings = footerSettings;
  await writeCmsData(data);
  return footerSettings;
}
