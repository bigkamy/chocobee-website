import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { resetPasswordWithToken } from "@/lib/admin-credentials";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const data = (body.data as { token?: string; password?: string }) ?? {};
  const token = String(data.token ?? "").trim();
  const password = String(data.password ?? "");

  if (!token) {
    return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 422 });
  }

  const success = await resetPasswordWithToken(token, password);
  if (!success) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "Password updated. You can now sign in." });
}
