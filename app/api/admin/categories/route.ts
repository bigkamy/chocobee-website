import { NextResponse } from "next/server";
import { categorySchema } from "@/lib/admin/validators";
import { createLocalCategory, listLocalCategories } from "@/lib/local-cms";

export async function GET() {
  const categories = await listLocalCategories();
  return NextResponse.json({ items: categories, total: categories.length });
}

export async function POST(request: Request) {
  const parsed = categorySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const category = await createLocalCategory({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    displayOrder: parsed.data.displayOrder,
    status: parsed.data.status ?? "ACTIVE",
  });

  return NextResponse.json({ item: category }, { status: 201 });
}
