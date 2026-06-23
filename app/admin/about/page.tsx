import { listAllLocalAboutPageSections } from "@/lib/local-cms";
import { AboutPageManager } from "./AboutPageManager";

export default async function AdminAboutPage() {
  const sections = await listAllLocalAboutPageSections();
  return <AboutPageManager initialSections={sections} />;
}
