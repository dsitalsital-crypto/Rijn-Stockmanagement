// Service Worker for Rejoes Stock Manager PWA
const CACHE_NAME = 'rejoes-stock-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Rejoes Stock';
  const options = {
    body: data.body || 'Nieuwe melding',
    icon: data.icon || '/Rijn-Stockmanagement/icon-192.png',
    badge: '/Rijn-Stockmanagement/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Openen' },
      { action: 'close', title: 'Sluiten' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'open' || !e.action) {
    e.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/Rijn-Stockmanagement/');
      })
    );
  }
});

// Cache strategy - network first
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
