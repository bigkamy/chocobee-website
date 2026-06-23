type WhatsAppOrderPayload = {
  name: string;
  phone: string;
  cake: string;
  message: string;
};

function cleanValue(value: unknown) {
  return String(value ?? "").trim();
}

export function normalizeWhatsAppOrderPayload(input: unknown): WhatsAppOrderPayload {
  const payload = input as Partial<WhatsAppOrderPayload>;
  const order = {
    name: cleanValue(payload.name),
    phone: cleanValue(payload.phone),
    cake: cleanValue(payload.cake),
    message: cleanValue(payload.message),
  };

  if (!order.name || !order.phone || !order.cake || !order.message) {
    throw new Error("Name, phone, cake, and message are required.");
  }

  return order;
}

export function formatCustomCakeWhatsAppMessage(order: WhatsAppOrderPayload) {
  return [
    "New Custom Cake Order:",
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Cake: ${order.cake}`,
    `Message: ${order.message}`,
  ].join("\n");
}

function formatWhatsAppNumber(value: string) {
  const trimmed = value.trim();
  if (trimmed.startsWith("whatsapp:")) return trimmed;
  if (trimmed.startsWith("+")) return `whatsapp:${trimmed}`;
  return `whatsapp:+91${trimmed.replace(/\D/g, "")}`;
}

export async function sendCustomCakeWhatsAppOrder(order: WhatsAppOrderPayload) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.TWILIO_WHATSAPP_TO || "9999757191";

  if (!accountSid || !authToken || !from) {
    throw new Error("Twilio WhatsApp environment variables are not configured.");
  }

  const body = new URLSearchParams({
    From: formatWhatsAppNumber(from),
    To: formatWhatsAppNumber(to),
    Body: formatCustomCakeWhatsAppMessage(order),
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = (await response.json()) as { sid?: string; message?: string; code?: number };

  if (!response.ok) {
    throw new Error(data.message || "Twilio WhatsApp message failed.");
  }

  return data;
}
