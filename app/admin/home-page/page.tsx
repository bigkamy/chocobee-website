import { listAllLocalHomePageSections } from "@/lib/local-cms";
import { HomePageManager } from "./HomePageManager";

export default async function AdminHomePagePage() {
  const sections = await listAllLocalHomePageSections();

  return <HomePageManager initialSections={sections} />;
}
