import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4173/klidne-hrani/';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[],errors=[];
try{
 // Incognito deliberately suppresses native install: these are UI/event tests,
 // not evidence of a completed WebAPK install. qa-install covers desktop install.
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'?install=1');
 await page.locator('.install-dialog[open]').waitFor();
 assert.equal(await page.locator('[data-install-confirm]').isVisible(),false);
 assert.match(await page.locator('[data-install-state]').textContent(),/Tento stav neznamená/);
 await page.evaluate(()=>localStorage.setItem('install-ui-test-preserve','keep'));
 results.push('Direct URL opens help; missing event does not claim installation');
 await page.evaluate(()=>{
  window.installPromptCalls=0;
  const e=new Event('beforeinstallprompt',{cancelable:true});
  e.prompt=async()=>{window.installPromptCalls++;return {outcome:'accepted'};};
  dispatchEvent(e);
 });
 assert.equal(await page.evaluate(()=>window.installPromptCalls),0);
 await page.locator('[data-install-confirm]').click();
 assert.equal(await page.evaluate(()=>window.installPromptCalls),1);
 assert.equal(await page.locator('[data-install-confirm]').isVisible(),false);
 assert.match(await page.locator('[data-install-state]').textContent(),/Chrome přijal žádost/);
 assert.doesNotMatch(await page.locator('[data-install-state]').textContent(),/Aplikace je nainstalovaná/);
 results.push('Late event enables button; user gesture calls prompt once; acceptance is not completion');
 await page.evaluate(()=>dispatchEvent(new Event('appinstalled')));
 assert.match(await page.locator('[data-install-state]').textContent(),/Chrome přijal instalaci/);
 assert.doesNotMatch(await page.locator('[data-install-state]').textContent(),/Aplikace je nainstalovaná/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('install-ui-test-preserve')),'keep');
 results.push('appinstalled does not overclaim Android package completion; existing local data preserved');
 await page.locator('summary').first().click();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.screenshot({path:'qa/install-help-mobile.png',fullPage:true});
 await page.locator('.install-dialog form button').click();
 assert.equal(await page.locator('[data-action="start"]').isVisible(),true);
 results.push('390px help remains usable; closing returns to game selection');
 for(const outcome of ['dismissed','failure']){
  await page.reload();await page.locator('.install-dialog[open]').waitFor();
  await page.evaluate(outcome=>{
   const e=new Event('beforeinstallprompt',{cancelable:true});
   e.prompt=async()=>{if(outcome==='failure')throw new Error('Test rejection');return {outcome};};
   dispatchEvent(e);
  },outcome);
  await page.locator('[data-install-confirm]').click();
  assert.match(await page.locator('[data-install-state]').textContent(),outcome==='failure'?/nepodařilo otevřít/:/Instalace byla zavřena/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('install-ui-test-preserve')),'keep');
  results.push(outcome+': clear retry guidance and preserved local data');
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync('qa/install-ui-results.json',JSON.stringify({checkedAt:new Date().toISOString(),browser:await browser.version(),url:base,results,errors,syntheticInstallEvents:true,androidDeviceTest:false},null,2));
 console.log(results.join('\n'));
 await context.close();
}finally{await browser.close();}
