"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, DragEvent, FormEvent, ReactNode, useEffect, useMemo, useReducer, useState } from "react";
import { createPortal } from "react-dom";
import type { CmsCustomOrderOptionGroup, CmsCustomOrderSettings } from "@/lib/local-cms";

export type CakeOrderGalleryImage = {
  src: string;
  alt: string;
  label: string;
};

type FormState = {
  occasion: string;
  size: string;
  tier: string;
  flavour: string;
  theme: string;
  cakeText: string;
  age: string;
  address: string;
  date: string;
  time: string;
  specificTime: string;
  notes: string;
};

type FieldName = keyof FormState;

type Action = { field: FieldName; value: string } | { type: "reset" };

const initialState: FormState = {
  occasion: "",
  size: "",
  tier: "Single Tier",
  flavour: "",
  theme: "",
  cakeText: "",
  age: "",
  address: "",
  date: "",
  time: "",
  specificTime: "",
  notes: "",
};

const fallbackUser = {
  name: "Guest Customer",
  phone: "+91 00000 00000",
  email: "hello@chocobeecake.studio",
};

const fallbackSettings: CmsCustomOrderSettings = {
  id: "custom-order",
  status: "ACTIVE",
  iconLabel: "Cake",
  title: "Custom Cake Order",
  subtitle: "Fill details & we'll confirm via your preferred channel",
  userSectionTitle: "User Details",
  userName: fallbackUser.name,
  userPhone: fallbackUser.phone,
  userEmail: fallbackUser.email,
  switchAccountLabel: "Not you? Switch account",
  switchAccountHref: "/admin/login",
  cakeSectionTitle: "Cake Details",
  themePlaceholder: "e.g., Unicorn, Superhero, Floral, Minimalist",
  cakeTextMaxLength: 30,
  cakeTextPlaceholder: "Text on cake",
  agePlaceholder: "e.g., 25",
  addressPlaceholder: "Full address with landmark & pincode",
  notesPlaceholder: "Any special instructions, allergies, eggless requirement, etc.",
  referenceSectionTitle: "Reference Images",
  dropzoneTitle: "Drop cake photos here or click to browse",
  dropzoneSubtitle: "Max 5 images, 5MB each (JPG, PNG)",
  galleryToggleLabel: "Or select from our gallery",
  galleryLimit: 12,
  maxUploadImages: 5,
  maxUploadSizeMb: 5,
  submitLabel: "Submit",
  submittingLabel: "Submitting...",
  footerNote: "You'll receive confirmation within 30 minutes",
  successMessage: "Order submitted! We will confirm shortly.",
  autoCloseMs: 4000,
  businessWhatsappNumber: "910000000000",
  businessEmail: fallbackUser.email,
  enableGalleryPicker: true,
  enableReferenceUpload: true,
  options: {
    occasion: ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Corporate", "Other"].map((label, index) => ({ id: label, label, value: label, displayOrder: index + 1, status: "ACTIVE" })),
    size: ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "4 kg", "5+ kg"].map((label, index) => ({ id: label, label, value: label, displayOrder: index + 1, status: "ACTIVE" })),
    tier: ["Single Tier", "2-Tier", "3-Tier", "Multi-Tier"].map((label, index) => ({ id: label, label, value: label, displayOrder: index + 1, status: "ACTIVE" })),
    flavour: ["Chocolate", "Vanilla", "Strawberry", "Red Velvet", "Black Forest", "Butterscotch", "Pineapple", "Custom"].map((label, index) => ({ id: label, label, value: label, displayOrder: index + 1, status: "ACTIVE" })),
    time: ["9 AM - 12 PM", "12 PM - 3 PM", "3 PM - 6 PM", "6 PM - 9 PM", "Specific Time"].map((label, index) => ({ id: label, label, value: label, displayOrder: index + 1, status: "ACTIVE" })),
  },
  updatedAt: new Date().toISOString(),
};

function reducer(state: FormState, action: Action): FormState {
  if ("type" in action) return initialState;
  return { ...state, [action.field]: action.value };
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function validateField(field: FieldName, value: string) {
  if (field === "occasion" && !value) return "Cake occasion is required.";
  if (field === "size" && !value) return "Cake size is required.";
  if (field === "flavour" && !value) return "Cake flavour is required.";
  if (field === "address" && value.trim().length < 10) return "Delivery address should be at least 10 characters.";
  if (field === "date" && (!value || value <= todayDate())) return "Delivery date must be a future date.";
  return "";
}

function FormInput({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="cake-order-field">
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function activeOptions(settings: CmsCustomOrderSettings, group: CmsCustomOrderOptionGroup) {
  return settings.options[group]
    .filter((option) => option.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function buildMessage(state: FormState, selectedGallery: CakeOrderGalleryImage[], uploadedImageUrls: string[], settings: CmsCustomOrderSettings) {
  const imageLines = [
    ...selectedGallery.map((image) => `${image.label}: ${image.src}`),
    ...uploadedImageUrls.map((url) => `Uploaded reference: ${url}`),
  ];

  return [
    "Custom Cake Order",
    "",
    `Customer: ${settings.userName}`,
    `Phone: ${settings.userPhone}`,
    `Email: ${settings.userEmail}`,
    "",
    `Occasion: ${state.occasion}`,
    `Size: ${state.size}`,
    `Tier: ${state.tier}`,
    `Flavour: ${state.flavour}`,
    `Theme: ${state.theme || "Not specified"}`,
    `Text on Cake: ${state.cakeText || "Not specified"}`,
    `Number/Age: ${state.age || "Not specified"}`,
    `Delivery Address: ${state.address}`,
    `Delivery Date: ${state.date}`,
    `Delivery Time: ${state.time === "Specific Time" ? state.specificTime : state.time}`,
    `Additional Details: ${state.notes || "None"}`,
    imageLines.length ? "" : null,
    imageLines.length ? "Reference Images:" : null,
    ...imageLines,
  ]
    .filter(Boolean)
    .join("\n");
}

export function CakeOrderModal({
  open,
  onClose,
  galleryImages = [],
  settings,
}: {
  open: boolean;
  onClose: () => void;
  galleryImages?: CakeOrderGalleryImage[];
  settings?: CmsCustomOrderSettings;
}) {
  const popupSettings = settings ?? fallbackSettings;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [selectedGallery, setSelectedGallery] = useState<CakeOrderGalleryImage[]>([]);
  const [attempted, setAttempted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successText, setSuccessText] = useState("Your order has been sent successfully!");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const filePreviews = useMemo(() => files.map((file) => ({ file, src: URL.createObjectURL(file) })), [files]);

  const errors = useMemo(() => {
    const fields: FieldName[] = ["occasion", "size", "flavour", "address", "date"];
    return fields.reduce<Partial<Record<FieldName, string>>>((result, field) => {
      const error = validateField(field, state[field]);
      if (error) result[field] = error;
      return result;
    }, {});
  }, [state]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => {
      setSuccess(false);
      onClose();
    }, popupSettings.autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [onClose, popupSettings.autoCloseMs, success]);

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview.src));
    };
  }, [filePreviews]);

  if (!open || popupSettings.status !== "ACTIVE") return null;

  function markTouched(field: FieldName) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function update(field: FieldName, value: string) {
    dispatch({ field, value });
  }

  function addFiles(nextFiles: FileList | File[]) {
    const accepted = Array.from(nextFiles)
      .filter((file) => ["image/jpeg", "image/png"].includes(file.type) && file.size <= popupSettings.maxUploadSizeMb * 1024 * 1024)
      .slice(0, Math.max(0, popupSettings.maxUploadImages - files.length));
    setFiles((current) => [...current, ...accepted].slice(0, popupSettings.maxUploadImages));
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files) addFiles(event.currentTarget.files);
  }

  function toggleGalleryImage(image: CakeOrderGalleryImage) {
    setSelectedGallery((current) =>
      current.some((item) => item.src === image.src)
        ? current.filter((item) => item.src !== image.src)
        : [...current, image].slice(0, popupSettings.maxUploadImages),
    );
  }

  async function uploadReferenceImages() {
    const uploadedUrls: string[] = [];

    if (!popupSettings.enableReferenceUpload) return uploadedUrls;

    for (const file of files) {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await response.json()) as { imageUrl?: string };
      if (response.ok && data.imageUrl) uploadedUrls.push(`${window.location.origin}${data.imageUrl}`);
    }

    return uploadedUrls;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    setSubmitError("");
    setTouched({ occasion: true, size: true, flavour: true, address: true, date: true });

    if (Object.keys(errors).length) return;

    try {
      setSubmitting(true);
      const uploadedImageUrls = await uploadReferenceImages();
      const message = buildMessage(state, selectedGallery, uploadedImageUrls, popupSettings);
      const response = await fetch("/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: popupSettings.userName,
          phone: popupSettings.userPhone,
          cake: [state.occasion, state.size, state.tier, state.flavour].filter(Boolean).join(" | "),
          message,
        }),
      });
      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your order. Please try again.");
      }

      window.localStorage.setItem("latestCakeOrder", message);
      setSuccessText(data.message || "Your order has been sent successfully!");
      setSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to send your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const showError = (field: FieldName) => (touched[field] || attempted) && errors[field] ? errors[field] : "";

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="cake-order-backdrop" onMouseDown={onClose}>
      <section className="cake-order-modal" aria-modal="true" role="dialog" aria-labelledby="cake-order-title" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="cake-order-close" onClick={onClose} aria-label="Close custom cake order modal">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <header className="cake-order-header">
          <span className="cake-order-icon" aria-hidden="true">{popupSettings.iconLabel.slice(0, 2)}</span>
          <div>
            <h2 id="cake-order-title">{popupSettings.title}</h2>
            <p>{popupSettings.subtitle}</p>
          </div>
        </header>

        {success ? (
          <div className="cake-order-success" role="status">
            <span>OK</span>
            <strong>{successText}</strong>
          </div>
        ) : (
          <form className={`cake-order-form ${attempted && Object.keys(errors).length ? "cake-order-shake" : ""}`} onSubmit={submit}>
            <section className="cake-order-section">
              <div className="cake-order-section-heading">
                <span>1</span>
                <h3>{popupSettings.userSectionTitle}</h3>
                <em>Auto-filled</em>
              </div>
              <div className="cake-order-user-grid">
                <article><span>Name</span><strong>{popupSettings.userName}</strong></article>
                <article><span>Phone</span><strong>{popupSettings.userPhone}</strong></article>
                <article><span>Email</span><strong>{popupSettings.userEmail}</strong></article>
              </div>
              <Link href={popupSettings.switchAccountHref} className="cake-order-switch">{popupSettings.switchAccountLabel}</Link>
            </section>

            <section className="cake-order-section">
              <div className="cake-order-section-heading">
                <span>2</span>
                <h3>{popupSettings.cakeSectionTitle}</h3>
              </div>
              <div className="cake-order-grid">
                <FormInput label="Cake Occasion" error={showError("occasion")}>
                  <select value={state.occasion} onBlur={() => markTouched("occasion")} onChange={(event) => update("occasion", event.currentTarget.value)}>
                    <option value="">Select occasion</option>
                    {activeOptions(popupSettings, "occasion").map((item) => <option value={item.value} key={item.id}>{item.label}</option>)}
                  </select>
                </FormInput>
                <FormInput label="Cake Size" error={showError("size")}>
                  <select value={state.size} onBlur={() => markTouched("size")} onChange={(event) => update("size", event.currentTarget.value)}>
                    <option value="">Select size</option>
                    {activeOptions(popupSettings, "size").map((item) => <option value={item.value} key={item.id}>{item.label}</option>)}
                  </select>
                </FormInput>
                <FormInput label="Cake Tier">
                  <select value={state.tier} onChange={(event) => update("tier", event.currentTarget.value)}>
                    {activeOptions(popupSettings, "tier").map((item) => <option value={item.value} key={item.id}>{item.label}</option>)}
                  </select>
                </FormInput>
                <FormInput label="Cake Flavour" error={showError("flavour")}>
                  <select value={state.flavour} onBlur={() => markTouched("flavour")} onChange={(event) => update("flavour", event.currentTarget.value)}>
                    <option value="">Select flavour</option>
                    {activeOptions(popupSettings, "flavour").map((item) => <option value={item.value} key={item.id}>{item.label}</option>)}
                  </select>
                </FormInput>
                <FormInput label="Cake Theme">
                  <input value={state.theme} onChange={(event) => update("theme", event.currentTarget.value)} placeholder={popupSettings.themePlaceholder} />
                </FormInput>
                <div className="cake-order-grid">
                  <FormInput label={`Text on Cake ${state.cakeText.length}/${popupSettings.cakeTextMaxLength}`}>
                    <input value={state.cakeText} maxLength={popupSettings.cakeTextMaxLength} onChange={(event) => update("cakeText", event.currentTarget.value)} placeholder={popupSettings.cakeTextPlaceholder} />
                  </FormInput>
                  <FormInput label="Number/Age on Cake">
                    <input value={state.age} type="number" onChange={(event) => update("age", event.currentTarget.value)} placeholder={popupSettings.agePlaceholder} />
                  </FormInput>
                </div>
                <div className="cake-order-full-row">
                  <FormInput label="Delivery Address" error={showError("address")}>
                    <textarea rows={3} value={state.address} onBlur={() => markTouched("address")} onChange={(event) => update("address", event.currentTarget.value)} placeholder={popupSettings.addressPlaceholder} />
                  </FormInput>
                </div>
                <div className="cake-order-delivery-stack">
                  <FormInput label="Delivery Date" error={showError("date")}>
                    <input type="date" min={todayDate()} value={state.date} onBlur={() => markTouched("date")} onChange={(event) => update("date", event.currentTarget.value)} />
                  </FormInput>
                  <FormInput label="Delivery Time">
                    <select value={state.time} onChange={(event) => update("time", event.currentTarget.value)}>
                      <option value="">Select time</option>
                      {activeOptions(popupSettings, "time").map((item) => <option value={item.value} key={item.id}>{item.label}</option>)}
                    </select>
                  </FormInput>
                </div>
                {state.time === "Specific Time" ? (
                  <FormInput label="Specific Time">
                    <input value={state.specificTime} onChange={(event) => update("specificTime", event.currentTarget.value)} placeholder="e.g., 5:30 PM" />
                  </FormInput>
                ) : null}
                <div className="cake-order-full-row">
                  <FormInput label="Additional Details">
                    <textarea rows={4} value={state.notes} onChange={(event) => update("notes", event.currentTarget.value)} placeholder={popupSettings.notesPlaceholder} />
                  </FormInput>
                </div>
              </div>
            </section>

            <section className="cake-order-section">
              <div className="cake-order-section-heading">
                <span>3</span>
                <h3>{popupSettings.referenceSectionTitle}</h3>
              </div>
              {popupSettings.enableReferenceUpload ? (
                <label className="cake-order-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
                  <input type="file" accept="image/png,image/jpeg" multiple onChange={handleFileChange} />
                  <strong>{popupSettings.dropzoneTitle}</strong>
                  <small>{popupSettings.dropzoneSubtitle}</small>
                </label>
              ) : null}
              {filePreviews.length ? (
                <div className="cake-order-preview-grid">
                  {filePreviews.map(({ file, src }, index) => (
                    <figure key={`${file.name}-${file.lastModified}-${index}`}>
                      <Image src={src} alt={file.name} width={80} height={80} />
                      <button type="button" onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}>×</button>
                    </figure>
                  ))}
                </div>
              ) : null}
              {popupSettings.enableGalleryPicker && galleryImages.length ? (
                <div className="cake-order-gallery-picker">
                  <button type="button">{popupSettings.galleryToggleLabel}</button>
                  <div>
                    {galleryImages.slice(0, popupSettings.galleryLimit).map((image) => (
                      <button
                        type="button"
                        className={selectedGallery.some((item) => item.src === image.src) ? "cake-order-gallery-selected" : ""}
                        onClick={() => toggleGalleryImage(image)}
                        key={image.src}
                      >
                        <Image src={image.src} alt={image.alt} width={96} height={96} />
                        <span>{image.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <footer className="cake-order-footer">
              {submitError ? <p className="cake-order-submit-error" role="alert">{submitError}</p> : null}
              <button
                type="submit"
                disabled={submitting}
                className="cake-order-submit inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-[#be1919] px-6 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(190,25,25,0.28)] transition hover:-translate-y-0.5 hover:bg-[#9f1616] focus:outline-none focus:ring-4 focus:ring-[#be1919]/20 disabled:cursor-wait disabled:opacity-70"
              >
                {submitting ? popupSettings.submittingLabel : popupSettings.submitLabel}
              </button>
              <p>{popupSettings.footerNote}</p>
            </footer>
          </form>
        )}
      </section>
    </div>,
    document.body,
  );
}
