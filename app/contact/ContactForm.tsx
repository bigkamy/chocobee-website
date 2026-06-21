"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [successMessage, setSuccessMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSuccessMessage("Thank you. Our team will contact you shortly.");
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="self-start rounded-[1.5rem] border border-white/75 bg-white/75 p-5 shadow-[0_24px_60px_rgba(93,64,55,0.12)] backdrop-blur md:p-6">
      <div className="mb-4">
        <h2 className="font-heading text-3xl leading-tight text-[#5d4037] sm:text-4xl">Send a Message</h2>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2 text-sm font-bold text-[#5d4037]">
          Full Name
          <input
            name="name"
            type="text"
            required
            minLength={2}
            placeholder="Your full name"
            className="min-h-10 rounded-2xl border border-[#be1919]/15 bg-white/80 px-4 text-[#3a211a] outline-none transition focus:border-[#be1919] focus:ring-4 focus:ring-[#be1919]/10"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#5d4037]">
          Email Address
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="min-h-10 rounded-2xl border border-[#be1919]/15 bg-white/80 px-4 text-[#3a211a] outline-none transition focus:border-[#be1919] focus:ring-4 focus:ring-[#be1919]/10"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#5d4037]">
          Phone Number
          <input
            name="phone"
            type="tel"
            required
            pattern="[0-9+\-\s]{8,}"
            placeholder="+91 00000 00000"
            className="min-h-10 rounded-2xl border border-[#be1919]/15 bg-white/80 px-4 text-[#3a211a] outline-none transition focus:border-[#be1919] focus:ring-4 focus:ring-[#be1919]/10"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#5d4037]">
          Message
          <textarea
            name="message"
            required
            minLength={8}
            rows={3}
            placeholder="Tell us about your cake theme, date, flavor, and size."
            className="rounded-2xl border border-[#be1919]/15 bg-white/80 px-4 py-3 text-[#3a211a] outline-none transition focus:border-[#be1919] focus:ring-4 focus:ring-[#be1919]/10"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#be1919] px-6 text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(190,25,25,0.24)] transition hover:-translate-y-1 hover:bg-[#a91515]"
      >
        Submit Request
      </button>

      {successMessage ? (
        <p role="status" className="mt-4 rounded-2xl bg-[#25d366]/12 px-4 py-3 text-sm font-bold text-[#197a3b]">
          {successMessage}
        </p>
      ) : null}
    </form>
  );
}
