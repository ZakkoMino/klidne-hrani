import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {defaults} from '../dist/logic.js';
const require=createRequire(import.meta.url);const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'chrome',headless:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4173/klidne-hrani/';
try{
 const context=await browser.newContext({serviceWorkers:'block'});const page=await context.newPage();
 const d=defaults();d.settings.sound=false;
 await page.addInitScript(d=>{
  localStorage.setItem('klidne-hrani-checkpoint-v1',JSON.stringify({savedAt:Date.now(),data:d}));
  const NativeAudio=window.Audio;window.audioEvents=[];
  window.Audio=function(...args){const audio=new NativeAudio(...args);for(const type of ['playing','ended','error','pause'])audio.addEventListener(type,()=>window.audioEvents.push({type,file:audio.src.split('/').pop()}));return audio;};
 },d);
 await page.goto(base);await page.locator('[data-action="start"]').click();await page.locator('[data-action="intro-audio"]').click();
 await page.waitForFunction(()=>window.audioEvents.some(e=>e.type==='ended'),{},{timeout:30000});
 const events=await page.evaluate(()=>window.audioEvents);assert.ok(events.some(e=>e.type==='playing'));assert.ok(!events.some(e=>e.type==='error'));
 await page.locator('[data-action="play"]').click();await page.locator('[data-action="instruction"]').click();
 await page.waitForFunction(()=>window.audioEvents.some(e=>e.type==='playing'&&e.file==='task-memory.mp3'));
 await page.locator('[data-action="pause"]').click();await page.waitForTimeout(500);
 const after=await page.evaluate(()=>window.audioEvents);assert.ok(after.some(e=>e.type==='pause'&&e.file==='task-memory.mp3'));
 await page.getByRole('heading',{name:'Máme pauzu.'}).waitFor();
 fs.writeFileSync('qa/audio-results.json',JSON.stringify({checkedAt:new Date().toISOString(),browser:await browser.version(),realMediaPlayback:true,cancellation:true,events:after,physicalSpeakerTest:false},null,2));
 console.log('PASS Real Chrome media playback, ended event, manual audio with automatic sound off and pause cancellation');
 await context.close();
}finally{await browser.close();}
