// Service worker simples do STE: tenta a rede primeiro e, se estiver sem internet, usa a cópia guardada.
const CACHE = 'ste-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(res => { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); return res; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: 'window' }).then(l => l.length ? l[0].focus() : self.clients.openWindow('./'))); });
