// Self-unregistering Service Worker - CLEANUP VERSION
// This SW will immediately unregister itself and clear all caches

console.log('🧹 DTTools Cleanup SW: Unregistering and clearing all caches...');

self.addEventListener('install', function(event) {
  console.log('✅ Cleanup SW installed - will self-destruct');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('🗑️ Cleanup SW activated - clearing all caches...');
  
  event.waitUntil(
    Promise.all([
      // Delete ALL caches
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Unregister this service worker
      self.registration.unregister().then(function() {
        console.log('✅ Service Worker unregistered successfully');
        // Force all clients to reload with fresh content
        return self.clients.matchAll().then(function(clients) {
          clients.forEach(function(client) {
            console.log('Reloading client:', client.url);
            client.postMessage({ action: 'reload' });
          });
        });
      })
    ])
  );
  
  return self.clients.claim();
});

// Don't intercept any fetches - let everything pass through
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});

// Listen for reload message from clients
self.addEventListener('message', function(event) {
  if (event.data.action === 'reload') {
    self.clients.matchAll().then(function(clients) {
      clients.forEach(function(client) {
        client.navigate(client.url);
      });
    });
  }
});
