import {dashboard,bindDashboard} from './benchmark-dashboard.js?v=20261027-charts-3';
import {esc, fmt, count, providerChip, scenarioName, ciText, isDecision} from './common.js?v=20261027-charts-3';
import {METRICS, finite, leaderboardOrder} from './analytics.js';

const arrow = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5"/></svg>';
const outcome = (value, label, cls) => `<span class="outcome-segment ${cls}" style="flex-grow:${Math.max(0,value)}" title="${esc(`${count(value)} ${label}`)}"></span>`;
const profile = m => `model.html?id=${encodeURIComponent(m.id)}`;

export function peopleReadout(m) {
  const t = m.totals;
  return `<div class="people-readout"><div class="people-strip" role="img" aria-label="${count(t.evacuated)} evacuated, ${count(t.avoidable_casualties)} avoidable deaths, ${count(t.avoidable_stranded)} avoidable stranded, ${count(t.unavoidable_losses)} unavoidable losses">${outcome(t.evacuated,'evacuated','evacuated')}${outcome(t.avoidable_casualties,'avoidable deaths','deaths')}${outcome(t.avoidable_stranded,'avoidable stranded','stranded')}${outcome(t.unavoidable_losses,'unavoidable losses','unavoidable')}</div><dl class="people-legend"><div><dt><i class="evacuated"></i>Evacuated</dt><dd>${count(t.evacuated)}</dd></div><div><dt><i class="deaths"></i>Avoidable deaths</dt><dd>${count(t.avoidable_casualties)}</dd></div><div><dt><i class="stranded"></i>Avoidable stranded</dt><dd>${count(t.avoidable_stranded)}</dd></div>${t.unavoidable_losses ? `<div><dt><i class="unavoidable"></i>Unavoidable losses</dt><dd>${count(t.unavoidable_losses)}</dd></div>` : ''}</dl><p class="readout-note">Summed across evaluated worlds. ${count(t.escapable)} people were individually escapable under the benchmark’s relaxed reference.</p></div>`;
}

function inspector(data, model, against) {
  const ordered = leaderboardOrder(data.models.filter(m => m.kind === model.kind));
  const worst = model.scenarios.filter(s=>finite(s.score)).toSorted((a,b)=>a.score-b.score)[0];
  const best = model.scenarios.filter(s=>finite(s.score)).toSorted((a,b)=>b.score-a.score)[0];
  return `<aside class="result-inspector" id="result-inspector" aria-labelledby="inspector-title"><div class="inspector-identity">${providerChip(model)}<span>${isDecision(model) ? `AI model · ${ordered.findIndex(m=>m.id===model.id)+1} of ${ordered.length}` : 'Hand-coded reference agent'}</span></div><h3 id="inspector-title">${esc(model.name)}</h3><div class="inspector-score"><b>${fmt(model.score)}</b><span>EMBER / 100<small>95% CI ${ciText(model)}</small></span></div>${peopleReadout(model)}<p class="scenario-readout">${best && worst ? `Best: <a href="scenarios.html?scenario=${encodeURIComponent(best.name)}&model=${encodeURIComponent(model.id)}">${esc(scenarioName(best.name))}</a> (${fmt(best.score)}). Lowest: <a href="scenarios.html?scenario=${encodeURIComponent(worst.name)}&model=${encodeURIComponent(model.id)}">${esc(scenarioName(worst.name))}</a> (${fmt(worst.score)}).` : 'Scenario scores are not available.'}</p><a class="inspector-link" href="${profile(model)}">Inspect this model ${arrow}</a><div class="quick-compare"><label for="compare-against">Compare with</label><select id="compare-against">${['Decision model','Reference agent'].map(kind=>`<optgroup label="${kind === 'Decision model' ? 'AI decision models' : 'Hand-coded reference agents'}">${leaderboardOrder(data.models.filter(m=>m.kind===kind && m.id!==model.id)).map(m=>`<option value="${esc(m.id)}" ${m.id === against.id ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}</optgroup>`).join('')}</select><div class="quick-comparison" aria-live="polite">${[model,against].map(m=>`<div><span>${esc(m.name)}</span><b>${fmt(m.score)}</b><div class="mini-score-track"><span style="transform:scaleX(${Math.max(0,Math.min(100,m.score))/100})"></span></div></div>`).join('')}<p>${fmt(Math.abs(model.score-against.score))} points ${model.score >= against.score ? 'higher' : 'lower'} in this snapshot. Descriptive difference; not a significance test.</p></div><a class="inspector-link" href="compare.html?models=${encodeURIComponent([model.id,against.id].join(','))}">Compare scenarios &amp; trade-offs ${arrow}</a></div></aside>`;
}

export function resultExplorer(data, models, state, value) {
  if (!models.length) return `<div class="empty"><h2>No matching models.</h2><p>Try another search or reset filters.</p></div>`;
  const selected = models.find(m=>m.id===state.inspect) || models[0];
  const against = data.models.find(m=>m.id===state.against && m.id!==selected.id) || leaderboardOrder(data.models.filter(m=>m.id!==selected.id && isDecision(m)))[0];
  return `${dashboard(data,models,selected,against,state,value)}<section class="selected-evidence" aria-label="Selected model evidence">${inspector(data,selected,against)}</section>`;
}

export function bindResultExplorer(root, handlers) {
  bindDashboard(root,handlers);
  const buttons = [...root.querySelectorAll('[data-inspect]')];
  buttons.forEach((button,i)=>{
    button.addEventListener('click',event=>handlers.inspect(button.dataset.inspect,event.detail>0));
    button.addEventListener('keydown',event=>{
      const next = ['ArrowDown','ArrowRight'].includes(event.key) ? buttons[(i+1)%buttons.length] : ['ArrowUp','ArrowLeft'].includes(event.key) ? buttons[(i+buttons.length-1)%buttons.length] : event.key === 'Home' ? buttons[0] : event.key === 'End' ? buttons.at(-1) : null;
      if (next) {event.preventDefault();handlers.inspect(next.dataset.inspect);}
    });
  });
  root.querySelector('#expand-results')?.addEventListener('click',handlers.expand);
  root.querySelector('#compare-against')?.addEventListener('change',e=>handlers.against(e.target.value));
}
