import { notFound } from "next/navigation";
import { adminResources, type AdminResourceKey } from "@/lib/admin/resources";

const fieldMap: Record<AdminResourceKey, string[]> = {
  categories: ["Category Name", "Slug", "Display Order", "Status"],
  gallery: ["Image", "Title / Cake Name", "Category", "Featured"],
  about: ["About Chocobee Text", "Chef Name", "Chef Description", "Chef Image"],
  team: ["Photo", "Name", "Designation", "Bio", "Display Order"],
  contact: ["Phone Number", "Email", "Address", "WhatsApp Number"],
  settings: ["Logo", "Footer Text", "Instagram", "Facebook", "WhatsApp", "Google Reviews"],
};

const helpMap: Record<AdminResourceKey, string[]> = {
  categories: ["Create categories shown on the website.", "Use status to hide categories without deleting them."],
  gallery: ["Upload one or many cake photos.", "Preview images in a grid and assign each image to a category."],
  about: ["Update the About page story and chef section.", "Use a clear portrait image for Chef Neha."],
  team: ["Add or remove team profiles.", "Sort profiles with display order."],
  contact: ["Keep phone, email, address, and WhatsApp number current.", "These values feed the Contact page."],
  settings: ["Upload logo and footer content.", "Update social links used around the site."],
};

export default async function AdminResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: resourceParam } = await params;
  const resource = adminResources[resourceParam as AdminResourceKey];
  if (!resource) notFound();

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p>{resource.label}</p>
          <h1>{resource.description}</h1>
        </div>
        <a href={`/api/admin/${resource.key}`} className="admin-outline-button">
          REST API
        </a>
      </header>

      <section className="admin-resource-grid">
        <article className="admin-resource-card">
          <h2>Editable fields</h2>
          <div className="admin-field-list">
            {fieldMap[resource.key].map((field) => (
              <span key={field}>{field}</span>
            ))}
          </div>
        </article>

        <article className="admin-resource-card">
          <h2>How staff will use this</h2>
          <ol>
            {helpMap[resource.key].map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="admin-table-card">
        <div>
          <h2>{resource.label}</h2>
          <button type="button">Add New</button>
        </div>
        <p className="admin-muted">
          This clean control page is wired to <code>/api/admin/{resource.key}</code>. Connect the form submit and image upload provider when your PostgreSQL and Cloudinary credentials are added.
        </p>
      </section>
    </main>
  );
}
