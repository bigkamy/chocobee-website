"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Cakes & Cookies", href: "/gallery" },
  { label: "Custom Orders", href: "/contact" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];
const categories = ["Wedding Cakes", "Theme Cakes", "Birthday Cakes", "Anniversary Cakes", "Cupcakes", "Kids Cakes"];
function SocialIcon({ type }: { type: "instagram" | "facebook" | "whatsapp" | "google" }) {
  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8h2V4h-2.5C10.5 4 9 5.8 9 8.4V11H7v4h2v5h4v-5h2.5l.5-4h-3V8.8c0-.5.3-.8 1-.8Z" />
      </svg>
    );
  }

  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 20l1.1-3A8 8 0 1 1 9 19.3L5 20Z" />
        <path d="M9.4 8.7c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.5-.1.7l-.4.5c-.1.2-.2.3 0 .6.5.9 1.3 1.7 2.3 2.2.3.2.5.1.6-.1l.6-.7c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .7-.6 1.5-1.3 1.7-.7.2-2 .2-4.1-1-2.4-1.4-3.9-3.8-4.1-5.2-.1-.8.2-1.4.5-1.6Z" />
      </svg>
    );
  }

  if (type === "google") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 12.2c0-.7-.1-1.3-.2-1.9H12v3.5h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h3c1.7-1.6 2.5-3.8 2.5-6.5Z" />
        <path d="M12 21c2.4 0 4.5-.8 6-2.2l-3-2.2c-.8.5-1.8.9-3 .9a5.2 5.2 0 0 1-4.9-3.6H4v2.3A9 9 0 0 0 12 21Z" />
        <path d="M7.1 13.9a5.4 5.4 0 0 1 0-3.8V7.8H4a9 9 0 0 0 0 8.4l3.1-2.3Z" />
        <path d="M12 6.5c1.3 0 2.5.5 3.4 1.3L18.1 5A8.9 8.9 0 0 0 12 3a9 9 0 0 0-8 4.8l3.1 2.3A5.2 5.2 0 0 1 12 6.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM17.5 6.8v.1" />
    </svg>
  );
}

export function Footer() {
  const [formStatus, setFormStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setFormStatus("Please fill all required details correctly.");
      form.reportValidity();
      return;
    }

    setFormStatus("Thank you. We will reach out shortly.");
    form.reset();
  }

  return (
    <>
      <footer id="contact" className="premium-footer">
        <div className="premium-footer-inner reveal">
          <div className="premium-footer-grid">
            <section className="footer-brand" aria-labelledby="footer-brand-heading">
              <Image src="/Images/CB_logo.png" alt="Chocobee Cake Studio" width={1168} height={864} className="footer-logo" />
              <h2 id="footer-brand-heading" className="sr-only">
                Chocobee Cake Studio
              </h2>
              <address>
                Crossing Republik, Ghaziabad, Gaur City 1 & 2, Noida Extension
                <a href="tel:+910000000000">+91 00000 00000</a>
                <a href="mailto:hello@chocobeecake.studio">hello@chocobeecake.studio</a>
                <span>10 AM - 10 PM</span>
              </address>
              <div className="footer-socials footer-socials-brand" aria-label="Social links">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <SocialIcon type="instagram" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <SocialIcon type="facebook" />
                </a>
                <a className="footer-whatsapp" href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                  <SocialIcon type="whatsapp" />
                </a>
                <Link href="/#reviews-heading" aria-label="Google Reviews">
                  <SocialIcon type="google" />
                </Link>
              </div>
            </section>

            <nav className="footer-links" aria-label="Footer quick links">
              <h3>Quick Links</h3>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="footer-links" aria-label="Cake categories">
              <h3>Categories</h3>
              <ul>
                {categories.map((category) => (
                  <li key={category}>
                    <Link href="/gallery">{category}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section className="footer-form-card" aria-labelledby="footer-form-heading">
              <h3 id="footer-form-heading">Reach Us</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <input name="name" type="text" minLength={2} required />
                </label>
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" pattern="[0-9+\-\s]{8,}" required />
                </label>
                <label>
                  <span>Message</span>
                  <textarea name="message" rows={3} minLength={8} required />
                </label>
                <button type="submit">Submit</button>
                <p role="status">{formStatus}</p>
              </form>
            </section>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Chocobee Cake Studio. All Rights Reserved.</p>
            <p>Designed with love by Chocobee</p>
          </div>
        </div>
      </footer>

    </>
  );
}
