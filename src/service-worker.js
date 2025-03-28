// Add at the top of the file
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = `chorechart-cache-${CACHE_VERSION}`;

// ...existing code...

// Add this function to clear old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Add skipWaiting to force immediate service worker update
self.skipWaiting();