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
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.3/font/bootstrap-icons.min.css"
];
self.addEventListener("install", function (event) {
    event.waitUntil(

        caches.open(cacheName)
        .then(function (cache) {
            cache.addAll(urlsToCache)
        })

    );

})

// Cache Dinamico
self.addEventListener("fetch", function (event) {

    event.respondWith(
        
        caches.match(event.request)
        .then(function (response) {

            // Si hay una respuesta en el cache, devuelve la respuesta
            if (response) {
                return response;
            }

            // Si no es http, devuelve la respuesta
            if(!event.request.url.startsWith('http')){
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

        })
    );
})

// Notificacion Hard-codeada
self.addEventListener("push", function(e){
    let title = e.data.text();
    let options = {
        body: "Nuevo producto en ElectroShop",
        icon: "./imgs/icon-512x512.png",
        data: {id: 1},
        actions: [
            {action: "1", title: "Comprar"},
            {action: "2", title: "cerrar"}
        ],
       
    }
    e.waitUntil(self.registration.showNotification(title, options));



})

self.addEventListener('notificationclick', function(e){
    if(e.action === '1'){
        console.log('El usuario clickeo comprar');
        clients.openWindow('https://pwa-marcosarcu.netlify.app/');
    } else if(e.action === '2'){
        console.log('El usuario clickeo cerrar');
    }
    e.notification.close();
})