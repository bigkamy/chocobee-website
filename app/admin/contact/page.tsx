import { listAllLocalContactPageSections } from "@/lib/local-cms";
import { ContactPageManager } from "./ContactPageManager";

export default async function AdminContactPage() {
  const sections = await listAllLocalContactPageSections();
  return <ContactPageManager initialSections={sections} />;
}
