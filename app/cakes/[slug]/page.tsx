import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/app/Breadcrumb";
import { Footer } from "@/app/Footer";
import { NavBar } from "@/app/NavBar";
import { getLocalGalleryImageBySlug } from "@/lib/local-cms";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cake = await getLocalGalleryImageBySlug(slug);

  if (!cake) {
    return {
      title: "Cake Design Not Found | Chocobee Cake Studio",
    };
  }

  return {
    title: cake.seoTitle || `${cake.title} | Chocobee Cake Studio`,
    description: cake.metaDescription || cake.description || `View ${cake.title} by Chocobee Cake Studio.`,
    keywords: cake.keywords || cake.tags || undefined,
    openGraph: {
      title: cake.seoTitle || cake.title,
      description: cake.metaDescription || cake.description || undefined,
      images: [{ url: cake.imageUrl, alt: cake.altText }],
    },
  };
}

export default async function CakeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cake = await getLocalGalleryImageBySlug(slug);

  if (!cake) notFound();

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#fff5f0] px-5 pb-16 pt-44 text-[#5d4037] sm:px-8 lg:px-10 lg:pt-48">
        <div className="mx-auto mb-8 max-w-6xl">
          <Breadcrumb items={[{ label: "Gallery", href: "/gallery" }, { label: cake.title }]} />
        </div>
        <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div className="relative min-h-[32rem] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(93,64,55,0.14)]">
            <Image src={cake.imageUrl} alt={cake.altText} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>

          <div>
            <Link href="/gallery" className="text-sm font-extrabold text-[#be1919]">
              Back to Gallery
            </Link>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.3em] text-[#be1919]">Cake Design</p>
            <h1 className="mt-3 font-heading text-5xl leading-tight text-[#5d4037] sm:text-6xl">{cake.title}</h1>
            <p className="mt-5 text-base leading-8 text-[#765447]">{cake.description}</p>

            {cake.tags ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {cake.tags.split(",").map((tag) => (
                  <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#be1919] shadow-sm">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#be1919] px-7 text-sm font-extrabold text-white">
                Enquire About This Cake
              </Link>
              <a href="https://wa.me/910000000000" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-7 text-sm font-extrabold text-white">
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
