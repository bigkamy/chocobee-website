"use client";

import { CakeOrderGalleryImage } from "./CakeOrderModal";
import { CakeOrderTrigger } from "./CakeOrderTrigger";
import type { CmsCustomOrderSettings } from "@/lib/local-cms";

function isCustomOrderAction(label?: string | null, href?: string | null) {
  const value = `${label ?? ""} ${href ?? ""}`.toLowerCase();
  return value.includes("custom") || value.includes("order");
}

export function HeroOrderActions({
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  galleryImages,
  customOrderSettings,
}: {
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  galleryImages: CakeOrderGalleryImage[];
  customOrderSettings?: CmsCustomOrderSettings;
}) {
  const primaryClass =
    "inline-flex min-h-12 items-center justify-center rounded-full bg-[#be1919] px-8 text-sm font-bold text-white shadow-[0_18px_30px_rgba(190,25,25,0.28)] transition hover:-translate-y-1 hover:bg-[#a91515]";
  const secondaryClass =
    "inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#be1919] bg-white/55 px-8 text-sm font-bold text-[#be1919] transition hover:-translate-y-1 hover:bg-[#fff2ba]";

  return (
    <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:gap-7 md:items-start">
      {isCustomOrderAction(primaryLabel, primaryHref) ? (
        <CakeOrderTrigger className={primaryClass} galleryImages={galleryImages} settings={customOrderSettings}>
          {primaryLabel ?? "Custom Orders"}
        </CakeOrderTrigger>
      ) : (
        <a href={primaryHref ?? "/about"} className={primaryClass}>
          {primaryLabel ?? "Know More"}
        </a>
      )}

      {isCustomOrderAction(secondaryLabel, secondaryHref) ? (
        <CakeOrderTrigger className={secondaryClass} galleryImages={galleryImages} settings={customOrderSettings}>
          {secondaryLabel ?? "Custom Orders"}
        </CakeOrderTrigger>
      ) : (
        <a href={secondaryHref ?? "/gallery"} className={secondaryClass}>
          {secondaryLabel ?? "Explore our Treat"}
        </a>
      )}
    </div>
  );
}
