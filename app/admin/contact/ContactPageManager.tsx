"use client";

import { FormEvent, useMemo, useState } from "react";
import type { CmsContactPageSection, CmsContactSectionItem, CmsContactSectionType } from "@/lib/local-cms";
import { EditIcon, TrashIcon } from "../ActionIcons";

type SectionStatus = "ACTIVE" | "INACTIVE";

const sectionTypes: CmsContactSectionType[] = ["hero", "details", "map", "form", "content"];
const iconOptions = ["studio", "address", "phone", "email", "hours", "text", "textarea"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankSection(order: number): CmsContactPageSection {
  return {
    id: `contact-section-${order}`,
    sectionKey: `contact-section-${order}`,
    sectionType: "content",
    label: `Contact Section ${order}`,
    eyebrow: "",
    title: `Contact Section ${order}`,
    subtitle: "",
    content: "",
    imageUrl: "",
    imageAlt: "",
    mapEmbedUrl: "",
    ctaLabel: "",
    ctaHref: "",
    displayOrder: order,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [],
  };
}

function blankItem(order: number, sectionType: CmsContactSectionType): CmsContactSectionItem {
  return {
    id: `${sectionType}-item-${order}`,
    label: sectionType === "form" ? "Form Field" : "Contact Item",
    title: sectionType === "form" ? "New Field" : `Item ${order}`,
    subtitle: "",
    content: "",
    href: "",
    icon: sectionType === "form" ? "text" : "studio",
    displayOrder: order,
    status: "ACTIVE",
  };
}

export function ContactPageManager({ initialSections }: { initialSections: CmsContactPageSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [editing, setEditing] = useState<CmsContactPageSection | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [publishedToast, setPublishedToast] = useState(false);

  function showPublishedToast() {
    setPublishedToast(true);
    window.setTimeout(() => setPublishedToast(false), 3200);
  }

  const stats = useMemo(
    () => ({
      active: sections.filter((section) => section.status === "ACTIVE").length,
      hidden: sections.filter((section) => section.status === "INACTIVE").length,
      items: sections.reduce((total, section) => total + section.items.length, 0),
    }),
    [sections],
  );

  async function loadSections() {
    const response = await fetch("/api/admin/contact-page", { cache: "no-store" });
    const data = (await response.json()) as { items?: CmsContactPageSection[] };
    setSections(data.items ?? []);
  }

  function startEditing(section: CmsContactPageSection) {
    setEditing({ ...section, items: section.items.map((item) => ({ ...item })) });
    setIsNew(false);
    setMessage("");
  }

  function startAdding() {
    setEditing(blankSection(sections.length + 1));
    setIsNew(true);
    setMessage("");
  }

  function updateEditing(patch: Partial<CmsContactPageSection>) {
    setEditing((current) => (current ? { ...current, ...patch } : current));
  }

  function updateItem(index: number, patch: Partial<CmsContactSectionItem>) {
    setEditing((current) => {
      if (!current) return current;
      return {
        ...current,
        items: current.items.map((item, itemIndex) => {
          if (itemIndex !== index) return item;
          const title = patch.title ?? item.title;
          return { ...item, ...patch, id: patch.id ?? item.id ?? slugify(title) };
        }),
      };
    });
  }

  function addItem() {
    setEditing((current) => (current ? { ...current, items: [...current.items, blankItem(current.items.length + 1, current.sectionType)] } : current));
  }

  function deleteItem(index: number) {
    setEditing((current) => (current ? { ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) } : current));
  }

  async function saveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const sectionKey = editing.sectionKey || slugify(editing.label);
    const payload = {
      ...editing,
      id: undefined,
      sectionKey,
      displayOrder: Number(editing.displayOrder),
      items: editing.items.map((item, index) => ({
        ...item,
        id: item.id || slugify(item.title || `contact-item-${index + 1}`),
        displayOrder: Number(item.displayOrder ?? index + 1),
      })),
    };

    const response = await fetch(isNew ? "/api/admin/contact-page" : `/api/admin/contact-page/${editing.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Could not save the Contact page section. Please check required fields.");
      return;
    }

    setMessage(isNew ? "Contact page section added." : "Contact page section updated.");
    setEditing(null);
    setIsNew(false);
    await loadSections();
  }

  async function deleteSection(section: CmsContactPageSection) {
    const confirmed = window.confirm(`Delete ${section.label}? This removes it from the Contact page.`);
    if (!confirmed) return;

    await fetch(`/api/admin/contact-page/${section.id}`, { method: "DELETE" });
    if (editing?.id === section.id) setEditing(null);
    setMessage("Contact page section deleted.");
    await loadSections();
  }

  return (
    <main className="admin-page admin-contact-page">
      {publishedToast ? (
        <div className="admin-publish-toast" role="status" aria-live="polite">
          <span className="admin-publish-toast-icon" aria-hidden="true">✓</span>
          Update Published Successfully!
        </div>
      ) : null}
      <header className="admin-page-header admin-contact-header">
        <div>
          <p>Contact Page</p>
        </div>
        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-publish-button admin-contact-small-button"
            onClick={async () => {
              await loadSections();
              showPublishedToast();
            }}
          >
            Publish
          </button>
        </div>
      </header>

      <section className="admin-contact-stats" aria-label="Contact page section summary">
        <article><span>Total Sections</span><strong>{sections.length}</strong></article>
        <article><span>Active</span><strong>{stats.active}</strong></article>
        <article><span>Hidden</span><strong>{stats.hidden}</strong></article>
        <article><span>Nested Items</span><strong>{stats.items}</strong></article>
      </section>

      <section className="admin-table-card admin-contact-sections-card">
        <div>
          <h2>All Contact Page Sections</h2>
          <button type="button" onClick={startAdding}>Add New</button>
        </div>
        {message ? <p className="admin-muted" role="status">{message}</p> : null}
        <table>
          <thead>
            <tr>
              <th>Section</th>
              <th>Section ID</th>
              <th>Type</th>
              <th>Title</th>
              <th>Items</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr className={editing?.id === section.id ? "admin-contact-selected-row" : undefined} key={section.id}>
                <td>{section.label}</td>
                <td><code className="admin-section-id">#{section.sectionKey}</code></td>
                <td>{section.sectionType}</td>
                <td>{section.title}</td>
                <td>{section.items.length}</td>
                <td>{section.displayOrder}</td>
                <td><span>{section.status === "ACTIVE" ? "Active" : "Inactive"}</span></td>
                <td>
                  <button type="button" className="admin-action-icon" onClick={() => startEditing(section)} aria-label={`Edit ${section.label}`} title="Edit"><EditIcon /></button>
                  <button type="button" className="admin-action-icon" onClick={() => void deleteSection(section)} aria-label={`Delete ${section.label}`} title="Delete"><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editing ? (
        <section className="admin-resource-card admin-contact-editor-card">
          <form className="admin-category-form admin-contact-editor" onSubmit={saveSection}>
            <div className="admin-contact-editor-heading">
              <div>
                <span>{isNew ? "New Section" : "Editing Section"}</span>
                <h2>{editing.label} <code className="admin-section-id">#{editing.sectionKey}</code></h2>
              </div>
              <button type="button" className="admin-secondary-button" onClick={() => setEditing(null)}>Cancel</button>
            </div>

            <div className="admin-contact-form-grid">
              <label>Section Label<input value={editing.label} onChange={(event) => updateEditing({ label: event.currentTarget.value, sectionKey: slugify(event.currentTarget.value) })} required /></label>
              <label>Section Key<input value={editing.sectionKey} onChange={(event) => updateEditing({ sectionKey: event.currentTarget.value })} required /></label>
              <label>
                Section Type
                <select value={editing.sectionType} onChange={(event) => updateEditing({ sectionType: event.currentTarget.value as CmsContactSectionType })}>
                  {sectionTypes.map((type) => <option value={type} key={type}>{type}</option>)}
                </select>
              </label>
              <label>Eyebrow<input value={editing.eyebrow ?? ""} onChange={(event) => updateEditing({ eyebrow: event.currentTarget.value })} /></label>
              <label>Title<input value={editing.title} onChange={(event) => updateEditing({ title: event.currentTarget.value })} required /></label>
              <label>Subtitle<input value={editing.subtitle ?? ""} onChange={(event) => updateEditing({ subtitle: event.currentTarget.value })} /></label>
            </div>

            <label>Content / Success Message<textarea value={editing.content ?? ""} onChange={(event) => updateEditing({ content: event.currentTarget.value })} /></label>

            <div className="admin-contact-form-grid">
              <label>Map Embed URL<input value={editing.mapEmbedUrl ?? ""} onChange={(event) => updateEditing({ mapEmbedUrl: event.currentTarget.value })} placeholder="https://www.google.com/maps?...&output=embed" /></label>
              <label>CTA Label<input value={editing.ctaLabel ?? ""} onChange={(event) => updateEditing({ ctaLabel: event.currentTarget.value })} /></label>
              <label>CTA Link<input value={editing.ctaHref ?? ""} onChange={(event) => updateEditing({ ctaHref: event.currentTarget.value })} /></label>
              <label>Display Order<input type="number" value={editing.displayOrder} onChange={(event) => updateEditing({ displayOrder: Number(event.currentTarget.value) })} /></label>
              <label>
                Status
                <select value={editing.status} onChange={(event) => updateEditing({ status: event.currentTarget.value as SectionStatus })}>
                  <option value="ACTIVE">Show Section</option>
                  <option value="INACTIVE">Hide Section</option>
                </select>
              </label>
            </div>

            <section className="admin-contact-items-panel">
              <div className="admin-contact-editor-heading">
                <div>
                  <span>Nested Content</span>
                  <h2>Contact cards and form fields</h2>
                </div>
                <button type="button" className="admin-secondary-button" onClick={addItem}>Add Item</button>
              </div>
              <div className="admin-contact-item-list">
                {editing.items.map((item, index) => (
                  <article className="admin-contact-item-card" key={`${item.id}-${index}`}>
                    <div className="admin-contact-item-card-header">
                      <strong>{item.label}</strong>
                      <button type="button" className="admin-action-icon" onClick={() => deleteItem(index)} aria-label={`Delete ${item.label}`} title="Delete"><TrashIcon /></button>
                    </div>
                    <div className="admin-contact-form-grid">
                      <label>Item Label<input value={item.label} onChange={(event) => updateItem(index, { label: event.currentTarget.value })} /></label>
                      <label>Title / Field Label<input value={item.title} onChange={(event) => updateItem(index, { title: event.currentTarget.value })} /></label>
                      <label>Value / Placeholder<input value={item.subtitle ?? ""} onChange={(event) => updateItem(index, { subtitle: event.currentTarget.value })} /></label>
                      <label>Link / Href<input value={item.href ?? ""} onChange={(event) => updateItem(index, { href: event.currentTarget.value })} /></label>
                      <label>
                        Icon / Field Type
                        <select value={item.icon ?? ""} onChange={(event) => updateItem(index, { icon: event.currentTarget.value })}>
                          <option value="">None</option>
                          {iconOptions.map((icon) => <option value={icon} key={icon}>{icon}</option>)}
                        </select>
                      </label>
                      <label>Display Order<input type="number" value={item.displayOrder} onChange={(event) => updateItem(index, { displayOrder: Number(event.currentTarget.value) })} /></label>
                      <label>
                        Status
                        <select value={item.status} onChange={(event) => updateItem(index, { status: event.currentTarget.value as SectionStatus })}>
                          <option value="ACTIVE">Show Item</option>
                          <option value="INACTIVE">Hide Item</option>
                        </select>
                      </label>
                    </div>
                    <label>Item Content<textarea value={item.content ?? ""} onChange={(event) => updateItem(index, { content: event.currentTarget.value })} /></label>
                  </article>
                ))}
              </div>
            </section>

            <div className="admin-contact-save-row">
              <button type="submit">{isNew ? "Create Section" : "Save Section"}</button>
            </div>
          </form>
        </section>
      ) : null}
    </main>
  );
}
