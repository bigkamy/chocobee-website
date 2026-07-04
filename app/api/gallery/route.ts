import { NextResponse } from "next/server";
import { listLocalGalleryImages } from "@/lib/local-cms";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q");
  const sort = url.searchParams.get("sort");

  const images = await listLocalGalleryImages({ category, q, sort });

  // Return only the fields the public gallery grid actually consumes. The stored
  // image objects also carry seoTitle/metaDescription/keywords/tags/etc., which
  // are dead weight here — dropping them meaningfully shrinks the response that
  // is fetched on every gallery visit.
  const slimImages = images.map((image) => ({
    id: image.id,
    title: image.title,
    slug: image.slug,
    imageUrl: image.imageUrl,
    altText: image.altText,
    description: image.description ?? null,
    minCakeSizeKg: image.minCakeSizeKg,
    categorySlug: image.categorySlug ?? null,
    categorySlugs: image.categorySlugs ?? [],
    categoryIds: image.categoryIds ?? [],
    subcategoryCtaIds: image.subcategoryCtaIds ?? [],
    gender: image.gender ?? null,
    ageGroup: image.ageGroup ?? null,
    flavour: image.flavour ?? null,
    tier: image.tier ?? null,
  }));

  return NextResponse.json({ images: slimImages });
}
