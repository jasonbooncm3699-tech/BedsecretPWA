"use client";

import { useSyncExternalStore } from "react";

const COOKIE_KEY = "bedsecret-cookie-consent";

function subscribeToStorage(callback: () => void) {
  const handler = () => callback();
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getClientSnapshot() {
  return window.localStorage.getItem(COOKIE_KEY) ?? "unset";
}

function getServerSnapshot() {
  return "unset";
}

export function CookieBanner() {
  const consent = useSyncExternalStore(
    subscribeToStorage,
    getClientSnapshot,
    getServerSnapshot,
  );
  const visible = consent === "unset";

  const setConsent = (value: "accepted" | "rejected") => {
    window.localStorage.setItem(COOKIE_KEY, value);
    window.dispatchEvent(new StorageEvent("storage", { key: COOKIE_KEY }));
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
