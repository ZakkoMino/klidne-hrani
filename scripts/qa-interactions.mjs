import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {defaults,makeTrial,validData} from '../dist/logic.js';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173/klidne-hrani/';
const results=[],errors=[];const note=x=>{results.push(x);console.log('PASS '+x);};
const click=(p,a)=>p.locator(`[data-action="${a}"]`).first().click();
const read=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('klidne-hrani-checkpoint-v1')).data);
async function setup(id,level=1,{width=800,height=1100,slowAudio=false}={}){
 const context=await browser.newContext({viewport:{width,height},hasTouch:true,isMobile:true,serviceWorkers:'block'});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));const d=defaults();d.settings.sound=false;d.settings.levels[id]=level;
 d.active={id:'interaction-test',localDate:'2026-10-12',status:'paused',games:[id,id==='memory'?'helper':'memory'],blockIndex:0,blockLimitMs:120000,blockVisibleMs:0,visibleMs:0,practiceDone:{[id]:2},trialIndex:{[id]:0},comfortBefore:{childChoice:'unsure',parentObservedSigns:[]},comfortAfter:{childChoice:'notAsked',parentObservedSigns:[]},breakUntil:null};
 await page.addInitScript(({d,slowAudio})=>{
  Math.random=()=>.42;localStorage.setItem('klidne-hrani-checkpoint-v1',JSON.stringify({savedAt:Date.now(),data:d}));
  window.spoken=[];HTMLMediaElement.prototype.play=function(){window.spoken.push(this.src.split('/').pop());setTimeout(()=>this.onended?.(),slowAudio?4000:30);return Promise.resolve();};
 },{d,slowAudio});
 await page.goto(base);await click(page,'resume-existing');await click(page,'resume');await click(page,'play');
 await page.locator('.playfield button:not(:disabled)').first().waitFor({timeout:25000});
 return {page,context,t:makeTrial(id,level,false,()=>.42,0)};
}
async function drag(page,from,to,{outside=false,cancel=false,leaveDown=false}={}){
 await page.locator(from).scrollIntoViewIfNeeded();
 const a=await page.locator(from).boundingBox(),b=to?await page.locator(to).boundingBox():{x:2,y:2,width:2,height:2};
 const start={x:a.x+a.width/2,y:a.y+a.height/2},end=outside?{x:4,y:4}:{x:b.x+b.width/2,y:b.y+b.height/2};
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...start,id:1}]});
 for(let i=1;i<=6;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start.x+(end.x-start.x)*i/6,y:start.y+(end.y-start.y)*i/6,id:1}]});
 if(!leaveDown)await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});
 await cdp.detach();
}
try{
 {
  const {page,context,t}=await setup('helper',2);
  const source=`[data-drag-value="${t.target[0].item}"]`,target=`[data-drop-value="${t.target[0].animal}"]`;
  await drag(page,source,target,{outside:true});assert.equal((await read(page)).trials.length,0);
  await drag(page,source,target,{cancel:true});assert.equal((await read(page)).trials.length,0);
  for(const p of t.target)await drag(page,`[data-drag-value="${p.item}"]`,`[data-drop-value="${p.animal}"]`);
  await page.locator('.feedback').waitFor();const d=await read(page);assert.equal(d.trials.length,1);assert.equal(d.trials[0].correctFirst,true);assert.deepEqual(d.trials[0].firstResponse,t.target);assert.equal(await page.locator('.drag-ghost').count(),0);
  await page.screenshot({path:'qa/helper-touch.png',fullPage:true});note('Real touch events: two-step helper, outside drop and pointer cancellation; exactly one result');await context.close();
 }
 {
  const {page,context,t}=await setup('helper',1,{width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  const other=t.animals.find(a=>a.id!==t.target[0].animal).id;
  await drag(page,`[data-drag-value="${t.target[0].item}"]`,`[data-drop-value="${other}"]`);
  assert.equal((await read(page)).trials[0].correctFirst,false);note('390px helper drop works; wrong recipient is recorded rather than silently accepted');await context.close();
 }
 {
  const {page,context,t}=await setup('sort',2);
  await drag(page,'[data-drag="sort"]',`[data-drop-value="${t.target}"]`);
  assert.equal((await read(page)).trials[0].correctFirst,true);note('Touch sorting into the matching box');await context.close();
 }
 {
  const {page,context,t}=await setup('story',3,{width:390,height:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await drag(page,'[data-drag-value="0"]','[data-drop-value="2"]');
  await drag(page,'[data-drag-value="1"]','[data-drop-value="1"]');
  await drag(page,'[data-drag-value="2"]','[data-drop-value="0"]');
  await drag(page,'[data-drag-value="0"]','[data-drop-value="0"]');
  assert.equal((await read(page)).trials.length,0);await click(page,'story-check');
  assert.deepEqual((await read(page)).trials[0].firstResponse,t.target);
  await page.screenshot({path:'qa/story-touch.png',fullPage:true});note('390px touch story arrangement and swapping; evaluate only after Hotovo');await context.close();
 }
 {
  const {page,context,t}=await setup('helper',1);
  await drag(page,`[data-drag-value="${t.target[0].item}"]`,`[data-drop-value="${t.target[0].animal}"]`,{leaveDown:true});
  await click(page,'pause');assert.equal(await page.locator('.drag-ghost').count(),0);
  const d=await read(page);assert.equal(d.trials.length,1);assert.equal(d.trials[0].completed,false);assert.equal(d.trials[0].correctFirst,null);note('Pause cancels a live drag without scoring');await context.close();
 }
 for(const id of ['memory','helper','story','search','stop','sort','path','rhythm']){
  const {page,context,t}=await setup(id,id==='helper'?2:1);
  if(id==='memory')await page.locator(`[data-action="answer"][data-value="${t.target[0]}"]`).click();
  if(id==='helper'){await page.locator(`[data-action="item"][data-id="${t.target[0].item}"]`).click();await page.locator(`[data-action="recipient"][data-id="${t.target[0].animal}"]`).click();}
  if(id==='story')await page.locator('[data-action="answer"]').first().click();
  if(id==='path')await page.locator('[data-action="move"]').first().click();
  await click(page,'instruction');await page.waitForFunction(()=>window.spoken.length>0);
  await page.locator('[data-action="instruction"]:not(:disabled)').waitFor({timeout:20000});
  const spoken=await page.evaluate(()=>window.spoken);
  assert.ok(spoken.length>0);if(id==='helper'){for(const p of t.target)assert.ok(spoken.includes(`give-${p.item}-${p.animal}.mp3`));assert.match(await page.locator('.playfield').textContent(),/Hotovo 1 z 2/);}
  if(id==='search')assert.deepEqual(spoken,['find-'+t.target+'.mp3']);
  if(id==='memory')assert.match(await page.locator('.sequence').textContent(),/1 z 2/);
  if(id==='story')assert.equal(await page.locator('.story-slot .scene').count(),1);
  if(id==='path')assert.match(await page.locator('.sequence').textContent(),/↑/);
  assert.ok(validData(await read(page)));note(id+': explicit spoken instruction with automatic sound off; partial answer retained');await context.close();
 }
 {
  const {page,context}=await setup('stop',1,{slowAudio:true});await click(page,'instruction');await page.waitForTimeout(3200);
  assert.equal((await read(page)).trials.length,0);await click(page,'pause');await page.waitForTimeout(1500);
  const d=await read(page);assert.equal(d.active.status,'paused');assert.equal(d.trials[0].completed,false);assert.equal(d.trials.length,1);note('Timed task does not expire during spoken help; pause cancels audio continuation');await context.close();
 }
 {
  const {page,context}=await setup('search');await click(page,'stop');await click(page,'home');await click(page,'install');
  assert.equal(await page.locator('dialog[open]').count(),1);
  await page.evaluate(()=>{const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=async()=>{throw new Error('test install failure');};dispatchEvent(e);});
  await page.locator('[data-install-confirm]').click();await page.getByText('Instalační nabídku se nepodařilo otevřít.',{exact:false}).waitFor();
  assert.equal((await read(page)).sessions.length,1);note('Install rejection has useful guidance and does not erase results');await context.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('qa/interaction-results.json',JSON.stringify({checkedAt:new Date().toISOString(),browser:await browser.version(),results,errors},null,2));
}finally{await browser.close();}
