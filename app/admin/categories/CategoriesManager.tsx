"use client";

import { FormEvent, useState } from "react";
import { EditIcon, TrashIcon } from "../ActionIcons";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  subcategoryCtas?: SubcategoryCta[];
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

type SubcategoryCta = {
  id: string;
  label: string;
  href: string;
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
  const [subcategoryCtas, setSubcategoryCtas] = useState<SubcategoryCta[]>([]);
  const [message, setMessage] = useState("");

  async function loadCategories() {
    const response = await fetch("/api/admin/categories", { cache: "no-store" });
    const data = (await response.json()) as { items?: Category[] };
    setCategories(data.items ?? []);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "");
    const slug = String(form.get("slug") || slugify(name));
    const payload = {
      name,
      slug,
      description: String(form.get("description") ?? ""),
      subcategoryCtas,
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

    formElement.reset();
    setEditing(null);
    setSubcategoryCtas([]);
    setMessage(editing ? "Category updated." : "Category added.");
    await loadCategories();
  }

  function startEditing(category: Category) {
    setEditing(category);
    setSubcategoryCtas(category.subcategoryCtas ?? []);
  }

  function cancelEditing() {
    setEditing(null);
    setSubcategoryCtas([]);
  }

  function startAdding() {
    setEditing(null);
    setSubcategoryCtas([]);
    setMessage("");
  }

  function addSubcategoryCta() {
    setSubcategoryCtas((current) => {
      const nextIndex = current.length + 1;
      return [
        ...current,
        {
          id: `subcategory-cta-${nextIndex}`,
          label: "New Subcategory",
          href: "/gallery",
          displayOrder: nextIndex,
          status: "ACTIVE",
        },
      ];
    });
  }

  function updateSubcategoryCta(index: number, patch: Partial<SubcategoryCta>) {
    setSubcategoryCtas((current) =>
      current.map((cta, ctaIndex) => {
        if (ctaIndex !== index) return cta;
        const label = patch.label ?? cta.label;
        return {
          ...cta,
          ...patch,
          id: patch.id ?? cta.id ?? slugify(label),
        };
      }),
    );
  }

  function deleteSubcategoryCta(index: number) {
    setSubcategoryCtas((current) => current.filter((_, ctaIndex) => ctaIndex !== index));
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

      <section className="admin-categories-layout">
        <form onSubmit={handleSubmit} className="admin-resource-card admin-category-form admin-categories-form" key={editing?.id ?? "new-category"}>
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
          <div className="admin-category-subcategory-panel">
            <div>
              <h3>Subcategory CTA</h3>
              <button type="button" className="admin-secondary-button" onClick={addSubcategoryCta}>
                Add CTA
              </button>
            </div>
            {subcategoryCtas.length ? (
              <div className="admin-category-subcategory-list">
                {subcategoryCtas.map((cta, index) => (
                  <article key={`${cta.id}-${index}`}>
                    <label>
                      Label
                      <input value={cta.label} onChange={(event) => updateSubcategoryCta(index, { label: event.currentTarget.value })} />
                    </label>
                    <label>
                      Link
                      <input value={cta.href} onChange={(event) => updateSubcategoryCta(index, { href: event.currentTarget.value })} />
                    </label>
                    <label>
                      Order
                      <input type="number" value={cta.displayOrder} onChange={(event) => updateSubcategoryCta(index, { displayOrder: Number(event.currentTarget.value) })} />
                    </label>
                    <label>
                      Status
                      <select value={cta.status} onChange={(event) => updateSubcategoryCta(index, { status: event.currentTarget.value as SubcategoryCta["status"] })}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </label>
                    <button type="button" className="admin-action-icon" onClick={() => deleteSubcategoryCta(index)} aria-label="Delete subcategory CTA" title="Delete">
                      <TrashIcon />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="admin-muted">Add buttons for subcategories like Kids Theme, Eggless, Premium, or Photo Cake.</p>
            )}
          </div>
          <button type="submit">{editing ? "Update Category" : "Add Category"}</button>
          {editing ? (
            <button type="button" className="admin-secondary-button" onClick={cancelEditing}>
              Cancel Edit
            </button>
          ) : null}
          {message ? <p role="status">{message}</p> : null}
        </form>

        <section className="admin-table-card admin-categories-table">
          <div>
            <h2>All Categories</h2>
            <button type="button" onClick={startAdding}>
              Add New
            </button>
          </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Sub CTAs</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className={editing?.id === category.id ? "admin-category-selected-row" : undefined}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.description}</td>
                <td>{category.subcategoryCtas?.filter((cta) => cta.status === "ACTIVE").length ?? 0}</td>
                <td>{category.displayOrder}</td>
                <td>
                  <span>{category.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                </td>
                <td>
                  <button type="button" className="admin-action-icon" onClick={() => startEditing(category)} aria-label={`Edit ${category.name}`} title="Edit">
                    <EditIcon />
                  </button>
                  <button type="button" className="admin-action-icon" onClick={() => deleteCategory(category.id)} aria-label={`Delete ${category.name}`} title="Delete">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </section>
      </section>
    </main>
  );
}
