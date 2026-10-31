import {
  loadResults,
  shell,
  esc,
  fmt,
  count,
  duration,
  costText,
  provider,
  providerInfo,
  errorPage,
} from "./common.js?v=20261031-dawn-1";
import {
  METRICS,
  filterModels,
  sortModels,
  finite,
} from "./analytics.js?v=20261031-dawn-1";
import {resultExplorer, bindResultExplorer} from './result-explorer.js?v=20261031-dawn-1';

const columns = [
  ["score", "EMBER"],
  ["safety", "Safety"],
  ["quality", "Quality"],
  ["evacuated", "Evacuated"],
  ["casualties", "Avoidable deaths"],
  ["stranded", "Avoidable stranded"],
  ["blocked", "Blocked moves"],
  ["requests", "API requests"],
  ["input", "Input tokens"],
  ["cost", "API cost"],
  ["latency", "Mean decision latency"],
];
function value(m, key) {
  const v = METRICS[key].get(m);
  if (!finite(v)) return "—";
  if (key === "cost") return costText(m);
  if (key === "latency") return duration(v);
  if (key === "safety" || key === "quality") return fmt(v, 3);
  return key === "score" ? fmt(v) : count(v);
}
async function main() {
  const data = await loadResults();
  shell(data, "leaderboard");
  const params = new URLSearchParams(location.search);
  const state = {
    query: params.get("q") ?? "",
    kind: params.get("kind") ?? "Decision model",
    creator: params.get("provider") ?? "all",
    sort: params.get("metric") ?? ({people:"evacuated",api:"cost"}[params.get("view")] || "score"),
    direction: "desc",
    inspect: params.get('model') ?? '',
  };
  if (!['all','Decision model','Reference agent'].includes(state.kind)) state.kind = 'Decision model';
  if (!Object.hasOwn(METRICS, state.sort)) state.sort = "score";
  if (!["asc", "desc"].includes(state.direction)) state.direction = "desc";
  const providersForKind=()=>[...new Set(data.models.filter(m=>state.kind==='all'||m.kind===state.kind).map(provider))].sort();
  const normalizeProvider=()=>{if(!providersForKind().includes(state.creator))state.creator='all';};
  normalizeProvider();
  document.getElementById("main").innerHTML =
    `<header class="benchmark-heading"><div><h1>EMBERBench</h1><p>Can AI guide people to safety as a fire spreads?</p></div><p class="benchmark-scope">${esc(data.world_count)} worlds · ${data.models.filter(m=>m.kind==='Decision model').length} decision models · ${data.models.filter(m=>m.kind==='Reference agent').length} reference agents<span>Public development snapshot · 1 trial per model</span></p></header>
    <section class="evaluation-scope" aria-label="Evaluation scope"><h2 class="sr-only">Public development leaderboard</h2><p><strong>Public development results.</strong> Models may train or tune here; scores are reproducible, but not contamination-resistant. Official EMBERBench requires separate hidden evaluation. No official hidden-test results or submission service are published here. <a href="docs/evaluation-boundary.html">About this evaluation</a></p></section>
    <section class="leaderboard-workspace" aria-label="Model explorer">
      <div class="results-toolbar"><label class="results-search" for="search"><span class="sr-only">Search models</span><input id="search" type="search" placeholder="Search models" value="${esc(state.query)}"></label><details class="results-options"><summary>Filters<span class="filter-count" hidden></span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg></summary><div class="results-option-fields"><label class="field">Entry type<select id="kind"><option value="all">All entries</option><option>Decision model</option><option>Reference agent</option></select></label><label class="field">Provider<select id="provider"><option value="all">All providers</option>${[...new Set(data.models.map(provider))].sort().map(p => `<option value="${esc(p)}">${esc(providerInfo(p).name)}</option>`).join('')}</select></label><label class="field">Ranking metric<select id="metric">${columns.map(([key,label]) => `<option value="${key}">${label}</option>`).join('')}</select></label><button class="button small" id="reset-filters" type="button">Reset filters</button></div></details></div>
      <p id="result-count" class="sr-only" aria-live="polite"></p><div id="visual-results"></div>
      <div class="explorer-foot"><p class="snapshot-limit">One trial per model. These results describe this public snapshot; they do not establish a statistically significant winner or predict real evacuation safety.</p><details class="evidence-detail"><summary>What do these results mean?<span aria-hidden="true">+</span></summary><div class="evidence-copy"><p><b>AI models</b> choose actions through a model. <b>Reference agents</b> use hand-coded rules and provide context, rather than another AI model to buy or use. Use Filters to choose either group.</p><p><b>EMBER is a score out of 100, not a survival percentage.</b> It combines safety and execution quality, balanced across scenario families. Safety / Quality are 0–1 factors. People outcomes sum across worlds and trials.</p><p>Rank follows the scoring specification: score rounded to 0.1 points, then Safety, avoidable losses per trial, worst scenario, and model ID. Custom sorts do not redefine rank. Sorting order is not statistical significance.</p><p>≈ marks list-price API cost estimates. API metadata may cover only the recorded invocation of a resumed run; missing API data is never ranked as zero.</p><p>Reported 95% CIs use the score report’s resampling procedure. Each published model has ${esc([...new Set(data.models.map(m => m.totals.trials))].join(', '))} trial in this snapshot; these CIs cannot capture unobserved between-trial variability. <a href="methodology.html">Read the methodology</a>.</p></div></details></div>
    </section>`;
  const options=document.querySelector('.results-options');
  document.addEventListener('click',e=>{if(options.open&&!options.contains(e.target))options.open=false;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&options.open){options.open=false;options.querySelector('summary').focus();}});
  for (const [id, key] of [
    ["kind", "kind"],
    ["provider", "creator"],
    ["metric", "sort"],
  ])
    document.getElementById(id).value = state[key];
  const render = () => {
    const providerField=document.getElementById('provider');
    providerField.innerHTML=`<option value="all">All providers</option>${providersForKind().map(p=>`<option value="${esc(p)}">${esc(providerInfo(p).name)}</option>`).join('')}`;
    providerField.value=state.creator;
    const active = document.activeElement;
    const focusInspect = active?.dataset?.inspect;
    const filtered = filterModels(data.models, state),
      models = sortModels(filtered, state.sort, "desc");
    const filterCount=Number(state.kind!=='Decision model')+Number(state.creator!=='all')+Number(state.sort!=='score');
    const badge=options.querySelector('.filter-count');badge.hidden=filterCount===0;badge.textContent=String(filterCount);
    options.querySelector('summary').setAttribute('aria-label',filterCount?`Filters, ${filterCount} active`:'Filters');
    document.getElementById('reset-filters').disabled=!filterCount&&!state.query;
    document.getElementById("result-count").textContent =
      `${models.length} of ${data.models.length} entries · ${METRICS[state.sort].label} ${state.direction === "asc" ? "ascending" : "descending"}`;
    const visual = document.getElementById('visual-results');
    visual.innerHTML = resultExplorer(data,models,state,value);
    bindResultExplorer(visual,{
      inspect:(id,pointer,source)=>{
        state.inspect=id;update();
        const target=source?document.querySelector(`[data-chart-id="${CSS.escape(source)}"] [data-plot-select="${CSS.escape(id)}"]`):document.querySelector(`[data-inspect="${CSS.escape(id)}"]`);target?.focus({preventScroll:true});
        if (pointer && !matchMedia('(prefers-reduced-motion:reduce)').matches) document.getElementById('result-inspector')?.animate([{transform:'translateY(6px)'},{transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.2,0,0,1)'});
      },
    });
    if (focusInspect) document.querySelector(`[data-inspect="${CSS.escape(focusInspect)}"]`)?.focus({preventScroll:true});
  };
  const update = () => {
    const p = new URLSearchParams({
      q: state.query,
      kind: state.kind,
      provider: state.creator,
      metric: state.sort,
      direction: state.direction,
      ...(state.inspect ? {model:state.inspect} : {}),
    });
    history.replaceState(null, "", `?${p}`);
    render();
  };
  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    update();
  });
  for (const [id, key] of [
    ["kind", "kind"],
    ["provider", "creator"],
    ["metric", "sort"],
  ])
    document.getElementById(id).addEventListener("change", (e) => {
      state[key] = e.target.value;
      if(key==='kind')normalizeProvider();
      if (key === "sort")
        state.direction = "desc";
      update();
    });
  document.getElementById("reset-filters").addEventListener("click", () => {
    state.query = "";
    state.kind = "Decision model";
    state.creator = "all";
    state.sort = "score";
    state.direction = "desc";
    document.getElementById("search").value = "";
    document.getElementById("kind").value = "Decision model";
    document.getElementById("provider").value = "all";
    document.getElementById("metric").value = "score";
    update();
  });
  if(params.get("direction")&&params.get("direction")!=="desc")update();else render();
}
main().catch(error=>{
  document.querySelector('[data-page-loader]')?.remove();
  document.querySelector('main')?.removeAttribute('data-loading');
  const summary=document.querySelector('[data-static-results]');
  if(!summary){errorPage(error);return;}
  const status=summary.querySelector('[data-static-status]');
  status.setAttribute('role','status');
  status.innerHTML='Interactive charts are unavailable. The published text results above remain readable. <button type="button" class="button small" data-retry-charts>Retry charts</button> <a href="data/leaderboard.json">Download public results as JSON</a> or read the <a href="docs.html">documentation</a>.';
  status.querySelector('[data-retry-charts]').addEventListener('click',()=>location.reload());
});
