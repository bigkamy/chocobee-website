"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { notifyPublished } from "../AdminToast";
import { GALLERY_FILTER_FIELDS, GALLERY_FILTERS_ENABLED } from "@/lib/gallery-filters";

type Category = {
  id: string;
  name: string;
  slug: string;
  subcategoryCtas?: SubcategoryCta[];
};

type SubcategoryCta = {
  id: string;
  label: string;
  href: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
};

type GalleryImage = {
  id: string;
  cakeId?: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
  categoryId?: string | null;
  categorySlug?: string | null;
  categoryIds?: string[];
  categorySlugs?: string[];
  subcategoryCtaIds?: string[];
  homeGroups?: string[];
  tags?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  altText: string;
  keywords?: string | null;
  minCakeSizeKg?: number | null;
  gender?: string | null;
  ageGroup?: string | null;
  flavour?: string | null;
  tier?: string | null;
  featured: boolean;
  status: "ACTIVE" | "INACTIVE";
};

const homeGalleryGroups = ["Recent Designs", "Most Viewed", "Top on Demand"] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.8 12s3.3-6 9.2-6 9.2 6 9.2 6-3.3 6-9.2 6-9.2-6-9.2-6Z" />
      <path d="M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 20 4.6-1.3L19.3 8a2.4 2.4 0 0 0-3.4-3.4L5.3 15.3 4 20Z" />
      <path d="m14 6 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="m6 7 1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function GalleryStackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="m3 16 4.5-4.5a2 2 0 0 1 2.8 0L15 16" />
      <path d="m13 14 2-2a2 2 0 0 1 2.8 0L21 15" />
      <circle cx="9" cy="9" r="1.6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="admin-gallery-card-field-chevron">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
    </svg>
  );
}

export function GalleryManager({
  initialCategories,
  initialImages,
  initialFilterFields,
}: {
  initialCategories: Category[];
  initialImages: GalleryImage[];
  initialFilterFields: string[];
}) {
  const [images, setImages] = useState(initialImages);
  const [filterFields, setFilterFields] = useState<string[]>(initialFilterFields);
  const [savingFilterFields, setSavingFilterFields] = useState(false);
  const [filterFieldsMessage, setFilterFieldsMessage] = useState("");
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  // Controlled selection state so edits survive collapsing/re-opening the
  // accordions and are always submitted, regardless of which list is open.
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([]);
  const [selectedHomeGroups, setSelectedHomeGroups] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState(editing?.imageUrl ?? "");
  const [preview, setPreview] = useState(editing?.imageUrl ?? "");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [isCategoryListOpen, setIsCategoryListOpen] = useState(false);
  const [isHomeGroupListOpen, setIsHomeGroupListOpen] = useState(false);
  const [isSubcategoryListOpen, setIsSubcategoryListOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formVersion, setFormVersion] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const categorySubcategoryGroups = initialCategories
    .map((category) => ({
      ...category,
      subcategoryCtas: (category.subcategoryCtas ?? [])
        .filter((cta) => cta.status === "ACTIVE")
        .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label)),
    }))
    .filter((category) => category.subcategoryCtas.length);
  const subcategoryLabelById = new Map(
    categorySubcategoryGroups.flatMap((category) => category.subcategoryCtas.map((subcategory) => [subcategory.id, subcategory.label] as const)),
  );
  const categoryNameById = new Map(initialCategories.map((category) => [category.id, category.name] as const));

  const filteredImages = useMemo(() => {
    const q = query.toLowerCase().trim();
    return images
      .filter((image) =>
        categoryFilter === "all" ? true : image.categoryId === categoryFilter || image.categoryIds?.includes(categoryFilter),
      )
      .filter((image) =>
        q ? [image.title, image.tags, image.keywords].filter(Boolean).some((value) => value?.toLowerCase().includes(q)) : true,
      );
  }, [categoryFilter, images, query]);

  async function refreshImages(preserveImage?: GalleryImage) {
    const response = await fetch("/api/admin/gallery", { cache: "no-store" });
    const data = (await response.json()) as { items?: GalleryImage[] };
    const nextImages = data.items ?? [];

    if (!preserveImage || nextImages.some((image) => image.id === preserveImage.id)) {
      setImages(nextImages);
      return;
    }

    setImages([preserveImage, ...nextImages]);
  }

  async function publishGallery() {
    await refreshImages();
    setMessage("Image gallery published to the live website.");
    notifyPublished();
  }

  function toggleFilterField(key: string) {
    setFilterFields((current) => (current.includes(key) ? current.filter((field) => field !== key) : [...current, key]));
    setFilterFieldsMessage("");
  }

  async function saveFilterFields() {
    setSavingFilterFields(true);
    setFilterFieldsMessage("");
    try {
      const response = await fetch("/api/admin/gallery-filters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: filterFields }),
      });
      if (!response.ok) throw new Error("save failed");
      setFilterFieldsMessage("Filter fields saved.");
    } catch {
      setFilterFieldsMessage("Could not save filter fields.");
    } finally {
      setSavingFilterFields(false);
    }
  }

  function startEditing(image: GalleryImage) {
    setEditing(image);
    setSelectedCategoryIds(image.categoryIds?.length ? image.categoryIds : image.categoryId ? [image.categoryId] : []);
    setSelectedSubcategoryIds(image.subcategoryCtaIds ?? []);
    setSelectedHomeGroups(image.homeGroups ?? []);
    setImageUrl(image.imageUrl);
    setPreview(image.imageUrl);
    setIsCategoryListOpen(false);
    setIsHomeGroupListOpen(false);
    setIsSubcategoryListOpen(false);
    setUploadStatus("");
    setMessage("");
    setIsFormOpen(true);
  }

  function startAdding() {
    setEditing(null);
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setSelectedHomeGroups([]);
    setImageUrl("");
    setPreview("");
    setIsCategoryListOpen(false);
    setIsHomeGroupListOpen(false);
    setIsSubcategoryListOpen(false);
    setUploadStatus("");
    setMessage("");
    setFormVersion((version) => version + 1);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    resetImageForm();
  }

  useEffect(() => {
    if (!isFormOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeForm();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormOpen]);

  function resetImageForm(statusMessage?: string) {
    setEditing(null);
    setSelectedCategoryIds([]);
    setSelectedSubcategoryIds([]);
    setSelectedHomeGroups([]);
    setImageUrl("");
    setPreview("");
    setIsCategoryListOpen(false);
    setIsHomeGroupListOpen(false);
    setIsSubcategoryListOpen(false);
    setUploadStatus("");
    setIsUploading(false);
    setFormVersion((version) => version + 1);
    if (statusMessage) {
      setMessage(statusMessage);
    }
  }

  async function saveImage(payload: Partial<GalleryImage>, id?: string) {
    const response = await fetch(id ? `/api/admin/gallery/${id}` : "/api/admin/gallery", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => null)) as { item?: GalleryImage; error?: string } | null;

    if (!response.ok || !data?.item) {
      setMessage("Could not save image. Please check all required fields.");
      return null;
    }

    const savedImage = data.item;

    setImages((currentImages) => {
      // Keep an edited image in its existing position so the gallery doesn't
      // jump to the top; only brand-new images are added at the front. `id` is
      // the previous id when editing (also covers a changed slug).
      const existingIndex = currentImages.findIndex((image) => image.id === (id ?? savedImage.id));
      if (existingIndex === -1) {
        return [savedImage, ...currentImages];
      }
      const nextImages = currentImages.slice();
      nextImages[existingIndex] = savedImage;
      return nextImages;
    });

    void refreshImages(savedImage);
    return savedImage;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!imageUrl) {
      setUploadStatus("Please upload a cake image before saving.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "");
    const slug = String(form.get("slug") || slugify(title));
    const categoryIds = selectedCategoryIds;
    const subcategoryCtaIds = selectedSubcategoryIds;
    const homeGroups = selectedHomeGroups;
    const payload = {
      title,
      slug,
      description: String(form.get("description") ?? ""),
      imageUrl,
      categoryId: categoryIds[0] ?? "",
      categoryIds,
      subcategoryCtaIds,
      homeGroups,
      tags: String(form.get("tags") ?? ""),
      seoTitle: String(form.get("seoTitle") || `${title} | Chocobee Cake Studio`),
      metaDescription: String(form.get("metaDescription") ?? ""),
      altText: String(form.get("altText") || title),
      keywords: String(form.get("keywords") ?? ""),
      minCakeSizeKg: Number(form.get("minCakeSizeKg")) > 0 ? Number(form.get("minCakeSizeKg")) : 0.5,
      featured: form.get("featured") === "on",
      status: String(form.get("status") ?? "ACTIVE") as GalleryImage["status"],
    };

    const saved = await saveImage(payload, editing?.id);
    if (!saved) return;

    setIsFormOpen(false);
    resetImageForm(editing ? "Image updated." : "Image added.");
    notifyPublished();
    if (!editing) {
      setQuery("");
      setCategoryFilter("all");
      window.alert("Cake image has been uploaded successfully");
    }
  }

  async function handleImageUpload(file?: File) {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("Uploading image...");

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
    const confirmed = window.confirm("Remove this selected image from the form? Unsaved uploaded files may be deleted.");
    if (!confirmed) return;

    // Covers both legacy same-origin uploads and S3-hosted uploads (".../cakes/...").
    const isUnsavedUploadedImage = imageUrl.includes("/cakes/") && imageUrl !== editing?.imageUrl;

    if (isUnsavedUploadedImage) {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
    }

    setImageUrl("");
    setPreview("");
    setUploadStatus(editing ? "Image cleared. Submit update to save this change." : "Image removed from the form.");
  }

  async function updateImageQuick(id: string, payload: Partial<Pick<GalleryImage, "categoryId" | "categoryIds" | "subcategoryCtaIds" | "featured" | "status">>) {
    const current = images.find((image) => image.id === id);
    if (!current) return;

    await saveImage(
      {
        title: current.title,
        slug: current.slug,
        description: current.description ?? "",
        imageUrl: current.imageUrl,
        categoryId: current.categoryId ?? "",
        categoryIds: current.categoryIds ?? (current.categoryId ? [current.categoryId] : []),
        subcategoryCtaIds: current.subcategoryCtaIds ?? [],
        homeGroups: current.homeGroups ?? [],
        tags: current.tags ?? "",
        seoTitle: current.seoTitle ?? "",
        metaDescription: current.metaDescription ?? "",
        altText: current.altText,
        keywords: current.keywords ?? "",
        minCakeSizeKg: current.minCakeSizeKg ?? 0.5,
        gender: current.gender ?? "",
        ageGroup: current.ageGroup ?? "",
        flavour: current.flavour ?? "",
        tier: current.tier ?? "",
        featured: current.featured,
        status: current.status,
        ...payload,
      },
      id,
    );
    setMessage("Image updated.");
  }

  async function deleteImage(id: string) {
    const current = images.find((image) => image.id === id);
    const confirmed = window.confirm(`Delete ${current?.title ?? "this image"}? This action cannot be undone.`);
    if (!confirmed) return;

    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (current?.imageUrl.includes("/cakes/")) {
      await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: current.imageUrl }),
      });
    }
    setMessage("Image removed.");
    await refreshImages();
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <p>Gallery Images</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-add-image-button" onClick={startAdding}>
            <PlusIcon />
            Add Image
          </button>
          <button type="button" className="admin-publish-button" onClick={() => void publishGallery()}>
            Publish Gallery
          </button>
        </div>
      </header>

      {GALLERY_FILTERS_ENABLED ? (
      <article className="admin-resource-card admin-gallery-filter-fields">
        <h2>Gallery Filter Fields</h2>
        <p className="admin-muted">Choose which filter dropdowns appear in the public gallery filter bar.</p>
        <div className="admin-filter-fields-list">
          {GALLERY_FILTER_FIELDS.map((field) => (
            <label key={field.key} className="admin-category-check-option">
              <input type="checkbox" checked={filterFields.includes(field.key)} onChange={() => toggleFilterField(field.key)} />
              <span>{field.label}</span>
            </label>
          ))}
        </div>
        <div className="admin-filter-fields-actions">
          <button type="button" onClick={() => void saveFilterFields()} disabled={savingFilterFields}>
            {savingFilterFields ? "Saving..." : "Save Filter Fields"}
          </button>
          {filterFieldsMessage ? <span role="status">{filterFieldsMessage}</span> : null}
        </div>
      </article>
      ) : null}

      <section className="admin-gallery-control-layout">
        <div className="admin-gallery-left-panel">
          <article className="admin-resource-card">
            <h2>Search and Filter</h2>
            <div className="admin-category-form admin-gallery-filter-row">
              <label>
                Search Images
                <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search by cake name or tag" />
              </label>
              <label>
                Filter Category
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.currentTarget.value)}>
                  <option value="all">All Categories</option>
                  {initialCategories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>

          <section className="admin-gallery-table-card">
            <div className="admin-gallery-table-heading">
              <div className="admin-gallery-table-heading-label">
                <span className="admin-gallery-table-heading-icon" aria-hidden="true">
                  <GalleryStackIcon />
                </span>
                <div>
                  <h2>Uploaded Cake Images</h2>
                  <p>Manage every cake photo shown across your website</p>
                </div>
              </div>
              <div className="admin-gallery-heading-actions">
                <span className="admin-gallery-count-badge">
                  {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
                </span>
                <button type="button" className="admin-add-image-button admin-add-image-button--soft" onClick={startAdding}>
                  <PlusIcon />
                  Add Image
                </button>
              </div>
            </div>

            <div className="admin-gallery-rows">
              {filteredImages.length === 0 ? (
                <div className="admin-gallery-empty">
                  <span className="admin-gallery-empty-icon" aria-hidden="true">
                    <GalleryStackIcon />
                  </span>
                  <h3>No cake images to show</h3>
                  <p>Upload your first cake photo, or adjust your search and category filters to see results.</p>
                  <button type="button" className="admin-add-image-button" onClick={startAdding}>
                    <PlusIcon />
                    Add Image
                  </button>
                </div>
              ) : (
                filteredImages.map((image, index) => (
                <article className="admin-gallery-row" key={image.id}>
                  <div className="admin-gallery-thumb">
                    <span className="admin-gallery-index" aria-label={`Image number ${index + 1}`}>{index + 1}</span>
                    <Image src={image.imageUrl} alt={image.altText} fill sizes="88px" className="object-cover" />
                  </div>

                  <div className="admin-gallery-row-main">
                    <div className="admin-gallery-row-title">
                      <h2>{image.title}</h2>
                      {image.cakeId ? (
                        <span className="admin-gallery-cake-id" title="Unique Cake ID">
                          ID: {image.cakeId}
                        </span>
                      ) : null}
                    </div>

                    <div className="admin-gallery-row-badges">
                      <details className="admin-gallery-card-field" aria-label={`Home page gallery groups for ${image.title}`}>
                        <summary>
                          <span>Home Page</span>
                          <span className="admin-gallery-card-field-count">
                            {image.homeGroups?.length ? `${image.homeGroups.length} selected` : "None"}
                          </span>
                          <ChevronIcon />
                        </summary>
                        <div className="admin-gallery-card-field-values">
                          {image.homeGroups?.length ? (
                            image.homeGroups.map((group) => <strong key={group}>{group}</strong>)
                          ) : (
                            <em>Not on homepage</em>
                          )}
                        </div>
                      </details>

                      <details className="admin-gallery-card-field" aria-label={`Selected subcategories for ${image.title}`}>
                        <summary>
                          <span>Subcategories</span>
                          <span className="admin-gallery-card-field-count">
                            {image.subcategoryCtaIds?.length ? `${image.subcategoryCtaIds.length} selected` : "None"}
                          </span>
                          <ChevronIcon />
                        </summary>
                        <div className="admin-gallery-card-field-values">
                          {image.subcategoryCtaIds?.length ? (
                            image.subcategoryCtaIds.map((subcategoryId) => <strong key={subcategoryId}>{subcategoryLabelById.get(subcategoryId) ?? subcategoryId}</strong>)
                          ) : (
                            <em>None selected</em>
                          )}
                        </div>
                      </details>

                      <div className="admin-gallery-home-groups" aria-label={`Minimum cake size for ${image.title}`}>
                        <span>Min. Cake Size</span>
                        <div>
                          <strong>{image.minCakeSizeKg ?? 0.5} kg</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-gallery-row-controls">
                    {(() => {
                      const savedCategoryIds = image.categoryIds?.length
                        ? image.categoryIds
                        : image.categoryId
                          ? [image.categoryId]
                          : [];
                      const savedCategoryNames = savedCategoryIds.map((categoryId) => categoryNameById.get(categoryId) ?? categoryId);
                      return (
                        <details className="admin-gallery-card-field" aria-label={`Categories for ${image.title}`}>
                          <summary>
                            <span>Category</span>
                            <span className="admin-gallery-card-field-count">
                              {savedCategoryNames.length ? `${savedCategoryNames.length} selected` : "None"}
                            </span>
                            <ChevronIcon />
                          </summary>
                          <div className="admin-gallery-card-field-values">
                            {savedCategoryNames.length ? (
                              savedCategoryNames.map((name) => <strong key={name}>{name}</strong>)
                            ) : (
                              <em>No category</em>
                            )}
                          </div>
                        </details>
                      );
                    })()}

                    <div className="admin-gallery-status-column">
                      <div className="admin-gallery-row-actions">
                        <a href={`/cakes/${image.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${image.title}`} title="View">
                          <EyeIcon />
                        </a>
                        <button type="button" onClick={() => startEditing(image)} aria-label={`Edit ${image.title}`} title="Edit">
                          <EditIcon />
                        </button>
                        <button type="button" onClick={() => deleteImage(image.id)} aria-label={`Remove ${image.title}`} title="Remove">
                          <TrashIcon />
                        </button>
                      </div>

                      <div className="admin-gallery-row-stacked-controls">
                        <label>
                          Featured
                          <select value={image.featured ? "yes" : "no"} onChange={(event) => updateImageQuick(image.id, { featured: event.currentTarget.value === "yes" })}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </label>

                        <label>
                          Visibility
                          <select value={image.status} onChange={(event) => updateImageQuick(image.id, { status: event.currentTarget.value as GalleryImage["status"] })}>
                            <option value="ACTIVE">Show</option>
                            <option value="INACTIVE">Hide</option>
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </article>
                ))
              )}
            </div>
          </section>
        </div>

      </section>

      {isFormOpen ? (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-label={editing ? "Edit cake image" : "Add cake image"} onClick={closeForm}>
          <div className="admin-gallery-modal" onClick={(event) => event.stopPropagation()}>
            <header className="admin-gallery-modal-header">
              <div className="admin-gallery-modal-heading">
                <span className="admin-gallery-modal-heading-icon" aria-hidden="true">
                  <GalleryStackIcon />
                </span>
                <div>
                  <h2>{editing ? "Edit Cake Image" : "Add Cake Image"}</h2>
                  <p>{editing ? "Update this cake photo and its details." : "Upload a new cake photo and fill in its details."}</p>
                </div>
              </div>
              <button type="button" className="admin-gallery-modal-close" onClick={closeForm} aria-label="Close">
                <CloseIcon />
              </button>
            </header>

            <form key={editing?.id ?? `new-image-${formVersion}`} onSubmit={handleSubmit} className="admin-gallery-modal-form admin-category-form">
          <div className="admin-gallery-modal-identity">
            <div className="admin-gallery-modal-identity-media">
              {editing?.cakeId ? (
                <div className="admin-gallery-modal-cakeid">
                  <span>Cake ID</span>
                  <span className="admin-section-id">{editing.cakeId}</span>
                </div>
              ) : null}
              {preview ? (
                <div className="admin-gallery-preview admin-gallery-preview-vertical">
                  <Image src={preview} alt="Cake preview" fill sizes="200px" className="object-contain" />
                </div>
              ) : null}
            </div>
            <div className="admin-gallery-modal-identity-fields">
              <div className="admin-upload-control">
                <label>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      void handleImageUpload(event.currentTarget.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {imageUrl ? (
                  <button type="button" className="admin-upload-delete" onClick={() => void clearSelectedImage()}>
                    Delete Image
                  </button>
                ) : null}
              </div>
              {uploadStatus ? <p className="admin-upload-status">{uploadStatus}</p> : null}
              {isUploading ? <p className="admin-upload-status">Please wait while the cake image is saved.</p> : null}
              <label>
                Cake Title
                <input name="title" defaultValue={editing?.title} placeholder="Chocolate Truffle Cake" required />
              </label>
              <label>
                URL Slug
                <input name="slug" defaultValue={editing?.slug} placeholder="chocolate-truffle-cake" required />
              </label>
              <label>
                Minimum Cake Size Required
                <span className="admin-size-field">
                  <input
                    name="minCakeSizeKg"
                    type="number"
                    inputMode="decimal"
                    step="0.5"
                    min="0.5"
                    defaultValue={editing?.minCakeSizeKg ?? 0.5}
                    required
                  />
                  <span className="admin-size-unit">kg</span>
                </span>
              </label>
              <label>
                Short Description
                <textarea name="description" defaultValue={editing?.description ?? ""} placeholder="Short cake description" />
              </label>
            </div>
          </div>
          <div className="admin-gallery-modal-taxonomy">
          <p className="admin-gallery-modal-taxonomy-title">Category Listing</p>
          <div className="admin-category-field">
            <button
              type="button"
              className="admin-category-toggle"
              onClick={() => setIsHomeGroupListOpen((isOpen) => !isOpen)}
              aria-expanded={isHomeGroupListOpen}
              aria-controls="admin-home-gallery-group-list"
            >
              <span>Home Page Cake Gallery</span>
              <span>{isHomeGroupListOpen ? "Hide list" : `${selectedHomeGroups.length || "No"} selected`}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={isHomeGroupListOpen ? "admin-category-chevron-open" : ""}>
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              </svg>
            </button>
            {isHomeGroupListOpen ? (
              <div className="admin-category-checklist" id="admin-home-gallery-group-list" role="group" aria-label="Select home page cake gallery groups">
                {homeGalleryGroups.map((group) => (
                  <label className="admin-category-check-option" key={group}>
                    <input
                      type="checkbox"
                      checked={selectedHomeGroups.includes(group)}
                      onChange={() => setSelectedHomeGroups((list) => toggleValue(list, group))}
                    />
                    <span>{group}</span>
                  </label>
                ))}
              </div>
            ) : null}
          </div>
          <div className="admin-category-field">
            <button
              type="button"
              className="admin-category-toggle"
              onClick={() => setIsCategoryListOpen((isOpen) => !isOpen)}
              aria-expanded={isCategoryListOpen}
              aria-controls="admin-image-category-list"
            >
              <span>Category</span>
              <span>{isCategoryListOpen ? "Hide list" : `${selectedCategoryIds.length || "No"} selected`}</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" className={isCategoryListOpen ? "admin-category-chevron-open" : ""}>
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
              </svg>
            </button>
            {isCategoryListOpen ? (
              <div className="admin-category-checklist" id="admin-image-category-list" role="group" aria-label="Select cake categories">
                {initialCategories.map((category) => {
                  return (
                    <label className="admin-category-check-option" key={category.id}>
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(category.id)}
                        onChange={() => setSelectedCategoryIds((list) => toggleValue(list, category.id))}
                      />
                      <span>{category.name}</span>
                    </label>
                  );
                })}
              </div>
            ) : null}
          </div>
          {categorySubcategoryGroups.length ? (
            <div className="admin-category-field">
              <button
                type="button"
                className="admin-category-toggle"
                onClick={() => setIsSubcategoryListOpen((isOpen) => !isOpen)}
                aria-expanded={isSubcategoryListOpen}
                aria-controls="admin-image-subcategory-list"
              >
                <span>Sub Categories</span>
                <span>{isSubcategoryListOpen ? "Hide list" : `${selectedSubcategoryIds.length || "No"} selected`}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={isSubcategoryListOpen ? "admin-category-chevron-open" : ""}>
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                </svg>
              </button>
              {isSubcategoryListOpen ? (
                <div className="admin-category-checklist admin-subcategory-checklist" id="admin-image-subcategory-list" role="group" aria-label="Select cake subcategories">
                  {categorySubcategoryGroups.map((category) => (
                    <div className="admin-subcategory-group" key={category.id}>
                      <strong>{category.name}</strong>
                      <div className="admin-subcategory-options">
                        {category.subcategoryCtas.map((subcategory) => (
                          <label className="admin-category-check-option" key={subcategory.id}>
                            <input
                              type="checkbox"
                              checked={selectedSubcategoryIds.includes(subcategory.id)}
                              onChange={() => setSelectedSubcategoryIds((list) => toggleValue(list, subcategory.id))}
                            />
                            <span>{subcategory.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          </div>
          <div className="admin-gallery-modal-seo">
          <p className="admin-gallery-modal-seo-title">TAGGING / SEO / Meta</p>
          <label>
            Tags
            <input name="tags" defaultValue={editing?.tags ?? ""} placeholder="chocolate, birthday, kids" />
          </label>
          <label>
            SEO Title
            <input name="seoTitle" defaultValue={editing?.seoTitle ?? ""} placeholder="Meta title" />
          </label>
          <label className="admin-gallery-modal-full">
            Meta Description
            <textarea name="metaDescription" defaultValue={editing?.metaDescription ?? ""} placeholder="SEO meta description" />
          </label>
          <label>
            Image Alt Text
            <input name="altText" defaultValue={editing?.altText ?? ""} placeholder="Describe the cake image" required />
          </label>
          <label>
            Keywords
            <input name="keywords" defaultValue={editing?.keywords ?? ""} placeholder="cake, birthday cake, custom cake" />
          </label>
          <label>
            Status
            <select name="status" defaultValue={editing?.status ?? "ACTIVE"}>
              <option value="ACTIVE">Show Image</option>
              <option value="INACTIVE">Hide Image</option>
            </select>
          </label>
          </div>
          <label className="admin-checkbox-label">
            <input name="featured" type="checkbox" defaultChecked={editing?.featured ?? false} />
            Featured Image
          </label>
              {message ? <p className="admin-gallery-modal-message" role="status">{message}</p> : null}
              <div className="admin-gallery-modal-actions">
                <button type="button" className="admin-secondary-button" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit">{editing ? "Update Image" : "Add Image"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
