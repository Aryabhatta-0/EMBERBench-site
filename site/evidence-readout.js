import {esc,fmt,scenarioName} from './common.js?v=20261028-navigation-2';
import {finite} from './analytics.js?v=20261028-navigation-2';
import {peopleReadout} from './result-explorer.js';

export function profileReadout(model) {
  const scenarios=model.scenarios.filter(s=>finite(s.score)).toSorted((a,b)=>a.score-b.score).slice(0,5);
  return `<div class="profile-readout"><section><h2>What happened to the people?</h2><p class="readout-intro">The score is a composite. These are the recorded human outcomes.</p>${peopleReadout(model)}<p class="readout-note">Public development evaluation, one trial. This simulation does not establish real-world evacuation safety.</p></section><section><h2>Where performance was lowest</h2><p class="readout-intro">Five lowest scenario scores · EMBER / 100</p><ul class="scenario-score-list">${scenarios.map(s=>`<li><a href="scenarios.html?scenario=${encodeURIComponent(s.name)}&model=${encodeURIComponent(model.id)}"><span>${esc(scenarioName(s.name))}</span><b>${fmt(s.score)}</b><span class="scenario-score-track" aria-hidden="true"><i style="transform:scaleX(${Math.max(0,Math.min(100,s.score))/100})"></i></span></a></li>`).join('')}</ul><p class="readout-note">A strong average can conceal difficult worlds. Open a scenario to compare models on the same challenge.</p></section></div>`;
}

export function comparisonReadout(models) {
  return `<section class="comparison-readout"><h2>Compare the people outcomes</h2><p class="readout-intro">The same evaluated worlds. Counts are summed, not family-balanced scores.</p><div class="comparison-people" style="--comparison-count:${models.length}">${models.map(m=>`<section><h3>${esc(m.name)}</h3>${peopleReadout(m)}</section>`).join('')}</div><p class="readout-note">Avoidable losses use an evaluator-side individual escape reference. One trial per model; differences here are descriptive.</p></section>`;
}
