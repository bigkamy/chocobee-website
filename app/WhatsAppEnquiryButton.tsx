"use client";

import { useState } from "react";
import { hasReachedEnquiryLimit, recordEnquiry } from "@/lib/enquiry-limit";
import { buildCakeWhatsAppLink, resolveCakeUrl, trackWhatsAppEnquiry, type CakeEnquiry } from "@/lib/whatsapp";
import { EnquiryLimitModal } from "./EnquiryLimitModal";

type WhatsAppEnquiryButtonProps = {
  cakeTitle: string;
  cakeSlug?: string | null;
  category?: string | null;
  subCategory?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  /** "icon" = compact round button for cake-card action rows, "button" = full labelled CTA. */
  variant?: "icon" | "button";
  /** Stretch to full width (used for the prominent detail-page CTA, full-width on mobile). */
  block?: boolean;
  label?: string;
  className?: string;
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.93.5 3.74 1.4 5.32L2 22l4.97-1.55a9.8 9.8 0 0 0 5.07 1.39h.01c5.43 0 9.84-4.4 9.84-9.84S17.47 2 12.04 2Zm0 17.9h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.05.95.98-2.97-.2-.31a8.07 8.07 0 0 1-1.24-4.31c0-4.47 3.64-8.1 8.12-8.1a8.07 8.07 0 0 1 8.1 8.11c0 4.48-3.64 8.12-8.1 8.12Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2.01 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.57.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

export function WhatsAppEnquiryButton({
  cakeTitle,
  cakeSlug,
  category,
  subCategory,
  imageUrl,
  description,
  variant = "button",
  block = false,
  label = "Enquire on WhatsApp",
  className = "",
}: WhatsAppEnquiryButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  function openWhatsApp() {
    if (isOpening) return; // prevent duplicate clicks while WhatsApp opens

    // Enforce the daily per-browser enquiry limit.
    if (hasReachedEnquiryLimit()) {
      setShowLimitWarning(true);
      return;
    }

    setIsOpening(true);
    recordEnquiry();

    const enquiry: CakeEnquiry = {
      cakeTitle,
      cakeUrl: resolveCakeUrl(cakeSlug),
      category,
      subCategory,
      imageUrl,
      description,
    };

    trackWhatsAppEnquiry({ cakeTitle, cakeSlug });
    window.open(buildCakeWhatsAppLink(enquiry), "_blank", "noopener,noreferrer");

    window.setTimeout(() => setIsOpening(false), 1200);
  }

  const classes = [
    variant === "icon" ? "wa-enquiry wa-enquiry-icon" : "wa-enquiry wa-enquiry-button",
    block ? "wa-enquiry-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        type="button"
        onClick={openWhatsApp}
        disabled={isOpening}
        title="Ask about this cake on WhatsApp"
        aria-label={`Ask about ${cakeTitle} on WhatsApp`}
        className={classes}
      >
        <WhatsAppIcon />
        {variant === "button" ? <span>{label}</span> : null}
      </button>
      {showLimitWarning ? <EnquiryLimitModal onClose={() => setShowLimitWarning(false)} /> : null}
    </>
  );
}
