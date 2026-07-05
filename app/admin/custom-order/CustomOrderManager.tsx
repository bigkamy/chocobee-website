"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { CmsCustomOrderOption, CmsCustomOrderOptionGroup, CmsCustomOrderSettings } from "@/lib/local-cms";
import { notifyPublished } from "../AdminToast";

const optionGroups: { key: CmsCustomOrderOptionGroup; label: string }[] = [
  { key: "occasion", label: "Occasions" },
  { key: "size", label: "Cake Sizes" },
  { key: "tier", label: "Cake Tiers" },
  { key: "flavour", label: "Flavours" },
  { key: "time", label: "Delivery Times" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Locale-independent date format (dd/mm/yyyy) so SSR and client output match and avoid hydration mismatches.
function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getUTCFullYear()}`;
}

function nextOption(group: CmsCustomOrderOption[], groupKey: CmsCustomOrderOptionGroup): CmsCustomOrderOption {
  const nextIndex = group.length + 1;
  const label = `New ${groupKey} option`;
  return {
    id: `${groupKey}-${nextIndex}`,
    label,
    value: label,
    displayOrder: nextIndex,
    status: "ACTIVE",
  };
}

export function CustomOrderManager({ initialSettings, embedded = false }: { initialSettings: CmsCustomOrderSettings; embedded?: boolean }) {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedOptionGroups, setExpandedOptionGroups] = useState<Record<CmsCustomOrderOptionGroup, boolean>>({
    occasion: false,
    size: false,
    tier: false,
    flavour: false,
    time: false,
  });

  function updateField<K extends keyof CmsCustomOrderSettings>(field: K, value: CmsCustomOrderSettings[K]) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function updateTextField(field: keyof CmsCustomOrderSettings, value: string) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function updateNumberField(field: keyof CmsCustomOrderSettings, value: string) {
    setSettings((current) => ({ ...current, [field]: Number(value) }));
  }

  function updateOption(group: CmsCustomOrderOptionGroup, index: number, patch: Partial<CmsCustomOrderOption>) {
    setSettings((current) => {
      const options = current.options[group].map((option, optionIndex) => {
        if (optionIndex !== index) return option;
        const label = patch.label ?? option.label;
        return {
          ...option,
          ...patch,
          id: patch.id ?? option.id ?? slugify(label),
          value: patch.value ?? label,
        };
      });

      return { ...current, options: { ...current.options, [group]: options } };
    });
  }

  function addOption(group: CmsCustomOrderOptionGroup) {
    if (!isEditing) return;
    setSettings((current) => ({
      ...current,
      options: {
        ...current.options,
        [group]: [...current.options[group], nextOption(current.options[group], group)],
      },
    }));
  }

  function deleteOption(group: CmsCustomOrderOptionGroup, index: number) {
    if (!isEditing) return;
    setSettings((current) => ({
      ...current,
      options: {
        ...current.options,
        [group]: current.options[group].filter((_, optionIndex) => optionIndex !== index),
      },
    }));
  }

  function toggleOptionGroup(group: CmsCustomOrderOptionGroup) {
    setExpandedOptionGroups((current) => ({ ...current, [group]: !current[group] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEditing) return;

    setIsSaving(true);
    const response = await fetch("/api/admin/custom-order", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    const data = (await response.json()) as { item?: CmsCustomOrderSettings; error?: string };
    setIsSaving(false);

    if (!response.ok || !data.item) {
      setMessage(data.error ?? "Could not update custom order popup.");
      return;
    }

    setSettings(data.item);
    setSavedSettings(data.item);
    setIsEditing(false);
    setMessage("Custom order popup updated successfully.");
    notifyPublished();
    window.setTimeout(() => setMessage(""), 2600);
  }

  function cancelEditing() {
    setSettings(savedSettings);
    setIsEditing(false);
    setMessage("");
  }

  const activeOptions = optionGroups.reduce((total, group) => total + settings.options[group.key].filter((option) => option.status === "ACTIVE").length, 0);

  const Root = embedded ? "div" : "main";
  return (
    <Root className={`${embedded ? "admin-embedded-panel" : "admin-page"} admin-footer-page admin-custom-order-page`}>
      <header className="admin-footer-page-header">
        <div>
          <p>Custom Cake Order Popup</p>
          <span>Last updated {formatDate(settings.updatedAt)}</span>
        </div>
        <div className="admin-header-actions">
          <Link href="/" className="admin-outline-button">
            View Website
          </Link>
          {isEditing ? (
            <button type="button" className="admin-outline-button admin-footer-compact-button" onClick={cancelEditing}>
              <XIcon />
              Cancel
            </button>
          ) : (
            <button type="button" className="admin-publish-button admin-footer-compact-button" onClick={() => setIsEditing(true)}>
              <EditIcon />
              Edit Popup
            </button>
          )}
        </div>
      </header>

      <section className="admin-footer-overview" aria-label="Custom order summary">
        <article>
          <span>Status</span>
          <strong>{settings.status === "ACTIVE" ? "Enabled" : "Hidden"}</strong>
        </article>
        <article>
          <span>Option Rows</span>
          <strong>{activeOptions}</strong>
        </article>
        <article>
          <span>Gallery Limit</span>
          <strong>{settings.galleryLimit}</strong>
        </article>
        <article>
          <span>Uploads</span>
          <strong>{settings.enableReferenceUpload ? `${settings.maxUploadImages} images` : "Disabled"}</strong>
        </article>
      </section>

      <form className="admin-footer-form" onSubmit={handleSubmit}>
        {message ? <p className="admin-footer-toast" role="status">{message}</p> : null}

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading admin-footer-panel-heading-row">
            <div>
              <span>Popup Identity</span>
              <h2>Header & Visibility</h2>
            </div>
            <p>Control the main popup title, intro text, icon label, and whether the popup is available.</p>
          </div>
          <div className="admin-footer-field-grid">
            <label>
              Popup Status
              <select value={settings.status} disabled={!isEditing} onChange={(event) => updateField("status", event.currentTarget.value as CmsCustomOrderSettings["status"])}>
                <option value="ACTIVE">Enabled</option>
                <option value="INACTIVE">Hidden</option>
              </select>
            </label>
            <label>
              Icon Label
              <input value={settings.iconLabel} disabled={!isEditing} onChange={(event) => updateTextField("iconLabel", event.currentTarget.value)} />
            </label>
            <label>
              Title
              <input value={settings.title} disabled={!isEditing} onChange={(event) => updateTextField("title", event.currentTarget.value)} />
            </label>
            <label>
              Subtitle
              <input value={settings.subtitle} disabled={!isEditing} onChange={(event) => updateTextField("subtitle", event.currentTarget.value)} />
            </label>
          </div>
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading">
            <div>
              <span>Customer Card</span>
              <h2>User Details</h2>
            </div>
            <p>Edit the read-only customer details shown at the top of the popup.</p>
          </div>
          <div className="admin-footer-field-grid">
            <label>
              Section Title
              <input value={settings.userSectionTitle} disabled={!isEditing} onChange={(event) => updateTextField("userSectionTitle", event.currentTarget.value)} />
            </label>
            <label>
              Name
              <input value={settings.userName} disabled={!isEditing} onChange={(event) => updateTextField("userName", event.currentTarget.value)} />
            </label>
            <label>
              Phone
              <input value={settings.userPhone} disabled={!isEditing} onChange={(event) => updateTextField("userPhone", event.currentTarget.value)} />
            </label>
            <label>
              Email
              <input value={settings.userEmail} disabled={!isEditing} onChange={(event) => updateTextField("userEmail", event.currentTarget.value)} />
            </label>
            <label>
              Switch Account Label
              <input value={settings.switchAccountLabel} disabled={!isEditing} onChange={(event) => updateTextField("switchAccountLabel", event.currentTarget.value)} />
            </label>
            <label>
              Switch Account Link
              <input value={settings.switchAccountHref} disabled={!isEditing} onChange={(event) => updateTextField("switchAccountHref", event.currentTarget.value)} />
            </label>
          </div>
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading">
            <div>
              <span>Form Fields</span>
              <h2>Labels & Placeholders</h2>
            </div>
            <p>Manage the text around cake details, delivery details, and free-form notes.</p>
          </div>
          <div className="admin-footer-field-grid">
            <label>
              Cake Section Title
              <input value={settings.cakeSectionTitle} disabled={!isEditing} onChange={(event) => updateTextField("cakeSectionTitle", event.currentTarget.value)} />
            </label>
            <label>
              Theme Placeholder
              <input value={settings.themePlaceholder} disabled={!isEditing} onChange={(event) => updateTextField("themePlaceholder", event.currentTarget.value)} />
            </label>
            <label>
              Cake Text Placeholder
              <input value={settings.cakeTextPlaceholder} disabled={!isEditing} onChange={(event) => updateTextField("cakeTextPlaceholder", event.currentTarget.value)} />
            </label>
            <label>
              Cake Text Max Length
              <input type="number" value={settings.cakeTextMaxLength} disabled={!isEditing} onChange={(event) => updateNumberField("cakeTextMaxLength", event.currentTarget.value)} />
            </label>
            <label>
              Number/Age Placeholder
              <input value={settings.agePlaceholder} disabled={!isEditing} onChange={(event) => updateTextField("agePlaceholder", event.currentTarget.value)} />
            </label>
            <label>
              Delivery Address Placeholder
              <input value={settings.addressPlaceholder} disabled={!isEditing} onChange={(event) => updateTextField("addressPlaceholder", event.currentTarget.value)} />
            </label>
            <label>
              Additional Details Placeholder
              <textarea value={settings.notesPlaceholder} disabled={!isEditing} onChange={(event) => updateTextField("notesPlaceholder", event.currentTarget.value)} />
            </label>
          </div>
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading">
            <div>
              <span>Media</span>
              <h2>Reference Images</h2>
            </div>
            <p>Control upload limits and gallery picker behavior for reference images.</p>
          </div>
          <div className="admin-footer-field-grid">
            <label>
              Section Title
              <input value={settings.referenceSectionTitle} disabled={!isEditing} onChange={(event) => updateTextField("referenceSectionTitle", event.currentTarget.value)} />
            </label>
            <label>
              Drop Box Title
              <input value={settings.dropzoneTitle} disabled={!isEditing} onChange={(event) => updateTextField("dropzoneTitle", event.currentTarget.value)} />
            </label>
            <label>
              Drop Box Subtitle
              <input value={settings.dropzoneSubtitle} disabled={!isEditing} onChange={(event) => updateTextField("dropzoneSubtitle", event.currentTarget.value)} />
            </label>
            <label>
              Gallery Toggle Label
              <input value={settings.galleryToggleLabel} disabled={!isEditing} onChange={(event) => updateTextField("galleryToggleLabel", event.currentTarget.value)} />
            </label>
            <label>
              Gallery Limit
              <input type="number" value={settings.galleryLimit} disabled={!isEditing} onChange={(event) => updateNumberField("galleryLimit", event.currentTarget.value)} />
            </label>
            <label>
              Max Upload Images
              <input type="number" value={settings.maxUploadImages} disabled={!isEditing} onChange={(event) => updateNumberField("maxUploadImages", event.currentTarget.value)} />
            </label>
            <label>
              Max Upload Size MB
              <input type="number" value={settings.maxUploadSizeMb} disabled={!isEditing} onChange={(event) => updateNumberField("maxUploadSizeMb", event.currentTarget.value)} />
            </label>
            <label className="admin-checkbox-label">
              <input type="checkbox" checked={settings.enableReferenceUpload} disabled={!isEditing} onChange={(event) => updateField("enableReferenceUpload", event.currentTarget.checked)} />
              Enable reference upload
            </label>
            <label className="admin-checkbox-label">
              <input type="checkbox" checked={settings.enableGalleryPicker} disabled={!isEditing} onChange={(event) => updateField("enableGalleryPicker", event.currentTarget.checked)} />
              Enable gallery picker
            </label>
          </div>
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading">
            <div>
              <span>Conversion</span>
              <h2>CTA, Success & Business Routing</h2>
            </div>
            <p>Set the CTA labels, confirmation copy, and business destination details.</p>
          </div>
          <div className="admin-footer-field-grid">
            <label>
              Submit CTA Label
              <input value={settings.submitLabel} disabled={!isEditing} onChange={(event) => updateTextField("submitLabel", event.currentTarget.value)} />
            </label>
            <label>
              Submitting Label
              <input value={settings.submittingLabel} disabled={!isEditing} onChange={(event) => updateTextField("submittingLabel", event.currentTarget.value)} />
            </label>
            <label>
              Footer Note
              <input value={settings.footerNote} disabled={!isEditing} onChange={(event) => updateTextField("footerNote", event.currentTarget.value)} />
            </label>
            <label>
              Success Message
              <input value={settings.successMessage} disabled={!isEditing} onChange={(event) => updateTextField("successMessage", event.currentTarget.value)} />
            </label>
            <label>
              Auto Close MS
              <input type="number" value={settings.autoCloseMs} disabled={!isEditing} onChange={(event) => updateNumberField("autoCloseMs", event.currentTarget.value)} />
            </label>
            <label>
              Business WhatsApp Number
              <input value={settings.businessWhatsappNumber} disabled={!isEditing} onChange={(event) => updateTextField("businessWhatsappNumber", event.currentTarget.value)} />
            </label>
            <label>
              Business Email
              <input value={settings.businessEmail} disabled={!isEditing} onChange={(event) => updateTextField("businessEmail", event.currentTarget.value)} />
            </label>
          </div>
        </section>

        {optionGroups.map((group) => (
          <section className="admin-resource-card admin-footer-panel" key={group.key}>
            <div className="admin-footer-panel-heading admin-footer-panel-heading-row">
              <button
                type="button"
                className="admin-custom-order-chevron-button"
                aria-expanded={expandedOptionGroups[group.key]}
                aria-controls={`custom-order-options-${group.key}`}
                onClick={() => toggleOptionGroup(group.key)}
              >
                <ChevronIcon />
              </button>
              <div>
                <span>Dropdown Options</span>
                <h2>{group.label}</h2>
              </div>
              <div className="admin-custom-order-option-actions">
                <span>{settings.options[group.key].filter((option) => option.status === "ACTIVE").length} active</span>
                <button type="button" className="admin-secondary-button admin-footer-compact-button" disabled={!isEditing} onClick={() => addOption(group.key)}>
                  <PlusIcon />
                  Add Option
                </button>
              </div>
            </div>
            {expandedOptionGroups[group.key] ? (
              <div id={`custom-order-options-${group.key}`}>
                <OptionEditor
                  group={group.key}
                  isEditing={isEditing}
                  options={settings.options[group.key]}
                  onDelete={(index) => deleteOption(group.key, index)}
                  onEdit={() => setIsEditing(true)}
                  onUpdate={(index, patch) => updateOption(group.key, index, patch)}
                />
              </div>
            ) : null}
          </section>
        ))}

        <div className="admin-footer-save-bar">
          <div>
            <strong>Custom order changes affect every popup trigger.</strong>
            <span>Review dropdowns, CTA text, and reference-image limits before publishing.</span>
          </div>
          <button type="submit" className="admin-publish-button admin-footer-save admin-footer-compact-button" disabled={!isEditing || isSaving}>
            <SaveIcon />
            {isSaving ? "Saving..." : "Save Popup"}
          </button>
        </div>
      </form>
    </Root>
  );
}

function OptionEditor({
  group,
  options,
  isEditing,
  onDelete,
  onEdit,
  onUpdate,
}: {
  group: CmsCustomOrderOptionGroup;
  options: CmsCustomOrderOption[];
  isEditing: boolean;
  onDelete: (index: number) => void;
  onEdit: () => void;
  onUpdate: (index: number, patch: Partial<CmsCustomOrderOption>) => void;
}) {
  return (
    <div className="admin-footer-link-list">
      <div className="admin-footer-link-head admin-custom-order-option-head" aria-hidden="true">
        <span>Label</span>
        <span>Value</span>
        <span>Order</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {options.map((option, index) => (
        <article className="admin-footer-link-editor admin-custom-order-option-row" key={`${group}-${option.id}-${index}`}>
          <span className="admin-footer-row-number">{index + 1}</span>
          <label>
            Label
            <input value={option.label} disabled={!isEditing} onChange={(event) => onUpdate(index, { label: event.currentTarget.value })} />
          </label>
          <label>
            Value
            <input value={option.value} disabled={!isEditing} onChange={(event) => onUpdate(index, { value: event.currentTarget.value })} />
          </label>
          <label>
            Order
            <input type="number" value={option.displayOrder} disabled={!isEditing} onChange={(event) => onUpdate(index, { displayOrder: Number(event.currentTarget.value) })} />
          </label>
          <label>
            Status
            <select value={option.status} disabled={!isEditing} onChange={(event) => onUpdate(index, { status: event.currentTarget.value as CmsCustomOrderOption["status"] })}>
              <option value="ACTIVE">Show</option>
              <option value="INACTIVE">Hide</option>
            </select>
          </label>
          <div className="admin-footer-row-actions">
            <button type="button" aria-label={`Edit ${option.label}`} onClick={onEdit}>
              <EditIcon />
            </button>
            <button type="button" aria-label={`Delete ${option.label}`} disabled={!isEditing} onClick={() => onDelete(index)}>
              <TrashIcon />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 20 4.5-1.1L19.2 8.2a2.4 2.4 0 0 0-3.4-3.4L5.1 15.5 4 20Z" />
      <path d="m14 6 4 4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 10 4 4 4-4" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4h12l2 2v14H5V4Z" />
      <path d="M8 4v6h8V4M8 20v-6h8v6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
