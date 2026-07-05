import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { S3_BUCKET, S3_PUBLIC_BASE_URL, getS3Client, isS3Configured } from "@/lib/s3";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const keyPrefix = "cakes/";
const docKeyPrefix = "brochure/";
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const allowedDocTypes = new Set(["application/pdf"]);
const maxUploadBytes = 5 * 1024 * 1024;
const maxDocBytes = 25 * 1024 * 1024;

function getSafeExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) return extension;
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  return ".jpg";
}

// Sanitizes an uploaded file name for use in a Content-Disposition header so the
// brochure downloads with a readable name rather than the random S3 key.
function getSafeFileName(file: File) {
  const base = path.basename(file.name).replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
  return base && base.toLowerCase().endsWith(".pdf") ? base : `${base || "brochure"}.pdf`;
}

// Resolves the S3 object key from a stored asset URL. Accepts the full public
// URL or a bare "cakes/<file>" / "brochure/<file>" key, and only ever returns
// keys under one of our known prefixes.
function resolveObjectKey(imageUrl: string) {
  let pathname = imageUrl;

  if (S3_PUBLIC_BASE_URL && imageUrl.startsWith(S3_PUBLIC_BASE_URL)) {
    pathname = imageUrl.slice(S3_PUBLIC_BASE_URL.length);
  } else if (/^https?:\/\//.test(imageUrl)) {
    try {
      pathname = new URL(imageUrl).pathname;
    } catch {
      return null;
    }
  }

  pathname = pathname.replace(/^\/+/, "");
  return pathname.startsWith(keyPrefix) || pathname.startsWith(docKeyPrefix) ? pathname : null;
}

export async function POST(request: Request) {
  if (!isS3Configured()) {
    return NextResponse.json({ error: "Image storage is not configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Please select a file." }, { status: 422 });
  }

  const isPdf = allowedDocTypes.has(file.type);

  if (!allowedImageTypes.has(file.type) && !isPdf) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, GIF images or PDF files are allowed." }, { status: 422 });
  }

  if (isPdf && file.size > maxDocBytes) {
    return NextResponse.json({ error: "PDF must be 25MB or smaller." }, { status: 422 });
  }

  if (!isPdf && file.size > maxUploadBytes) {
    return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 422 });
  }

  const key = isPdf
    ? `${docKeyPrefix}${Date.now()}-${randomUUID()}.pdf`
    : `${keyPrefix}${Date.now()}-${randomUUID()}${getSafeExtension(file)}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await getS3Client().send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: bytes,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
      // Force PDFs to download with a readable filename instead of opening inline
      // under the random object key.
      ContentDisposition: isPdf ? `attachment; filename="${getSafeFileName(file)}"` : undefined,
    }),
  );

  const url = `${S3_PUBLIC_BASE_URL}/${key}`;
  // Return `url` for PDF callers and keep `imageUrl` for existing image callers.
  return NextResponse.json({ url, imageUrl: url, fileName: isPdf ? getSafeFileName(file) : undefined }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!isS3Configured()) {
    return NextResponse.json({ ok: true });
  }

  const body = (await request.json().catch(() => null)) as { imageUrl?: string } | null;
  const key = body?.imageUrl ? resolveObjectKey(body.imageUrl) : null;

  if (!key) {
    return NextResponse.json({ ok: true });
  }

  await getS3Client()
    .send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }))
    .catch(() => undefined);

  return NextResponse.json({ ok: true });
}
