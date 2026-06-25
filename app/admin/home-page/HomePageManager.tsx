"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import type { CmsCustomOrderSettings, CmsReview } from "@/lib/local-cms";
import { CloseIcon, EditIcon, ManageIcon, TrashIcon } from "../ActionIcons";
import { CustomOrderManager } from "../custom-order/CustomOrderManager";
import { ReviewsManager } from "../reviews/ReviewsManager";

type ManagePanel = "custom-order" | "reviews" | null;

type HomePageSection = {
  id: string;
  sectionKey: string;
  label: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  updatedAt: string;
  categoryCards?: HomeCategoryCard[];
  whyCards?: HomeWhyCard[];
};

type HomeCategoryCard = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageAlt: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

type HomeWhyCard = {
  id: string;
  title: string;
  text: string;
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

export function HomePageManager({
  initialSections,
  customOrderSettings,
  reviews,
}: {
  initialSections: HomePageSection[];
  customOrderSettings: CmsCustomOrderSettings;
  reviews: CmsReview[];
}) {
  const [sections, setSections] = useState<HomePageSection[]>(initialSections);
  const [editing, setEditing] = useState<HomePageSection | null>(null);
  const [activePanel, setActivePanel] = useState<ManagePanel>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [categoryCards, setCategoryCards] = useState<HomeCategoryCard[]>([]);
  const [whyCards, setWhyCards] = useState<HomeWhyCard[]>([]);
  const [message, setMessage] = useState("");

  async function loadSections() {
    const response = await fetch("/api/admin/home-page", { cache: "no-store" });
    const data = (await response.json()) as { items?: HomePageSection[] };
    setSections(data.items ?? []);
  }

  function startEditing(section: HomePageSection) {
    setActivePanel(null);
    setEditing(section);
    setImageUrl(section.imageUrl ?? "");
    setPreview(section.imageUrl ?? "");
    setCategoryCards(section.categoryCards ?? []);
    setWhyCards(section.whyCards ?? []);
    setUploadStatus("");
    setMessage("");
  }

  function togglePanel(panel: Exclude<ManagePanel, null>) {
    setEditing(null);
    setActivePanel((current) => (current === panel ? null : panel));
  }

  function cancelEditing() {
    setEditing(null);
    setImageUrl("");
    setPreview("");
    setCategoryCards([]);
    setWhyCards([]);
    setUploadStatus("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    const form = new FormData(event.currentTarget);
    const formString = (field: string, fallback: string | null | undefined) =>
      form.has(field) ? String(form.get(field) ?? "") : fallback ?? "";
    const payload = {
      sectionKey: formString("sectionKey", editing.sectionKey),
      label: formString("label", editing.label),
      title: formString("title", editing.title),
      subtitle: formString("subtitle", editing.subtitle),
      content: formString("content", editing.content),
      imageUrl,
      imageAlt: formString("imageAlt", editing.imageAlt),
      ctaLabel: formString("ctaLabel", editing.ctaLabel),
      ctaHref: formString("ctaHref", editing.ctaHref),
      secondaryCtaLabel: formString("secondaryCtaLabel", editing.secondaryCtaLabel),
      secondaryCtaHref: formString("secondaryCtaHref", editing.secondaryCtaHref),
      categoryCards: editing.sectionKey === "categories" ? categoryCards : editing.categoryCards ?? [],
      whyCards: editing.sectionKey === "why-us" ? whyCards : editing.whyCards ?? [],
      displayOrder: Number(form.get("displayOrder") ?? editing.displayOrder),
      status: String(form.get("status") ?? editing.status) as HomePageSection["status"],
    };

    const response = await fetch(`/api/admin/home-page/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Could not update the home page section. Please check the fields.");
      return;
    }

    setMessage("Home page section updated.");
    cancelEditing();
    await loadSections();
  }

  async function handleImageUpload(file?: File) {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Uploading section image...");

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });

    const data = (await response.json()) as { imageUrl?: string; error?: string };
    setIsUploading(false);

    if (!response.ok || !data.imageUrl) {
      setUploadStatus(data.error ?? "Image upload failed.");
      return;
    }

    setImageUrl(data.imageUrl);
    setPreview(data.imageUrl);
    setUploadStatus("Image uploaded.");
  }

  async function clearSelectedImage() {
    const confirmed = window.confirm("Remove this selected section image? Save changes afterward to update the section.");
    if (!confirmed) return;

    const isUnsavedUploadedImage = imageUrl.startsWith("/uploads/cakes/") && imageUrl !== editing?.imageUrl;

    if (isUnsavedUploadedImage) {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
    }

    setImageUrl("");
    setPreview("");
    setUploadStatus("Image removed. Save changes to update this section.");
  }

  function updateCategoryCard(index: number, patch: Partial<HomeCategoryCard>) {
    setCategoryCards((currentCards) =>
      currentCards.map((card, cardIndex) => {
        if (cardIndex !== index) return card;
        const title = patch.title ?? card.title;
        return {
          ...card,
          ...patch,
          id: patch.id ?? card.id ?? slugify(title),
        };
      }),
    );
  }

  function addCategoryCard() {
    const nextIndex = categoryCards.length + 1;
    setCategoryCards((currentCards) => [
      ...currentCards,
      {
        id: `category-card-${nextIndex}`,
        title: `Category Card ${nextIndex}`,
        description: "",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
        imageAlt: `Category Card ${nextIndex}`,
        ctaLabel: "Explore More",
        ctaHref: "#contact",
        displayOrder: nextIndex,
        status: "ACTIVE",
      },
    ]);
  }

  function deleteCategoryCard(index: number) {
    const card = categoryCards[index];
    const confirmed = window.confirm(`Delete ${card?.title ?? "this category card"}? This action cannot be undone after saving.`);
    if (!confirmed) return;

    setCategoryCards((currentCards) => currentCards.filter((_, cardIndex) => cardIndex !== index));
  }

  function updateWhyCard(index: number, patch: Partial<HomeWhyCard>) {
    setWhyCards((currentCards) =>
      currentCards.map((card, cardIndex) => {
        if (cardIndex !== index) return card;
        const title = patch.title ?? card.title;
        return {
          ...card,
          ...patch,
          id: patch.id ?? card.id ?? slugify(title),
        };
      }),
    );
  }

  function addWhyCard() {
    const nextIndex = whyCards.length + 1;
    setWhyCards((currentCards) => [
      ...currentCards,
      {
        id: `why-card-${nextIndex}`,
        title: `Why Card ${nextIndex}`,
        text: "",
        displayOrder: nextIndex,
        status: "ACTIVE",
      },
    ]);
  }

  function deleteWhyCard(index: number) {
    const card = whyCards[index];
    const confirmed = window.confirm(`Delete ${card?.title ?? "this Why Us card"}? Save changes afterward to update the section.`);
    if (!confirmed) return;

    setWhyCards((currentCards) => currentCards.filter((_, cardIndex) => cardIndex !== index));
  }

  async function handleCategoryCardUpload(index: number, file?: File) {
    if (!file) return;

    setUploadStatus("Uploading category card image...");

    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });

    const data = (await response.json()) as { imageUrl?: string; error?: string };

    if (!response.ok || !data.imageUrl) {
      setUploadStatus(data.error ?? "Image upload failed.");
      return;
    }

    updateCategoryCard(index, { imageUrl: data.imageUrl });
    setUploadStatus("Category card image uploaded.");
  }

  function clearCategoryCardImage(index: number) {
    const card = categoryCards[index];
    const confirmed = window.confirm(`Remove the image from ${card?.title ?? "this category card"}? Save changes afterward to update the section.`);
    if (!confirmed) return;

    updateCategoryCard(index, { imageUrl: "" });
  }

  async function deleteSection(section: HomePageSection) {
    const confirmed = window.confirm(`Delete ${section.label}? This action cannot be undone.`);
    if (!confirmed) return;

    await fetch(`/api/admin/home-page/${section.id}`, { method: "DELETE" });

    if (section.imageUrl?.startsWith("/uploads/cakes/")) {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: section.imageUrl }),
      });
    }

    setMessage("Home page section deleted.");
    if (editing?.id === section.id) cancelEditing();
    await loadSections();
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p>Home Page</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-publish-button" onClick={() => void loadSections()}>
            Refresh Sections
          </button>
          <Link href="/" className="admin-outline-button">
            View Home Page
          </Link>
        </div>
      </header>

      <section className="admin-table-card admin-home-sections-card">
        <div>
          <h2>All Home Page Sections</h2>
        </div>
        {message ? <p className="admin-muted" role="status">{message}</p> : null}
        <table>
          <thead>
            <tr>
              <th>Section</th>
              <th>Section ID</th>
              <th>Title</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id} className={editing?.id === section.id ? "admin-home-section-active" : undefined}>
                <td>{section.label}</td>
                <td><code className="admin-section-id">#{section.sectionKey}</code></td>
                <td>{section.title}</td>
                <td>{section.displayOrder}</td>
                <td>
                  <span>{section.status === "ACTIVE" ? "Active" : "Inactive"}</span>
                </td>
                <td>
                  <button type="button" className="admin-action-icon" onClick={() => startEditing(section)} aria-label={`Edit ${section.label}`} title="Edit">
                    <EditIcon />
                  </button>
                  <button type="button" className="admin-action-icon" onClick={() => void deleteSection(section)} aria-label={`Delete ${section.label}`} title="Delete">
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}

            <tr className="admin-home-section-linkrow">
              <td>Custom Order Popup</td>
              <td>custom-order</td>
              <td>Custom order popup content &amp; options</td>
              <td>—</td>
              <td>
                <span>Managed</span>
              </td>
              <td>
                <button
                  type="button"
                  className={`admin-action-icon is-manage${activePanel === "custom-order" ? " is-open" : ""}`}
                  onClick={() => togglePanel("custom-order")}
                  aria-expanded={activePanel === "custom-order"}
                  aria-label={activePanel === "custom-order" ? "Close Custom Order Popup" : "Manage Custom Order Popup"}
                  title={activePanel === "custom-order" ? "Close" : "Manage"}
                >
                  {activePanel === "custom-order" ? <CloseIcon /> : <ManageIcon />}
                </button>
              </td>
            </tr>
            <tr className="admin-home-section-linkrow">
              <td>Reviews</td>
              <td><code className="admin-section-id">#reviews</code></td>
              <td>Customer reviews shown on the home page</td>
              <td>—</td>
              <td>
                <span>Managed</span>
              </td>
              <td>
                <button
                  type="button"
                  className={`admin-action-icon is-manage${activePanel === "reviews" ? " is-open" : ""}`}
                  onClick={() => togglePanel("reviews")}
                  aria-expanded={activePanel === "reviews"}
                  aria-label={activePanel === "reviews" ? "Close Reviews" : "Manage Reviews"}
                  title={activePanel === "reviews" ? "Close" : "Manage"}
                >
                  {activePanel === "reviews" ? <CloseIcon /> : <ManageIcon />}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {activePanel === "custom-order" ? (
        <section className="admin-home-section-editor-card">
          <CustomOrderManager initialSettings={customOrderSettings} embedded />
        </section>
      ) : null}

      {activePanel === "reviews" ? (
        <section className="admin-home-section-editor-card">
          <ReviewsManager initialReviews={reviews} embedded />
        </section>
      ) : null}

      {editing ? (
        <section className="admin-resource-card admin-home-section-editor-card">
          <form onSubmit={handleSubmit} className="admin-category-form admin-home-section-editor" key={editing.id}>
            <div className="admin-home-section-editor-heading">
              <h3>Edit {editing.label} <code className="admin-section-id">#{editing.sectionKey}</code></h3>
              <button type="button" className="admin-secondary-button" onClick={cancelEditing}>
                Cancel
              </button>
            </div>
            {editing.sectionKey !== "why-us" ? (
              <>
                <label>
                  Section Label
                  <input name="label" defaultValue={editing.label} required />
                </label>
                <label>
                  Section Key
                  <input name="sectionKey" defaultValue={editing.sectionKey} required />
                </label>
                <label>
                  Title
                  <input name="title" defaultValue={editing.title} required />
                </label>
                <label>
                  Subtitle
                  <input name="subtitle" defaultValue={editing.subtitle ?? ""} />
                </label>
                <label>
                  Content
                  <textarea name="content" defaultValue={editing.content ?? ""} />
                </label>
              </>
            ) : null}
            {editing.sectionKey === "categories" ? (
              <section className="admin-home-category-cards" aria-label="Our Categories cards">
                <div className="admin-home-section-editor-heading">
                  <h3>Our Categories Image Cards</h3>
                  <button type="button" className="admin-secondary-button" onClick={addCategoryCard}>
                    Add Card
                  </button>
                </div>
                <div className="admin-home-category-card-list">
                  {categoryCards.map((card, index) => (
                    <article className="admin-home-category-card-editor" key={`${card.id}-${index}`}>
                      <div className="admin-home-category-card-preview">
                        {card.imageUrl ? (
                          <Image src={card.imageUrl} alt={card.imageAlt || card.title} fill sizes="220px" className="object-cover" />
                        ) : null}
                      </div>
                      <div className="admin-home-category-card-fields">
                        <label>
                          Card Title
                          <input value={card.title} onChange={(event) => updateCategoryCard(index, { title: event.currentTarget.value })} />
                        </label>
                        <label>
                          Description
                          <textarea
                            value={card.description ?? ""}
                            onChange={(event) => updateCategoryCard(index, { description: event.currentTarget.value })}
                          />
                        </label>
                        <label>
                          Image URL
                          <input value={card.imageUrl} onChange={(event) => updateCategoryCard(index, { imageUrl: event.currentTarget.value })} />
                        </label>
                        <div className="admin-upload-control">
                          <label>
                            Upload Card Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                void handleCategoryCardUpload(index, event.currentTarget.files?.[0]);
                              }}
                            />
                          </label>
                          <button type="button" className="admin-upload-delete" onClick={() => clearCategoryCardImage(index)}>
                            Remove
                          </button>
                        </div>
                        <label>
                          Image Alt Text
                          <input value={card.imageAlt} onChange={(event) => updateCategoryCard(index, { imageAlt: event.currentTarget.value })} />
                        </label>
                        <label>
                          CTA Label
                          <input value={card.ctaLabel ?? ""} onChange={(event) => updateCategoryCard(index, { ctaLabel: event.currentTarget.value })} />
                        </label>
                        <label>
                          CTA Link
                          <input value={card.ctaHref ?? ""} onChange={(event) => updateCategoryCard(index, { ctaHref: event.currentTarget.value })} />
                        </label>
                        <label>
                          Display Order
                          <input
                            type="number"
                            value={card.displayOrder}
                            onChange={(event) => updateCategoryCard(index, { displayOrder: Number(event.currentTarget.value) })}
                          />
                        </label>
                        <label>
                          Status
                          <select
                            value={card.status}
                            onChange={(event) => updateCategoryCard(index, { status: event.currentTarget.value as HomeCategoryCard["status"] })}
                          >
                            <option value="ACTIVE">Show Card</option>
                            <option value="INACTIVE">Hide Card</option>
                          </select>
                        </label>
                        <button type="button" className="admin-secondary-button" onClick={() => deleteCategoryCard(index)}>
                          Delete Card
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
            {editing.sectionKey === "why-us" ? (
              <section className="admin-home-why-cards" aria-label="Why Us cards">
                <div className="admin-home-section-editor-heading">
                  <h3>Why Us Box Cards</h3>
                  <button type="button" className="admin-secondary-button" onClick={addWhyCard}>
                    Add Card
                  </button>
                </div>
                <div className="admin-home-why-card-list">
                  {whyCards.map((card, index) => (
                    <article className="admin-home-why-card-editor" key={`${card.id}-${index}`}>
                      <label>
                        Card Title
                        <input value={card.title} onChange={(event) => updateWhyCard(index, { title: event.currentTarget.value })} />
                      </label>
                      <label>
                        Card Description
                        <textarea value={card.text} onChange={(event) => updateWhyCard(index, { text: event.currentTarget.value })} />
                      </label>
                      <label>
                        Display Order
                        <input
                          type="number"
                          value={card.displayOrder}
                          onChange={(event) => updateWhyCard(index, { displayOrder: Number(event.currentTarget.value) })}
                        />
                      </label>
                      <label>
                        Status
                        <select value={card.status} onChange={(event) => updateWhyCard(index, { status: event.currentTarget.value as HomeWhyCard["status"] })}>
                          <option value="ACTIVE">Show Card</option>
                          <option value="INACTIVE">Hide Card</option>
                        </select>
                      </label>
                      <button type="button" className="admin-secondary-button" onClick={() => deleteWhyCard(index)}>
                        Delete Card
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
            {editing.sectionKey !== "why-us" ? (
              <>
                <div className="admin-home-image-grid">
                  <div className="admin-gallery-preview admin-home-image-preview">
                    {preview ? <Image src={preview} alt="Home page section preview" fill sizes="360px" className="object-cover" /> : null}
                  </div>
                  <div className="admin-home-image-controls">
                    <label>
                      Image URL
                      <input
                        name="imageUrl"
                        value={imageUrl}
                        onChange={(event) => {
                          setImageUrl(event.currentTarget.value);
                          setPreview(event.currentTarget.value);
                        }}
                      />
                    </label>
                    <div className="admin-upload-control">
                      <label>
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            void handleImageUpload(event.currentTarget.files?.[0]);
                          }}
                        />
                      </label>
                      {imageUrl ? (
                        <button type="button" className="admin-upload-delete" onClick={() => void clearSelectedImage()}>
                          Remove
                        </button>
                      ) : null}
                    </div>
                    {uploadStatus ? <p className="admin-upload-status">{uploadStatus}</p> : null}
                    {isUploading ? <p className="admin-upload-status">Please wait while the section image is saved.</p> : null}
                  </div>
                </div>
                <label>
                  Image Alt Text
                  <input name="imageAlt" defaultValue={editing.imageAlt ?? ""} />
                </label>
                <label>
                  CTA Label
                  <input name="ctaLabel" defaultValue={editing.ctaLabel ?? ""} />
                </label>
                <label>
                  CTA Link
                  <input name="ctaHref" defaultValue={editing.ctaHref ?? ""} />
                </label>
                <label>
                  Secondary CTA Label
                  <input name="secondaryCtaLabel" defaultValue={editing.secondaryCtaLabel ?? ""} placeholder="Explore our Treat" />
                </label>
                <label>
                  Secondary CTA Link
                  <input name="secondaryCtaHref" defaultValue={editing.secondaryCtaHref ?? ""} placeholder="/gallery" />
                </label>
              </>
            ) : null}
            <label>
              Display Order
              <input name="displayOrder" type="number" defaultValue={editing.displayOrder} />
            </label>
            <label>
              Status
              <select name="status" defaultValue={editing.status}>
                <option value="ACTIVE">Show Section</option>
                <option value="INACTIVE">Hide Section</option>
              </select>
            </label>
            <button type="submit">Update Section</button>
          </form>
        </section>
      ) : null}
    </main>
  );
}
