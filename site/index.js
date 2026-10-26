import {shell,loadResults,esc,fmt} from './common.js?v=20261027-guide-footer-2';
import {mountEvaluationLoop} from './evaluation-loop.js';
import {mountHeroMotion} from './hero-motion.js?v=20261027-continuous-lines-1';
import {revealCompanyFooter} from './footer.js?v=20261027-guide-footer-2';

shell(null,'company');
const plotObservers=[];
const destroyHero=mountHeroMotion(document.querySelector('.company-hero'));
addEventListener('pagehide',e=>{if(!e.persisted){destroyHero?.();plotObservers.forEach(observer=>observer.disconnect());}});
mountEvaluationLoop(document.getElementById('home-evaluation-loop'),{compact:true});
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const fine=matchMedia('(hover:hover) and (pointer:fine) and (min-width:701px)');
const groupIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h11M4 18h6"/></svg>';

function setGrouping(card,grouped,instant=false){
  card.classList.toggle('group-instant',instant||reduced.matches);
  card.dataset.grouped=String(grouped);
}
function prepareGrouping(card){
  const counters={evacuated:0,casualty:0,stranded:0};
  const marks=[...card.querySelectorAll('.outcome-person')],pitch=card.querySelector('.people-art-inner').clientWidth/marks.length;
  marks.forEach((dot,index)=>{
    const type=dot.dataset.outcome,local=counters[type]++;
    const row=type==='evacuated'?0:type==='casualty'?1:2;
    dot.style.cssText=`--dot-x:${index*pitch}px;--dot-y:54px;--group-x:${local*pitch}px;--group-y:${row*52}px;--mark-width:${pitch}px`;
  });
}

loadResults().then(data=>{
  const models=['openrouter-typesafe_jev-1.14-choice-r1','openrouter-nace-ai_drex-v2.0-choice-r1'].map(id=>data.models.find(m=>m.id===id)).filter(Boolean);
  document.getElementById('outcome-cards').innerHTML=models.map(m=>{
    const t=m.totals,groups=[['evacuated',t.evacuated],['casualty',t.avoidable_casualties],['stranded',t.avoidable_stranded]];
    return `<article class="outcome-card"><div class="outcome-card-title"><h3>${esc(m.name)}</h3></div><div class="outcome-score"><strong>${fmt(m.score)}</strong><span>EMBER / 100</span></div><div class="people-art" role="img" aria-label="${t.evacuated} evacuated, ${t.avoidable_casualties} avoidable deaths and ${t.avoidable_stranded} avoidable stranded"><div class="people-art-inner">${groups.map(([type,n])=>Array.from({length:n},()=>`<span class="outcome-person" data-outcome="${type}"></span>`).join('')).join('')}</div></div><dl class="outcome-key">${groups.map(([type,n])=>`<div><dt><i class="${type}-key"></i>${type==='evacuated'?'Evacuated':type==='casualty'?'Avoidable deaths':'Avoidable stranded'}</dt><dd>${n}</dd></div>`).join('')}</dl><button type="button" class="group-outcomes" data-group-outcomes aria-pressed="false">${groupIcon}<span>Separate outcomes</span></button></article>`;
  }).join('');
  for(const card of document.querySelectorAll('.outcome-card')){
    let locked=false;
    prepareGrouping(card);
    const observer=new ResizeObserver(()=>{const instant=card.classList.contains('group-instant');card.classList.add('group-instant');prepareGrouping(card);void card.querySelector('.people-art-inner').offsetWidth;requestAnimationFrame(()=>{if(!instant&&!reduced.matches)card.classList.remove('group-instant');});});observer.observe(card.querySelector('.people-art-inner'));plotObservers.push(observer);
    setGrouping(card,false,true);
    card.addEventListener('pointerenter',()=>{if(fine.matches&&!locked)setGrouping(card,true);});
    card.addEventListener('pointerleave',()=>{if(!locked)setGrouping(card,false);});
    card.querySelector('[data-group-outcomes]').addEventListener('click',e=>{locked=!locked;e.currentTarget.setAttribute('aria-pressed',String(locked));e.currentTarget.querySelector('span').textContent=locked?'Show together':'Separate outcomes';setGrouping(card,locked,e.detail===0);});
    reduced.addEventListener('change',()=>setGrouping(card,card.dataset.grouped==='true',true));
  }
  requestAnimationFrame(revealCompanyFooter);
}).catch(()=>{document.getElementById('outcome-cards').innerHTML='<p class="result-preview-error">Results preview unavailable.</p>';});
