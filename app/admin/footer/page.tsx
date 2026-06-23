import { getLocalFooterSettings } from "@/lib/local-cms";
import { FooterManager } from "./FooterManager";

export default async function AdminFooterPage() {
  const settings = await getLocalFooterSettings();

  return <FooterManager initialSettings={settings} />;
}
