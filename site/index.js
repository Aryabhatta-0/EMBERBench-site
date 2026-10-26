import {shell,loadResults,esc,fmt} from './common.js?v=20261027-docs-1';
import {mountEvaluationLoop} from './evaluation-loop.js';
import {mountHeroMotion} from './hero-motion.js?v=20261027-continuous-lines-1';

shell(null,'company');
const destroyHero=mountHeroMotion(document.querySelector('.company-hero'));
addEventListener('pagehide',e=>{if(!e.persisted)destroyHero?.();});
mountEvaluationLoop(document.getElementById('home-evaluation-loop'),{compact:true});
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const fine=matchMedia('(hover:hover) and (pointer:fine) and (min-width:701px)');
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';

function setGrouping(card,grouped,instant=false){
  card.classList.toggle('group-instant',instant||reduced.matches);
  card.dataset.grouped=String(grouped);
}
function prepareGrouping(card){
  const counters={evacuated:0,casualty:0,stranded:0};
  [...card.querySelectorAll('.outcome-person')].forEach((dot,index)=>{
    const type=dot.dataset.outcome,local=counters[type]++;
    const col=type==='evacuated'?local%16:local%6+18;
    const row=type==='evacuated'?Math.floor(local/16):Math.floor(local/6)+(type==='stranded'?8:0);
    dot.style.cssText=`--dot-x:${index%26*12}px;--dot-y:${Math.floor(index/26)*12}px;--group-x:${col*12}px;--group-y:${row*12}px`;
  });
}

loadResults().then(data=>{
  const models=['openrouter-typesafe_jev-1.14-choice-r1','openrouter-nace-ai_drex-v2.0-choice-r1'].map(id=>data.models.find(m=>m.id===id)).filter(Boolean);
  document.getElementById('outcome-cards').innerHTML=models.map(m=>{
    const t=m.totals,groups=[['evacuated',t.evacuated],['casualty',t.avoidable_casualties],['stranded',t.avoidable_stranded]];
    return `<article class="outcome-card"><div class="outcome-card-title"><h4>${esc(m.name)}</h4><a class="outcome-open" href="benchmark.html?model=${encodeURIComponent(m.id)}" aria-label="Inspect ${esc(m.name)}">${arrow}</a></div><div class="outcome-score"><strong>${fmt(m.score)}</strong><span>EMBER / 100</span></div><div class="people-art" role="img" aria-label="${t.evacuated} evacuated, ${t.avoidable_casualties} avoidable deaths and ${t.avoidable_stranded} avoidable stranded"><div class="people-art-inner">${groups.map(([type,n])=>Array.from({length:n},()=>`<span class="outcome-person" data-outcome="${type}"></span>`).join('')).join('')}</div></div><dl class="outcome-key">${groups.map(([type,n])=>`<div><dt><i class="${type}-key"></i>${type==='evacuated'?'Evacuated':type==='casualty'?'Avoidable deaths':'Avoidable stranded'}</dt><dd>${n}</dd></div>`).join('')}</dl><button type="button" class="group-outcomes" data-group-outcomes aria-pressed="false">Separate outcomes${arrow}</button></article>`;
  }).join('');
  for(const card of document.querySelectorAll('.outcome-card')){
    let locked=false;
    prepareGrouping(card);
    setGrouping(card,false,true);
    card.addEventListener('pointerenter',()=>{if(fine.matches&&!locked)setGrouping(card,true);});
    card.addEventListener('pointerleave',()=>{if(!locked)setGrouping(card,false);});
    card.querySelector('[data-group-outcomes]').addEventListener('click',e=>{locked=!locked;e.currentTarget.setAttribute('aria-pressed',String(locked));setGrouping(card,locked,e.detail===0);});
    reduced.addEventListener('change',()=>setGrouping(card,card.dataset.grouped==='true',true));
  }
}).catch(()=>{document.getElementById('outcome-cards').innerHTML='<p class="result-preview-error">The preview could not load. <a href="benchmark.html">Open the benchmark</a> to try again.</p>';});
