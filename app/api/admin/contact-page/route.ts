import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { contactPageSectionSchema } from "@/lib/admin/validators";
import { createLocalContactPageSection, listAllLocalContactPageSections } from "@/lib/local-cms";

export async function GET() {
  const sections = await listAllLocalContactPageSections();
  return NextResponse.json({ items: sections, total: sections.length });
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const parsed = contactPageSectionSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await createLocalContactPageSection({
    ...parsed.data,
    eyebrow: parsed.data.eyebrow ?? null,
    subtitle: parsed.data.subtitle ?? null,
    content: parsed.data.content ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    imageAlt: parsed.data.imageAlt ?? null,
    mapEmbedUrl: parsed.data.mapEmbedUrl ?? null,
    ctaLabel: parsed.data.ctaLabel ?? null,
    ctaHref: parsed.data.ctaHref ?? null,
    status: parsed.data.status ?? "ACTIVE",
    items: parsed.data.items ?? [],
  });

  return NextResponse.json({ item }, { status: 201 });
}
