self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("bedsecret-v1").then((cache) => cache.addAll(["/", "/en"])),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).catch(() => caches.match("/en"));
    }),
  );
});
