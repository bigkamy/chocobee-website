import { NextResponse } from "next/server";
import { listLocalGalleryImages } from "@/lib/local-cms";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q");
  const sort = url.searchParams.get("sort");

  const images = await listLocalGalleryImages({ category, q, sort });

  return NextResponse.json({ images });
}
