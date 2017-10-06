var CACHES_KEY = "v1";
var filesToCache = [
  "assets/image/unset.jpg",
   "assets/image/7-1.jpg",
   "assets/image/055.jpg",
   "assets/css/task6.css"
  ];
var rules = [
  {
    pattern: /^.+png$/,
    maxAge: 86400
  },
  {
    pattern: /^.+jpeg$/,
    maxAge: 86400
  },
  {
    pattern: /^.+css$/,
    maxAge: 86400
  }
];

function matchAssetsRule(request) {
  return rules.find(rule => {
    return rule.pattern.test(request.url);
  });
}

function exceedMaxAge(rule, response) {
  var maxAge = Number(rule.maxAge);
  if (isNaN(maxAge)) maxAge = 2592000;
  var startTimeText =
    response.headers.get("date") || response.headers.get("last-modified");
  var startTime = new Date(startTimeText);
  var timeSpan = new Date() - startTime;
  timeSpan = Math.floor(timeSpan / 1000);
  return timeSpan > maxAge;
}

function fetchAndWrite(request) {
  return fetch(request.url, { mode: "cors" }).then(response => {
    caches.open(CACHES_KEY).then(cache => {
      cache.put(request, response.clone());
    });
    return response.clone();
  });
}

self.addEventListener("install", event => {
  console.warn("[SW Install]");
  event.waitUntil(
    caches.open(CACHES_KEY).then(cache => {
      cache.addAll(filesToCache)
    })
  );
});
self.addEventListener("activate", event => {
  console.warn("[SW activate]");
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHES_KEY) {
          return caches.delete(key);
        }
      }));
    })
  );
});
self.addEventListener("fetch", event => {
  var result = null;
  var rule = matchAssetsRule(event.request);
  if (rule) {
    result = caches
      .match(event.request, { cacheName: CACHES_KEY })
      .then(response => {
        if (response) {
          if (exceedMaxAge(rule, response)) {
            console.log("[SW Fetch] outdate", response.url);
            return fetchAndWrite(event.request).catch(error => {
              console.error("[SW Fetch]", "failed to fetch");
              console.error(error);
              return response.clone();
            });
          }
          console.log("[SW Fetch] from cache", response.url);
          return response.clone();
        } else {
          console.log("[SW Fetch] miss cache", event.request.url);
          return fetchAndWrite(event.request).catch(e => {
            console.log(event.request.url);
            console.log(e);
          });
        }
      });
  } else {
    console.log("[SW Fetch] miss rule, bypass", event.request.url);
    result = fetch(event.request);
  }
  event.respondWith(result);
});
