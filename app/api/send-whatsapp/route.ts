import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { BUSINESS_EMAIL, sendAdminEmail } from "@/lib/email";
import { normalizeWhatsAppOrderPayload, sendCustomCakeWhatsAppOrder } from "@/lib/twilio-whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Receives a custom cake order. Email is the guaranteed delivery channel; the
// Twilio WhatsApp message is a best-effort extra. This ships with the Amplify
// app, replacing the old standalone Express server.
export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    if (body.response) return body.response;

    const order = normalizeWhatsAppOrderPayload(body.data);

    // Email is the guaranteed delivery channel for every order.
    await sendAdminEmail({
      to: BUSINESS_EMAIL,
      subject: `New custom cake order — ${order.name}`,
      text: order.message,
      html: `<h2 style="font-family:sans-serif;color:#5d4037">New custom cake order</h2>
<pre style="font-family:sans-serif;font-size:14px;color:#3a211a;white-space:pre-wrap">${escapeHtml(order.message)}</pre>`,
    });

    // WhatsApp is a best-effort extra channel — never fail the order if Twilio
    // isn't configured, since the email above already captured the request.
    let sid: string | undefined;
    try {
      const result = await sendCustomCakeWhatsAppOrder(order);
      sid = result.sid;
    } catch (whatsappError) {
      console.warn(
        "[order] WhatsApp delivery skipped:",
        whatsappError instanceof Error ? whatsappError.message : whatsappError,
      );
    }

    return NextResponse.json({
      ok: true,
      sid,
      message: "Your order has been sent successfully!",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send your order.";
    const status = message.includes("required") ? 400 : 500;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
