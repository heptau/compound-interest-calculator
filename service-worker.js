const SW_VERSION = '1.0.0'; // Define version here
const STATIC_CACHE_NAME = 'interest-calculator-static-v' + SW_VERSION;
const DATA_CACHE_NAME = 'interest-calculator-data-v1.0.0'; // Increased version

const staticUrlsToCache = [
	'/',
	'index.html',
	'about.html',
	'main.css',
	'app.js',
	'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/i18next/25.0.1/i18next.min.js'
];

const staticAssetRegex = /locales\/.*\.json/; // Regex for locale files

function shouldHandleAsStatic(url) {
	return staticAssetRegex.test(url);
}

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(STATIC_CACHE_NAME)
			.then(cache => cache.addAll(staticUrlsToCache))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheName !== STATIC_CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		}).then(() => {
			// Send version to all clients after activation
			self.clients.matchAll().then(clients => {
				clients.forEach(client => {
					client.postMessage({
						type: 'SW_VERSION',
						version: SW_VERSION // Use SW_VERSION directly
					});
				});
			});
			return self.clients.claim();
		})
	);
});

self.addEventListener('fetch', event => {
	const { url } = event.request;

	// Filter out requests that the service worker shouldn't handle (e.g., chrome-extension)
	if (!url.startsWith('http') && !url.startsWith('https')) {
		return; // Skip handling this request
	}

	if (!shouldHandleAsStatic(url)) {
		// Handle all non-static requests as data (including API and images)
		event.respondWith(
			caches.open(DATA_CACHE_NAME).then(cache => {
				return cache.match(event.request).then(cachedResponse => {
					if (cachedResponse) {
						// Return cached data immediately
						if (navigator.connection && (navigator.connection.type === 'wifi' || navigator.connection.type === 'ethernet')) {
							fetch(event.request).then(networkResponse => {
								if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
									return;
								}
								cache.put(event.request.url, networkResponse.clone()); // Update cache
							});
						}
						return cachedResponse;
					}

					return fetch(event.request).then(networkResponse => {
						if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
							return networkResponse;
						}

						// Check Content-Type before caching
						if (networkResponse.headers.get('content-type') &&
							networkResponse.headers.get('content-type').includes('application/json')) {
							cache.put(event.request.url, networkResponse.clone());
						} else if (networkResponse.headers.get('content-type') &&
								   networkResponse.headers.get('content-type').startsWith('image/')) {
							cache.put(event.request.url, networkResponse.clone());
						}

						return networkResponse;
					});
				}).catch(() => fetch(event.request)); // If cache.match fails, fetch from network
			})
		);
	} else {
		// Handle static assets (only locale files now) with cache-first and background update
		event.respondWith(
			caches.open(STATIC_CACHE_NAME).then(cache => {
				return cache.match(event.request).then(cachedResponse => {
					if (cachedResponse) {
						// Return cached asset immediately
						if (navigator.connection && (navigator.connection.type === 'wifi' || navigator.connection.type === 'ethernet')) {
							fetch(event.request).then(networkResponse => {
								if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
									return;
								}
								cache.put(event.request.url, networkResponse.clone()); // Update cache
							});
						}
						return cachedResponse;
					}

					return fetch(event.request).then(networkResponse => {
						if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
							return networkResponse;
						}
						cache.put(event.request.url, networkResponse.clone());
						return networkResponse;
					});
				}).catch(() => fetch(event.request)); // If cache.match fails, fetch from network
			})
		);
	}
});

self.addEventListener('message', (event) => {
	if (event.data.type === 'GET_VERSION') {
		self.clients.matchAll().then(clients => {
			clients.forEach(client => {
				client.postMessage({ type: 'SW_VERSION', version: SW_VERSION });
			});
		});
	}
	if (event.data.action === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
