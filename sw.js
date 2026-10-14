const CACHE = 'sakura-flap-v6-20261014';
const ROOT = '/flappy-bird/';
const ASSETS = [ROOT, ROOT+'index.html', ROOT+'manifest.webmanifest', ROOT+'icon-192.png', ROOT+'icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('sakura-flap-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(ROOT)) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(response => response.ok ? response : caches.match(ROOT)).catch(() => caches.match(ROOT)));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
