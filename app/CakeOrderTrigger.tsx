"use client";

import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import type { CakeOrderGalleryImage } from "./CakeOrderModal";
import type { CmsCustomOrderSettings } from "@/lib/local-cms";

// Load the ~500-line order modal (image upload, gallery picker, form) only
// after the trigger is first clicked, keeping it out of every page's first load.
const CakeOrderModal = dynamic(() => import("./CakeOrderModal").then((mod) => mod.CakeOrderModal), { ssr: false });

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
  const [everOpened, setEverOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setEverOpened(true);
          setOpen(true);
        }}
      >
        {children}
      </button>
      {everOpened ? (
        <CakeOrderModal open={open} onClose={() => setOpen(false)} galleryImages={galleryImages} settings={settings} />
      ) : null}
    </>
  );
}
