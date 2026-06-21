import { CategoriesManager } from "./CategoriesManager";
import { listLocalCategories } from "@/lib/local-cms";

export default async function AdminCategoriesPage() {
  const categories = await listLocalCategories();

  return <CategoriesManager initialCategories={categories} />;
}
