import { NextResponse } from "next/server";
import { gallerySchema } from "@/lib/admin/validators";
import { deleteLocalGalleryImage, updateLocalGalleryImage } from "@/lib/local-cms";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = gallerySchema.partial().safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await updateLocalGalleryImage(id, parsed.data);
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteLocalGalleryImage(id);
  return NextResponse.json({ ok: true });
}
