import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { categorySchema } from "@/lib/admin/validators";
import { createLocalCategory, listLocalCategories } from "@/lib/local-cms";

export async function GET() {
  const categories = await listLocalCategories();
  return NextResponse.json({ items: categories, total: categories.length });
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const parsed = categorySchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const category = await createLocalCategory({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    subcategoryCtas: parsed.data.subcategoryCtas,
    displayOrder: parsed.data.displayOrder,
    status: parsed.data.status ?? "ACTIVE",
  });

  return NextResponse.json({ item: category }, { status: 201 });
}
