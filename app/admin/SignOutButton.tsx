"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button type="button" className="admin-signout-button" onClick={() => void signOut({ callbackUrl: "/admin/login" })}>
      Sign Out
    </button>
  );
}
