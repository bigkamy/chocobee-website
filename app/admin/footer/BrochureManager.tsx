"use client";

import { FormEvent, useState } from "react";
import type { CmsFooterSettings } from "@/lib/local-cms";

// Locale-independent date format (dd/mm/yyyy) so SSR and client output match and avoid hydration mismatches.
function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getUTCFullYear()}`;
}

// Slim admin page for the "Download Brochure" PDF. It loads the full footer
// settings so a save preserves every other field, but only the brochure fields
// are editable here.
export function BrochureManager({ initialSettings }: { initialSettings: CmsFooterSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [brochureStatus, setBrochureStatus] = useState("");

  async function uploadBrochure(file?: File) {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setBrochureStatus("Please choose a PDF file.");
      return;
    }

    setBrochureStatus("Uploading brochure...");
    const body = new FormData();
    body.append("file", file);

    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json()) as { url?: string; imageUrl?: string; fileName?: string; error?: string };
    const url = data.url ?? data.imageUrl;

    if (!response.ok || !url) {
      setBrochureStatus(data.error ?? "Brochure upload failed.");
      return;
    }

    setSettings((current) => ({ ...current, brochurePdfUrl: url, brochurePdfName: data.fileName ?? file.name }));
    setBrochureStatus("Brochure uploaded. Save to publish.");
  }

  function removeBrochure() {
    setSettings((current) => ({ ...current, brochurePdfUrl: "", brochurePdfName: "" }));
    setBrochureStatus("Brochure removed. Save to publish.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    const response = await fetch("/api/admin/footer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    const data = (await response.json()) as { item?: CmsFooterSettings; error?: string };
    setIsSaving(false);

    if (!response.ok || !data.item) {
      setMessage(data.error ?? "Could not save brochure.");
      return;
    }

    setSettings(data.item);
    setMessage("Brochure published successfully.");
    window.setTimeout(() => setMessage(""), 2600);
  }

  return (
    <main className="admin-page admin-footer-page admin-footer-pro">
      <header className="admin-footer-page-header">
        <div>
          <p>Brochure</p>
          <span>Last updated {formatDate(settings.updatedAt)}</span>
        </div>
        <div className="admin-header-actions">
          <button type="submit" form="brochure-form" className="admin-publish-button admin-footer-compact-button" disabled={isSaving}>
            {isSaving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </header>

      <form id="brochure-form" onSubmit={handleSubmit} className="admin-footer-form">
        {message ? <p className="admin-footer-toast" role="status">{message}</p> : null}

        <section className="admin-resource-card admin-footer-panel">
          <div className="admin-footer-panel-heading">
            <div>
              <span>Downloads</span>
              <h2>Brochure PDF</h2>
            </div>
            <p>Upload the PDF wired to the “Download Brochure” buttons in the navbar and footer. Replace it anytime to update both.</p>
          </div>
          <div className="admin-footer-brochure">
            <div className="admin-footer-brochure-current">
              {settings.brochurePdfUrl ? (
                <>
                  <span className="admin-footer-brochure-file">
                    <a href={settings.brochurePdfUrl} target="_blank" rel="noreferrer">
                      {settings.brochurePdfName || "Current brochure"}
                    </a>
                  </span>
                  <button type="button" className="admin-action-icon" onClick={removeBrochure} aria-label="Delete brochure" title="Delete">
                    <TrashIcon />
                  </button>
                </>
              ) : (
                <span className="admin-footer-brochure-empty">No brochure uploaded yet.</span>
              )}
            </div>
            <div className="admin-footer-brochure-fields">
              <div className="admin-upload-control">
                <label>
                  {settings.brochurePdfUrl ? "Replace PDF" : "Upload PDF"}
                  <input type="file" accept="application/pdf" onChange={(event) => void uploadBrochure(event.currentTarget.files?.[0])} />
                </label>
              </div>
              <label>
                PDF URL
                <input value={settings.brochurePdfUrl} onChange={(event) => setSettings((current) => ({ ...current, brochurePdfUrl: event.currentTarget.value }))} />
              </label>
              <label>
                Download File Name
                <input value={settings.brochurePdfName} onChange={(event) => setSettings((current) => ({ ...current, brochurePdfName: event.currentTarget.value }))} />
              </label>
            </div>
            {brochureStatus ? <p className="admin-upload-status">{brochureStatus}</p> : null}
          </div>
        </section>

        <div className="admin-footer-save-bar">
          <div>
            <strong>The brochure applies across the whole website.</strong>
            <span>Upload a PDF, then publish to update the navbar and footer buttons.</span>
          </div>
          <button type="submit" className="admin-publish-button admin-footer-save admin-footer-compact-button" disabled={isSaving}>
            <SaveIcon />
            {isSaving ? "Saving..." : "Save Brochure"}
          </button>
        </div>
      </form>
    </main>
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
