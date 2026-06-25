// Single source of truth for building WhatsApp cake-enquiry messages and links.
// Used by the reusable <WhatsAppEnquiryButton /> so every cake surface stays consistent.

export const STUDIO_WHATSAPP_NUMBER = "919999757191";

export type CakeEnquiry = {
  cakeTitle: string;
  cakeUrl?: string | null;
  category?: string | null;
  subCategory?: string | null;
  imageUrl?: string | null;
  description?: string | null;
};

/** Build the formatted WhatsApp enquiry message for a cake. Optional fields are omitted when empty. */
export function buildCakeWhatsAppMessage(cake: CakeEnquiry): string {
  const lines: string[] = [
    "🎂 Hello Chocobee Cake Studio,",
    "",
    "I am interested in this cake.",
    "",
    "🍰 Cake Name:",
    cake.cakeTitle,
  ];

  if (cake.category) lines.push("", "📂 Category:", cake.category);
  if (cake.subCategory) lines.push("", "🏷 Sub Category:", cake.subCategory);
  if (cake.cakeUrl) lines.push("", "🔗 Cake URL:", cake.cakeUrl);
  if (cake.imageUrl) lines.push("", "🖼 Cake Image:", cake.imageUrl);
  if (cake.description) lines.push("", "📝 Description:", cake.description);

  lines.push(
    "",
    "I would like to know:",
    "",
    "• Price",
    "• Available Weight Options",
    "• Available Flavours",
    "• Delivery Availability",
    "",
    "Please contact me.",
    "",
    "Thank you.",
  );

  return lines.join("\n");
}

/** Build the full wa.me link with the encoded enquiry message. */
export function buildCakeWhatsAppLink(cake: CakeEnquiry): string {
  return `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildCakeWhatsAppMessage(cake))}`;
}

/** Resolve the absolute cake page URL from a slug (falls back to the current page). */
export function resolveCakeUrl(slug?: string | null): string {
  if (typeof window === "undefined") return slug ? `/cakes/${slug}` : "";
  if (slug) return `${window.location.origin}/cakes/${slug}`;
  return window.location.href;
}

type WhatsAppAnalyticsWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
};

/** Emit an analytics signal for a WhatsApp cake enquiry (CustomEvent + dataLayer + gtag when available). */
export function trackWhatsAppEnquiry(data: { cakeTitle: string; cakeSlug?: string | null }) {
  if (typeof window === "undefined") return;

  const detail = { event: "whatsapp_enquiry", cakeTitle: data.cakeTitle, cakeSlug: data.cakeSlug ?? null };
  const w = window as WhatsAppAnalyticsWindow;

  window.dispatchEvent(new CustomEvent("cake:whatsapp-enquiry", { detail }));
  if (Array.isArray(w.dataLayer)) w.dataLayer.push(detail);
  if (typeof w.gtag === "function") w.gtag("event", "whatsapp_enquiry", detail);
}
