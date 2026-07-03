import { NextResponse } from "next/server";
import { getGalleryFilterFields } from "@/lib/local-cms";

export async function GET() {
  const fields = await getGalleryFilterFields();
  return NextResponse.json({ fields });
}
