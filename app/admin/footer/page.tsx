import { getLocalFooterSettings } from "@/lib/local-cms";
import { BrochureManager } from "./BrochureManager";

export default async function AdminBrochurePage() {
  const settings = await getLocalFooterSettings();

  return <BrochureManager initialSettings={settings} />;
}
