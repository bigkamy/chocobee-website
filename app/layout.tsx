import type { Metadata } from "next";
import { Pacifico, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://chocobeecake.vercel.app"),
  title: "Chocobee Cake Studio",
  description:
    "Chocobee Cake Studio bakes pastel custom cakes, cupcakes, and dessert tables for joyful celebrations.",
  applicationName: "Chocobee Cake Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Chocobee Cake Studio",
    title: "Chocobee Cake Studio",
    description: "Custom cakes, cupcakes, and dessert tables for joyful celebrations.",
    url: "/",
    images: [
      {
        url: "/Images/CB_logo.png",
        width: 1200,
        height: 630,
        alt: "Chocobee Cake Studio",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Chocobee Cake Studio",
    description: "Custom cakes, cupcakes, and dessert tables for joyful celebrations.",
    images: ["/Images/CB_logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${pacifico.variable} h-full scroll-smooth antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <div className="bakery-icon-layer" aria-hidden="true">
          <span className="bakery-icon bakery-icon-cupcake bakery-icon-1" />
          <span className="bakery-icon bakery-icon-cookie bakery-icon-2" />
          <span className="bakery-icon bakery-icon-cake bakery-icon-3" />
          <span className="bakery-icon bakery-icon-whisk bakery-icon-4" />
          <span className="bakery-icon bakery-icon-rolling-pin bakery-icon-5" />
          <span className="bakery-icon bakery-icon-heart bakery-icon-6" />
          <span className="bakery-icon bakery-icon-cupcake bakery-icon-7" />
          <span className="bakery-icon bakery-icon-cookie bakery-icon-8" />
        </div>
        {children}
      </body>
    </html>
  );
}
