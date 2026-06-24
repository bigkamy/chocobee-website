"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email") }),
      });
      const data = (await response.json()) as { message?: string };
      setStatus("sent");
      setMessage(data.message ?? "If that email matches an admin account, a reset link has been sent.");
    } catch {
      setStatus("idle");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-login-card">
      <p>Password Recovery</p>
      <h1>Forgot password</h1>
      <label>
        Admin Email
        <input name="email" type="email" placeholder="admin@chocobee.com" required />
      </label>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Reset Link"}
      </button>
      {message ? (
        <span role="status" style={{ color: status === "sent" ? "#197a3b" : undefined }}>
          {message}
        </span>
      ) : null}
      <Link href="/admin/login" className="admin-login-forgot" style={{ justifySelf: "start" }}>
        Back to sign in
      </Link>
    </form>
  );
}
