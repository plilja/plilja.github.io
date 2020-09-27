const CACHE_PREFIX = 'plilja.se';
const CACHE_VERSION = '1'; // bump to get a new cache
const GLOBAL_CACHE_NAME = CACHE_PREFIX + '-' + CACHE_VERSION;
const DEBUG = false;

function daysToMillis(days) {
    return days * 24 * 60 * 60 * 1000;
}

function secondsToMillis(seconds) {
    return seconds * 1000;
}

const CACHES_SETTINGS = [
    {
        'name': 'long-cache',
        'expiry': daysToMillis(90),
        'entries': [
            new RegExp('^/javascript/.*'),
            new RegExp('^/images/.*'),
            new RegExp('^/css/.*'),
        ],
    },
    {
        'name': 'medium-cache',
        'expiry': daysToMillis(1),
        'entries': [
            new RegExp('^/$'),
            new RegExp('.*/tag/.*'),
        ],
    },
    {
        'name': 'default-cache',
        'expiry': daysToMillis(7),
        'entries': [
            new RegExp('.*'),
        ],
    },
];

function getCacheSettings(url) {
    const tmp = url.replace("http://", "")
        .replace("https://", "");
    const baseUrl = tmp.substring(tmp.indexOf('/'));
    for (const cacheSettings of CACHES_SETTINGS) {
        for (const entry of cacheSettings.entries) {
            if (entry.test(baseUrl)) {
                DEBUG && console.log(`SW: url: ${baseUrl} cacheSettings: ${cacheSettings.name} cacheExpiry: ${cacheSettings.expiry}`);
                return cacheSettings;
            }
        }
    }
    return undefined;
}

function isActive(cachedResponse) {
    const expiration = cachedResponse.headers.get('sw-cache-expires');
    const now = new Date().getTime();
    return !!(expiration && expiration > now);
}

// This function is in large copied from this blog post
// It has been slightly rewritten, most significant change is to
// accommodate having multiple caches with different expiry times
// and using unix timestamps instead of dates.
// https://phyks.me/2019/01/manage-expiration-of-cached-assets-with-service-worker-caching.html
addEventListener('fetch', (event) => {
    const {request} = event;

    event.respondWith(caches.open(GLOBAL_CACHE_NAME).then(
        cache => cache.match(request).then(
            (response) => {
                const cacheSettings = getCacheSettings(request.url);
                if (response) {
                    if (isActive(response)) {
                        DEBUG && console.log(`SW: serving ${request.url} from cache.`);
                        return response;
                    } else {
                        DEBUG && console.log(`SW: cached ${request.url} is expired.`);
                    }
                }

                DEBUG && console.log(`SW: no active match in cache for ${request.url}, using network.`);
                return fetch(request).then((liveResponse) => {
                    const expires = new Date().getTime() + cacheSettings.expiry;
                    // The cache can only store Response objects
                    // and those are not mutable. Create a copy
                    // of the response and add the expiry header.
                    const cachedResponseFields = {
                        status: liveResponse.status,
                        statusText: liveResponse.statusText,
                        headers: {'sw-cache-expires': expires},
                    };
                    liveResponse.headers.forEach((v, k) => {
                        cachedResponseFields.headers[k] = v;
                    });
                    // Body can only be consumed once, we need to clone the response
                    const returnedResponse = liveResponse.clone();
                    return liveResponse.blob().then((body) => {
                        cache.put(request, new Response(body, cachedResponseFields));
                        return returnedResponse;
                    });
                });
            })
        )
    )
});

addEventListener('activate', event => {
    const removeExpiredEntries = async () => {
        const cacheNames = await caches.keys();
        for (const cacheName in cacheNames) {
            if (cacheName === GLOBAL_CACHE_NAME) {
                await caches.open(cacheName).then(async cache => {
                    await cache.keys(async request => {
                        await cache.match(request).then(async response => {
                            if (!isActive(response)) {
                                await cache.delete(request);
                            }
                        })
                    });
                })
            } else {
                // Old cache, delete it
                await caches.delete(cacheName);
            }
        }
    };
    event.waitUntil(removeExpiredEntries());
});

