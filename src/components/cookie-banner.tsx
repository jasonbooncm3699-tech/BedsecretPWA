"use client";

import { useState } from "react";

const COOKIE_KEY = "bedsecret-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const saved = window.localStorage.getItem(COOKIE_KEY);
    return !saved;
  });

  const setConsent = (value: "accepted" | "rejected") => {
    window.localStorage.setItem(COOKIE_KEY, value);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-24 z-40 rounded-2xl border bg-surface p-4 shadow-xl md:inset-x-auto md:right-8 md:bottom-8 md:w-[420px]">
      <p className="text-sm text-muted-foreground">
        Bedsecret uses cookies to improve your experience. You can accept or reject
        non-essential cookies.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setConsent("accepted")}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Accept
        </button>
        <button
          onClick={() => setConsent("rejected")}
          className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
