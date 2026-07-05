"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import type { CmsFooterSettings, CmsFooterSocialLink } from "@/lib/local-cms";

function SocialIcon({ type }: { type: CmsFooterSocialLink["type"] }) {
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

function orderedActive<T extends { displayOrder: number; label: string; status: string }>(items: T[]) {
  return items.filter((item) => item.status === "ACTIVE").sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function FooterLink({ href, children, className, ariaLabel }: { href: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function FooterClient({ settings }: { settings: CmsFooterSettings }) {
  const [formStatus, setFormStatus] = useState("");
  const quickLinks = orderedActive(settings.quickLinks);
  const categoryLinks = orderedActive(settings.categoryLinks);
  const socialLinks = orderedActive(settings.socialLinks);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setFormStatus(settings.formErrorMessage);
      form.reportValidity();
      return;
    }

    setFormStatus(settings.formSuccessMessage);
    form.reset();
  }

  return (
    <footer id="contact" className="premium-footer">
      <div className="premium-footer-inner reveal">
        <div className="premium-footer-grid">
          <section className="footer-brand" aria-labelledby="footer-brand-heading">
            {settings.logoUrl ? <Image src={settings.logoUrl} alt={settings.logoAlt || "Footer logo"} width={1168} height={864} className="footer-logo" /> : null}
            <h2 id="footer-brand-heading" className="sr-only">
              {settings.logoAlt || "Footer brand"}
            </h2>
            <address>
              {settings.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              {settings.phoneLabel ? <a href={settings.phoneHref || "#"}>{settings.phoneLabel}</a> : null}
              {settings.emailLabel ? <a href={settings.emailHref || "#"}>{settings.emailLabel}</a> : null}
              {settings.hoursLabel ? <span>{settings.hoursLabel}</span> : null}
            </address>
            <div className="footer-socials footer-socials-brand" aria-label="Social links">
              {socialLinks.map((link) => (
                <FooterLink href={link.href} className={link.type === "whatsapp" ? "footer-whatsapp" : ""} ariaLabel={link.label} key={link.id}>
                  <SocialIcon type={link.type} />
                </FooterLink>
              ))}
            </div>
            {settings.brochurePdfUrl ? (
              <a href={settings.brochurePdfUrl} download={settings.brochurePdfName || undefined} className="footer-brochure">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4v9" />
                  <path d="m8 11 4 4 4-4" />
                  <path d="M5 19h14" />
                </svg>
                Download Brochure
              </a>
            ) : null}
          </section>

          <nav className="footer-links" aria-label="Footer quick links">
            <h3>Quick Links</h3>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-links" aria-label="Cake categories">
            <h3>Categories</h3>
            <ul>
              {categoryLinks.map((link) => (
                <li key={link.id}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <section className="footer-form-card" aria-labelledby="footer-form-heading">
            <h3 id="footer-form-heading">{settings.formTitle}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                <span>{settings.formNameLabel}</span>
                <input name="name" type="text" minLength={2} required />
              </label>
              <label>
                <span>{settings.formPhoneLabel}</span>
                <input name="phone" type="tel" pattern="[0-9+\-\s]{8,}" required />
              </label>
              <label>
                <span>{settings.formMessageLabel}</span>
                <textarea name="message" rows={3} minLength={8} required />
              </label>
              <button type="submit">{settings.formSubmitLabel}</button>
              <p role="status">{formStatus}</p>
            </form>
          </section>
        </div>

        <div className="footer-bottom">
          <p>{settings.copyrightText}</p>
          <p>{settings.creditText}</p>
        </div>
      </div>
    </footer>
  );
}
