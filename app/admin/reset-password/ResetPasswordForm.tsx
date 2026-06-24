"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.8 12s3.3-6 9.2-6 9.2 6 9.2 6-3.3 6-9.2 6-9.2-6-9.2-6Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9.6 9.6 0 0 1 12 6c5.9 0 9.2 6 9.2 6a14 14 0 0 1-2.6 3.2M6.2 7.4A14 14 0 0 0 2.8 12s3.3 6 9.2 6a9.4 9.4 0 0 0 3.3-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not reset password.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="admin-login-card">
        <p>Password Recovery</p>
        <h1>Invalid link</h1>
        <span role="alert">This reset link is missing or invalid. Please request a new one.</span>
        <Link href="/admin/forgot-password" className="admin-login-forgot" style={{ justifySelf: "start" }}>
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="admin-login-card">
        <p>Password Recovery</p>
        <h1>Password updated</h1>
        <span role="status" style={{ color: "#197a3b" }}>
          Your password has been changed. You can now sign in with your new password.
        </span>
        <Link href="/admin/login" className="admin-login-forgot" style={{ justifySelf: "start" }}>
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="admin-login-card">
      <p>Password Recovery</p>
      <h1>Set a new password</h1>
      <label>
        New Password
        <div className="admin-login-password">
          <input name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" minLength={8} required />
          <button
            type="button"
            className="admin-login-toggle"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </label>
      <label>
        Confirm Password
        <input name="confirm" type={showPassword ? "text" : "password"} placeholder="Re-enter new password" minLength={8} required />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? "Updating…" : "Update Password"}
      </button>
      {error ? <span role="alert">{error}</span> : null}
    </form>
  );
}
