/* global self:false, caches:false */
'use strict';

/**
 * Installation is attempted when the downloaded file is found
 * to be new — either different to an existing service worker
 * (byte-wise compared), or the first service worker
 * encountered for this page/site.
 *
 * If this is the first time a service worker has been made
 * available then installation is attempted and after a
 * successful installation it is activated.
 *
 * We are asking this ServiceWorker to cache the HTML file
 * along with our required styles, scripts, image and audio
 * assets.
 *
 * @param {Object} event - InstallEvent.
 */
self.addEventListener('install', function(event) {
    console.info('ServiceWorker::install');

    event.waitUntil(
        caches.open('hots').then(function(cache) {
            var addAssets = cache.addAll([
                '/',
                '/css/main.css',
                '/js/main.js',
                '/img/jaina.jpg',
                '/audio/jaina.mp3',
                '/img/johanna.jpg',
                '/audio/johanna.mp3',
                '/img/kerrigan.jpg',
                '/audio/kerrigan.mp3',
                '/img/li-li.jpg',
                '/audio/li-li.mp3',
                '/img/lt-morales.jpg',
                '/audio/lt-morales.mp3',
                '/img/nova.jpg',
                '/audio/nova.mp3',
                '/img/sgt-hammer.jpg',
                '/audio/sgt-hammer.mp3',
                '/img/sonya.jpg',
                '/audio/sonya.mp3',
                '/img/sylvanas.jpg',
                '/audio/sylvanas.mp3',
                '/img/tyrande.jpg',
                '/audio/tyrande.mp3',
                '/img/valla.jpg',
                '/audio/valla.mp3',
                '/img/zagara.jpg',
                '/audio/zagara.mp3'
            ]);

            addAssets.then(function() {
                console.log('ServiceWorker::cacheAddAll');
            }).catch(function() {
                console.error('ServiceWorker::cacheAddAll');
            });

            return addAssets;
        })
    );
});

/**
 * Whenever the browser makes a request / fetch for an asset,
 * the ServiceWorker intercepts it before any network
 * requests are made. If the request was for an asset we have
 * explicitly asked to be cached then service it from our
 * ServiceWorker and skip the need for the network.
 *
 * @param {Object} event - FetchEvent.
 */
self.addEventListener('fetch', function(event) {
    console.info('ServiceWorker::fetch', event);

    event.respondWith(
        caches.match(event.request)
              .then(function(response) {
                  console.info('Caches::match', response);
                  return response || fetch(event.request);
              })
    );
});
