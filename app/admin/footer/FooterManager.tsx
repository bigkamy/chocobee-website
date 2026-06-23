"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import type { CmsFooterLink, CmsFooterSettings, CmsFooterSocialLink } from "@/lib/local-cms";

type LinkGroup = "quickLinks" | "categoryLinks" | "socialLinks";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nextLink(group: CmsFooterLink[], label: string): CmsFooterLink {
  const nextIndex = group.length + 1;
  return {
    id: `${slugify(label)}-${nextIndex}`,
    label,
    href: "#",
    displayOrder: nextIndex,
    status: "ACTIVE",
  };
}

export function FooterManager({ initialSettings }: { initialSettings: CmsFooterSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  function updateField(field: keyof CmsFooterSettings, value: string | string[]) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function updateLink(group: LinkGroup, index: number, patch: Partial<CmsFooterLink & CmsFooterSocialLink>) {
    setSettings((current) => {
      const links = current[group].map((link, linkIndex) => {
        if (linkIndex !== index) return link;
        const title = patch.label ?? link.label;
        return {
          ...link,
          ...patch,
          id: patch.id ?? link.id ?? slugify(title),
        };
      });

      return { ...current, [group]: links };
    });
  }

  function addLink(group: LinkGroup) {
    if (!isEditing) return;

    setSettings((current) => {
      if (group === "socialLinks") {
        const next = {
          ...nextLink(current.socialLinks, "Social Link"),
          type: "instagram" as const,
        };
        return { ...current, socialLinks: [...current.socialLinks, next] };
      }

      const label = group === "quickLinks" ? "Quick Link" : "Category Link";
      return { ...current, [group]: [...current[group], nextLink(current[group], label)] };
    });
  }

  function deleteLink(group: LinkGroup, index: number) {
    if (!isEditing) return;

    setSettings((current) => ({
      ...current,
      [group]: current[group].filter((_, linkIndex) => linkIndex !== index),
    }));
  }

  async function uploadLogo(file?: File) {
    if (!file || !isEditing) return;

    setUploadStatus("Uploading footer logo...");
    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { imageUrl?: string; error?: string };

    if (!response.ok || !data.imageUrl) {
      setUploadStatus(data.error ?? "Logo upload failed.");
      return;
    }

    updateField("logoUrl", data.imageUrl);
    setUploadStatus("Footer logo uploaded.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEditing) return;

    setIsSaving(true);
    const response = await fetch("/api/admin/footer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data = (await response.json()) as { item?: CmsFooterSettings; error?: string };
    setIsSaving(false);

    if (!response.ok || !data.item) {
      setMessage(data.error ?? "Could not update footer.");
      return;
    }

    setSettings(data.item);
    setSavedSettings(data.item);
    setIsEditing(false);
    setMessage("Footer updated successfully.");
    window.setTimeout(() => setMessage(""), 2600);
  }

  function cancelEditing() {
    setSettings(savedSettings);
    setIsEditing(false);
    setMessage("");
    setUploadStatus("");
  }

  function clearIdentityInfo() {
    setIsEditing(true);
    setUploadStatus("");
    setSettings((current) => ({
      ...current,
      logoUrl: "",
      logoAlt: "",
      addressLines: [],
      phoneLabel: "",
      phoneHref: "",
      emailLabel: "",
      emailHref: "",
      hoursLabel: "",
    }));
    setMessage("Identity information cleared. Save Footer to publish.");
  }

  return (
    <main className="admin-page admin-footer-page">
      <header className="admin-footer-page-header">
        <div>
          <p>Footer Settings</p>
          <span>Last updated {new Date(settings.updatedAt).toLocaleDateString()}</span>
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
              Edit Footer
            </button>
          )}
        </div>
      </header>

      <section className="admin-footer-overview" aria-label="Footer configuration summary">
        <article>
          <span>Quick Links</span>
          <strong>{settings.quickLinks.filter((link) => link.status === "ACTIVE").length}</strong>
        </article>
        <article>
          <span>Categories</span>
          <strong>{settings.categoryLinks.filter((link) => link.status === "ACTIVE").length}</strong>
        </article>
        <article>
          <span>Socials</span>
          <strong>{settings.socialLinks.filter((link) => link.status === "ACTIVE").length}</strong>
        </article>
        <article>
          <span>Last Updated</span>
          <strong>{new Date(settings.updatedAt).toLocaleDateString()}</strong>
        </article>
      </section>

      <form onSubmit={handleSubmit} className="admin-footer-form">
        {message ? <p className="admin-footer-toast" role="status">{message}</p> : null}

        <section className="admin-resource-card admin-footer-panel admin-footer-identity-panel">
          <div className="admin-footer-panel-heading">
            <div>
              <span>Identity</span>
              <h2>Brand & Contact</h2>
            </div>
            <div className="admin-footer-panel-actions">
              <p>Control the logo, studio address, call links, email, and working hours shown in the footer.</p>
              <div>
                <button type="button" className="admin-outline-button admin-footer-compact-button" onClick={() => setIsEditing(true)}>
                  <EditIcon />
                  Edit
                </button>
                <button type="button" className="admin-outline-button admin-footer-compact-button admin-footer-danger-button" onClick={clearIdentityInfo}>
                  <TrashIcon />
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="admin-footer-brand-grid">
            <div className="admin-gallery-preview admin-footer-logo-preview">
              {settings.logoUrl ? <Image src={settings.logoUrl} alt={settings.logoAlt} fill sizes="220px" className="object-contain" /> : null}
            </div>
            <div className="admin-footer-field-grid">
              <label>
                Logo URL
                <input value={settings.logoUrl} disabled={!isEditing} onChange={(event) => updateField("logoUrl", event.currentTarget.value)} />
              </label>
              <label>
                Logo Alt Text
                <input value={settings.logoAlt} disabled={!isEditing} onChange={(event) => updateField("logoAlt", event.currentTarget.value)} />
              </label>
              <div className="admin-upload-control">
                <label>
                  Upload Logo
                  <input type="file" accept="image/*" disabled={!isEditing} onChange={(event) => void uploadLogo(event.currentTarget.files?.[0])} />
                </label>
              </div>
              {uploadStatus ? <p className="admin-upload-status">{uploadStatus}</p> : null}
            </div>
          </div>
          <label>
            Address Lines
            <textarea
              value={settings.addressLines.join("\n")}
              disabled={!isEditing}
              onChange={(event) => updateField("addressLines", event.currentTarget.value.split("\n").map((line) => line.trim()).filter(Boolean))}
            />
          </label>
          <div className="admin-footer-field-grid">
            <label>
              Phone Label
              <input value={settings.phoneLabel} disabled={!isEditing} onChange={(event) => updateField("phoneLabel", event.currentTarget.value)} />
            </label>
            <label>
              Phone Link
              <input value={settings.phoneHref} disabled={!isEditing} onChange={(event) => updateField("phoneHref", event.currentTarget.value)} />
            </label>
            <label>
              Email Label
              <input value={settings.emailLabel} disabled={!isEditing} onChange={(event) => updateField("emailLabel", event.currentTarget.value)} />
            </label>
            <label>
              Email Link
              <input value={settings.emailHref} disabled={!isEditing} onChange={(event) => updateField("emailHref", event.currentTarget.value)} />
            </label>
            <label>
              Hours
              <input value={settings.hoursLabel} disabled={!isEditing} onChange={(event) => updateField("hoursLabel", event.currentTarget.value)} />
            </label>
          </div>
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading admin-footer-panel-heading-row">
            <div>
              <span>Navigation</span>
              <h2>Quick Links</h2>
            </div>
            <button type="button" className="admin-secondary-button admin-footer-compact-button" disabled={!isEditing} onClick={() => addLink("quickLinks")}>
              <PlusIcon />
              Add Link
            </button>
          </div>
          <FooterLinkEditor
            links={settings.quickLinks}
            isEditing={isEditing}
            onDelete={(index) => deleteLink("quickLinks", index)}
            onEdit={() => setIsEditing(true)}
            onUpdate={(index, patch) => updateLink("quickLinks", index, patch)}
          />
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading admin-footer-panel-heading-row">
            <div>
              <span>Catalog</span>
              <h2>Category Links</h2>
            </div>
            <button type="button" className="admin-secondary-button admin-footer-compact-button" disabled={!isEditing} onClick={() => addLink("categoryLinks")}>
              <PlusIcon />
              Add Link
            </button>
          </div>
          <FooterLinkEditor
            links={settings.categoryLinks}
            isEditing={isEditing}
            onDelete={(index) => deleteLink("categoryLinks", index)}
            onEdit={() => setIsEditing(true)}
            onUpdate={(index, patch) => updateLink("categoryLinks", index, patch)}
          />
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading admin-footer-panel-heading-row">
            <div>
              <span>Social</span>
              <h2>Social Links</h2>
            </div>
            <button type="button" className="admin-secondary-button admin-footer-compact-button" disabled={!isEditing} onClick={() => addLink("socialLinks")}>
              <PlusIcon />
              Add Social
            </button>
          </div>
          <FooterSocialEditor
            links={settings.socialLinks}
            isEditing={isEditing}
            onDelete={(index) => deleteLink("socialLinks", index)}
            onEdit={() => setIsEditing(true)}
            onUpdate={(index, patch) => updateLink("socialLinks", index, patch)}
          />
        </section>

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading">
            <div>
              <span>Conversion</span>
              <h2>Contact Form & Bottom Bar</h2>
            </div>
            <p>Set form labels, validation messages, and the legal/credit line at the bottom of every page.</p>
          </div>
          <div className="admin-footer-field-grid">
            <label>
              Form Title
              <input value={settings.formTitle} disabled={!isEditing} onChange={(event) => updateField("formTitle", event.currentTarget.value)} />
            </label>
            <label>
              Name Label
              <input value={settings.formNameLabel} disabled={!isEditing} onChange={(event) => updateField("formNameLabel", event.currentTarget.value)} />
            </label>
            <label>
              Phone Label
              <input value={settings.formPhoneLabel} disabled={!isEditing} onChange={(event) => updateField("formPhoneLabel", event.currentTarget.value)} />
            </label>
            <label>
              Message Label
              <input value={settings.formMessageLabel} disabled={!isEditing} onChange={(event) => updateField("formMessageLabel", event.currentTarget.value)} />
            </label>
            <label>
              Submit Button
              <input value={settings.formSubmitLabel} disabled={!isEditing} onChange={(event) => updateField("formSubmitLabel", event.currentTarget.value)} />
            </label>
            <label>
              Success Message
              <input value={settings.formSuccessMessage} disabled={!isEditing} onChange={(event) => updateField("formSuccessMessage", event.currentTarget.value)} />
            </label>
            <label>
              Error Message
              <input value={settings.formErrorMessage} disabled={!isEditing} onChange={(event) => updateField("formErrorMessage", event.currentTarget.value)} />
            </label>
            <label>
              Copyright Text
              <input value={settings.copyrightText} disabled={!isEditing} onChange={(event) => updateField("copyrightText", event.currentTarget.value)} />
            </label>
            <label>
              Credit Text
              <input value={settings.creditText} disabled={!isEditing} onChange={(event) => updateField("creditText", event.currentTarget.value)} />
            </label>
          </div>
        </section>

        <div className="admin-footer-save-bar">
          <div>
            <strong>Footer changes apply across the whole website.</strong>
            <span>Review links and contact details before publishing.</span>
          </div>
          <button type="submit" className="admin-publish-button admin-footer-save admin-footer-compact-button" disabled={!isEditing || isSaving}>
            <SaveIcon />
            {isSaving ? "Saving..." : "Save Footer"}
          </button>
        </div>
      </form>
    </main>
  );
}

function FooterLinkEditor({
  links,
  isEditing,
  onDelete,
  onEdit,
  onUpdate,
}: {
  links: CmsFooterLink[];
  isEditing: boolean;
  onDelete: (index: number) => void;
  onEdit: () => void;
  onUpdate: (index: number, patch: Partial<CmsFooterLink>) => void;
}) {
  return (
    <div className="admin-footer-link-list">
      <div className="admin-footer-link-head" aria-hidden="true">
        <span>Name</span>
        <span>URL</span>
        <span>Order</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {links.map((link, index) => (
        <article className="admin-footer-link-editor" key={`${link.id}-${index}`}>
          <span className="admin-footer-row-number">{index + 1}</span>
          <label>
            Label
            <input value={link.label} disabled={!isEditing} onChange={(event) => onUpdate(index, { label: event.currentTarget.value })} />
          </label>
          <label>
            Link
            <input value={link.href} disabled={!isEditing} onChange={(event) => onUpdate(index, { href: event.currentTarget.value })} />
          </label>
          <label>
            Order
            <input
              type="number"
              value={link.displayOrder}
              disabled={!isEditing}
              onChange={(event) => onUpdate(index, { displayOrder: Number(event.currentTarget.value) })}
            />
          </label>
          <label>
            Status
            <select value={link.status} disabled={!isEditing} onChange={(event) => onUpdate(index, { status: event.currentTarget.value as CmsFooterLink["status"] })}>
              <option value="ACTIVE">Show</option>
              <option value="INACTIVE">Hide</option>
            </select>
          </label>
          <div className="admin-footer-row-actions">
            <button type="button" aria-label={`Edit ${link.label}`} onClick={onEdit}>
              <EditIcon />
            </button>
            <button type="button" aria-label={`Delete ${link.label}`} disabled={!isEditing} onClick={() => onDelete(index)}>
              <TrashIcon />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function FooterSocialEditor({
  links,
  isEditing,
  onDelete,
  onEdit,
  onUpdate,
}: {
  links: CmsFooterSocialLink[];
  isEditing: boolean;
  onDelete: (index: number) => void;
  onEdit: () => void;
  onUpdate: (index: number, patch: Partial<CmsFooterSocialLink>) => void;
}) {
  return (
    <div className="admin-footer-link-list">
      <div className="admin-footer-link-head admin-footer-social-head" aria-hidden="true">
        <span>Type</span>
        <span>Name</span>
        <span>URL</span>
        <span>Order</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {links.map((link, index) => (
        <article className="admin-footer-link-editor admin-footer-social-editor" key={`${link.id}-${index}`}>
          <span className="admin-footer-row-number">{index + 1}</span>
          <label>
            Type
            <select value={link.type} disabled={!isEditing} onChange={(event) => onUpdate(index, { type: event.currentTarget.value as CmsFooterSocialLink["type"] })}>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="google">Google</option>
            </select>
          </label>
          <label>
            Label
            <input value={link.label} disabled={!isEditing} onChange={(event) => onUpdate(index, { label: event.currentTarget.value })} />
          </label>
          <label>
            Link
            <input value={link.href} disabled={!isEditing} onChange={(event) => onUpdate(index, { href: event.currentTarget.value })} />
          </label>
          <label>
            Order
            <input
              type="number"
              value={link.displayOrder}
              disabled={!isEditing}
              onChange={(event) => onUpdate(index, { displayOrder: Number(event.currentTarget.value) })}
            />
          </label>
          <label>
            Status
            <select value={link.status} disabled={!isEditing} onChange={(event) => onUpdate(index, { status: event.currentTarget.value as CmsFooterSocialLink["status"] })}>
              <option value="ACTIVE">Show</option>
              <option value="INACTIVE">Hide</option>
            </select>
          </label>
          <div className="admin-footer-row-actions">
            <button type="button" aria-label={`Edit ${link.label}`} onClick={onEdit}>
              <EditIcon />
            </button>
            <button type="button" aria-label={`Delete ${link.label}`} disabled={!isEditing} onClick={() => onDelete(index)}>
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
