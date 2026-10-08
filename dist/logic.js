import {GAMES,ITEMS,ANIMALS,ICONS,STORIES,MAX_LEVELS} from './content.js';
export const gameIds=GAMES.map(g=>g.id);
export const defaults=()=>({schemaVersion:1,settings:{blockMs:120000,sound:true,levels:Object.fromEntries(gameIds.map(id=>[id,1]))},sessions:[],trials:[],observations:[],active:null});
export const shuffle=(list,rng=Math.random)=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export const pick=(a,r=Math.random)=>a[Math.floor(r()*a.length)];
export function makeTrial(id,level=1,practice=false,rng=Math.random,index=0){
 if(!gameIds.includes(id))throw Error('Neznámá hra');
 level=Math.max(1,Math.min(MAX_LEVELS[id],level));const t={gameId:id,level,practice,correctFirst:null,supportTypes:[],responses:[],contentId:id==='story'?'story-'+index%STORIES.length:'v1-'+id+'-'+index};
 if(id==='memory')Object.assign(t,{target:shuffle([0,1,2,3],rng).slice(0,practice?1:level+1)});
 if(id==='helper'){const items=shuffle(ITEMS,rng).slice(0,2),animals=shuffle(ANIMALS,rng).slice(0,2);Object.assign(t,{items,animals,target:items.slice(0,!practice&&level>=2?2:1).map((i,n)=>({item:i.id,animal:animals[n].id})),selected:null});}
 if(id==='story'){const s=STORIES[index%STORIES.length],target=level===1?[0,2]:[0,1,2];Object.assign(t,{story:s,target,options:shuffle(target,rng)});}
 if(id==='search'){const options=shuffle(ICONS,rng).slice(0,practice?2:[2,4,6][level-1]);Object.assign(t,{options,target:pick(options,rng).id});}
 if(id==='stop')Object.assign(t,{go:practice?index%2===0:![2,5,8].includes(index%10),target:practice?index%2===0:![2,5,8].includes(index%10),tapped:false});
 if(id==='sort'){const rule=level===1?'color':level===2?'shape':Math.floor(index/5)%2===0?'color':'shape';const color=pick(['blue','gold'],rng),shape=pick(['circle','square'],rng);Object.assign(t,{rule,color,shape,target:rule==='color'?color:shape,options:rule==='color'?['blue','gold']:['circle','square']});}
 if(id==='path'){Object.assign(t,level===3?{start:6,target:1,obstacles:[4],maxSteps:3}:{start:6,target:4,obstacles:level===2?[7]:[],maxSteps:2});const transform=n=>{let row=Math.floor(n/3),col=n%3;if(Math.floor(index/4)%2)col=2-col;for(let i=0;i<index%4;i++){const old=row;row=col;col=2-old;}return row*3+col;};t.start=transform(t.start);t.target=transform(t.target);t.obstacles=t.obstacles.map(transform);}
 if(id==='rhythm')Object.assign(t,{target:Array.from({length:level===1?2:3},()=>pick(['clap','tap'],rng))});
 return t;
}
export function walk(start,moves,obstacles=[]){let pos=start;for(const m of moves){const row=Math.floor(pos/3),col=pos%3;const next=m==='up'?(row>0?pos-3:-1):m==='down'?(row<2?pos+3:-1):m==='left'?(col>0?pos-1:-1):m==='right'?(col<2?pos+1:-1):-1;if(next<0||obstacles.includes(next))return {valid:false,pos};pos=next;}return {valid:true,pos};}
export function pathSolution(t){let queue=[[]];while(queue.length){const moves=queue.shift();const p=walk(t.start,moves,t.obstacles);if(p.valid&&p.pos===t.target)return moves;if(p.valid&&moves.length<t.maxSteps)for(const step of ['up','right','down','left'])queue.push([...moves,step]);}return [];}
export function evaluate(t,response){switch(t.gameId){case 'memory':case 'story':return JSON.stringify(response)===JSON.stringify(t.target);case 'helper':return JSON.stringify(response)===JSON.stringify(t.target);case 'path':{const p=walk(t.start,response,t.obstacles);return p.valid&&p.pos===t.target&&response.length<=t.maxSteps;}case 'stop':return Boolean(response)===t.go;case 'rhythm':return null;default:return response===t.target;}}
export function shouldAdvance(trials,id,level){if(id==='story'||id==='rhythm'||id==='stop'||level>=MAX_LEVELS[id])return false;const xs=trials.filter(t=>t.gameId===id&&t.level===level&&t.completed&&!t.practice&&!t.invalidReason).slice(-10);return xs.length===10&&new Set(xs.map(t=>t.localDate)).size>=2&&xs.filter(t=>t.correctFirst===true&&!t.supportTypes.length).length>=8&&xs.filter(t=>t.supportTypes.length).length<=1;}
export function addVisible(session,ms){if(!session||session.status!=='playing')return session;const delta=Math.max(0,Math.min(ms,session.blockLimitMs-session.blockVisibleMs));session.blockVisibleMs+=delta;session.visibleMs+=delta;return session;}
export const localDay=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const isText=(x,max=120)=>typeof x==='string'&&x.length<=max;
const day=x=>isText(x,10)&&/^\d{4}-\d{2}-\d{2}$/.test(x);
const choice=x=>x&&['okay','break','end','unsure','notAsked'].includes(x.childChoice)&&Array.isArray(x.parentObservedSigns)&&x.parentObservedSigns.length<=50&&x.parentObservedSigns.every(s=>isText(s));
const counts=x=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.entries(x).every(([k,v])=>gameIds.includes(k)&&Number.isInteger(v)&&v>=0&&v<50000);
const session=a=>a&&isText(a.id)&&['playing','paused','break','done'].includes(a.status)&&[120000,180000].includes(a.blockLimitMs)&&[0,1].includes(a.blockIndex)&&Array.isArray(a.games)&&a.games.length===2&&new Set(a.games).size===2&&a.games.every(x=>gameIds.includes(x))&&Number.isFinite(a.visibleMs)&&a.visibleMs>=0&&a.visibleMs<=2*a.blockLimitMs&&Number.isFinite(a.blockVisibleMs)&&a.blockVisibleMs>=0&&a.blockVisibleMs<=a.blockLimitMs&&day(a.localDate)&&counts(a.practiceDone)&&counts(a.trialIndex)&&choice(a.comfortBefore)&&choice(a.comfortAfter)&&(a.status!=='break'||Number.isFinite(a.breakUntil));
export function validData(d){
 if(!d||d.schemaVersion!==1||!d.settings||![120000,180000].includes(d.settings.blockMs)||typeof d.settings.sound!=='boolean')return false;
 if(!gameIds.every(id=>Number.isInteger(d.settings.levels?.[id])&&d.settings.levels[id]>=1&&d.settings.levels[id]<=MAX_LEVELS[id]))return false;
 if(!['sessions','trials','observations'].every(k=>Array.isArray(d[k])&&d[k].length<=50000))return false;
 if(!d.sessions.every(s=>session(s)&&s.status==='done'))return false;
 if(!d.trials.every(t=>t&&isText(t.id)&&isText(t.sessionId)&&gameIds.includes(t.gameId)&&Number.isInteger(t.level)&&t.level>=1&&t.level<=MAX_LEVELS[t.gameId]&&typeof t.practice==='boolean'&&typeof t.completed==='boolean'&&Array.isArray(t.supportTypes)&&t.supportTypes.length<=10&&t.supportTypes.every(x=>['audioReplay','visualCue','parentHelp','simplifiedInstruction'].includes(x))&&(t.correctFirst===null||typeof t.correctFirst==='boolean')&&day(t.localDate)&&(t.invalidReason===null||isText(t.invalidReason))))return false;
 if(!d.observations.every(o=>o&&isText(o.id)&&day(o.localDate)&&isText(o.note,1000)))return false;
 return d.active===null||Boolean(session(d.active));
}
export function parseImport(text){if(text.length>10000000)throw Error('Soubor je příliš velký.');let d;try{d=JSON.parse(text);}catch{throw Error('Soubor není platná JSON záloha.');}if(!validData(d))throw Error('Záloha má neznámý nebo poškozený formát.');d.active=null;return d;}
