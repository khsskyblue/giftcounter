const CACHE_NAME = 'giftcounter-v1';

// 캐싱할 파일 목록 (55.html 및 관련 자산들)
// 필요에 따라 사용할 css나 js 파일 경로를 배열에 추가하세요.
const ASSETS_TO_CACHE = [
  './55.html',
  // './style.css',  // 사용하는 CSS 파일이 있다면 주석을 해제하고 경로를 적으세요
  // './script.js'   // 사용하는 JS 파일이 있다면 주석을 해제하고 경로를 적으세요
];

// 1. 서비스 워커 설치 및 리소스 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('기본 리소스 캐싱 중...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting()) // 즉시 활성화
  );
});

// 2. 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('이전 캐시 삭제 중:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. 네트워크 요청 가로채기 (Cache-First 전략)
// 캐시에 데이터가 있으면 캐시를 반환하고, 없으면 네트워크에서 가져옵니다.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
