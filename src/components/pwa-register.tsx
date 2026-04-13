"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Avoid stale cache/HMR issues while developing locally.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // no-op
          });
        });
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            caches.delete(key).catch(() => {
              // no-op
            });
          });
        });
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.update().catch(() => {
        // no-op
      });
    }).catch(() => {
      // Keep silent in UI, registration failure should not break rendering.
    });
  }, []);

  return null;
}
