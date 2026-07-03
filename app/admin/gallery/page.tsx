import { GalleryManager } from "./GalleryManager";
import { getGalleryFilterFields, listAllLocalGalleryImages, listLocalCategories } from "@/lib/local-cms";

export default async function AdminGalleryPage() {
  const [categories, images, filterFields] = await Promise.all([
    listLocalCategories({ activeOnly: true }),
    listAllLocalGalleryImages(),
    getGalleryFilterFields(),
  ]);

  return <GalleryManager initialCategories={categories} initialImages={images} initialFilterFields={filterFields} />;
}
