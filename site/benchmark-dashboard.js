import {esc,fmt,count,scenarioName,isDecision} from './common.js';
import {METRICS,finite,leaderboardOrder} from './analytics.js';

export const PAGE_SIZE=5;
const bounded=v=>Math.max(0,Math.min(1,v));
export function rankingPage(models,page=0){
  const pages=Math.max(1,Math.ceil(models.length/PAGE_SIZE));
  const current=Math.max(0,Math.min(pages-1,Number.isFinite(page)?Math.trunc(page):0));
  return {current,pages,start:current*PAGE_SIZE,models:models.slice(current*PAGE_SIZE,(current+1)*PAGE_SIZE)};
}
export function outcomeParts(model){
  return [['evacuated','Evacuated',model.totals.evacuated],['deaths','Avoidable deaths',model.totals.avoidable_casualties],['stranded','Avoidable stranded',model.totals.avoidable_stranded],['unavoidable','Unavoidable losses',model.totals.unavoidable_losses||0]];
}
const shortName=m=>m.name.includes('/')?m.name.split('/').slice(1).join('/'):m.name;
const scenarioLabels=['Sparse','Crowded','Bottleneck','Two exits','Central fire','Exit risk','Several fires','Maze','Crowd 100','Replanning'];
const arrow=direction=>`<svg viewBox="0 0 20 20" aria-hidden="true"><path d="${direction==='next'?'M4 10h12m-5-5 5 5-5 5':'M16 10H4m5-5-5 5 5 5'}"/></svg>`;

function columns(data,models,selected,state,value){
  const key=state.sort,metric=METRICS[key],page=rankingPage(models,state.page??Math.floor(models.indexOf(selected)/PAGE_SIZE));
  const maximum=key==='score'?100:['safety','quality','congestion'].includes(key)?1:Math.max(0,...models.map(metric.get).filter(finite));
  const unit=key==='score'?'points / 100':['safety','quality','congestion'].includes(key)?'factor / 1':key==='cost'?'USD':key==='latency'?'seconds / decision':['evacuated','casualties','stranded'].includes(key)?'people':'count';
  return `<section class="dashboard-panel rank-panel" aria-labelledby="rank-plot-title"><header class="dashboard-panel-head plot-heading"><div><h2 id="rank-plot-title">${esc(metric.label)}</h2><p>${esc(unit)} · ${metric.direction==='higher'?'Higher':'Lower'} is better</p></div><div class="chart-pagination"><button type="button" data-chart-page="${page.current-1}" ${page.current===0?'disabled':''} aria-label="Previous five models">${arrow('prev')}</button><span>${page.start+1}–${page.start+page.models.length} / ${models.length}</span><button type="button" data-chart-page="${page.current+1}" ${page.current===page.pages-1?'disabled':''} aria-label="Next five models">${arrow('next')}</button></div></header><div class="column-plot"><div class="column-y" aria-hidden="true"><span>${fmt(maximum,maximum<10?2:0)}</span><span>0</span></div><ol class="result-chart column-chart" aria-label="${esc(metric.label)} comparison">${page.models.map(m=>{const v=metric.get(m),rank=leaderboardOrder(data.models.filter(x=>x.kind===m.kind)).findIndex(x=>x.id===m.id)+1;
    return `<li><button type="button" class="chart-model column-model ${m.id===selected.id?'is-inspected':''}" data-inspect="${esc(m.id)}" aria-pressed="${m.id===selected.id}" aria-label="${esc(m.name)}: ${esc(value(m,key))} ${esc(unit)}, EMBER rank ${rank} within ${esc(m.kind.toLowerCase())}s"><b>${esc(value(m,key))}</b><span class="column-well" aria-hidden="true"><span class="chart-fill" style="transform:scaleY(${finite(v)&&maximum>0?bounded(v/maximum):0})"></span>${finite(v)?'':'<span class="column-missing">—</span>'}</span><span class="chart-model-name" title="${esc(m.name)}">${esc(shortName(m))}</span></button></li>`;
  }).join('')}</ol></div><p class="panel-caption">${key==='score'?'Fixed 0–100 scale. Select a bar to inspect a model.':key==='cost'?'≈ marks estimated cost. Missing data is not zero.':key==='latency'?'Recorded seconds per act call. Missing data is not zero.':esc(metric.help)}</p></section>`;
}

function scatter(models,selected){
  const valid=models.filter(m=>finite(m.safety)&&finite(m.quality));
  const label=m=>`${m.name}: Safety ${fmt(m.safety,3)}, quality ${fmt(m.quality,3)}`;
  return `<section class="dashboard-panel scatter-panel" aria-labelledby="factor-plot-title"><header class="dashboard-panel-head"><div><h2 id="factor-plot-title">Safety &amp; execution quality</h2><p>0–1 factors · Higher is better</p></div><span class="panel-context">${valid.length} entries</span></header><div class="factor-plot"><span class="factor-y-title">Safety</span><div class="factor-y" aria-hidden="true"><span>1</span><span>0.5</span><span>0</span></div><div class="factor-plane" aria-label="Safety versus execution quality"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H100M0 50H100M0 100H100M0 0V100M50 0V100M100 0V100"/></svg>${valid.map(m=>`<button type="button" class="factor-point ${m.id===selected.id?'is-selected':''} ${isDecision(m)?'':'is-reference'}" style="left:${bounded(m.quality)*100}%;top:${(1-bounded(m.safety))*100}%" data-plot-select="${esc(m.id)}" data-chart-label="${esc(label(m))}" aria-label="${esc(label(m))}" aria-pressed="${m.id===selected.id}"><span></span></button>`).join('')}</div><div class="factor-x" aria-hidden="true"><span>0</span><span>0.5</span><span>1</span></div><span class="factor-x-title">Execution quality</span></div><p class="panel-caption scatter-caption" data-default-caption="${esc(label(selected))}">${esc(label(selected))}</p></section>`;
}

function outcomes(model){
  const parts=outcomeParts(model),total=parts.reduce((a,p)=>a+p[2],0),circle=2*Math.PI*43;let offset=0;
  return `<section class="dashboard-panel outcome-panel" aria-labelledby="people-plot-title"><header class="dashboard-panel-head"><div><h2 id="people-plot-title">People outcomes</h2><p>Selected model · Counts across evaluated worlds</p></div></header><div class="outcome-donut"><svg viewBox="0 0 120 120" role="img" aria-label="${esc(model.name)}: ${parts.map(p=>`${p[2]} ${p[1].toLowerCase()}`).join(', ')}"><circle class="donut-track" cx="60" cy="60" r="43"/>${parts.map(([cls,,n])=>{const length=total?n/total*circle:0;const arc=`<circle class="donut-arc ${cls}" cx="60" cy="60" r="43" stroke-dasharray="${length} ${circle-length}" stroke-dashoffset="${-offset}" transform="rotate(-90 60 60)"/>`;offset+=length;return n?arc:'';}).join('')}<text class="donut-total" x="60" y="59">${count(total)}</text><text class="donut-unit" x="60" y="76">people</text></svg><dl class="donut-key">${parts.filter(p=>p[2]||p[0]!=='unavoidable').map(([cls,label,n])=>`<div><dt><i class="${cls}"></i>${label}</dt><dd>${count(n)}</dd></div>`).join('')}</dl></div><p class="panel-caption">Counts describe outcomes; EMBER is a composite score.</p></section>`;
}

function scenarios(selected,against,state){
  const ids=[...new Set([...selected.scenarios,...against.scenarios].map(s=>s.name))].sort(),half=state.scenarioPage===1?1:0,visible=ids.slice(half*5,half*5+5);
  return `<section class="dashboard-panel scenario-panel" aria-labelledby="scenario-plot-title"><header class="dashboard-panel-head"><div><h2 id="scenario-plot-title">Scenario performance</h2><p>EMBER / 100 · Select a cell for its evidence</p></div><div class="scenario-pages" role="group" aria-label="Scenarios displayed">${[0,1].map(p=>`<button type="button" data-scenario-page="${p}" aria-pressed="${half===p}">${p*5+1}–${Math.min(ids.length,p*5+5)}</button>`).join('')}</div></header><div class="mini-heatmap"><div class="heat-row heat-axis" aria-hidden="true"><span>Scenario</span>${visible.map(id=>`<span title="${esc(scenarioName(id))}">${scenarioLabels[Number(id.slice(7,9))-1]||ids.indexOf(id)+1}</span>`).join('')}</div>${[selected,against].map(m=>`<div class="heat-row"><span class="heat-model" title="${esc(m.name)}">${esc(shortName(m))}</span>${visible.map(id=>{const s=m.scenarios.find(s=>s.name===id),valid=finite(s?.score),label=`${m.name}, ${scenarioName(id)}: ${valid?fmt(s.score)+' EMBER points':'unavailable'}`;return `<a class="mini-heat-cell heat-level-${valid?Math.min(4,Math.floor(s.score/25)):'missing'}" href="scenarios.html?scenario=${encodeURIComponent(id)}&model=${encodeURIComponent(m.id)}" aria-label="${esc(label)}" title="${esc(label)}">${valid?fmt(s.score,1):'—'}</a>`;}).join('')}</div>`).join('')}</div><div class="heat-legend"><span>Score bands</span><i class="heat-level-0"></i><i class="heat-level-1"></i><i class="heat-level-2"></i><i class="heat-level-3"></i><i class="heat-level-4"></i><span>0–100</span><a href="compare.html?models=${encodeURIComponent([selected.id,against.id].join(','))}">Full comparison</a></div></section>`;
}

export function dashboard(data,models,selected,against,state,value){
  return `<div class="dashboard-selection"><label for="inspect-model">Inspect model</label><select id="inspect-model">${models.map(m=>`<option value="${esc(m.id)}" ${m.id===selected.id?'selected':''}>${esc(m.name)}</option>`).join('')}</select><span><b>${fmt(selected.score)}</b> EMBER / 100</span><a href="model.html?id=${encodeURIComponent(selected.id)}">Model profile</a></div><div class="benchmark-dashboard">${columns(data,models,selected,state,value)}${scatter(models,selected)}${outcomes(selected)}${scenarios(selected,against,state)}</div><p class="plot-note">EMBER combines safety and execution quality. It is not the percentage of people saved. Rankings use the scientific tie-breaks. API metadata may cover only a resumed run’s final invocation. Missing data is not zero.</p>`;
}

export function bindDashboard(root,handlers){
  root.querySelector('#inspect-model')?.addEventListener('change',e=>handlers.inspect(e.target.value,false,'select'));
  root.querySelectorAll('[data-chart-page]').forEach(b=>b.addEventListener('click',()=>handlers.page(Number(b.dataset.chartPage),b.getAttribute('aria-label').startsWith('Next')?'next':'previous')));
  root.querySelectorAll('[data-scenario-page]').forEach(b=>b.addEventListener('click',()=>handlers.scenarioPage(Number(b.dataset.scenarioPage))));
  root.querySelectorAll('[data-plot-select]').forEach(b=>{
    b.addEventListener('click',()=>handlers.inspect(b.dataset.plotSelect,true,'scatter'));
    const caption=root.querySelector('.scatter-caption');
    const show=()=>{caption.textContent=b.dataset.chartLabel;},restore=()=>{caption.textContent=caption.dataset.defaultCaption;};
    b.addEventListener('pointerenter',show);b.addEventListener('focus',show);b.addEventListener('pointerleave',restore);b.addEventListener('blur',restore);
  });
}
