import {esc,fmt,count,scenarioName,isDecision,providerInfo} from './common.js?v=20261027-brands-1';
import {METRICS,finite,leaderboardOrder} from './analytics.js?v=20261027-brands-1';

const bounded=v=>Math.max(0,Math.min(1,v));
export function outcomeParts(model){
 return [['evacuated','Evacuated',model.totals.evacuated],['deaths','Avoidable deaths',model.totals.avoidable_casualties],['stranded','Avoidable stranded',model.totals.avoidable_stranded],['unavoidable','Unavoidable losses',model.totals.unavoidable_losses||0]];
}
export function metricScale(models,key){
 return key==='score'?100:['safety','quality','congestion'].includes(key)?1:Math.max(0,...models.map(METRICS[key].get).filter(finite));
}
const shortName=m=>m.name.includes('/')?m.name.split('/').slice(1).join('/'):m.name;
const brandStyle=m=>`--model-color:${providerInfo(m).color}`;
const logo=m=>{const p=providerInfo(m);return p.logo?`<img class="chart-logo" src="assets/providers/${esc(p.logo)}" width="20" height="20" alt="${esc(p.name)}" loading="lazy">`:'<span class="reference-symbol" aria-hidden="true">◇</span>';};
const identity=m=>`${logo(m)}<span class="chart-model-name" title="${esc(m.name)}">${esc(shortName(m))}</span>`;
const selectedClass=(m,selected)=>m.id===selected?.id?' is-inspected':'';

function columns(data,models,selected,state,value){
 const key=state.sort,metric=METRICS[key],maximum=metricScale(models,key);
 const unit=key==='score'?'points / 100':['safety','quality','congestion'].includes(key)?'factor / 1':key==='cost'?'USD':key==='latency'?'seconds / decision':['evacuated','casualties','stranded'].includes(key)?'people':'count';
 return `<section class="dashboard-panel rank-panel" id="ranking" aria-labelledby="rank-plot-title"><header class="dashboard-panel-head"><div><h2 id="rank-plot-title">${esc(metric.label)}</h2><p>${esc(unit)} · ${metric.direction==='higher'?'Higher':'Lower'} is better</p></div><span class="panel-context">${models.length} ${models.every(isDecision)?'decision models':'entries'}</span></header><div class="column-plot"><div class="column-y" aria-hidden="true">${[1,.75,.5,.25,0].map(n=>`<span>${fmt(maximum*n,maximum<10?2:0)}</span>`).join('')}</div><ol class="result-chart column-chart" style="--column-count:${models.length}" aria-label="${esc(metric.label)} comparison">${models.map(m=>{const v=metric.get(m),rank=leaderboardOrder(data.models.filter(x=>x.kind===m.kind)).findIndex(x=>x.id===m.id)+1;
  return `<li style="${brandStyle(m)};--bar-value:${finite(v)&&maximum>0?bounded(v/maximum):0}"><button type="button" class="chart-model column-model${selectedClass(m,selected)}" data-inspect="${esc(m.id)}" aria-pressed="${m.id===selected?.id}" aria-label="${esc(m.name)}: ${esc(value(m,key))} ${esc(unit)}, EMBER rank ${rank} within ${esc(m.kind.toLowerCase())}s"><span class="column-well" aria-hidden="true"><span class="chart-fill" style="--bar-value:${finite(v)&&maximum>0?bounded(v/maximum):0}"></span></span><b>${esc(value(m,key))}</b><span class="column-identity">${identity(m)}</span>${finite(v)?'':'<span class="column-missing sr-only">Unavailable</span>'}</button></li>`;
 }).join('')}</ol></div><p class="panel-caption">${key==='score'?'All matching models on a fixed 0–100 scale. Select a model for its evidence.':key==='cost'?'≈ marks estimated cost. Missing data is not zero.':key==='latency'?'Recorded seconds per act call. Missing data is not zero.':esc(metric.help)}</p></section>`;
}
function scatter(models,selected){
 const valid=models.filter(m=>finite(m.safety)&&finite(m.quality));
 const label=m=>`${m.name}: Safety ${fmt(m.safety,3)}, quality ${fmt(m.quality,3)}`;
 const caption=selected?label(selected):`${valid.length} models. Focus or hover a point to see its values; select it for evidence.`;
 return `<section class="dashboard-panel scatter-panel" id="factors" aria-labelledby="factor-plot-title"><header class="dashboard-panel-head"><div><h2 id="factor-plot-title">Safety &amp; execution quality</h2><p>Every matching model · 0–1 factors · Higher is better</p></div></header><div class="factor-plot"><span class="factor-y-title">Safety</span><div class="factor-y" aria-hidden="true"><span>1</span><span>0.5</span><span>0</span></div><div class="factor-plane" aria-label="Safety versus execution quality"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H100M0 25H100M0 50H100M0 75H100M0 100H100M0 0V100M25 0V100M50 0V100M75 0V100M100 0V100"/></svg>${valid.map(m=>`<button type="button" class="factor-point ${m.id===selected?.id?'is-selected':''} ${isDecision(m)?'':'is-reference'}" style="${brandStyle(m)};left:${bounded(m.quality)*100}%;top:${(1-bounded(m.safety))*100}%" data-plot-select="${esc(m.id)}" data-chart-label="${esc(label(m))}" aria-label="${esc(label(m))}" aria-pressed="${m.id===selected?.id}">${logo(m)}</button>`).join('')}</div><div class="factor-x" aria-hidden="true"><span>0</span><span>0.5</span><span>1</span></div><span class="factor-x-title">Execution quality</span></div><p class="panel-caption scatter-caption" data-default-caption="${esc(caption)}">${esc(caption)}</p></section>`;
}
function outcomes(models){
 return `<section class="dashboard-panel outcome-panel" id="outcomes" aria-labelledby="people-plot-title"><header class="dashboard-panel-head"><div><h2 id="people-plot-title">People outcomes by model</h2><p>Every matching model · Share of evaluated people</p></div></header><div class="outcome-key">${outcomeParts(models[0]).map(([cls,label])=>`<span><i class="${cls}"></i>${label}</span>`).join('')}</div><ol class="outcome-rows">${models.map(m=>{const parts=outcomeParts(m),total=parts.reduce((a,p)=>a+p[2],0);const label=`${m.name}: ${parts.map(p=>`${count(p[2])} ${p[1].toLowerCase()}`).join(', ')}`;return `<li><a href="model.html?id=${encodeURIComponent(m.id)}" data-outcome-label="${esc(label)}" aria-label="${esc(label)}. View model evidence"><span class="row-model">${identity(m)}</span><span class="outcome-stack" aria-hidden="true">${parts.map(([cls,label,n])=>`<i class="${cls}" style="flex-grow:${n}" title="${count(n)} ${label.toLowerCase()}"></i>`).join('')}</span><b>${total?fmt(m.totals.evacuated/total*100,1):'—'}<small>% evacuated</small></b></a></li>`;}).join('')}</ol><p class="panel-caption outcome-caption" data-default-caption="Bars use each model's total evaluated people as their denominator. Evacuation share is not EMBER.">Bars use each model's total evaluated people as their denominator. Focus or hover a row for exact counts. Evacuation share is not EMBER.</p></section>`;
}
function scenarios(models){
 const names=[...new Set(models.flatMap(m=>m.scenarios.map(s=>s.name)))].sort();
 return `<section class="dashboard-panel scenario-panel" id="scenario-results" aria-labelledby="scenario-plot-title"><header class="dashboard-panel-head"><div><h2 id="scenario-plot-title">Performance across scenarios</h2><p>Every matching model in each scenario · EMBER / 100 · Higher is better</p></div></header><div class="scenario-multiples">${names.map(name=>`<section class="scenario-mini"><h3><a href="scenarios.html?scenario=${encodeURIComponent(name)}">${esc(scenarioName(name))}</a></h3><ol class="scenario-models" style="--column-count:${models.length}" aria-label="${esc(scenarioName(name))} model scores">${models.map(m=>{const s=m.scenarios.find(s=>s.name===name),score=s?.score;return `<li style="${brandStyle(m)}"><a href="scenarios.html?scenario=${encodeURIComponent(name)}&model=${encodeURIComponent(m.id)}" aria-label="${esc(m.name)}: ${finite(score)?fmt(score)+' EMBER points':'unavailable'}. View scenario evidence"><span class="scenario-column" aria-hidden="true"><i style="--scenario-score:${finite(score)?bounded(score/100):0}"></i></span><b>${finite(score)?fmt(score,1):'—'}</b><span class="column-identity">${identity(m)}</span></a></li>`;}).join('')}</ol></section>`).join('')}</div><p class="panel-caption">The model order matches the main chart. Select any model’s bar to open its scenario evidence.</p></section>`;
}
export function dashboard(data,models,selected,state,value){
 return `<div class="benchmark-dashboard">${columns(data,models,selected,state,value)}${scatter(models,selected)}${outcomes(models)}${scenarios(models)}</div><p class="plot-note">EMBER combines safety and execution quality. It is not the percentage of people saved. Rankings use the scientific tie-breaks. API metadata may cover only a resumed run’s final invocation. Missing data is not zero.</p>`;
}
export function bindDashboard(root,handlers){
 root.querySelectorAll('[data-outcome-label]').forEach(row=>{
  const caption=root.querySelector('.outcome-caption'),show=()=>{caption.textContent=row.dataset.outcomeLabel;},restore=()=>{caption.textContent=caption.dataset.defaultCaption;};
  row.addEventListener('pointerenter',show);row.addEventListener('focus',show);row.addEventListener('pointerleave',restore);row.addEventListener('blur',restore);
 });
 root.querySelectorAll('[data-plot-select]').forEach(b=>{
  b.addEventListener('click',()=>handlers.inspect(b.dataset.plotSelect,true,'scatter'));
  const caption=root.querySelector('.scatter-caption');
  const show=()=>{caption.textContent=b.dataset.chartLabel;},restore=()=>{caption.textContent=caption.dataset.defaultCaption;};
  b.addEventListener('pointerenter',show);b.addEventListener('focus',show);b.addEventListener('pointerleave',restore);b.addEventListener('blur',restore);
 });
}
