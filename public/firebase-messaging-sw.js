importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: 'AIzaSyC-YOUR-API-KEY',
  authDomain: 'YOUR-PROJECT.firebaseapp.com',
  projectId: 'YOUR-PROJECT-ID',
  appId: 'YOUR-APP-ID',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Vibe Travel';
  const notificationOptions = {
    body: payload.notification?.body || 'You have arrived at your destination',
    icon: '/vibe-travel-icon.png',
    badge: '/vibe-travel-badge.png',
    tag: payload.data?.placeId || 'notification',
    requireInteraction: false,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
