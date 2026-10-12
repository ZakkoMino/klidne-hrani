import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const list=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?list(path.join(dir,d.name)):[path.join(dir,d.name)]);
const files=list('dist').filter(f=>!f.endsWith('sw.js')).map(f=>'./'+f.slice(5).replaceAll('\\','/')).sort();
for(const f of files){if(/\.(js|css|html|json|webmanifest|svg)$/.test(f)){const p=path.join('dist',f.slice(2));const before=fs.readFileSync(p,'utf8'),after=before.replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');if(after!==before)fs.writeFileSync(p,after);}}
const hash=crypto.createHash('sha256');for(const f of files)hash.update(fs.readFileSync(path.join('dist',f.slice(2))));const version=hash.digest('hex').slice(0,12);
fs.writeFileSync('dist/sw.js',`const CACHE='klidne-hrani-${version}';
const FILES=${JSON.stringify(['./',...files])};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('klidne-hrani-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);
 if(e.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 // A manifest must be refreshed so Chrome sees current installation metadata.
 if(url.pathname.endsWith('/manifest.webmanifest')){
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('manifest');return r;}).catch(()=>caches.match('./manifest.webmanifest')));return;
 }
 e.respondWith(caches.open(CACHE).then(c=>c.match(e.request)).then(cached=>cached||fetch(e.request).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):Response.error())));
});`);
console.log(`Offline bundle: ${files.length} files; version ${version}`);
