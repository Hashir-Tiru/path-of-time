const CACHE_NAME = "kala-chakra-pwa-v2";
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
    // Warm the exact astronomy dependency. Failure to reach the CDN must not block install.
    try {
      const response = await fetch(ASTRONOMY_ENGINE, { mode: "cors", cache: "reload" });
      if (response.ok) await cache.put(ASTRONOMY_ENGINE, response);
    } catch (error) {
      // Online use can still load the library later; offline astronomy needs one successful fetch.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("kala-chakra-pwa-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Keep page navigations fresh, with the last working app as the offline fallback.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok && url.origin === self.location.origin) {
          const cache = await caches.open(CACHE_NAME);
          cache.put("./index.html", response.clone());
        }
        return response;
      } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match("./index.html")) || (await cache.match("./")) ||
          new Response("KALA CHAKRA is not available offline yet. Open it once while online.", {
            status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
      }
    })());
    return;
  }

  // Same-origin app shell and the pinned Astronomy Engine dependency use cache-first.
  if (url.origin === self.location.origin || url.href === ASTRONOMY_ENGINE) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      } catch (error) {
        return new Response("", { status: 504, statusText: "Offline resource unavailable" });
      }
    })());
  }
});
