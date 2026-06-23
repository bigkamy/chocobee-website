"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import type { CmsAboutPageSection, CmsAboutSectionItem, CmsAboutSectionType } from "@/lib/local-cms";

type SectionStatus = "ACTIVE" | "INACTIVE";

const sectionTypes: CmsAboutSectionType[] = ["story", "chef", "team", "features", "cta", "content"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankSection(order: number): CmsAboutPageSection {
  return {
    id: `about-section-${order}`,
    sectionKey: `about-section-${order}`,
    sectionType: "content",
    label: `About Section ${order}`,
    eyebrow: "",
    title: `About Section ${order}`,
    subtitle: "",
    content: "",
    imageUrl: "",
    imageAlt: "",
    ctaLabel: "",
    ctaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    displayOrder: order,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [],
  };
}

function blankItem(order: number, sectionType: CmsAboutSectionType): CmsAboutSectionItem {
  const labelMap: Record<CmsAboutSectionType, string> = {
    story: "Slider Image",
    chef: "Stat",
    team: "Team Member",
    features: "Feature",
    cta: "CTA Item",
    content: "Content Item",
  };

  return {
    id: `${sectionType}-item-${order}`,
    label: labelMap[sectionType],
    title: sectionType === "chef" ? "100+" : sectionType === "features" ? "New Feature" : `Item ${order}`,
    subtitle: sectionType === "chef" ? "Metric Label" : "",
    content: "",
    imageUrl: "",
    imageAlt: "",
    href: "",
    displayOrder: order,
    status: "ACTIVE",
  };
}

function usesSectionImage(sectionType: CmsAboutSectionType) {
  return sectionType === "chef" || sectionType === "content";
}

export function AboutPageManager({ initialSections }: { initialSections: CmsAboutPageSection[] }) {
  const [sections, setSections] = useState(initialSections);
  const [editing, setEditing] = useState<CmsAboutPageSection | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const stats = useMemo(
    () => ({
      active: sections.filter((section) => section.status === "ACTIVE").length,
      hidden: sections.filter((section) => section.status === "INACTIVE").length,
      items: sections.reduce((total, section) => total + section.items.length, 0),
    }),
    [sections],
  );

  async function loadSections() {
    const response = await fetch("/api/admin/about-page", { cache: "no-store" });
    const data = (await response.json()) as { items?: CmsAboutPageSection[] };
    setSections(data.items ?? []);
  }

  function startEditing(section: CmsAboutPageSection) {
    setEditing({ ...section, items: section.items.map((item) => ({ ...item })) });
    setIsNew(false);
    setMessage("");
    setUploadStatus("");
  }

  function startAdding() {
    setEditing(blankSection(sections.length + 1));
    setIsNew(true);
    setMessage("");
    setUploadStatus("");
  }

  function updateEditing(patch: Partial<CmsAboutPageSection>) {
    setEditing((current) => (current ? { ...current, ...patch } : current));
  }

  function updateItem(index: number, patch: Partial<CmsAboutSectionItem>) {
    setEditing((current) => {
      if (!current) return current;
      const items = current.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        const title = patch.title ?? item.title;
        return {
          ...item,
          ...patch,
          id: patch.id ?? item.id ?? slugify(title),
        };
      });
      return { ...current, items };
    });
  }

  function addItem() {
    setEditing((current) => {
      if (!current) return current;
      return { ...current, items: [...current.items, blankItem(current.items.length + 1, current.sectionType)] };
    });
  }

  function deleteItem(index: number) {
    setEditing((current) => (current ? { ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) } : current));
  }

  async function uploadImage(target: "section" | "item", index?: number, file?: File) {
    if (!file) return;

    setUploadStatus("Uploading image...");
    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { imageUrl?: string; error?: string };

    if (!response.ok || !data.imageUrl) {
      setUploadStatus(data.error ?? "Image upload failed.");
      return;
    }

    if (target === "section") {
      updateEditing({ imageUrl: data.imageUrl });
    } else if (typeof index === "number") {
      updateItem(index, { imageUrl: data.imageUrl });
    }

    setUploadStatus("Image uploaded.");
  }

  async function saveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const sectionKey = editing.sectionKey || slugify(editing.label);
    const payload = {
      ...editing,
      id: undefined,
      sectionKey,
      items: editing.items.map((item, index) => ({
        ...item,
        id: item.id || slugify(item.title || `about-item-${index + 1}`),
        displayOrder: Number(item.displayOrder ?? index + 1),
      })),
      displayOrder: Number(editing.displayOrder),
    };

    const response = await fetch(isNew ? "/api/admin/about-page" : `/api/admin/about-page/${editing.id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Could not save the About page section. Please check required fields.");
      return;
    }

    setMessage(isNew ? "About page section added." : "About page section updated.");
    setEditing(null);
    setIsNew(false);
    await loadSections();
  }

  async function deleteSection(section: CmsAboutPageSection) {
    const confirmed = window.confirm(`Delete ${section.label}? This removes the section from the About page after save.`);
    if (!confirmed) return;

    await fetch(`/api/admin/about-page/${section.id}`, { method: "DELETE" });
    if (editing?.id === section.id) setEditing(null);
    setMessage("About page section deleted.");
    await loadSections();
  }

  return (
    <main className="admin-page admin-about-page">
      <header className="admin-page-header admin-about-header">
        <div>
          <p>About Page</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-publish-button admin-about-small-button" onClick={startAdding}>
            Add Section
          </button>
          <button type="button" className="admin-outline-button admin-about-small-button" onClick={() => void loadSections()}>
            Refresh
          </button>
          <Link href="/about" className="admin-outline-button admin-about-small-button">
            View About Page
          </Link>
        </div>
      </header>

      <section className="admin-about-stats" aria-label="About page section summary">
        <article>
          <span>Total Sections</span>
          <strong>{sections.length}</strong>
        </article>
        <article>
          <span>Active</span>
          <strong>{stats.active}</strong>
        </article>
        <article>
          <span>Hidden</span>
          <strong>{stats.hidden}</strong>
        </article>
        <article>
          <span>Nested Items</span>
          <strong>{stats.items}</strong>
        </article>
      </section>

      <section className="admin-table-card admin-about-sections-card">
        <div>
          <h2>All About Page Sections</h2>
          <button type="button" onClick={startAdding}>
            Add New
          </button>
        </div>
        {message ? <p className="admin-muted" role="status">{message}</p> : null}
        <table>
          <thead>
            <tr>
              <th>Section</th>
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
              <tr className={editing?.id === section.id ? "admin-about-selected-row" : undefined} key={section.id}>
                <td>{section.label}</td>
                <td>{section.sectionType}</td>
                <td>{section.title}</td>
                <td>{section.items.length}</td>
                <td>{section.displayOrder}</td>
                <td>
                  <span>{section.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                </td>
                <td>
                  <button type="button" onClick={() => startEditing(section)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => void deleteSection(section)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editing ? (
        <section className="admin-resource-card admin-about-editor-card">
          <form className="admin-category-form admin-about-editor" onSubmit={saveSection}>
            <div className="admin-about-editor-heading">
              <div>
                <span>{isNew ? "New Section" : "Editing Section"}</span>
                <h2>{editing.label}</h2>
              </div>
              <button type="button" className="admin-secondary-button" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>

            <div className="admin-about-form-grid">
              <label>
                Section Label
                <input value={editing.label} onChange={(event) => updateEditing({ label: event.currentTarget.value, sectionKey: slugify(event.currentTarget.value) })} required />
              </label>
              <label>
                Section Key
                <input value={editing.sectionKey} onChange={(event) => updateEditing({ sectionKey: event.currentTarget.value })} required />
              </label>
              <label>
                Section Type
                <select value={editing.sectionType} onChange={(event) => updateEditing({ sectionType: event.currentTarget.value as CmsAboutSectionType })}>
                  {sectionTypes.map((type) => (
                    <option value={type} key={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Eyebrow
                <input value={editing.eyebrow ?? ""} onChange={(event) => updateEditing({ eyebrow: event.currentTarget.value })} />
              </label>
              <label>
                Title
                <input value={editing.title} onChange={(event) => updateEditing({ title: event.currentTarget.value })} required />
              </label>
              <label>
                Subtitle
                <input value={editing.subtitle ?? ""} onChange={(event) => updateEditing({ subtitle: event.currentTarget.value })} />
              </label>
            </div>

            <label>
              Content
              <textarea value={editing.content ?? ""} onChange={(event) => updateEditing({ content: event.currentTarget.value })} />
            </label>

            {usesSectionImage(editing.sectionType) ? (
              <div className="admin-about-media-grid">
                <div className="admin-gallery-preview admin-about-image-preview">
                  {editing.imageUrl ? <Image src={editing.imageUrl} alt={editing.imageAlt || editing.title} fill sizes="320px" className="object-cover" /> : null}
                </div>
                <div className="admin-about-form-grid">
                  <label>
                    Section Image URL
                    <input value={editing.imageUrl ?? ""} onChange={(event) => updateEditing({ imageUrl: event.currentTarget.value })} />
                  </label>
                  <label>
                    Image Alt Text
                    <input value={editing.imageAlt ?? ""} onChange={(event) => updateEditing({ imageAlt: event.currentTarget.value })} />
                  </label>
                  <div className="admin-upload-control">
                    <label>
                      Upload / Replace Image
                      <input type="file" accept="image/*" onChange={(event) => void uploadImage("section", undefined, event.currentTarget.files?.[0])} />
                    </label>
                    <button type="button" className="admin-upload-delete" onClick={() => updateEditing({ imageUrl: "" })}>
                      Remove
                    </button>
                  </div>
                  {uploadStatus ? <p className="admin-upload-status">{uploadStatus}</p> : null}
                </div>
              </div>
            ) : (
              <p className="admin-about-control-note">
                This section uses Nested Content below for its images and content cards.
              </p>
            )}

            <div className="admin-about-form-grid">
              <label>
                CTA Label
                <input value={editing.ctaLabel ?? ""} onChange={(event) => updateEditing({ ctaLabel: event.currentTarget.value })} />
              </label>
              <label>
                CTA Link
                <input value={editing.ctaHref ?? ""} onChange={(event) => updateEditing({ ctaHref: event.currentTarget.value })} />
              </label>
              <label>
                Secondary CTA Label
                <input value={editing.secondaryCtaLabel ?? ""} onChange={(event) => updateEditing({ secondaryCtaLabel: event.currentTarget.value })} />
              </label>
              <label>
                Secondary CTA Link
                <input value={editing.secondaryCtaHref ?? ""} onChange={(event) => updateEditing({ secondaryCtaHref: event.currentTarget.value })} />
              </label>
              <label>
                Display Order
                <input type="number" value={editing.displayOrder} onChange={(event) => updateEditing({ displayOrder: Number(event.currentTarget.value) })} />
              </label>
              <label>
                Status
                <select value={editing.status} onChange={(event) => updateEditing({ status: event.currentTarget.value as SectionStatus })}>
                  <option value="ACTIVE">Show Section</option>
                  <option value="INACTIVE">Hide Section</option>
                </select>
              </label>
            </div>

            <section className="admin-about-items-panel">
              <div className="admin-about-editor-heading">
                <div>
                  <span>Nested Content</span>
                  <h2>Items inside this section</h2>
                </div>
                <button type="button" className="admin-secondary-button" onClick={addItem}>
                  Add Item
                </button>
              </div>
              <div className="admin-about-item-list">
                {editing.items.map((item, index) => (
                  <article className="admin-about-item-card" key={`${item.id}-${index}`}>
                    <div className="admin-about-item-card-header">
                      <strong>{item.label}</strong>
                      <button type="button" onClick={() => deleteItem(index)}>
                        Delete
                      </button>
                    </div>
                    <div className="admin-about-item-preview-row">
                      <div className="admin-about-item-thumb">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.imageAlt || item.title} fill sizes="96px" className="object-cover" />
                        ) : (
                          <span>No image</span>
                        )}
                      </div>
                      <div>
                        <strong>{item.title || "Untitled item"}</strong>
                        <span>{item.imageUrl ? "Thumbnail preview" : "Add an image URL or upload an image"}</span>
                      </div>
                    </div>
                    <div className="admin-about-form-grid">
                      <label>
                        Item Label
                        <input value={item.label} onChange={(event) => updateItem(index, { label: event.currentTarget.value })} />
                      </label>
                      <label>
                        Title / Value
                        <input value={item.title} onChange={(event) => updateItem(index, { title: event.currentTarget.value })} />
                      </label>
                      <label>
                        Subtitle / Role
                        <input value={item.subtitle ?? ""} onChange={(event) => updateItem(index, { subtitle: event.currentTarget.value })} />
                      </label>
                      <label>
                        Link
                        <input value={item.href ?? ""} onChange={(event) => updateItem(index, { href: event.currentTarget.value })} />
                      </label>
                      <label>
                        Image URL
                        <input value={item.imageUrl ?? ""} onChange={(event) => updateItem(index, { imageUrl: event.currentTarget.value })} />
                      </label>
                      <label>
                        Image Alt
                        <input value={item.imageAlt ?? ""} onChange={(event) => updateItem(index, { imageAlt: event.currentTarget.value })} />
                      </label>
                      <label>
                        Display Order
                        <input type="number" value={item.displayOrder} onChange={(event) => updateItem(index, { displayOrder: Number(event.currentTarget.value) })} />
                      </label>
                      <label>
                        Status
                        <select value={item.status} onChange={(event) => updateItem(index, { status: event.currentTarget.value as SectionStatus })}>
                          <option value="ACTIVE">Show Item</option>
                          <option value="INACTIVE">Hide Item</option>
                        </select>
                      </label>
                    </div>
                    <label>
                      Item Content
                      <textarea value={item.content ?? ""} onChange={(event) => updateItem(index, { content: event.currentTarget.value })} />
                    </label>
                    <div className="admin-upload-control">
                      <label>
                        Upload Item Image
                        <input type="file" accept="image/*" onChange={(event) => void uploadImage("item", index, event.currentTarget.files?.[0])} />
                      </label>
                      <button type="button" className="admin-upload-delete" onClick={() => updateItem(index, { imageUrl: "" })}>
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <div className="admin-about-save-row">
              <button type="submit">{isNew ? "Create Section" : "Save Section"}</button>
            </div>
          </form>
        </section>
      ) : null}
    </main>
  );
}
