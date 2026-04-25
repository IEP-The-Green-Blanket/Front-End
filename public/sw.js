const CACHE_NAME = "green-blanket-v1";

const urlsToCache = ["/", "/offline"];

// this is the service worker file that allows the app to work offline and be installable as a PWA. All it does now is cache the offline page and returns it when the user is offline.

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
});

// Fetch - if the user is offline, it shows the offline page
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match("/offline")));
});
