"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

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

export function LoginForm() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
      callbackUrl: "/admin",
    });

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form onSubmit={handleSubmit} className="admin-login-card">
      <p>Secure Admin Access</p>
      <h1>Welcome back</h1>
      <label>
        Email
        <input name="email" type="email" placeholder="admin@chocobee.com" required />
      </label>
      <label>
        Password
        <div className="admin-login-password">
          <input name="password" type={showPassword ? "text" : "password"} placeholder="Enter password" required />
          <button
            type="button"
            className="admin-login-toggle"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </label>
      <Link href="/admin/forgot-password" className="admin-login-forgot">
        Forgot password?
      </Link>
      <button type="submit">Sign In</button>
      {error ? <span role="alert">{error}</span> : null}
    </form>
  );
}
