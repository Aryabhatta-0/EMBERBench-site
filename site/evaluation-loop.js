const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const stages=[
  ['Observe','The model sees the map, the people and the fire as they are now. Future fire and evaluator seeds stay hidden.'],
  ['Decide','It returns a move or stay action for every active person.'],
  ['Simulate','The simulator resolves movement conflicts, evacuations and fire. A fresh observation starts the next decision.'],
  ['Verify','The completed action record must reproduce exactly when replayed.'],
  ['Score','Verified outcomes become safety and execution-quality factors, then a score out of 100.'],
];
export function mountEvaluationLoop(root,{compact=false}={}){
  root.classList.add('evaluation-loop');
  if(compact)root.classList.add('compact-loop');
  root.innerHTML=`<div class="loop-path" role="group" aria-label="How evaluation works">${stages.map(([title],i)=>`<button type="button" data-loop-stage="${i}" aria-pressed="${i===0}"><span>${title}</span></button>${i<4?arrow:''}`).join('')}<span class="loop-return">Observe → Decide → Simulate repeats each step</span></div><div class="loop-explanation" aria-live="polite"><p>${stages[0][1]}</p><span class="loop-position" aria-hidden="true">1 / 5</span></div>`;
  const choose=(button,pointer)=>{
    const index=Number(button.dataset.loopStage);
    root.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const copy=root.querySelector('.loop-explanation p');copy.textContent=stages[index][1];
    root.querySelector('.loop-position').textContent=`${index+1} / 5`;
    if(pointer&&!matchMedia('(prefers-reduced-motion:reduce)').matches)copy.animate([{transform:'translateY(5px)'},{transform:'translateY(0)'}],{duration:200,easing:'cubic-bezier(.2,0,0,1)'});
  };
  root.addEventListener('click',e=>{const b=e.target.closest('[data-loop-stage]');if(b)choose(b,e.detail>0);});
  root.querySelectorAll('button').forEach((b,i,list)=>b.addEventListener('keydown',e=>{
    const next=e.key==='ArrowRight'?list[(i+1)%list.length]:e.key==='ArrowLeft'?list[(i+list.length-1)%list.length]:null;
    if(next){e.preventDefault();choose(next,false);next.focus();}
  }));
}
