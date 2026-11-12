const CACHE_NAME = "path-of-time-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
const ASTRONOMY_ENGINE = "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    // Warm the astronomy library while online so lunar calculations can work offline later.
    try {
      const response = await fetch(ASTRONOMY_ENGINE, { mode: "cors", cache: "reload" });
      if (response.ok) await cache.put(ASTRONOMY_ENGINE, response);
    } catch (error) {
      // Installation can still complete; lunar calculations need one successful online load.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("path-of-time-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (url.href === ASTRONOMY_ENGINE) {
    event.respondWith((async () => {
      const cached = await caches.match(ASTRONOMY_ENGINE);
      if (cached) return cached;
      try {
        const live = await fetch(request);
        if (live.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(ASTRONOMY_ENGINE, live.clone());
        }
        return live;
      } catch (error) {
        return new Response("Astronomy Engine is not cached yet. Open PATH OF TIME once while online to prepare offline lunar calculations.", {
          status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })());
    return;
  }

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const live = await fetch(request);
      if (live.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, live.clone());
      }
      return live;
    } catch (error) {
      if (request.mode === "navigate") {
        return (await caches.match("./index.html")) || Response.error();
      }
      return Response.error();
    }
  })());
});
