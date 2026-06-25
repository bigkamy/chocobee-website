import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readJsonBody } from "@/lib/api-json";
import { BUSINESS_EMAIL, sendAdminEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function GET() {
  const contact = await prisma.contactSetting.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ contact });
}

type ContactEntry = { label: string; value: string };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    if (body.response) return body.response;

    const data = body.data as { entries?: ContactEntry[]; replyTo?: string } | null;
    const entries = (data?.entries ?? [])
      .map((entry) => ({ label: String(entry?.label ?? "").trim(), value: String(entry?.value ?? "").trim() }))
      .filter((entry) => entry.label && entry.value);

    if (!entries.length) {
      return NextResponse.json({ ok: false, error: "Please fill in the form before submitting." }, { status: 400 });
    }

    const replyToRaw = String(data?.replyTo ?? "").trim();
    const replyTo = isValidEmail(replyToRaw) ? replyToRaw : undefined;

    const text = ["New contact form submission", "", ...entries.map((entry) => `${entry.label}: ${entry.value}`)].join("\n");
    const html = `<h2 style="font-family:sans-serif;color:#5d4037">New contact form submission</h2>
<table style="font-family:sans-serif;border-collapse:collapse">
${entries
      .map(
        (entry) =>
          `<tr><td style="padding:6px 12px;font-weight:700;color:#5d4037;vertical-align:top">${escapeHtml(entry.label)}</td><td style="padding:6px 12px;color:#3a211a;white-space:pre-wrap">${escapeHtml(entry.value)}</td></tr>`,
      )
      .join("\n")}
</table>`;

    const result = await sendAdminEmail({
      to: BUSINESS_EMAIL,
      subject: "New contact form submission — Chocobee",
      text,
      html,
      replyTo,
    });

    return NextResponse.json({ ok: true, delivered: result.delivered });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send your message.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
