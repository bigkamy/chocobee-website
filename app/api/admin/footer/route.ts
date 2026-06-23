import { NextResponse } from "next/server";
import { footerSettingsSchema } from "@/lib/admin/validators";
import { getLocalFooterSettings, updateLocalFooterSettings } from "@/lib/local-cms";

export async function GET() {
  const item = await getLocalFooterSettings();
  return NextResponse.json({ item });
}

export async function PATCH(request: Request) {
  const parsed = footerSettingsSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const item = await updateLocalFooterSettings(parsed.data);
  return NextResponse.json({ item });
}
