"use client";

import { useEffect } from "react";
import { DAILY_ENQUIRY_LIMIT } from "@/lib/enquiry-limit";

export function EnquiryLimitModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="enquiry-limit-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-limit-title"
      onClick={onClose}
    >
      <div className="enquiry-limit-card" onClick={(event) => event.stopPropagation()}>
        <span className="enquiry-limit-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 3 2 20h20L12 3Z" />
            <path d="M12 10v4" />
            <path d="M12 17h.01" />
          </svg>
        </span>
        <h3 id="enquiry-limit-title">Daily enquiry limit reached</h3>
        <p>
          You can send up to {DAILY_ENQUIRY_LIMIT} cake enquiries on WhatsApp per day. You&apos;ve reached today&apos;s
          limit — please try again tomorrow.
        </p>
        <button type="button" className="enquiry-limit-close" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
