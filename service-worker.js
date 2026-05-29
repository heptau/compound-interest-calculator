const SW_VERSION = '1.2.2'; // Single source of truth — bump on every deploy
const STATIC_CACHE_NAME = 'interest-calculator-static-v' + SW_VERSION;
const DATA_CACHE_NAME = 'interest-calculator-data-v' + SW_VERSION;

const localUrlsToCache = [
	'/',
	'index.html',
	'main.css',
	'app.js',
	'icon.svg',
	'icon.png',
	'icon-transparent.png',
	'qr-code.png',
	'screenshot-mobile.jpg'
];

const cdnUrlsToCache = [
	'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
];

const staticAssetRegex = /locales\/.*\.json/; // Regex for locale files
const manifestAssetRegex = /manifest-.*\.json/; // Regex for per-language manifest files

function shouldHandleAsStatic(url) {
	return staticAssetRegex.test(url) || manifestAssetRegex.test(url);
}

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(STATIC_CACHE_NAME)
			.then(cache => {
				return cache.addAll(localUrlsToCache)
					.then(() => {
						return Promise.all(
							cdnUrlsToCache.map(url =>
								cache.add(url).catch(() => {})
							)
						);
					});
			})
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
						if (!navigator.connection || navigator.connection.type === 'wifi' || navigator.connection.type === 'ethernet') {
							fetch(event.request).then(networkResponse => {
								if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
									return;
								}
								cache.put(event.request.url, networkResponse.clone()); // Update cache
							}).catch(() => {});
						}
						return cachedResponse;
					}

					return fetch(event.request).then(networkResponse => {
						if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
							return networkResponse;
						}

						// Check Content-Type before caching
						if (networkResponse.headers.get('content-type') &&
							(networkResponse.headers.get('content-type').includes('application/json') ||
							 networkResponse.headers.get('content-type').includes('javascript') ||
							 networkResponse.headers.get('content-type').startsWith('image/'))) {
							cache.put(event.request.url, networkResponse.clone());
						}

						return networkResponse;
					});
				}).catch(() => fetch(event.request)); // If cache.match fails, fetch from network
			})
		);
	} else {
		// Handle static assets (locale files) with network-first strategy
		event.respondWith(
			caches.open(STATIC_CACHE_NAME).then(cache => {
				return fetch(event.request).then(networkResponse => {
					if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
						cache.put(event.request.url, networkResponse.clone());
					}
					return networkResponse;
				}).catch(() => {
					return cache.match(event.request).then(cachedResponse => {
						return cachedResponse || new Response('', { status: 503 });
					});
				});
			})
		);
	}
});

self.addEventListener('message', (event) => {
	if (!event.data) return;
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
