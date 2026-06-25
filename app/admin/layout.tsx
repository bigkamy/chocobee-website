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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`admin-shell ${inter.variable}`}>
      <AdminNav />
      <div className="admin-main">{children}</div>
    </div>
  );
}
