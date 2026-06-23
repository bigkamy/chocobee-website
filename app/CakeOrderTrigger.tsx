"use client";

import { ReactNode, useState } from "react";
import { CakeOrderGalleryImage, CakeOrderModal } from "./CakeOrderModal";
import type { CmsCustomOrderSettings } from "@/lib/local-cms";

export function CakeOrderTrigger({
  children,
  className,
  galleryImages,
  settings,
}: {
  children: ReactNode;
  className?: string;
  galleryImages?: CakeOrderGalleryImage[];
  settings?: CmsCustomOrderSettings;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <CakeOrderModal open={open} onClose={() => setOpen(false)} galleryImages={galleryImages} settings={settings} />
    </>
  );
}
