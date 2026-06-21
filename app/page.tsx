import Image from "next/image";
import { CategoriesSection } from "./CategoriesSection";
import { NavBar } from "./NavBar";
import { ReviewsSection } from "./ReviewsSection";

const whyChooseUs = [
  {
    title: "Baked Fresh",
    text: "Small-batch cakes, cupcakes, and fillings made with premium ingredients.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5c0-2.8 2.1-5.1 4.8-5.5.8-1.8 2.6-3 4.7-3A5.5 5.5 0 0 1 20 9.5c0 1.4-.5 2.6-1.3 3.6V20H6v-7.1c-.6-.1-1-.1-1-.4Z" />
        <path d="M8 15h8M8 18h8" />
      </svg>
    ),
  },
  {
    title: "Custom Magic",
    text: "Colors, toppers, flavors, and themes designed around your celebration.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 20 4.6-1.3L19.3 8a2.4 2.4 0 0 0-3.4-3.4L5.3 15.3 4 20Z" />
        <path d="m14 6 4 4M12 20h8" />
      </svg>
    ),
  },
  {
    title: "Party Ready",
    text: "Neat packaging, careful timing, and desserts that photograph beautifully.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v18M5 8h14v12H5zM4 8c0-1.7 1.3-3 3-3 2 0 3.1 3 5 3 1.9 0 3-3 5-3 1.7 0 3 1.3 3 3" />
      </svg>
    ),
  },
];

const treats = [
  {
    eyebrow: "Signature cakes",
    title: "Celebration cakes with soft buttercream swirls",
    text: "From pastel birthday layers to elegant anniversary cakes, every design is made to feel personal, polished, and joyfully sweet.",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1100&q=85",
    alt: "Pink celebration cake with buttercream and candles",
  },
  {
    eyebrow: "Cupcake boxes",
    title: "Cupcakes dressed for gifting, parties, and tiny cravings",
    text: "Choose classic vanilla, double chocolate, strawberry cream, or a mixed box with honey-gold sprinkles and custom toppers.",
    image:
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1100&q=85",
    alt: "Decorated cupcakes with pink frosting",
    reverse: true,
  },
  {
    eyebrow: "Dessert tables",
    title: "Sweet spreads that make every table glow",
    text: "Mini cakes, cookies, cake pops, and bite-size pastries styled into a soft, cohesive dessert moment for your event.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1100&q=85",
    alt: "Pastel dessert table with small cakes and sweets",
  },
];

function DecorativeSprinkles() {
  return (
    <div className="sprinkle-field" aria-hidden="true">
      <span className="dot dot-one" />
      <span className="dot dot-two" />
      <span className="dot dot-three" />
      <span className="dot dot-four" />
      <span className="star star-one" />
      <span className="star star-two" />
      <span className="crumb crumb-one" />
      <span className="crumb crumb-two" />
      <span className="crumb crumb-three" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="site-shell min-h-screen overflow-hidden text-[#5D4037]">
      <DecorativeSprinkles />

      <NavBar />

      <section id="home" className="relative pt-28 sm:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-0 sm:px-8 md:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-0">
          <div className="reveal relative z-10 mx-auto max-w-2xl text-center md:mx-0 md:text-left">
            <h1 className="font-heading text-[2.35rem] leading-[0.95] text-[#5D4037] sm:text-[3.35rem] lg:text-[4.1rem]">
              <span className="whitespace-nowrap">Meet the Chef</span>
              <br />
              <span className="whitespace-nowrap text-[#be1919]">Neha Panwar</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#715044] sm:text-lg md:mx-0">
              Serving since 2013, Chef Neha Panwar has created 25,000+ unique cake designs, delighting 5,000+
              happy clients with exceptional creativity, premium quality, and a passion for crafting memorable
              celebrations truly unforgettable.
            </p>

            <div className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:gap-7 md:items-start">
              <a
                href="#treats"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#be1919] px-8 text-sm font-bold text-white shadow-[0_18px_30px_rgba(190,25,25,0.28)] transition hover:-translate-y-1 hover:bg-[#a91515]"
              >
                Explore Our Treats
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#be1919] bg-white/55 px-8 text-sm font-bold text-[#be1919] transition hover:-translate-y-1 hover:bg-[#fff2ba]"
              >
                Plan a Custom Cake
              </a>
            </div>

          </div>

          <div className="hero-image-static relative mx-auto flex w-full max-w-[640px] justify-center">
            <div className="hero-glow" aria-hidden="true" />
            <div className="floating-cupcake">
              <Image
                src="/Images/neha.png?v=2"
                alt="Chocobee Cake Studio feature"
                width={712}
                height={1058}
                priority
                sizes="(max-width: 768px) 88vw, 512px"
                className="cupcake-photo"
              />
              <span className="photo-spark photo-spark-one" aria-hidden="true" />
              <span className="photo-spark photo-spark-two" aria-hidden="true" />
              <span className="photo-spark photo-spark-three" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        <div className="reveal grid gap-4 rounded-[28px] border border-white/80 bg-white/62 p-4 shadow-[0_20px_55px_rgba(93,64,55,0.1)] backdrop-blur md:grid-cols-3">
          {whyChooseUs.map((item, index) => (
            <article key={item.title} className={`why-card why-card-${index + 1}`}>
              <span className="why-icon">{item.icon}</span>
              <div>
                <h2 className="text-base font-bold">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-[#765447]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CategoriesSection />

      <ReviewsSection />

      <section id="treats" className="relative bg-[#fffaf7] py-20">
        <div className="absolute left-[-5rem] top-20 h-56 w-56 rounded-full bg-[#FFB7C5]/20 blur-3xl" aria-hidden="true" />
        <div className="absolute right-[-4rem] bottom-32 h-64 w-64 rounded-full bg-[#FFD700]/18 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#a06b48]">Fresh from the studio</p>
            <h2 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl">
              Pretty bakes, tender crumbs, golden little details
            </h2>
          </div>

          <div className="mt-16 space-y-20">
            {treats.map((treat) => (
              <article
                key={treat.title}
                className={`reveal treat-row ${treat.reverse ? "treat-row-reverse" : ""}`}
              >
                <div className="treat-image-wrap">
                  <span className="treat-orbit" aria-hidden="true" />
                  <Image
                    src={treat.image}
                    alt={treat.alt}
                    width={1100}
                    height={900}
                    sizes="(max-width: 900px) 90vw, 496px"
                    className="treat-image"
                  />
                </div>
                <div className="treat-copy">
                  <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#a06b48]">{treat.eyebrow}</p>
                  <h3 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl">{treat.title}</h3>
                  <p className="mt-5 text-base leading-8 text-[#765447]">{treat.text}</p>
                  <a href="#contact" className="mt-7 inline-flex rounded-full bg-[#FFD700] px-6 py-3 text-sm font-bold text-[#5D4037] shadow-[0_14px_24px_rgba(255,215,0,0.28)] transition hover:-translate-y-1">
                    Order this style
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="relative bg-[#FFB7C5] pt-24 text-[#5D4037]">
        <svg
          className="absolute left-0 top-0 h-24 w-full -translate-y-[1px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 50C95 20 154 20 240 50C330 82 390 82 480 50C570 20 630 20 720 50C810 82 870 82 960 50C1050 20 1110 20 1200 50C1290 82 1350 82 1440 50V0H0V50Z"
            fill="#fffaf7"
          />
          <path
            d="M0 70C120 110 240 35 360 70C480 105 600 35 720 70C840 105 960 35 1080 70C1200 105 1320 35 1440 70V120H0V70Z"
            fill="#FFB7C5"
          />
        </svg>

        <div className="reveal mx-auto grid max-w-7xl gap-8 px-5 pb-14 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#7d4f3f]">Custom orders</p>
            <h2 className="mt-3 max-w-2xl font-heading text-4xl leading-tight sm:text-5xl">
              Tell us the flavor, theme, and date. We will bring the sweetness.
            </h2>
          </div>
          <a
            href="mailto:hello@chocobeecake.studio"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#FFD700] px-8 text-sm font-bold shadow-[0_16px_26px_rgba(93,64,55,0.18)] transition hover:-translate-y-1"
          >
            hello@chocobeecake.studio
          </a>
        </div>
      </footer>
    </main>
  );
}
