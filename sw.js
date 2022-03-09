const CACHE_NAME = 'v1_cache_degradado_app_vue';
const urlsToCache = [
  './',
  './?umt_source=web_app_manifest',
  './pages/fallback.html',
  './pages/css/style.css',
  './img/favicon.png',
  './img/icon32.png',
  './img/icon64.png',
  './img/icon128.png',
  './img/icon192.png',
  './img/icon256.png',
  './img/icon512.png',
  './img/icon1024.png',
  './js/main.js',
  './js/mountApp.js',
  './css/style.css',
  './manifest.json',
  'https://unpkg.com/vue@next',
  'https://necolas.github.io/normalize.css/8.0.1/normalize.css',
  'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@1,300&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache
        .addAll(urlsToCache)
        .then(() => self.skipWaiting())
        .catch(err => console.log(err))
    )
  );
});

self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

/* Download CACHE */
self.addEventListener('fetch', e => {
  e.respondWith(
    caches
      .match(e.request)
      .then(res => {
        if (res) {
          return res;
        }
        return fetch(e.request);
      })
      .catch(() => caches.match('./pages/fallback.html'))
  );
});
