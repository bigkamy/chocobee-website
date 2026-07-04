"use client";

import { FormEvent, useState } from "react";
import type { CmsContactPageSection } from "@/lib/local-cms";

function inputType(icon?: string | null) {
  if (icon === "email") return "email";
  if (icon === "phone") return "tel";
  return "text";
}

export function ContactForm({ section }: { section?: CmsContactPageSection }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const configuredFields = section?.items
    .filter((item) => item.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
  const fields = configuredFields?.length
    ? configuredFields
    : [
        { id: "name", title: "Full Name", subtitle: "Your full name", icon: "text" },
        { id: "email", title: "Email Address", subtitle: "you@example.com", icon: "email" },
        { id: "phone", title: "Phone Number", subtitle: "+91 00000 00000", icon: "phone" },
        { id: "message", title: "Message", subtitle: "Tell us about your cake theme, date, flavor, and size.", icon: "textarea" },
      ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const entries = (fields ?? []).map((field) => ({
      label: field.title,
      value: String(formData.get(field.id) ?? ""),
    }));
    const emailField = (fields ?? []).find((field) => field.icon === "email");
    const replyTo = emailField ? String(formData.get(emailField.id) ?? "") : "";

    setErrorMessage("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries, replyTo }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to send your message. Please try again.");
      }

      setSuccessMessage(section?.content || "Thank you. Our team will contact you shortly.");
      form.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form id={section?.sectionKey} onSubmit={handleSubmit} className="self-start rounded-[1.5rem] border border-white/75 bg-white/75 p-5 shadow-[0_24px_60px_rgba(93,64,55,0.12)] backdrop-blur md:p-6">
      <div className="mb-4">
        <h2 className="font-heading text-3xl leading-tight text-[#5d4037] sm:text-4xl">{section?.title || "Send a Message"}</h2>
      </div>

      <div className="grid gap-3">
        {fields.map((field) => (
          <label className="grid gap-2 text-sm font-bold text-[#5d4037]" key={field.id}>
            {field.title}
            {field.icon === "textarea" ? (
              <textarea
                name={field.id}
                required
                minLength={8}
                rows={3}
                placeholder={field.subtitle ?? ""}
                className="rounded-2xl border border-[#be1919]/15 bg-white/80 px-4 py-3 text-[#3a211a] outline-none transition focus:border-[#be1919] focus:ring-4 focus:ring-[#be1919]/10"
              />
            ) : (
              <input
                name={field.id}
                type={inputType(field.icon)}
                required
                minLength={field.icon === "text" ? 2 : undefined}
                pattern={field.icon === "phone" ? "[0-9+\\-\\s]{8,}" : undefined}
                placeholder={field.subtitle ?? ""}
                className="min-h-10 rounded-2xl border border-[#be1919]/15 bg-white/80 px-4 text-[#3a211a] outline-none transition focus:border-[#be1919] focus:ring-4 focus:ring-[#be1919]/10"
              />
            )}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#be1919] px-6 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(190,25,25,0.24)] transition hover:-translate-y-1 hover:bg-[#a91515] disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Sending..." : section?.ctaLabel || "Submit Request"}
      </button>

      {successMessage ? (
        <p role="status" className="mt-4 rounded-2xl bg-[#25d366]/12 px-4 py-3 text-sm font-bold text-[#197a3b]">
          {successMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p role="alert" className="mt-4 rounded-2xl bg-[#be1919]/10 px-4 py-3 text-sm font-bold text-[#be1919]">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
