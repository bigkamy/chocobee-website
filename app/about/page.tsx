import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "../Breadcrumb";
import { Footer } from "../Footer";
import { NavBar } from "../NavBar";
import { listLocalAboutPageSections } from "@/lib/local-cms";
import type { CmsAboutPageSection, CmsAboutSectionItem } from "@/lib/local-cms";

export const metadata: Metadata = {
  title: "About Us | Chocobee Cake Studio",
  description:
    "Learn about Chocobee Cake Studio, Chef Neha Panwar, and our journey crafting custom designer cakes since 2013.",
};

function orderedActiveItems(items: CmsAboutSectionItem[]) {
  return items.filter((item) => item.status === "ACTIVE").sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function SectionIntro({ section, centered = false }: { section: CmsAboutPageSection; centered?: boolean }) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : ""}>
      {section.eyebrow ? <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#be1919]">{section.eyebrow}</p> : null}
      <h2 className="mt-3 font-heading text-4xl leading-tight text-[#5d4037] sm:text-5xl">{section.title}</h2>
      {section.content ? <p className="mt-4 text-base leading-8 text-[#765447]">{section.content}</p> : null}
    </div>
  );
}

function StorySection({ section }: { section: CmsAboutPageSection }) {
  const slides = orderedActiveItems(section.items);

  return (
    <section id={section.sectionKey} className="px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <SectionIntro section={section} />
          {slides.length ? (
            <div className="about-story-slider">
              <div className="about-story-slider-track">
                {slides.slice(0, 6).map((item, index) => (
                  <article key={item.id} className={`about-story-slide about-story-slide-${index + 1}`}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.imageAlt || item.title} width={900} height={1100} className="h-full w-full object-cover" />
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ChefSection({ section }: { section: CmsAboutPageSection }) {
  const stats = orderedActiveItems(section.items);

  return (
    <section id={section.sectionKey} className="bg-white/45 px-5 py-20 backdrop-blur-[1px] sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {section.imageUrl ? (
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-[#ffe8ee]">
            <Image src={section.imageUrl} alt={section.imageAlt || section.title} width={712} height={1058} className="h-auto w-full object-contain" priority />
          </div>
        ) : null}
        <div>
          <SectionIntro section={section} />
          {stats.length ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-5 text-center shadow-[0_16px_38px_rgba(93,64,55,0.08)]">
                  <strong className="block text-2xl font-black text-[#be1919]">{item.title}</strong>
                  <span className="mt-1 block text-sm font-bold text-[#765447]">{item.subtitle}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TeamSection({ section }: { section: CmsAboutPageSection }) {
  const members = orderedActiveItems(section.items);

  return (
    <section id={section.sectionKey} className="px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro section={section} centered />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <article key={member.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(93,64,55,0.1)] transition hover:-translate-y-1">
              {member.imageUrl ? <Image src={member.imageUrl} alt={member.imageAlt || member.title} width={700} height={760} className="h-72 w-full object-cover" /> : null}
              <div className="p-5 text-center">
                <h3 className="font-extrabold text-[#5d4037]">{member.title}</h3>
                {member.subtitle ? <p className="mt-1 text-sm font-bold text-[#be1919]">{member.subtitle}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const featureIconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
  "aria-hidden": true,
};

const featureIcons: Record<string, ReactNode> = {
  // Custom Designs — brush / palette
  "custom-designs": (
    <svg {...featureIconProps}>
      <path d="M4 20c0-2 1.5-3 3-3s3 1 3 3-1.5 2-3 2-3-1-3-2Z" />
      <path d="M9.5 15 20 4.5a1.8 1.8 0 0 0-2.5-2.5L7 12.5" />
    </svg>
  ),
  // Premium Ingredients — leaf
  "premium-ingredients": (
    <svg {...featureIconProps}>
      <path d="M4 20c8 1 15-4 16-16C8 3 3 10 4 20Z" />
      <path d="M4 20C7 14 11 11 16 9" />
    </svg>
  ),
  // Timely Delivery — clock
  "timely-delivery": (
    <svg {...featureIconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  ),
  // Customer Satisfaction — heart
  "customer-satisfaction": (
    <svg {...featureIconProps}>
      <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z" />
    </svg>
  ),
  // Creative Concepts — lightbulb
  "creative-concepts": (
    <svg {...featureIconProps}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </svg>
  ),
  // Hygiene & Quality — shield check
  "hygiene-quality": (
    <svg {...featureIconProps}>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

function FeatureIcon({ title }: { title: string }) {
  const key = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return featureIcons[key] ?? <CheckIcon />;
}

function FeaturesSection({ section }: { section: CmsAboutPageSection }) {
  const features = orderedActiveItems(section.items);

  return (
    <section id={section.sectionKey} className="bg-white/45 px-5 py-20 backdrop-blur-[1px] sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro section={section} centered />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.id} className="flex items-center gap-4 rounded-2xl border border-white/75 bg-white/75 p-5 shadow-[0_16px_38px_rgba(93,64,55,0.08)] transition hover:-translate-y-1">
              <span className="inline-grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[#be1919] text-white">
                <FeatureIcon title={feature.title} />
              </span>
              <h3 className="text-base font-extrabold text-[#5d4037]">{feature.title}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ section }: { section: CmsAboutPageSection }) {
  return (
    <section id={section.sectionKey} className="px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-[linear-gradient(135deg,#be1919,#7f1512)] px-6 py-12 text-center text-white shadow-[0_24px_70px_rgba(190,25,25,0.24)] sm:px-10">
        <h2 className="font-heading text-4xl leading-tight sm:text-5xl">{section.title}</h2>
        {section.content ? <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/86">{section.content}</p> : null}
        <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
          {section.ctaLabel && section.ctaHref ? (
            <Link href={section.ctaHref} className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-extrabold text-[#be1919] transition hover:-translate-y-1">
              {section.ctaLabel}
            </Link>
          ) : null}
          {section.secondaryCtaLabel && section.secondaryCtaHref ? (
            <a href={section.secondaryCtaHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-7 text-sm font-extrabold text-white transition hover:-translate-y-1">
              {section.secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ContentSection({ section }: { section: CmsAboutPageSection }) {
  return (
    <section id={section.sectionKey} className="px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        {section.imageUrl ? (
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_45px_rgba(93,64,55,0.1)]">
            <Image src={section.imageUrl} alt={section.imageAlt || section.title} width={900} height={760} className="h-auto w-full object-cover" />
          </div>
        ) : null}
        <SectionIntro section={section} />
      </div>
    </section>
  );
}

function AboutSection({ section }: { section: CmsAboutPageSection }) {
  if (section.sectionType === "story") return <StorySection section={section} />;
  if (section.sectionType === "chef") return <ChefSection section={section} />;
  if (section.sectionType === "team") return <TeamSection section={section} />;
  if (section.sectionType === "features") return <FeaturesSection section={section} />;
  if (section.sectionType === "cta") return <CtaSection section={section} />;
  return <ContentSection section={section} />;
}

export default async function AboutPage() {
  const sections = await listLocalAboutPageSections({ activeOnly: true });

  return (
    <>
      <NavBar />
      <main className="about-page-shell min-h-screen bg-[#fff5f0] pt-32 text-[#5d4037]">
        <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8 lg:px-10">
          <Breadcrumb items={[{ label: "About" }]} />
        </div>
        {sections.map((section) => (
          <AboutSection section={section} key={section.id} />
        ))}
      </main>
      <Footer />
    </>
  );
}
