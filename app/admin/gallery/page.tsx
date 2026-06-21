import { GalleryManager } from "./GalleryManager";
import { listAllLocalGalleryImages, listLocalCategories } from "@/lib/local-cms";

export default async function AdminGalleryPage() {
  const [categories, images] = await Promise.all([listLocalCategories({ activeOnly: true }), listAllLocalGalleryImages()]);

  return <GalleryManager initialCategories={categories} initialImages={images} />;
}
