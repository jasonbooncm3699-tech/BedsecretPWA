const CACHE_NAME = "bedsecret-static-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(["/en"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const request = event.request;
  const url = new URL(request.url);

  // Always prefer network for app/document requests to avoid stale HTML/CSS on mobile.
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/en")),
    );
    return;
  }

  // For same-origin static assets, use stale-while-revalidate.
  if (
    url.origin === self.location.origin &&
    ["style", "script", "image", "font"].includes(request.destination)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const cloned = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      }),
    );
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request).then((cached) => cached)),
  );
});
