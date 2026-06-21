import { NextResponse } from "next/server";
import { listLocalCategories } from "@/lib/local-cms";

export async function GET() {
  const categories = await listLocalCategories({ activeOnly: true });

  return NextResponse.json({ categories });
}
