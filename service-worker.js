// service-worker.js
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open('driverpro-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/src/index.html',
        '/src/style.css',
        '/src/app.js',
        '/assets/Logo.DrvPro.jpg',
        '/assets/f1-racing-overlay.jpg'
        // adicione outros ficheiros relevantes ao cache inicial
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

