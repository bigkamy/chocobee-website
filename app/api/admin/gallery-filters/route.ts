import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { getGalleryFilterFields, setGalleryFilterFields } from "@/lib/local-cms";

export async function GET() {
  const fields = await getGalleryFilterFields();
  return NextResponse.json({ fields });
}

export async function PUT(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const data = body.data as { fields?: unknown };
  const fields = Array.isArray(data.fields) ? data.fields.filter((field): field is string => typeof field === "string") : [];
  const saved = await setGalleryFilterFields(fields);
  return NextResponse.json({ fields: saved });
}
