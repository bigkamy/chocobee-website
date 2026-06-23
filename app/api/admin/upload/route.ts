import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uploadDir = path.join(process.cwd(), "public", "uploads", "cakes");
const publicPrefix = "/uploads/cakes/";
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxUploadBytes = 5 * 1024 * 1024;

function getSafeExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) return extension;
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  return ".jpg";
}

function resolveUploadedPath(imageUrl: string) {
  if (!imageUrl.startsWith(publicPrefix)) return null;

  const fileName = path.basename(imageUrl);
  const resolved = path.resolve(uploadDir, fileName);
  const allowedRoot = path.resolve(uploadDir);
  return resolved.startsWith(allowedRoot) ? resolved : null;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please select an image file." }, { status: 422 });
  }

  if (!allowedImageTypes.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, and GIF images are allowed." }, { status: 422 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 422 });
  }

  await mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}${getSafeExtension(file)}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), bytes);

  return NextResponse.json({ imageUrl: `${publicPrefix}${fileName}` }, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { imageUrl?: string } | null;
  const uploadedPath = body?.imageUrl ? resolveUploadedPath(body.imageUrl) : null;

  if (!uploadedPath) {
    return NextResponse.json({ ok: true });
  }

  await unlink(uploadedPath).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
