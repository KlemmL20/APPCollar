const CACHE='collarapp-v3';
const FILES=['./', './index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e=>{
  if(new URL(e.request.url).pathname.startsWith('/api/')){e.respondWith(fetch(e.request).catch(()=>new Response(JSON.stringify({error:'Sin conexión'}),{headers:{'Content-Type':'application/json'},status:503})));return;}
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){const cl=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,cl));}return r;}).catch(()=>caches.match('./index.html'))));
});
