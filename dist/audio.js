import {AUDIO_TEXTS} from './content.js';

export function createSpeaker({enabled,onError}) {
 const player=new Audio();player.preload='auto';player.volume=.85;
 let resolvePending=null,timeout=null;
 function stop(){
  player.pause();player.onended=player.onerror=null;clearTimeout(timeout);
  const resolve=resolvePending;resolvePending=null;resolve?.(false);
 }
 async function play(key,force=false){
  if((!force&&!enabled())||!AUDIO_TEXTS[key])return false;
  stop();
  return new Promise(resolve=>{
   resolvePending=resolve;
   const done=ok=>{if(resolvePending!==resolve)return;stop();if(!ok)onError();};
   // One reusable media element keeps mobile user-gesture playback authorization.
   player.src=new URL(`./assets/audio/${key}.mp3`,import.meta.url).href;
   player.onended=()=>{if(resolvePending!==resolve)return;resolvePending=null;clearTimeout(timeout);resolve(true);};
   player.onerror=()=>done(false);
   timeout=setTimeout(()=>done(false),45000);
   player.play().catch(()=>done(false));
  });
 }
 return {play,stop};
}

let context;
export function unlockPercussion(){
 try{context??=new(window.AudioContext||window.webkitAudioContext)();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}
}
export function percussion(kind){
 if(!context||context.state!=='running')return;
 const start=context.currentTime;
 if(kind==='clap'){
  const buffer=context.createBuffer(1,Math.floor(context.sampleRate*.12),context.sampleRate),samples=buffer.getChannelData(0);
  for(let n=0;n<samples.length;n++)samples[n]=(Math.random()*2-1)*Math.exp(-n/(context.sampleRate*.025));
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain();
  source.buffer=buffer;filter.type='bandpass';filter.frequency.value=1200;gain.gain.value=.25;
  source.connect(filter);filter.connect(gain);gain.connect(context.destination);source.start(start);
  source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
 }else{
  const source=context.createOscillator(),gain=context.createGain();source.type='sine';source.frequency.setValueAtTime(180,start);source.frequency.exponentialRampToValueAtTime(80,start+.1);
  gain.gain.setValueAtTime(.18,start);gain.gain.exponentialRampToValueAtTime(.001,start+.13);
  source.connect(gain);gain.connect(context.destination);source.start(start);source.stop(start+.14);
  source.onended=()=>{source.disconnect();gain.disconnect();};
 }
}
