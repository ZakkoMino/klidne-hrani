import {VERSION} from './content.js';

export function createInstaller({notify,onOfflineReady,canReload}){
 let promptEvent=null,registration=null,installed=matchMedia('(display-mode: standalone)').matches;
 let message='',waiting=false,dialog=null;
 const appUrl=new URL('./',import.meta.url).href;
 function render(){
  if(!dialog)return;
  dialog.querySelector('[data-install-state]').textContent=message||(installed?'Aplikaci už máte otevřenou samostatně.':promptEvent?'Chrome je připravený nabídnout instalaci.':'Pokud Chrome nenabídne tlačítko, použijte jeho nabídku ⋮.');
  const button=dialog.querySelector('[data-install-confirm]');button.disabled=!promptEvent||installed;button.hidden=!promptEvent||installed;
  dialog.querySelector('[data-install-update]').hidden=!waiting;
 }
 function open(){
  if(!dialog){
   dialog=document.createElement('dialog');dialog.className='install-dialog';
   dialog.innerHTML=`<h2>Instalace aplikace</h2><p data-install-state role="status"></p><button class="primary" data-install-confirm>Instalovat aplikaci</button><ol><li>Na Androidu otevřete tento web v běžném okně prohlížeče Chrome.</li><li>V nabídce <strong>⋮</strong> vyberte <strong>Nainstalovat a vytvořit zástupce → Nainstalovat</strong>. Název se může podle verze Chrome lišit.</li><li>Po instalaci aplikaci otevřete ikonou na ploše.</li></ol><p>Pokud Chrome oznámí chybu, ponechte si její přesné znění. Web můžete dál používat přímo v prohlížeči. Výsledky kvůli instalaci nemažte.</p><details><summary>Android hlásí „již nainstalováno“, ale aplikace nejde otevřít</summary><ol><li>Otevřete hry na webu. V části Pro rodiče → Data, soukromí a záloha si uložte Export JSON, pokud chcete zachovat výsledky.</li><li>V Androidu otevřete Nastavení → Aplikace → Zobrazit všechny aplikace a vyhledejte Klidné hraní. Pokud tam je nefunkční stará instalace, odinstalujte jen ji.</li><li>Zavřete staré záložky her, znovu otevřete tuto adresu v Chrome a použijte nabídku ⋮ → Nainstalovat a vytvořit zástupce → Nainstalovat. Některé verze říkají Přidat na plochu.</li></ol><p>Data Chrome ani ostatní aplikace nemažte. Pokud Klidné hraní v seznamu není nebo chyba přetrvá, k dalšímu ověření pomůže verze Chrome a Androidu.</p></details><p class="muted">Adresa aplikace: <a data-install-url></a><br>Verze ${VERSION}</p><button class="quiet" data-install-update>Načíst připravenou aktualizaci</button><form method="dialog"><button class="quiet">Zavřít</button></form>`;
   document.body.append(dialog);const link=dialog.querySelector('[data-install-url]');link.href=appUrl;link.textContent=appUrl;
   dialog.querySelector('[data-install-confirm]').addEventListener('click',async()=>{
    if(!promptEvent)return;
    const event=promptEvent;promptEvent=null;
    try{
     // Call prompt directly from this user gesture, and consume this event once.
     const result=await event.prompt();
     const choice=result?.outcome?result:await event.userChoice;
     message=choice.outcome==='accepted'?'Chrome přijal žádost. Dokončení instalace zajišťuje prohlížeč.':'Instalace byla zavřena. Můžete pokračovat na webu a instalovat později z nabídky Chrome.';
    }catch{
     message='Instalační nabídku se nepodařilo otevřít. Zkuste nabídku ⋮ v Chrome. Pokud se objeví chyba, poznamenejte si její přesné znění.';
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
 window.addEventListener('appinstalled',()=>{installed=true;promptEvent=null;message='Aplikace je nainstalovaná.';render();notify(message);});
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
