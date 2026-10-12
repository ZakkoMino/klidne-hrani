import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4173/klidne-hrani/';
const profile=fs.mkdtempSync('qa/chrome-install-');
const context=await chromium.launchPersistentContext(profile,{channel:'chrome',headless:true});
const browser=context.browser();let cdp,manifestId,installed=false;
try{
 const page=await context.newPage();
 await page.addInitScript(()=>{window.installPromptSeen=false;window.addEventListener('beforeinstallprompt',()=>window.installPromptSeen=true);});
 await page.goto(base);await page.waitForFunction(()=>window.installPromptSeen,{},{timeout:30000});
 cdp=await context.newCDPSession(page);
 const manifest=await cdp.send('Page.getAppManifest');const eligibility=await cdp.send('Page.getInstallabilityErrors');
 assert.deepEqual(manifest.errors,[]);assert.deepEqual(eligibility.installabilityErrors,[]);
 manifestId=manifest.manifest.id;assert.equal(manifestId,new URL('/klidne-hrani/',base).href);
 assert.ok((await cdp.send('Page.getManifestIcons')).primaryIcon);
 await cdp.send('PWA.install',{manifestId,installUrlOrBundleUrl:base});installed=true;
 const osState=await cdp.send('PWA.getOsAppState',{manifestId});
 assert.equal(typeof osState.badgeCount,'number');
 const result={checkedAt:new Date().toISOString(),browser:await browser.version(),url:base,manifestId,installabilityErrors:eligibility.installabilityErrors,installPrompt:true,desktopInstall:true,osState,androidDeviceTest:false};
 console.log(JSON.stringify(result,null,2));fs.writeFileSync('qa/install-results.json',JSON.stringify(result,null,2));
}finally{
 if(installed)await cdp.send('PWA.uninstall',{manifestId});
 await context.close();
}
