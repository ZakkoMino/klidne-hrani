import fs from 'node:fs';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';import {AUDIO_TEXTS,STORIES,GAMES} from '../dist/content.js';
for(const f of ['app','logic','storage','content'])execFileSync(process.execPath,['--check',`dist/${f}.js`]);
const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest'));
assert.equal(manifest.display,'standalone');assert.equal(GAMES.length,8);assert.equal(STORIES.length,12);
for(const icon of manifest.icons)assert.ok(fs.statSync('dist/'+icon.src.replace(/^\.\//,'')).size>500);
let bytes=0;for(const key of Object.keys(AUDIO_TEXTS)){const b=fs.readFileSync(`dist/assets/audio/${key}.wav`);assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WAVE');assert.ok(b.length>1000);bytes+=b.length;}
for(let i=1;i<=3;i++)assert.ok(fs.statSync(`dist/assets/story-atlas-${i}.png`).size>10000);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(d=>d.isDirectory()?walk(dir+'/'+d.name):[dir+'/'+d.name]);
for(const f of walk('dist')){assert.ok(!/\.(docx|pdf|jpg)$/i.test(f),'Private document in dist');if(/\.(js|html|css|json)$/.test(f))assert.doesNotMatch(fs.readFileSync(f,'utf8'),/patientName|birthDate|medicalReportImage|C:\\Users\\/i,'Personal health information in deployment');}
console.log(`Checked 8 games, 12 stories, ${Object.keys(AUDIO_TEXTS).length} WAV clips (${(bytes/1024/1024).toFixed(1)} MiB), icons, syntax and deployment boundary.`);
