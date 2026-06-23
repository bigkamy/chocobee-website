import { NextResponse } from "next/server";
import { homePageSectionSchema } from "@/lib/admin/validators";
import { createLocalHomePageSection, listAllLocalHomePageSections } from "@/lib/local-cms";

export async function GET() {
  const sections = await listAllLocalHomePageSections();
  return NextResponse.json({ items: sections, total: sections.length });
}

export async function POST(request: Request) {
  const parsed = homePageSectionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await createLocalHomePageSection({
    ...parsed.data,
    subtitle: parsed.data.subtitle ?? null,
    content: parsed.data.content ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    imageAlt: parsed.data.imageAlt ?? null,
    ctaLabel: parsed.data.ctaLabel ?? null,
    ctaHref: parsed.data.ctaHref ?? null,
    secondaryCtaLabel: parsed.data.secondaryCtaLabel ?? null,
    secondaryCtaHref: parsed.data.secondaryCtaHref ?? null,
    categoryCards: parsed.data.categoryCards ?? [],
    whyCards: parsed.data.whyCards ?? [],
    status: parsed.data.status ?? "ACTIVE",
  });

  return NextResponse.json({ item }, { status: 201 });
}
