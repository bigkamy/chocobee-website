import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AdminNav } from "./AdminNav";

const inter = Inter({
  variable: "--font-admin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin Panel | Chocobee Cake Studio",
  description: "Secure backend management system for Chocobee Cake Studio.",
};

// The admin panel must always reflect live CMS data from Postgres. Without this,
// Next.js prerenders these pages at build time and freezes them on the seed
// content (e.g. the gallery list showing only the 3 default cakes), even though
// the database and public site already have the latest images.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`admin-shell ${inter.variable}`}>
      <AdminNav />
      <div className="admin-main">{children}</div>
    </div>
  );
}
