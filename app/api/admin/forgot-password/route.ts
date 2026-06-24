import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { createResetToken, getAdminEmail } from "@/lib/admin-credentials";
import { sendAdminEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (body.response) return body.response;

  const email = String((body.data as { email?: string })?.email ?? "").trim().toLowerCase();
  const adminEmail = getAdminEmail();

  // Only send a reset link when the address matches the configured admin. We
  // always respond with the same message so the endpoint can't be used to probe
  // which address is the admin's.
  if (adminEmail && email === adminEmail) {
    const token = await createResetToken();
    const origin = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const resetUrl = `${origin.replace(/\/$/, "")}/admin/reset-password?token=${token}`;

    await sendAdminEmail({
      to: adminEmail,
      subject: "Reset your Chocobee admin password",
      text: `You requested a password reset for the Chocobee admin dashboard.\n\nReset your password using this link (valid for 1 hour):\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
      html: `<p>You requested a password reset for the <strong>Chocobee admin dashboard</strong>.</p>
<p>Reset your password using the link below (valid for 1 hour):</p>
<p><a href="${resetUrl}" style="display:inline-block;background:#be1919;color:#fff;font-weight:700;padding:10px 18px;border-radius:999px;text-decoration:none">Reset Password</a></p>
<p>Or copy this URL into your browser:<br>${resetUrl}</p>
<p style="color:#765447;font-size:13px">If you did not request this, you can safely ignore this email.</p>`,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "If that email matches an admin account, a reset link has been sent.",
  });
}
