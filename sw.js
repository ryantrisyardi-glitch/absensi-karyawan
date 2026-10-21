const CACHE_NAME = 'absensi-cache-v2';
const urlsToCache = ['./', './index.html', './manifest.json', './styles.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  // Firebase & data selalu online; hanya shell app yang di-cache.
  if (event.request.url.includes('firestore') || event.request.url.includes('googleapis')) return;
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
