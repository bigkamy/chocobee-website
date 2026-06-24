import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { reviewSchema } from "@/lib/admin/validators";
import { deleteLocalReview, updateLocalReview } from "@/lib/local-cms";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const parsed = reviewSchema.partial().safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await updateLocalReview(id, parsed.data);
  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteLocalReview(id);
  return NextResponse.json({ ok: true });
}
