import type { Metadata } from "next";
import { Breadcrumb } from "../Breadcrumb";
import { Footer } from "../Footer";
import { NavBar } from "../NavBar";
import { ContactForm } from "./ContactForm";
import { listLocalContactPageSections } from "@/lib/local-cms";
import type { CmsContactPageSection, CmsContactSectionItem } from "@/lib/local-cms";

export const metadata: Metadata = {
  title: "Contact Us | Chocobee Cake Studio",
  description:
    "Contact Chocobee Cake Studio in Crossing Republik, Ghaziabad for custom cakes, theme cakes, cupcakes, and celebration desserts.",
};

function orderedItems(items: CmsContactSectionItem[]) {
  return items.filter((item) => item.status === "ACTIVE").sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
}

function ContactIcon({ icon }: { icon?: string | null }) {
  if (icon === "address") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z" />
        <path d="M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
      </svg>
    );
  }

  if (icon === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 4.5 9 4l2 4-1.4 1.2c.9 1.8 2.3 3.2 4.1 4.1L15 12l4 2-.5 2.4c-.2.9-1 1.6-2 1.6A12.5 12.5 0 0 1 4 5.5c0-1 .7-1.8 1.6-2Z" />
      </svg>
    );
  }

  if (icon === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4Z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (icon === "hours") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 21V8l7-5 7 5v13H5Z" />
      <path d="M9 21v-7h6v7M9 10h.1M15 10h.1" />
    </svg>
  );
}

function HeroIntro({ section }: { section?: CmsContactPageSection }) {
  return (
    <div id={section?.sectionKey} className="mx-auto max-w-3xl text-center">
      {section?.eyebrow ? <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#be1919]">{section.eyebrow}</p> : null}
      <h1 className="mt-3 font-heading text-5xl leading-tight text-[#5d4037] sm:text-6xl">{section?.title || "Get in Touch"}</h1>
      {section?.content ? <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#765447]">{section.content}</p> : null}
    </div>
  );
}

function DetailCard({ section }: { section?: CmsContactPageSection }) {
  const items = orderedItems(section?.items ?? []);

  return (
    <section id={section?.sectionKey} className="rounded-[1.5rem] border border-white/75 bg-white/70 p-5 shadow-[0_24px_60px_rgba(93,64,55,0.1)] backdrop-blur md:p-7">
      <h2 className="font-heading text-3xl text-[#5d4037]">{section?.title || "Contact Details"}</h2>
      <div className="mt-5 grid gap-3">
        {items.map((detail, index) => {
          const content = (
            <>
              <span className={`contact-detail-icon contact-detail-icon-${index + 1}`}>
                <ContactIcon icon={detail.icon} />
              </span>
              <span>
                <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-[#be1919]">{detail.title}</span>
                <span className="mt-1 block text-sm font-bold text-[#5d4037]">{detail.subtitle}</span>
              </span>
            </>
          );

          return detail.href ? (
            <a href={detail.href} className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl bg-[#fff8f6] p-3 transition hover:-translate-y-0.5 hover:bg-white" key={detail.id}>
              {content}
            </a>
          ) : (
            <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl bg-[#fff8f6] p-3" key={detail.id}>
              {content}
            </div>
          );
        })}
      </div>

      {section?.ctaLabel && section.ctaHref ? (
        <a
          href={section.ctaHref}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#25d366] px-6 text-sm font-extrabold text-white shadow-[0_16px_30px_rgba(37,211,102,0.22)] transition hover:-translate-y-1"
        >
          {section.ctaLabel}
        </a>
      ) : null}
    </section>
  );
}

function MapSection({ section }: { section?: CmsContactPageSection }) {
  if (!section?.mapEmbedUrl) return null;

  return (
    <section id={section?.sectionKey} className="overflow-hidden rounded-[1.5rem] border border-white/75 bg-white/70 p-3 shadow-[0_24px_60px_rgba(93,64,55,0.1)] backdrop-blur">
      <iframe
        title={section.title || "Chocobee Cake Studio location map"}
        src={section.mapEmbedUrl}
        className="h-[22rem] w-full rounded-[1.1rem] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}

export default async function ContactPage() {
  const sections = await listLocalContactPageSections({ activeOnly: true });
  const hero = sections.find((section) => section.sectionType === "hero");
  const details = sections.find((section) => section.sectionType === "details");
  const map = sections.find((section) => section.sectionType === "map");
  const form = sections.find((section) => section.sectionType === "form");

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#fff5f0] text-[#5d4037]">
        <section className="relative overflow-hidden px-5 pb-16 pt-48 sm:px-8 lg:px-10 lg:pb-20 lg:pt-56">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,183,197,0.38),transparent_18rem),radial-gradient(circle_at_88%_10%,rgba(255,215,0,0.2),transparent_20rem)]" />
          <div className="relative mx-auto max-w-7xl">
            <Breadcrumb items={[{ label: "Contact" }]} />
            <HeroIntro section={hero} />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <DetailCard section={details} />
                <MapSection section={map} />
              </div>
              {form ? <ContactForm section={form} /> : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
