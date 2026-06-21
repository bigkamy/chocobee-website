import Link from "next/link";

const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "SEO Manager", href: "/admin/gallery" },
  { label: "About", href: "/admin/about" },
  { label: "Team Members", href: "/admin/team" },
  { label: "Contact", href: "/admin/contact" },
  { label: "Website Settings", href: "/admin/settings" },
];

export function AdminNav() {
  return (
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand">
        <span>CB</span>
        <strong>Chocobee Admin</strong>
      </Link>

      <nav aria-label="Admin navigation">
        <p>Admin Menu</p>
        {adminLinks.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
