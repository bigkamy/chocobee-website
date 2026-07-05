import type { Metadata } from "next";
import { Footer } from "../Footer";
import { GalleryClient } from "./GalleryClient";
import { getLocalBrochureSettings } from "@/lib/local-cms";

export const metadata: Metadata = {
  title: "Cakes & Cookies Gallery | Chocobee Cake Studio",
  description:
    "Explore Chocobee Cake Studio's premium cakes and cookies gallery, including birthday cakes, wedding cakes, kids theme cakes, designer cakes, and custom cookies.",
};

export default async function GalleryPage() {
  const brochure = await getLocalBrochureSettings();

  return (
    <>
      <GalleryClient brochureUrl={brochure.url} brochureName={brochure.name} />
      <Footer />
    </>
  );
}
