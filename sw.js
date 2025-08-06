const CACHE_NAME = 'creature-crypt-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/hexagon-background.png',
    '/creature-crypt-logo.png',
    '/creature-crypt-icon-16.png',
    '/creature-crypt-icon-32.png',
    '/creature-crypt-icon-180.png',
    '/creature-crypt-icon-192.png',
    '/creature-crypt-icon-512.png',
    '/style.css', // Add your CSS file if separate
    '/script.js'  // Add your JS file if separate
    // Add other assets as needed
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
        ))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(networkResponse => {
                if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('Offline. Check your connection.', { status: 503 });
            });
        })
    );
});