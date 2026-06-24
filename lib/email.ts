import nodemailer from "nodemailer";

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS on 465, STARTTLS otherwise
    auth: { user, pass },
  });
}

/**
 * Sends an email via SMTP (configured through SMTP_* env vars). When SMTP is not
 * configured, the message is logged to the server console instead so the flow
 * stays testable in development. Returns whether it was actually delivered.
 */
export async function sendAdminEmail({ to, subject, text, html }: SendArgs) {
  const transport = getTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@chocobee.local";

  if (!transport) {
    console.warn(`[email] SMTP not configured — email NOT sent.\n  To: ${to}\n  Subject: ${subject}\n  ${text}`);
    return { delivered: false };
  }

  await transport.sendMail({ from, to, subject, text, html });
  return { delivered: true };
}
