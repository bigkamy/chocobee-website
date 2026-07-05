"use client";

import { useEffect, useState } from "react";

const ADMIN_TOAST_EVENT = "admin:published";

// Fire the global "New Changes Published" bar from any admin manager after a
// successful publish / update / save. Rendered once by the admin layout.
export function notifyPublished(message = "New Changes Published") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ADMIN_TOAST_EVENT, { detail: message }));
}

export function AdminToast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer = 0;
    let clearTimer = 0;

    function onPublished(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearTimer);
      setMessage(detail || "New Changes Published");
      // Mount hidden, then flip to visible on the next frames so the bar slides in.
      setVisible(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      hideTimer = window.setTimeout(() => setVisible(false), 2800);
      clearTimer = window.setTimeout(() => setMessage(""), 3200);
    }

    window.addEventListener(ADMIN_TOAST_EVENT, onPublished);
    return () => {
      window.removeEventListener(ADMIN_TOAST_EVENT, onPublished);
      window.clearTimeout(hideTimer);
      window.clearTimeout(clearTimer);
    };
  }, []);

  if (!message) return null;

  return (
    <div className="admin-toast-viewport" role="status" aria-live="polite">
      <div className={`admin-toast${visible ? " admin-toast-visible" : ""}`}>
        <span className="admin-toast-check" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m5 12.5 4.2 4.2L19 7" />
          </svg>
        </span>
        {message}
      </div>
    </div>
  );
}
