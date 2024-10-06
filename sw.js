// Название кеша
const CACHE_NAME = 'eeljur-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/EEljur.html'
];

// Устанавливаем Service Worker и кешируем файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Обрабатываем запросы, выдавая закешированные версии
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кеше, возвращаем его
        if (response) {
          return response;
        }
        // Иначе запрашиваем его из сети
        return fetch(event.request);
      })
  );
});

// Обновляем кеш, удаляя устаревшие файлы
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
