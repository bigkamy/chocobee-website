import { FooterClient } from "./FooterClient";
import { getLocalFooterSettings } from "@/lib/local-cms";

export async function Footer() {
  const settings = await getLocalFooterSettings();

  return <FooterClient settings={settings} />;
}
