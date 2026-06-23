"use client";

import { FormEvent, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editing, setEditing] = useState<Category | null>(null);
  const [message, setMessage] = useState("");

  async function loadCategories() {
    const response = await fetch("/api/admin/categories", { cache: "no-store" });
    const data = (await response.json()) as { items?: Category[] };
    setCategories(data.items ?? []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const slug = String(form.get("slug") || slugify(name));
    const payload = {
      name,
      slug,
      description: String(form.get("description") ?? ""),
      displayOrder: Number(form.get("displayOrder") ?? 0),
      status: String(form.get("status") ?? "ACTIVE") as Category["status"],
    };

    const response = await fetch(editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Could not save category. Please check the fields.");
      return;
    }

    event.currentTarget.reset();
    setEditing(null);
    setMessage(editing ? "Category updated." : "Category added.");
    await loadCategories();
  }

  async function deleteCategory(id: string) {
    const category = categories.find((item) => item.id === id);
    const confirmed = window.confirm(
      `Delete ${category?.name ?? "this category"}? This action cannot be undone and may affect related gallery images.`,
    );
    if (!confirmed) return;

    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setMessage("Category deleted.");
    await loadCategories();
  }

  async function publishCategories() {
    await loadCategories();
    setMessage("Categories published to the live website.");
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p>Categories</p>
          <h1>Control the category list shown on the Gallery page</h1>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-publish-button" onClick={() => void publishCategories()}>
            Publish Categories
          </button>
          <a href="/gallery" className="admin-outline-button">
            View Gallery
          </a>
        </div>
      </header>

      <section className="admin-resource-grid">
        <form onSubmit={handleSubmit} className="admin-resource-card admin-category-form">
          <h2>{editing ? "Edit Category" : "Add Category"}</h2>
          <label>
            Category Name
            <input name="name" defaultValue={editing?.name} placeholder="Birthday Cakes" required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={editing?.slug} placeholder="birthday-cakes" required />
          </label>
          <label>
            Description
            <textarea name="description" defaultValue={editing?.description ?? ""} placeholder="Short SEO-friendly category description" />
          </label>
          <label>
            Display Order
            <input name="displayOrder" type="number" defaultValue={editing?.displayOrder ?? categories.length + 1} />
          </label>
          <label>
            Status
            <select name="status" defaultValue={editing?.status ?? "ACTIVE"}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
          <button type="submit">{editing ? "Update Category" : "Add Category"}</button>
          {editing ? (
            <button type="button" className="admin-secondary-button" onClick={() => setEditing(null)}>
              Cancel Edit
            </button>
          ) : null}
          {message ? <p role="status">{message}</p> : null}
        </form>

        <article className="admin-resource-card">
          <h2>Live Gallery Categories</h2>
          <p className="admin-muted">
            Active categories from this list appear automatically in the sidebar on <strong>/gallery</strong>.
          </p>
          <div className="admin-field-list">
            {categories
              .filter((category) => category.status === "ACTIVE")
              .map((category) => (
                <span key={category.id}>{category.name}</span>
              ))}
          </div>
        </article>
      </section>

      <section className="admin-table-card">
        <div>
          <h2>All Categories</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.description}</td>
                <td>{category.displayOrder}</td>
                <td>
                  <span>{category.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                </td>
                <td>
                  <button type="button" onClick={() => setEditing(category)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteCategory(category.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
