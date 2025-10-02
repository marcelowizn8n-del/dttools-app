// Service Worker para forçar atualizações de cache
const CACHE_VERSION = 'dttools-v1.0.6-manifest-fix';
const CACHE_NAME = 'dttools-cache-' + CACHE_VERSION;

// Lista de arquivos para cachear
const urlsToCache = [
  '/',
  '/logo-horizontal.png',
  '/logo-icon.png',
  '/manifest.json'
];

// Instalar service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
  // Força o novo SW a se tornar ativo imediatamente
  console.log('DTTools SW installed, version:', CACHE_VERSION, '- Mobile FINAL fix');
  self.skipWaiting();
});

// Ativar service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Força o controle imediato de todas as páginas
  console.log('DTTools SW activated, version:', CACHE_VERSION, '- Mobile FINAL fix');
  return self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Network first para HTML, cache first para assets
    caches.match(event.request)
      .then(function(response) {
        // Se encontrou no cache e não é HTML, retorna do cache
        if (response && !event.request.url.match(/\.(html|php|asp)$/i)) {
          return response;
        }
        
        // Senão, busca da rede
        return fetch(event.request).then(function(response) {
          // Não cacheia se não for uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clona a resposta
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(function() {
          // Se falhar na rede, retorna do cache se disponível
          return response;
        });
      })
  );
});

// Notificar sobre atualizações
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});