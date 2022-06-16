self.addEventListener("install", function (event) {
    self.skipWaiting();
    console.log("SW instalado", event);
});

self.addEventListener("activate", function (event) {
    console.log("SW activado", event);
});


let cacheName = "cache";
let urlsToCache = [
    "./",
    "./index.html",
    "./css/main.css",
    "./js/main.js",
    "./sw.js",
    "./imgs/logo.png",
    "./imgs/ContactUs.svg",
    "./imgs/ElectroShop.svg",
];
self.addEventListener("install", function (event) {
    event.waitUntil(

        caches.open(cacheName)
        .then(function (cache) {
            cache.addAll(urlsToCache)
        })

    );

})

self.addEventListener("fetch", function (event) {

    event.respondWith(
        
        caches.match(event.request)
        .then(function (response) {

            // Si hay una respuesta en el cache, devuelve la respuesta
            if (response) {
                return response;
            }

            // Si no hay una respuesta en el cache, clono la petición
            let requestToCache = event.request.clone();

            // Hago la petición
            return fetch(requestToCache)
                // Si hay un error, devuelve la respuesta del error
                .then(function (response) {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    // Si no hay error, clono la respuesta
                    let responseToCache = response.clone();
                    // Y la guardo en el cache
                    caches.open(cacheName)
                        .then(function (cache) {
                            cache.put(requestToCache, responseToCache);
                        });
                    // Devuelve la respuesta
                    return response;

                })


            // return fetch(event.request);
        })
    );
})