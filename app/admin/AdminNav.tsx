import Link from "next/link";

const adminLinks = [
  { label: "Dashboard", href: "/admin" },
  { label: "Home Page", href: "/admin/home-page" },
  { label: "Custom Order Popup", href: "/admin/custom-order" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Footer", href: "/admin/footer" },
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
