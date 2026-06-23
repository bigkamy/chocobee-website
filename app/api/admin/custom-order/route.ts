import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { customOrderSettingsSchema } from "@/lib/admin/validators";
import { getLocalCustomOrderSettings, updateLocalCustomOrderSettings } from "@/lib/local-cms";

export async function GET() {
  const item = await getLocalCustomOrderSettings();
  return NextResponse.json({ item });
}

export async function PATCH(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const parsed = customOrderSettingsSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await updateLocalCustomOrderSettings(parsed.data);
  return NextResponse.json({ item });
}
