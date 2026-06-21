"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [error, setError] = useState("");

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
        <input name="password" type="password" placeholder="Enter password" required />
      </label>
      <button type="submit">Sign In</button>
      {error ? <span role="alert">{error}</span> : null}
    </form>
  );
}
