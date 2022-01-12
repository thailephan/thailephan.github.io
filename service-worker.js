const CACHE_NAME = "version-1";

const urlsToCache = [
    "index.html",
    "static/fonts/Roboto-Bold.ttf",
    "static/fonts/Roboto-Regular.ttf",
    "static/fonts/Roboto-Medium.ttf",
    "static/fonts/Roboto-Light.ttf",
    "static/css/base.css",
    "static/css/main.83876a5f.css",
    "static/js/main.966f04eb.js",
    "logo192.png",
    "favicon.ico",
];

const self = this;

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[Service worker] Cache installed");
            return cache.addAll(urlsToCache);
        }),
    );
});

self.addEventListener("fetch", (event) => {
    console.log("[Service worker] Cache fetched");

    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            return (
                cachedResponse ||
                fetch(event.request).then(function (res) {
                    caches
                        .open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, res))
                        // .catch(() => caches.match("index.html"));
                    return res;
                })
            );
        }),
    );
});

self.addEventListener("activate", (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    console.log("[Service worker] Cache activated");
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter(function (cacheName) {
                        return !cacheWhiteList.includes(cacheName);
                    })
                    .map(function (cacheName) {
                        return caches.delete(cacheName);
                    }),
            ),
        ),
    );
});
