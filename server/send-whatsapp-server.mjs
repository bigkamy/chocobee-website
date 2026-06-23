import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.WHATSAPP_SERVER_PORT || 4000);

app.use(cors({ origin: process.env.WHATSAPP_CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

function cleanValue(value) {
  return String(value || "").trim();
}

function normalizePayload(input) {
  const order = {
    name: cleanValue(input.name),
    phone: cleanValue(input.phone),
    cake: cleanValue(input.cake),
    message: cleanValue(input.message),
  };

  if (!order.name || !order.phone || !order.cake || !order.message) {
    const error = new Error("Name, phone, cake, and message are required.");
    error.statusCode = 400;
    throw error;
  }

  return order;
}

function formatWhatsAppMessage(order) {
  return [
    "New Custom Cake Order:",
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Cake: ${order.cake}`,
    `Message: ${order.message}`,
  ].join("\n");
}

function formatWhatsAppNumber(value) {
  const trimmed = cleanValue(value);
  if (trimmed.startsWith("whatsapp:")) return trimmed;
  if (trimmed.startsWith("+")) return `whatsapp:${trimmed}`;
  return `whatsapp:+91${trimmed.replace(/\D/g, "")}`;
}

async function sendWhatsApp(order) {
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
    Body: formatWhatsAppMessage(order),
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Twilio WhatsApp message failed.");
  }

  return data;
}

app.post("/send-whatsapp", async (request, response) => {
  try {
    const order = normalizePayload(request.body);
    const result = await sendWhatsApp(order);

    response.json({
      ok: true,
      sid: result.sid,
      message: "Your order has been sent successfully!",
    });
  } catch (error) {
    response.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || "Unable to send WhatsApp order.",
    });
  }
});

app.listen(port, () => {
  console.log(`WhatsApp order server running on http://localhost:${port}`);
});
