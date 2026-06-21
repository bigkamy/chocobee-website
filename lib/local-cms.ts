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
  tags?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  altText: string;
  keywords?: string | null;
  featured: boolean;
  status: CmsStatus;
  createdAt: string;
};

type CmsData = {
  categories: CmsCategory[];
  galleryImages: CmsGalleryImage[];
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
      })),
    };
    await writeCmsData(data);
    return data;
  } catch {
    const initialData: CmsData = { categories: defaultCategories, galleryImages: defaultGalleryImages };
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
