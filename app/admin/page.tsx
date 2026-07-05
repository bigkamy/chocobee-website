import Link from "next/link";

const metrics = [
  ["Total Categories", "5", "Birthday, Wedding, Designer, Kids, Cookies"],
  ["Gallery Images", "0", "Upload cake photos from Gallery"],
];

const quickActions = [
  ["Add Category", "/admin/categories"],
  ["Upload Gallery Images", "/admin/gallery"],
  ["Manage Brochure", "/admin/footer"],
];

export default function AdminDashboardPage() {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p>Admin Dashboard</p>
        </div>
        <Link href="/api/admin/dashboard" className="admin-outline-button">
          Dashboard API
        </Link>
      </header>

      <section className="admin-metrics-grid admin-metrics-grid-simple" aria-label="Dashboard metrics">
        {metrics.map(([label, value, note]) => (
          <article className="admin-metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="admin-action-panel">
        <div>
          <p>Content Management</p>
          <h2>What would you like to update?</h2>
        </div>
        <div className="admin-action-grid">
          {quickActions.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
