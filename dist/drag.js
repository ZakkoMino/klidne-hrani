// Pointer Events support mouse, pen and touch; clicking remains the keyboard fallback.
export function enableDragging({canStart,onDrop}) {
 let drag=null,suppressClickUntil=0;
 const clearTarget=()=>document.querySelectorAll('.drop-hover').forEach(el=>el.classList.remove('drop-hover'));
 const targetAt=(x,y)=>document.elementFromPoint(x,y)?.closest('[data-drop]');
 function cancel(){
  if(!drag)return;
  drag.ghost?.remove();drag.source.classList.remove('drag-source');
  try{drag.source.releasePointerCapture(drag.pointerId);}catch{}
  drag=null;clearTarget();
 }
 document.addEventListener('pointerdown',e=>{
  const source=e.target.closest('[data-drag]');
  if(drag||!source||source.disabled||!e.isPrimary||e.button!==0||!canStart())return;
  drag={source,pointerId:e.pointerId,x:e.clientX,y:e.clientY,kind:source.dataset.drag,value:source.dataset.dragValue};
  source.setPointerCapture(e.pointerId);
 });
 document.addEventListener('pointermove',e=>{
  if(!drag||drag.pointerId!==e.pointerId)return;
  if(!drag.ghost&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<7)return;
  e.preventDefault();
  if(!drag.ghost){
   const ghost=drag.source.cloneNode(true);ghost.removeAttribute('id');ghost.removeAttribute('data-action');
   ghost.classList.add('drag-ghost');ghost.setAttribute('aria-hidden','true');ghost.tabIndex=-1;
   document.body.append(ghost);drag.ghost=ghost;drag.source.classList.add('drag-source');
  }
  drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
  clearTarget();const target=targetAt(e.clientX,e.clientY);
  if(target&&!target.disabled&&target.dataset.drop===drag.kind)target.classList.add('drop-hover');
 },{passive:false});
 document.addEventListener('pointerup',e=>{
  if(!drag||drag.pointerId!==e.pointerId)return;
  const current=drag,target=targetAt(e.clientX,e.clientY),moved=!!drag.ghost;
  cancel();
  if(!moved)return;
  suppressClickUntil=performance.now()+500;e.preventDefault();
  if(target&&!target.disabled&&target.dataset.drop===current.kind&&canStart())onDrop(current.kind,current.value,target.dataset.dropValue);
 });
 document.addEventListener('click',e=>{if(performance.now()<suppressClickUntil&&e.target.closest('[data-drag],[data-drop]')){e.preventDefault();e.stopImmediatePropagation();}},true);
 document.addEventListener('pointercancel',cancel);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')cancel();});
 window.addEventListener('blur',cancel);
 return cancel;
}
