const CACHE_NAME = 'interest-calculator-v1';
const urlsToCache = [
	'/',
	'/index.html',
	'/main.css',
	'/app.js',
	'/icon.svg',
	'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => cache.addAll(urlsToCache))
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then(response => {
				if (response) {
					return response;
				}
				return fetch(event.request);
			})
	);
});
