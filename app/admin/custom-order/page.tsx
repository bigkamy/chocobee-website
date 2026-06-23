import { getLocalCustomOrderSettings } from "@/lib/local-cms";
import { CustomOrderManager } from "./CustomOrderManager";

export default async function AdminCustomOrderPage() {
  const settings = await getLocalCustomOrderSettings();

  return <CustomOrderManager initialSettings={settings} />;
}
