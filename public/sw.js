// Dirwa service worker: makes repeat visits near-instant and lets a visitor who has seen the
// gallery or showroom browse it again on a weak or dropped mobile connection.
//  - /assets/* (hashed JS/CSS)      cache-first (file names change on every build)
//  - /products, /models, /draco     stale-while-revalidate (instant, refreshed in the background)
//  - the page itself                network-first, falls back to the cached copy when offline
const VERSION = 'dirwa-v1';
const STATIC = VERSION + '-static';
const MEDIA = VERSION + '-media';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const p = url.pathname;

  if (p.startsWith('/assets/')) {
    e.respondWith(
      caches.open(STATIC).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) c.put(req, res.clone());
        return res;
      })
    );
  } else if (/^\/(products|models|draco)\//.test(p)) {
    e.respondWith(
      caches.open(MEDIA).then(async (c) => {
        const hit = await c.match(req);
        const refresh = fetch(req)
          .then((res) => { if (res.ok) c.put(req, res.clone()); return res; })
          .catch(() => hit);
        return hit || refresh;
      })
    );
  } else if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(STATIC).then((c) => c.put('/', copy)); return res; })
        .catch(() => caches.match('/').then((r) => r || Response.error()))
    );
  }
});
