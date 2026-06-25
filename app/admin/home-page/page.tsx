import { getLocalCustomOrderSettings, listAllLocalHomePageSections, listLocalReviews } from "@/lib/local-cms";
import { HomePageManager } from "./HomePageManager";

export default async function AdminHomePagePage() {
  const sections = await listAllLocalHomePageSections();
  const customOrderSettings = await getLocalCustomOrderSettings();
  const reviews = await listLocalReviews();

  return <HomePageManager initialSections={sections} customOrderSettings={customOrderSettings} reviews={reviews} />;
}
