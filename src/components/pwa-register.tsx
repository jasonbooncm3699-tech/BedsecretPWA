"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Keep silent in UI, registration failure should not break rendering.
      });
    }
  }, []);

  return null;
}
