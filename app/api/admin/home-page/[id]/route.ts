import { NextResponse } from "next/server";
import { homePageSectionSchema } from "@/lib/admin/validators";
import { deleteLocalHomePageSection, updateLocalHomePageSection } from "@/lib/local-cms";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = homePageSectionSchema.partial().safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await updateLocalHomePageSection(id, parsed.data);
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteLocalHomePageSection(id);
  return NextResponse.json({ ok: true });
}
