const CACHE_NAME = "app-cache-v1";

// Install: cache the app shell (index.html + root)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(["/", "/index.html"])),
  );
  // Activate immediately, don't wait for old SW to die
  self.skipWaiting();
});

// Activate: clean up old caches, take control of all clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  // Take control of already-open pages without requiring a reload
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  // Navigation requests (HTML page loads) — always return index.html from cache if offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Online: serve fresh page and re-cache it
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => {
          // Offline: serve cached index.html so the SPA can boot
          const cached = await caches.match("/index.html");
          return (
            cached ||
            new Response(
              "Offline and index.html not cached yet. Load the page once while online.",
              {
                status: 503,
                headers: { "Content-Type": "text/plain" },
              },
            )
          );
        }),
    );
    return;
  }

  // All other requests (JS, CSS, API calls) — network first, fall back to cache
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;

        return new Response(
          JSON.stringify({ error: "Offline and resource not cached." }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        );
      }
    }),
  );
});
