import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {defaults,makeTrial,validData} from '../dist/logic.js';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173/';const errors=[],results=[];fs.mkdirSync('qa',{recursive:true});
const note=x=>{results.push(x);console.log('PASS '+x);};
const active=(id,index=0)=>({id:'qa-session',localDate:'2026-10-08',startedAt:new Date().toISOString(),status:'paused',games:[id,id==='memory'?'helper':'memory'],blockIndex:0,blockLimitMs:120000,blockVisibleMs:0,visibleMs:0,practiceDone:{[id]:2},trialIndex:{[id]:index},comfortBefore:{childChoice:'unsure',parentObservedSigns:[]},comfortAfter:{childChoice:'notAsked',parentObservedSigns:[]},breakUntil:null});
async function setup({id,level=1,index=0,width=1024,height=850,offline=false,ms=0}={}){const context=await browser.newContext({viewport:{width,height},serviceWorkers:offline?'allow':'block'});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const d=defaults();d.settings.sound=false;if(id){d.settings.levels[id]=level;d.active=active(id,index);d.active.blockVisibleMs=ms;d.active.visibleMs=ms;}await page.addInitScript(({d})=>{Math.random=()=>.42;if(!localStorage.getItem('qa-seeded')){localStorage.setItem('klidne-hrani-checkpoint-v1',JSON.stringify({savedAt:Date.now(),data:d}));localStorage.setItem('qa-seeded','yes');}}, {d});await page.goto(base);await page.locator('h1').waitFor();return {context,page};}
const click=(p,a)=>p.locator(`[data-action="${a}"]`).first().click();
async function play(p){await click(p,'resume-existing');await click(p,'resume');await click(p,'play');}
const data=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('klidne-hrani-checkpoint-v1')).data);
try{
 for(const [id,level,index] of [['memory',3,0],['helper',2,0],['story',3,0],['search',3,0],['stop',1,2],['sort',3,5],['path',3,0],['rhythm',2,0]]){
  const {page,context}=await setup({id,level,index});await play(page);const t=makeTrial(id,level,false,()=>.42,index);
  if(id==='memory'||id==='story'){await page.locator('[data-action="answer"]:not(:disabled)').first().waitFor({timeout:20000});for(const n of t.target)await page.locator(`[data-action="answer"][data-value="${n}"]`).click();}
  if(id==='helper'){await page.locator('[data-action="item"]:not(:disabled)').first().waitFor();for(const p of t.target){await page.locator(`[data-action="item"][data-id="${p.item}"]`).click();await page.locator(`[data-action="recipient"][data-id="${p.animal}"]`).click();}}
  if(id==='search'){await page.locator(`[data-action="answer"][data-value="${t.target}"]`).click();}
  if(id==='stop'){await page.locator('.feedback').waitFor({timeout:10000});assert.match(await page.locator('.feedback').textContent(),/Povedlo/);}
  if(id==='sort'){await page.locator('[data-action="rule-ready"]').waitFor();await click(page,'rule-ready');await page.locator(`[data-action="answer"][data-value="${t.target}"]`).click();}
  if(id==='path'){for(const m of ['up','up','right'])await page.locator(`[data-action="move"][data-value="${m}"]`).click();await click(page,'walk');}
  if(id==='rhythm')await page.locator('[data-action="rhythm-result"][data-value="independent"]').click({timeout:15000});
  await page.locator('.feedback').waitFor();const d=await data(page);assert.equal(d.trials.length,1);assert.equal(d.trials[0].correctFirst,id==='rhythm'?null:true);assert.ok(validData(d));assert.equal(d.active.comfortBefore.childChoice,'unsure');
  if(id==='story')await page.screenshot({path:'qa/story-tablet.png',fullPage:true});
  if(id==='path')await page.screenshot({path:'qa/path-tablet.png',fullPage:true});
  note(id+': complete highest implemented level and persist first response');await context.close();
 }
 {
  const {page,context}=await setup({id:'path',level:3});await play(page);await page.locator('[data-action="move"]:not(:disabled)').first().waitFor();for(const m of ['up','up','right'])await page.locator(`[data-action="move"][data-value="${m}"]`).click();await click(page,'walk');await click(page,'pause');await page.getByText('Máme pauzu.',{exact:true}).waitFor();await page.waitForTimeout(2300);const d=await data(page);assert.equal(d.trials.length,1);assert.equal(d.trials[0].completed,false);assert.equal(d.trials[0].correctFirst,null);assert.equal(d.active.status,'paused');note('Pause interrupts animated walk without late success');await context.close();
 }
 {
  const {page,context}=await setup({id:'search'});await play(page);await page.locator('[data-action="answer"]:not(:disabled)').first().waitFor();const before=(await data(page)).active.visibleMs;await page.reload();await click(page,'resume-existing');await page.getByText('Máme pauzu.',{exact:true}).waitFor();const a=(await data(page)).active;assert.equal(a.status,'paused');assert.ok(a.visibleMs>=before);note('Reload restores paused session and does not reset elapsed time');await click(page,'stop');await page.locator('[data-action="comfort"][data-value="unsure"]').click();const d=await data(page);assert.equal(d.active,null);assert.equal(d.sessions[0].comfortAfter.childChoice,'unsure');assert.ok(validData(d));await click(page,'home');assert.equal(await page.locator('[data-action="start"]').isDisabled(),true);note('Unknown comfort stays unknown; completed day cannot restart in child UI');await context.close();
 }
 {
  const {page,context}=await setup({id:'memory',ms:119000});await click(page,'resume-existing');await click(page,'resume');await page.getByText('Teď se rozhlédneme.',{exact:true}).waitFor({timeout:5000});assert.equal(await page.locator('#break-continue').isDisabled(),true);const a=(await data(page)).active;assert.equal(a.blockVisibleMs,120000);assert.equal(a.status,'break');note('Two-minute cap starts enforced break, including instruction time');await context.close();
 }
 {
  const {page,context}=await setup({width:390,height:844});await page.screenshot({path:'qa/home-phone.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.locator('.game-card').count(),8);await click(page,'parent');const b=page.locator('#parent-hold');await b.dispatchEvent('pointerdown');await page.waitForTimeout(2100);await page.getByRole('heading',{name:'Pro rodiče',exact:true}).waitFor();await page.screenshot({path:'qa/parent-phone.png',fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);note('390px layout fits viewport and parent hold gate opens');await context.close();
 }
 {
  const {page,context}=await setup({offline:true});await page.getByText('✓ Připraveno i bez internetu',{exact:true}).waitFor({timeout:30000});await page.reload();await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await page.screenshot({path:'qa/home-tablet.png',fullPage:true});await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'Co si dnes zahrajeme?'}).waitFor();const fetched=await page.evaluate(async()=>{const texts=(await import('./content.js')).AUDIO_TEXTS;let total=0;for(const key of Object.keys(texts)){const r=await fetch(`./assets/audio/${key}.wav`);if(!r.ok)throw Error(key);const b=await r.arrayBuffer();if(b.byteLength<1000)throw Error(key);total++;}const r=await fetch('./assets/audio/intro-helper.wav');const a=new AudioContext();const decoded=await a.decodeAudioData(await r.arrayBuffer());await a.close();return {total,duration:decoded.duration};});assert.equal(fetched.total,110);assert.ok(fetched.duration>1);note(`Offline reload + all ${fetched.total} Czech audio clips + browser WAV decoding`);await context.close();
 }
 assert.deepEqual(errors,[]);note('No uncaught browser errors');
 fs.writeFileSync('qa/browser-results.json',JSON.stringify({checkedAt:new Date().toISOString(),browser:await browser.version(),results,errors},null,2));
}finally{await browser.close();}
