// LifeOptima PWA Service Worker

const CACHE_NAME = 'lifeoptima-v1.2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
];

// Installation - Caching für Offline-Funktionalität
self.addEventListener('install', (event) => {
  console.log('LifeOptima PWA Service Worker installiert');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Dateien werden gecacht...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Aktivierung - Alte Caches löschen
self.addEventListener('activate', (event) => {
  console.log('LifeOptima PWA Service Worker aktiviert');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Alter Cache gelöscht:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// Fetch - Cache First Strategy für Offline-Funktionalität
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache gefunden - zurückgeben
        if (response) {
          return response;
        }
        
        // Nicht im Cache - von Netzwerk laden
        return fetch(event.request).then(fetchResponse => {
          // Prüfen ob gültige Antwort
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // Antwort klonen für Cache
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return fetchResponse;
        });
      })
      .catch(() => {
        // Offline Fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Nachrichten vom Hauptthread
self.addEventListener('message', (event) => {
  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      ...options,
      icon: './icon-192.png',
      badge: './icon-72.png'
    });
  }
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // App-Fenster öffnen/fokussieren
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then((clientList) => {
      // Existierendes Fenster fokussieren
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // Neues Fenster öffnen
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});

// Push Notifications (für Server-Push)
self.addEventListener('push', (event) => {
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = { body: event.data.text() };
    }
  }
  
  const options = {
    body: notificationData.body || 'Zeit für deine Gesundheitsziele! 💪',
    icon: './icon-192.png',
    badge: './icon-72.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    data: {
      dateOfArrival: Date.now(),
      action: notificationData.action || 'open'
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || '💧 LifeOptima Erinnerung', 
      options
    )
  );
});

// Background Sync für Offline-Daten
self.addEventListener('sync', (event) => {
  if (event.tag === 'health-data-sync') {
    event.waitUntil(syncHealthData());
  }
});

function syncHealthData() {
  return new Promise((resolve) => {
    console.log('Gesundheitsdaten werden synchronisiert...');
    // Hier würde die Offline-Daten-Synchronisation stattfinden
    resolve();
  });
} 