// Stays registered so the site can be installed. Does not cache.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.clients.claim();
      if (keys.length === 0) return;
      const clients = await self.clients.matchAll({ type: 'window' });
      await Promise.all(
        clients.map((client) => client.navigate(client.url)),
      );
    })(),
  );
});

self.addEventListener('fetch', () => {
  // Leave the request to the network. respondWith would be a cache.
});
