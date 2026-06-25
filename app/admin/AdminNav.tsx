"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

function isActiveLink(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.4" />
      <rect x="14" y="3" width="7" height="5" rx="1.4" />
      <rect x="14" y="12" width="7" height="9" rx="1.4" />
      <rect x="3" y="16" width="7" height="5" rx="1.4" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3 2.9-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
      <path d="M16 5.2A2.8 2.8 0 0 1 16 11M17.5 14.6c2 .5 3.5 1.9 4 4.4" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6 10.5V20h12v-9.5" />
      <path d="M10 20v-4.5h4V20" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  ),
  categories: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6.5 11 3l7 3.5-7 3.5z" />
      <path d="M4 12l7 3.5L18 12" />
      <path d="M4 17l7 3.5L18 17" />
    </svg>
  ),
  gallery: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.2" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m4 18 5-4.5 4 3.5 3-2.5 4 3.5" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.2" />
      <path d="m4 7 8 5.5L20 7" />
    </svg>
  ),
  footer: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.2" />
      <path d="M3 15h18" />
      <path d="M7 18h5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.3-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
} as const;

const adminLinkGroups = [
  [
    { label: "Dashboard", href: "/admin", icon: icons.dashboard },
    { label: "Team Members", href: "/admin/team", icon: icons.team },
  ],
  [
    { label: "Home Page", href: "/admin/home-page", icon: icons.home },
    { label: "About", href: "/admin/about", icon: icons.about },
    { label: "Categories", href: "/admin/categories", icon: icons.categories },
    { label: "Gallery", href: "/admin/gallery", icon: icons.gallery },
    { label: "Contact", href: "/admin/contact", icon: icons.contact },
    { label: "Footer", href: "/admin/footer", icon: icons.footer },
  ],
  [{ label: "Website Settings", href: "/admin/settings", icon: icons.settings }],
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand">
        <span>CB</span>
        <strong>Chocobee Admin</strong>
      </Link>

      <nav aria-label="Admin navigation">
        <p>Admin Menu</p>
        {adminLinkGroups.map((group, groupIndex) => (
          <Fragment key={groupIndex}>
            {groupIndex > 0 ? <span className="admin-nav-divider" aria-hidden="true" /> : null}
            {group.map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  className={active ? "admin-nav-active" : undefined}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="admin-nav-icon" aria-hidden="true">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </Fragment>
        ))}
      </nav>

      <SignOutButton />
    </aside>
  );
}
