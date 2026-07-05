"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CakeOrderTrigger } from "./CakeOrderTrigger";
import type { CmsCustomOrderSettings } from "@/lib/local-cms";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11.5 12 5l8 6.5V20h-5v-5.5H9V20H4Z" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "/about",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20c1.1-3.5 3.8-5.3 7.5-5.3s6.4 1.8 7.5 5.3" />
      </svg>
    ),
  },
  {
    label: "Cakes & Cookies",
    href: "/gallery",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 11h10l-1 9H8Z" />
        <path d="M8 11c0-3 1.8-5 4-5s4 2 4 5M10 6.3 12 3l2 3.3" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/contact",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16v11H4Z" />
        <path d="m4 8 8 6 8-6" />
      </svg>
    ),
  },
];

export function NavBar({ customOrderSettings }: { customOrderSettings?: CmsCustomOrderSettings }) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Chocobee Cake Studio home">
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
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-menu-link text-sm font-semibold text-[#5D4037] transition hover:text-[#c87488]"
            >
              <span className="nav-menu-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CakeOrderTrigger
            settings={customOrderSettings}
            className={`site-navbar-cta rounded-full bg-[#be1919] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a91515] ${
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
          </CakeOrderTrigger>

          <button
            type="button"
            className="nav-menu-button inline-flex h-11 w-11 items-center justify-center rounded-full text-[#5D4037] transition hover:bg-[#be1919]/10 hover:text-[#be1919] md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-nav-menu"
          className="site-navbar-mobile mx-auto mt-1 max-w-7xl px-4 pb-4 md:hidden"
        >
          <nav className="flex flex-col gap-1 rounded-2xl border border-[#ffcfda] bg-[#FFF5F0]/95 p-2 shadow-[0_16px_40px_rgba(93,64,55,0.14)] backdrop-blur-xl">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#5D4037] transition hover:bg-[#be1919]/10 hover:text-[#be1919]"
              >
                <span className="nav-menu-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
