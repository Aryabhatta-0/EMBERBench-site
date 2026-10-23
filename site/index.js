import { loadResults, shell, esc, fmt, count, section, provenance, errorPage, isDecision, providerChip } from './common.js';
import { leaderboardOrder } from './analytics.js';
import { scoreBars, scatter, heatmap, legend, providerComparison, metricBars, scoreCostQuadrant } from './charts.js';
import { animateCosmos } from './cosmos.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
async function main() {
  const data = await loadResults();
  shell(data, 'overview');
  const models = leaderboardOrder(data.models), decisions = models.filter(isDecision);
  const worlds = new Set(models[0].episodes.map(e => `${e.index}/${e.scenario_id}/${e.seed}`)).size;
  document.getElementById('main').innerHTML = `
  <section class="anantam-hero" aria-labelledby="hero-title">
    <div class="hero-copy"><h1 id="hero-title">Intelligence,<br>measured.</h1><p>Explore how AI makes decisions<br class="desktop-break"> when every move matters.</p><div class="hero-actions"><a class="button primary" href="leaderboard.html">Explore the benchmark ${arrow}</a><a class="quiet-link" href="methodology.html">How it works</a></div></div>
    <div class="hero-art"><div class="cosmos-emblem"><img src="assets/anantam-logo.png" width="1254" height="1254" alt="Anantam’s star-filled infinity emblem" fetchpriority="high"><canvas class="cosmos-sky" aria-hidden="true" hidden></canvas></div><span class="art-caption">Anantam <span lang="sa">अनन्तम्</span><span>Boundless possibilities.</span></span><button class="cosmos-toggle" type="button" hidden>Pause motion</button></div>
    <div class="hero-facts" aria-label="Benchmark coverage"><span><b>${count(decisions.length)}</b> decision models</span><span><b>${count(models.length - decisions.length)}</b> reference agents</span><span><b>${count(worlds)}</b> shared worlds</span><span>Powered by <a href="methodology.html">EMBERBench</a></span></div>
  </section>
  <section class="benchmark-stage" id="explore" aria-labelledby="explore-title">
    <div class="stage-heading"><div><h2 id="explore-title">Beyond a single score.</h2><p>Same worlds. Different decisions. Explore the evidence.</p></div><a class="quiet-link" href="leaderboard.html">Full leaderboard ${arrow}</a></div>
    <div class="view-tabs" role="tablist" aria-label="Explore benchmark results"><button id="tab-rankings" role="tab" aria-selected="true" aria-controls="view-rankings" tabindex="0">Rankings</button><button id="tab-tradeoffs" role="tab" aria-selected="false" aria-controls="view-tradeoffs" tabindex="-1">Trade-offs</button><button id="tab-scenarios" role="tab" aria-selected="false" aria-controls="view-scenarios" tabindex="-1">Scenarios</button></div>
    <div class="result-view" id="view-rankings" role="tabpanel" aria-labelledby="tab-rankings" tabindex="0"><div class="result-intro"><h3>Who leads the way?</h3><p>Leading decision models by EMBER Score. Higher is better.</p></div><div class="featured-results">${decisions.slice(0, 3).map((m, i) => `<a class="featured-result" href="model.html?id=${encodeURIComponent(m.id)}"><span class="featured-rank">${String(i + 1).padStart(2, '0')}</span><div>${providerChip(m)}<h4>${esc(m.name)}</h4></div><span class="featured-score">${fmt(m.score)}<small>EMBER Score</small></span>${arrow}</a>`).join('')}</div><details class="analysis-disclosure"><summary>Explore all ${models.length} evaluated entries</summary><div class="toolbar"><label class="field">Entry type<select id="top-kind"><option value="all">All entries</option><option value="Decision model">Decision models</option><option value="Reference agent">Reference agents</option></select></label></div><div id="top-chart"></div>${legend()}</details></div>
    <div class="result-view" id="view-tradeoffs" role="tabpanel" aria-labelledby="tab-tradeoffs" tabindex="0" hidden><div class="result-intro"><h3>See the trade-offs.</h3><p>Compare outcomes, then inspect the models behind them.</p></div><div class="toolbar"><label class="field">Relationship<select id="analysis-metric"><option value="quality">Safety vs Quality</option><option value="casualties">EMBER vs avoidable casualties</option><option value="congestion">EMBER vs congestion block rate</option><option value="latency">EMBER vs mean decision latency</option><option value="cost">EMBER vs API cost</option></select></label><label class="field">Highlight model<select id="highlight-model"><option value="">None</option>${models.map(m => `<option value="${esc(m.id)}">${esc(m.name)}</option>`).join('')}</select></label></div><div id="scatter-chart"></div><p class="note">Cost and latency are run metadata, never score inputs. Estimated costs are marked ≈.</p></div>
    <div class="result-view" id="view-scenarios" role="tabpanel" aria-labelledby="tab-scenarios" tabindex="0" hidden><div class="result-intro"><h3>Every world tells a story.</h3><p>Scenario scores, from 0 to 100. <a href="scenarios.html">Explore the scenarios</a>.</p></div>${heatmap(models)}</div>
    <p class="scope-note">Public development results. Descriptive ranks, not significance claims. One trial per model; confidence intervals do not capture between-trial variability.</p>
    <details class="analysis-disclosure extended-analysis"><summary>More analysis &amp; provenance</summary><div class="grid2">${section('Company scorecard', 'Compare providers using recorded results.', '<div class="toolbar"><label class="field">Compare by<select id="provider-metric"><option value="score">Best EMBER Score</option><option value="cost">Lowest recorded API cost</option><option value="latency">Lowest mean decision latency</option></select></label></div><div id="provider-chart"></div>')}${section('Mean decision latency', 'Recorded mean time to return one action.', metricBars(decisions, 'latency'))}${section('Recorded run time', 'End-to-end time for the recorded invocation.', metricBars(decisions, 'wall'))}${section('Score vs API cost', 'Missing costs remain unavailable.', scoreCostQuadrant(decisions))}</div>${section('Reproducible by construction', 'Generated from official score reports.', provenance(data))}</details>
  </section>
  <section class="research-note" aria-labelledby="research-title"><div><h2 id="research-title">Real pressure.<br>Reproducible evidence.</h2><a class="button" href="methodology.html">Meet EMBERBench ${arrow}</a></div><div class="research-copy"><p>Fire spreads. Corridors fill. Every decision changes what happens next.</p><p>EMBERBench tests how models guide people through dynamic evacuations. Anantam makes those outcomes easier to explore, compare, and understand.</p><details><summary>What the results mean</summary><p>EMBER Score combines safety and execution quality. It is not the percentage of people saved. These public worlds support development; they do not establish hidden-suite generalization. Reference agents use fixed strategies and are not language models.</p><a href="methodology.html#public-development">Read the evaluation scope</a></details><a class="quiet-link" href="compare.html">Compare models ${arrow}</a></div></section>`;
  animateCosmos(document.querySelector('.cosmos-emblem'));
  const highlight = () => document.getElementById('highlight-model').value;
  const renderTop = () => { document.getElementById('top-chart').innerHTML = scoreBars(models.filter(m => document.getElementById('top-kind').value === 'all' || m.kind === document.getElementById('top-kind').value), highlight()); };
  const renderScatter = () => { const key = document.getElementById('analysis-metric').value; document.getElementById('scatter-chart').innerHTML = scatter(models, key, key === 'quality' ? 'safety' : 'score', highlight()); };
  const renderProviders = () => { document.getElementById('provider-chart').innerHTML = providerComparison(decisions, document.getElementById('provider-metric').value); };
  document.getElementById('top-kind').addEventListener('change', renderTop);
  document.getElementById('analysis-metric').addEventListener('change', renderScatter);
  document.getElementById('provider-metric').addEventListener('change', renderProviders);
  document.getElementById('highlight-model').addEventListener('change', () => { renderTop(); renderScatter(); });
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const activate = tab => tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !selected; });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs.at(-1);
      if (next) { e.preventDefault(); activate(next); next.focus(); }
    });
  });
  renderTop(); renderScatter(); renderProviders();
}
main().catch(errorPage);
