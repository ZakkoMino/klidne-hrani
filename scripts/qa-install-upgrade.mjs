import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
let legacy=true;const root=path.resolve('dist');
const mime={'.js':'text/javascript','.webmanifest':'application/manifest+json','.css':'text/css','.html':'text/html','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(!pathname.startsWith('/klidne-hrani/')){res.writeHead(404).end();return;}
 const relative=pathname.slice('/klidne-hrani/'.length)||'index.html',file=path.resolve(root,relative);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(relative==='manifest.webmanifest'){const m=JSON.parse(fs.readFileSync(file));if(legacy)m.id='./';res.writeHead(200,{'Content-Type':mime['.webmanifest'],'Cache-Control':'no-store'}).end(JSON.stringify(m));return;}
 fs.readFile(file,(error,body)=>{if(error){res.writeHead(404).end();return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(body);});
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`,base=origin+'/klidne-hrani/';
const context=await chromium.launchPersistentContext(fs.mkdtempSync('qa/chrome-upgrade-'),{channel:'chrome',headless:true});const installed=[];
let cdp;
try{
 const page=await context.newPage();cdp=await context.newCDPSession(page);
 await page.addInitScript(()=>{window.installPromptSeen=false;addEventListener('beforeinstallprompt',()=>window.installPromptSeen=true);});
 await page.goto(base);await page.waitForFunction(()=>window.installPromptSeen,{},{timeout:30000});
 const old=(await cdp.send('Page.getAppManifest')).manifest.id;assert.equal(old,origin+'/');
 await cdp.send('PWA.install',{manifestId:old,installUrlOrBundleUrl:base});installed.push(old);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 legacy=false;await page.reload();
 const updated=(await cdp.send('Page.getAppManifest')).manifest.id;assert.equal(updated,base);
 const eligibility=await cdp.send('Page.getInstallabilityErrors');assert.deepEqual(eligibility.installabilityErrors,[]);
 await page.waitForTimeout(2000);
 const offeredWhileOldInstalled=await page.evaluate(()=>window.installPromptSeen);
 // Existing desktop installations can suppress the banner by URL even after ID changes.
 await cdp.send('PWA.uninstall',{manifestId:old});installed.splice(installed.indexOf(old),1);
 await page.reload();await page.waitForTimeout(2000);
 const offeredAfterRemoval=await page.evaluate(()=>window.installPromptSeen);
 await cdp.send('PWA.install',{manifestId:updated,installUrlOrBundleUrl:base});installed.push(updated);
 for(const manifestId of installed)await cdp.send('PWA.getOsAppState',{manifestId});
 const result={checkedAt:new Date().toISOString(),browser:await context.browser().version(),oldIdentity:'/',newIdentity:'/klidne-hrani/',offeredWhileOldInstalled,offeredAfterRemoval,oldTestAppRemoved:true,manualInstallationViaCDP:true,serviceWorkerEnabled:true,androidDeviceTest:false};
 fs.writeFileSync('qa/install-upgrade-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{
 for(const manifestId of installed.reverse())await cdp.send('PWA.uninstall',{manifestId}).catch(()=>{});
 await context.close();await new Promise(resolve=>server.close(resolve));
}
