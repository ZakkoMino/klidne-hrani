import {VERSION} from './content.js';

export function createInstaller({notify,onOfflineReady,canReload}){
 let promptEvent=null,registration=null,installed=matchMedia('(display-mode: standalone)').matches;
 let message='',waiting=false,dialog=null;
 const appUrl=new URL('./',import.meta.url).href;
 function render(){
  if(!dialog)return;
  dialog.querySelector('[data-install-state]').textContent=message||(installed?'Aplikaci už máte otevřenou samostatně.':promptEvent?'Instalaci spusťte tlačítkem níže přímo z tohoto okna.':'Instalační tlačítko zatím není dostupné. Chvíli počkejte, případně web znovu otevřete v běžném okně Chrome. Tento stav neznamená, že je aplikace nainstalovaná.');
  const button=dialog.querySelector('[data-install-confirm]');button.disabled=!promptEvent||installed;button.hidden=!promptEvent||installed;
  dialog.querySelector('[data-install-update]').hidden=!waiting;
 }
 function open(){
  if(!dialog){
   dialog=document.createElement('dialog');dialog.className='install-dialog';
   dialog.innerHTML=`<h2>Instalace aplikace</h2>
    <p data-install-state role="status"></p><button class="primary" data-install-confirm>Instalovat aplikaci</button>
    <ol><li>Otevřete hry v běžném okně Chrome a chvíli počkejte na instalační tlačítko.</li><li>Stiskněte <strong>Instalovat aplikaci</strong> v tomto okně a potvrďte nabídku prohlížeče.</li><li>Po dokončení instalace otevřete Klidné hraní jeho ikonou.</li></ol>
    <details><summary>Chrome hlásí „již nainstalováno“, ale aplikace nejde otevřít</summary>
     <p>V Chrome 155 může nabídka ⋮ zaměnit jinou nainstalovanou hru ze stejného webu za Klidné hraní. Zkuste tlačítko <strong>Instalovat aplikaci</strong> nahoře v tomto okně. Používá jinou instalační cestu; její výsledek je třeba ověřit na vašem zařízení.</p>
     <p>Pokud se tlačítko neobjeví nebo instalace selže, hry můžete dál spouštět webovým zástupcem. Poznamenejte si znění chyby a verzi Chrome. Data prohlížeče ani ostatní hry nemažte.</p>
    </details>
    <details><summary>Další možnosti v nabídce Chrome</summary>
     <p>Instalace bývá v nabídce <strong>⋮ → Nainstalovat a vytvořit zástupce → Nainstalovat</strong>. Pokud tato nabídka chybně hlásí již nainstalovanou aplikaci, použijte tlačítko nahoře.</p>
     <p>Volba <strong>Vytvořit zkratku → Přidat</strong> vytvoří ikonu otevírající web v Chrome. Funguje jako dočasná možnost spouštění, nikoli potvrzení instalace.</p>
    </details>
    <p class="muted">Adresa aplikace: <a data-install-url></a><br>Verze ${VERSION}</p><button class="quiet" data-install-update>Načíst připravenou aktualizaci</button><form method="dialog"><button class="quiet">Zavřít</button></form>`;
   document.body.append(dialog);const link=dialog.querySelector('[data-install-url]');link.href=appUrl;link.textContent=appUrl;
   dialog.querySelector('[data-install-confirm]').addEventListener('click',async()=>{
    if(!promptEvent)return;
    const event=promptEvent;promptEvent=null;
    try{
     // Call prompt directly from this user gesture, and consume this event once.
     const result=await event.prompt();
     const choice=result?.outcome?result:await event.userChoice;
     message=choice.outcome==='accepted'?'Chrome přijal žádost. Dokončení instalace zajišťuje prohlížeč.':'Instalace byla zavřena. Můžete dál hrát na webu a instalaci zkusit po jeho novém načtení.';
    }catch{
     message='Instalační nabídku se nepodařilo otevřít. Zavřete toto okno a znovu načtěte web. Pokud se chyba opakuje, poznamenejte si její přesné znění. Dál můžete hrát na webu.';
    }
    render();
   });
   dialog.querySelector('[data-install-update]').addEventListener('click',()=>{
    if(!canReload()){message='Nejdřív dokončete rozehrané hry tlačítkem Končíme. Výsledky zůstanou uložené.';render();return;}
    const worker=registration?.waiting;if(!worker)return;
    navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});
    worker.postMessage({type:'SKIP_WAITING'});
   });
  }
  render();if(!dialog.open)dialog.showModal();
  registration?.update().catch(()=>{});
 }
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;message='';render();});
 // On Android this event can precede WebAPK creation; only opening the app verifies completion.
 window.addEventListener('appinstalled',()=>{promptEvent=null;message='Chrome přijal instalaci. Dokončení může chvíli trvat. Potom ověřte otevření Klidného hraní jeho ikonou.';render();notify(message);});
 async function register(){
  if(!('serviceWorker'in navigator)){onOfflineReady(false);return;}
  try{
   registration=await navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'});
   const checkWaiting=()=>{waiting=!!registration.waiting;render();};checkWaiting();
   registration.addEventListener('updatefound',()=>{
    const worker=registration.installing;
    worker?.addEventListener('statechange',()=>{checkWaiting();if(worker.state==='redundant'&&!registration.active)onOfflineReady(false);});
   });
   await navigator.serviceWorker.ready;onOfflineReady(true);
  }catch{onOfflineReady(false);}
 }
 return {open,register};
}
