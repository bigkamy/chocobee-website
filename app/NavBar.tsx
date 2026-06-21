"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5V20h-5v-5.5H9V20H4Z" />
      </svg>
    ),
  },
  {
    label: "Cakes",
    href: "#treats",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 11h10l-1 9H8Z" />
        <path d="M8 11c0-3 1.8-5 4-5s4 2 4 5M10 6.3 12 3l2 3.3" />
      </svg>
    ),
  },
  {
    label: "Why Us",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
      </svg>
    ),
  },
  {
    label: "Contact",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16v11H4Z" />
        <path d="m4 8 8 6 8-6" />
      </svg>
    ),
  },
];

export function NavBar() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-navbar");

    const updateHeader = () => {
      const shouldShrink = window.scrollY > 12;

      setHasScrolled(shouldShrink);
      header?.classList.toggle("site-navbar-scrolled", shouldShrink);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { capture: true, passive: true });

    return () => window.removeEventListener("scroll", updateHeader, { capture: true });
  }, []);

  return (
    <header
      className={`site-navbar transition-all duration-300 ${
        hasScrolled
          ? "border-b border-[#ffcfda] bg-[#FFF5F0]/88 shadow-[0_8px_28px_rgba(93,64,55,0.08)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="logo-color-band" aria-hidden="true" />
      <nav
        className={`site-navbar-inner mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8 lg:px-10 ${
          hasScrolled ? "min-h-20 py-2" : "min-h-32 py-3"
        }`}
      >
        <a href="#home" className="flex min-w-0 items-center gap-3" aria-label="Chocobee Cake Studio home">
          <span className={`nav-logo-frame ${hasScrolled ? "nav-logo-frame-scrolled" : ""}`}>
            <Image
              src="/Images/CB_logo.png"
              alt=""
              width={1168}
              height={864}
              priority
              className="nav-logo-image"
            />
          </span>
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href ?? `#${item.label === "Home" ? "home" : item.label.toLowerCase().replace(" ", "-")}`}
              className="nav-menu-link text-sm font-semibold text-[#5D4037] transition hover:text-[#c87488]"
            >
              <span className="nav-menu-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className={`site-navbar-cta rounded-full bg-[#be1919] text-sm font-bold text-white shadow-[0_12px_22px_rgba(190,25,25,0.28)] transition hover:-translate-y-0.5 hover:bg-[#a91515] ${
            hasScrolled ? "px-3 py-2 sm:px-4" : "px-4 py-2.5 sm:px-5"
          }`}
        >
          <span className="nav-menu-icon nav-cta-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M7 10h10l-1 10H8Z" />
              <path d="M8 10c0-3 1.8-5 4-5s4 2 4 5" />
              <path d="M12 5V3M9.5 7 8 5.5M14.5 7 16 5.5" />
            </svg>
          </span>
          Custom Orders
        </a>
      </nav>
    </header>
  );
}
