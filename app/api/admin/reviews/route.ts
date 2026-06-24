import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { reviewSchema } from "@/lib/admin/validators";
import { createLocalReview, listLocalReviews } from "@/lib/local-cms";

export async function GET() {
  const reviews = await listLocalReviews();
  return NextResponse.json({ items: reviews, total: reviews.length });
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const parsed = reviewSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const review = await createLocalReview({
    name: parsed.data.name,
    text: parsed.data.text,
    rating: parsed.data.rating,
    date: parsed.data.date,
    displayOrder: parsed.data.displayOrder,
    status: parsed.data.status ?? "ACTIVE",
  });

  return NextResponse.json({ item: review }, { status: 201 });
}
