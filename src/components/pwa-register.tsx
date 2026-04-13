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

    const swVersion = process.env.NEXT_PUBLIC_SW_VERSION?.trim() || "1";
    let refreshTriggered = false;

    const clearBrowserCaches = () => {
      if (!("caches" in window)) {
        return;
      }

      caches.keys().then((keys) => {
        keys.forEach((key) => {
          caches.delete(key).catch(() => {
            // no-op
          });
        });
      });
    };

    try {
      const versionStorageKey = "bedsecret-sw-version";
      const previousVersion = window.localStorage.getItem(versionStorageKey);
      if (previousVersion !== swVersion) {
        clearBrowserCaches();
        window.localStorage.setItem(versionStorageKey, swVersion);
      }
    } catch {
      // no-op
    }

    const applyWaitingWorker = (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    };

    const refreshServiceWorker = (registration: ServiceWorkerRegistration) => {
      registration.update().catch(() => {
        // no-op
      });
      applyWaitingWorker(registration);
    };

    let updateIntervalId: number | null = null;
    let activeRegistration: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register(`/sw.js?v=${encodeURIComponent(swVersion)}`)
      .then((registration) => {
        activeRegistration = registration;
        refreshServiceWorker(registration);

        registration.addEventListener("updatefound", () => {
          const nextWorker = registration.installing;
          if (!nextWorker) return;
          nextWorker.addEventListener("statechange", () => {
            if (nextWorker.state === "installed" && navigator.serviceWorker.controller) {
              nextWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });

        updateIntervalId = window.setInterval(() => {
          refreshServiceWorker(registration);
        }, 60000);
      })
      .catch(() => {
        // Keep silent in UI, registration failure should not break rendering.
      });

    const onVisible = () => {
      if (document.visibilityState === "visible" && activeRegistration) {
        refreshServiceWorker(activeRegistration);
      }
    };

    const onFocus = () => {
      if (activeRegistration) {
        refreshServiceWorker(activeRegistration);
      }
    };

    const onControllerChange = () => {
      if (refreshTriggered) {
        return;
      }
      refreshTriggered = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      if (updateIntervalId !== null) {
        window.clearInterval(updateIntervalId);
      }
    };
  }, []);

  return null;
}
