// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBI2teHmn00s6KvrmMWRhOpi3Jfa27K_xo",
  authDomain: "rijnstockmanagement.firebaseapp.com",
  projectId: "rijnstockmanagement",
  storageBucket: "rijnstockmanagement.firebasestorage.app",
  messagingSenderId: "179354843916",
  appId: "1:179354843916:web:c6137cca4caa060146e729"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Rejoes Stock', {
    body: body || 'Nieuwe melding',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    tag: 'rejoes-notification'
  });
});

// Handle notification click
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/application/');
    })
  );
});
