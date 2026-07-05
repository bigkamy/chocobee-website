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
  brochure: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7Z" />
      <path d="M14 3v5h5" />
      <path d="M12 11v5" />
      <path d="m9.5 13.5 2.5 2.5 2.5-2.5" />
    </svg>
  ),
} as const;

const adminLinkGroups = [
  [{ label: "Dashboard", href: "/admin", icon: icons.dashboard }],
  [
    { label: "Categories", href: "/admin/categories", icon: icons.categories },
    { label: "Gallery", href: "/admin/gallery", icon: icons.gallery },
    { label: "Brochure", href: "/admin/footer", icon: icons.brochure },
  ],
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
