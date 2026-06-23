import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/api-json";
import { normalizeWhatsAppOrderPayload, sendCustomCakeWhatsAppOrder } from "@/lib/twilio-whatsapp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);
    if (body.response) return body.response;

    const order = normalizeWhatsAppOrderPayload(body.data);
    const result = await sendCustomCakeWhatsAppOrder(order);

    return NextResponse.json({
      ok: true,
      sid: result.sid,
      message: "Your order has been sent successfully!",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send WhatsApp order.";
    const status = message.includes("required") ? 400 : 500;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
