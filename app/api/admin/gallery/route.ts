import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { gallerySchema } from "@/lib/admin/validators";
import { createLocalGalleryImage, listAllLocalGalleryImages } from "@/lib/local-cms";

export async function GET() {
  const images = await listAllLocalGalleryImages();
  return NextResponse.json({ items: images, total: images.length });
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const parsed = gallerySchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await createLocalGalleryImage({
    ...parsed.data,
    publicId: parsed.data.publicId ?? null,
    categorySlug: null,
    featured: parsed.data.featured,
    status: parsed.data.status ?? "ACTIVE",
  });

  return NextResponse.json({ item }, { status: 201 });
}
