import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "../Footer";
import { NavBar } from "../NavBar";

export const metadata: Metadata = {
  title: "About Us | Chocobee Cake Studio",
  description:
    "Learn about Chocobee Cake Studio, Chef Neha Panwar, and our journey crafting custom designer cakes since 2013.",
};

const aboutSliderImages = [
  {
    title: "Designer Celebration Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Wedding Cake Finishes",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Pastel Party Cakes",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Cupcake Gift Boxes",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Chocolate Signature Cakes",
    image: "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Handcrafted Cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
  },
];

const achievements = [
  ["11+", "Years of Experience"],
  ["25,000+", "Unique Designs"],
  ["5,000+", "Happy Clients"],
];

const team = [
  {
    name: "Aarohi Sharma",
    role: "Cake Artist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Riya Kapoor",
    role: "Theme Designer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Kunal Mehra",
    role: "Customer Support",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Nisha Verma",
    role: "Delivery Coordinator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  },
];

const features = [
  "Custom Designs",
  "Premium Ingredients",
  "Timely Delivery",
  "Customer Satisfaction",
  "Creative Concepts",
  "Hygiene & Quality",
];

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

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="about-page-shell min-h-screen bg-[#fff5f0] pt-32 text-[#5d4037]">
      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#be1919]">Our Story</p>
              <h2 className="mt-3 font-heading text-4xl leading-tight text-[#5d4037] sm:text-5xl">
                Designed with care, baked with purpose.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#765447]">
                Chocobee Cake Studio has been serving sweet happiness since 2013, creating 25,000+ unique cake
                designs for 5,000+ happy clients. We specialize in custom cakes, theme cakes, designer celebration
                cakes, cupcakes, and dessert moments that feel deeply personal. Every order is treated as a story:
                your theme, your colors, your flavor memories, and the joy you want your guests to feel.
              </p>
            </div>

            <div className="about-story-slider">
              <div className="about-story-slider-track">
                {aboutSliderImages.map((item, index) => (
                  <article key={item.title} className={`about-story-slide about-story-slide-${index + 1}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={900}
                      height={1100}
                      className="h-full w-full object-cover"
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/45 px-5 py-16 backdrop-blur-[1px] sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-[#ffe8ee]">
            <Image
              src="/Images/neha.png"
              alt="Chef Neha Panwar"
              width={712}
              height={1058}
              className="h-auto w-full object-contain"
              priority
            />
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#be1919]">Meet the Chef</p>
            <h2 className="mt-3 font-heading text-4xl leading-tight text-[#5d4037] sm:text-5xl">Neha Panwar</h2>
            <p className="mt-5 text-base leading-8 text-[#765447]">
              Chef Neha Panwar leads Chocobee Cake Studio with a passion for creative storytelling through cake.
              Her journey is rooted in listening carefully to each client, translating ideas into elegant edible
              designs, and delivering cakes that taste as beautiful as they look. Her expertise in theme detailing,
              premium finishes, and customer-first service has helped make thousands of celebrations truly unforgettable.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {achievements.map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white p-5 text-center shadow-[0_16px_38px_rgba(93,64,55,0.08)]">
                  <strong className="block text-2xl font-black text-[#be1919]">{value}</strong>
                  <span className="mt-1 block text-sm font-bold text-[#765447]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#be1919]">Our Team</p>
            <h2 className="mt-3 font-heading text-4xl leading-tight text-[#5d4037] sm:text-5xl">
              Artists behind every celebration
            </h2>
            <p className="mt-4 text-base leading-8 text-[#765447]">
              Our team brings together cake artists, designers, support specialists, and delivery coordinators who
              work with care, discipline, and a shared love for beautiful celebrations.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <article key={member.name} className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(93,64,55,0.1)] transition hover:-translate-y-1">
                <Image src={member.image} alt={member.name} width={700} height={760} className="h-72 w-full object-cover" />
                <div className="p-5 text-center">
                  <h3 className="font-extrabold text-[#5d4037]">{member.name}</h3>
                  <p className="mt-1 text-sm font-bold text-[#be1919]">{member.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/45 px-5 py-16 backdrop-blur-[1px] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-[#be1919]">Why Choose Us</p>
            <h2 className="mt-3 font-heading text-4xl leading-tight text-[#5d4037] sm:text-5xl">
              Premium cakes, polished experience
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature} className="flex items-center gap-4 rounded-2xl border border-white/75 bg-white/75 p-5 shadow-[0_16px_38px_rgba(93,64,55,0.08)] transition hover:-translate-y-1">
                <span className="inline-grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[#be1919] text-white">
                  <CheckIcon />
                </span>
                <h3 className="text-base font-extrabold text-[#5d4037]">{feature}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[linear-gradient(135deg,#be1919,#7f1512)] px-6 py-12 text-center text-white shadow-[0_24px_70px_rgba(190,25,25,0.24)] sm:px-10">
          <h2 className="font-heading text-4xl leading-tight sm:text-5xl">Let&apos;s Create Something Sweet Together</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/86">
            Tell us your theme, flavor, date, and celebration mood. We will help shape it into a cake worth remembering.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-extrabold text-[#be1919] transition hover:-translate-y-1">
              Order Your Cake Now
            </Link>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#25d366] px-7 text-sm font-extrabold text-white transition hover:-translate-y-1">
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
