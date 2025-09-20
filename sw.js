const CACHE = 'undo-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './onboarding.html',
  './dashboard.html',
  './achievements.html',
  './analytics.html',
  './breathing.html',
  './settings.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
