import {PAGE_SIZE} from './benchmark-dashboard.js?v=20261027-docs-1';
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
} from "./common.js?v=20261027-docs-1";
import {
  METRICS,
  filterModels,
  sortModels,
  finite,
  leaderboardOrder,
} from "./analytics.js";
import {resultExplorer, bindResultExplorer} from './result-explorer.js?v=20261027-docs-1';

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
    view: ["scores", "people", "api"].includes(params.get("view")) ? params.get("view") : "scores",
    kind: params.get("kind") ?? "Decision model",
    creator: params.get("provider") ?? "all",
    sort: params.get("metric") ?? "score",
    direction: params.get("direction") ?? "desc",
    inspect: params.get('model') ?? '',
    page: params.has('page') ? Math.max(0,Number(params.get('page'))||0) : null,
  };
  if (!['all','Decision model','Reference agent'].includes(state.kind)) state.kind = 'Decision model';
  if (!Object.hasOwn(METRICS, state.sort)) state.sort = "score";
  if (!["asc", "desc"].includes(state.direction)) state.direction = "desc";
  document.getElementById("main").innerHTML =
    `<header class="benchmark-heading"><div><h1>EMBERBench</h1><p>Can AI guide people to safety as a fire spreads?</p></div><p class="benchmark-scope">${esc(data.world_count)} worlds · ${data.models.filter(m=>m.kind==='Decision model').length} AI models · ${data.models.filter(m=>m.kind==='Reference agent').length} reference agents<span>Public development snapshot · 1 trial per model</span></p></header>
    <section class="leaderboard-workspace" aria-label="Model explorer">
      <div class="explorer-search"><label class="field search-field">Search the evaluation<input id="search" type="search" placeholder="Model name or provider" value="${esc(state.query)}"></label><label class="field">Entry type<select id="kind"><option value="all">All entries</option><option>Decision model</option><option>Reference agent</option></select></label><label class="field">Provider<select id="provider"><option value="all">All providers</option>${[...new Set(data.models.map(provider))].sort().map(p => `<option value="${esc(p)}">${esc(providerInfo(p).name)}</option>`).join('')}</select></label><button class="button small" id="reset-filters" type="button">Reset filters</button></div>
      <div class="explorer-views"><div class="metric-views" role="group" aria-label="Metrics displayed">${[['scores','Scores'],['people','People'],['api','API usage']].map(([id,label]) => `<button type="button" data-metric-view="${id}" aria-pressed="${state.view === id}">${label}</button>`).join('')}</div><label class="field sort-field">Sort by<select id="metric">${columns.map(([key,label]) => `<option value="${key}">${label}</option>`).join('')}</select></label></div>
      <p id="result-count" class="muted" aria-live="polite"></p><div id="visual-results"></div>
      <div class="explorer-foot"><p class="snapshot-limit">One trial per model. These results describe this public snapshot; they do not establish a statistically significant winner or predict real evacuation safety.</p><details class="evidence-detail"><summary>What do these results mean?<span aria-hidden="true">+</span></summary><div class="evidence-copy"><p><b>AI models</b> choose actions through a model. <b>Reference agents</b> use hand-coded rules and provide context, rather than another AI model to buy or use. Choose an entry type above to see either group.</p><p><b>EMBER is a score out of 100, not a survival percentage.</b> It combines safety and execution quality, balanced across scenario families. Safety / Quality are 0–1 factors. People outcomes sum across worlds and trials.</p><p>Rank follows the scoring specification: score rounded to 0.1 points, then Safety, avoidable losses per trial, worst scenario, and model ID. Custom sorts do not redefine rank. Sorting order is not statistical significance.</p><p>≈ marks list-price API cost estimates. API metadata may cover only the recorded invocation of a resumed run; missing API data is never ranked as zero.</p><p>Reported 95% CIs use the score report’s resampling procedure. Each published model has ${esc([...new Set(data.models.map(m => m.totals.trials))].join(', '))} trial in this snapshot; these CIs cannot capture unobserved between-trial variability. <a href="methodology.html">Read the methodology</a>.</p></div></details></div>
    </section>`;
  const secondaryControls = [
    document.getElementById('kind').closest('.field'),
    document.getElementById('provider').closest('.field'),
    document.querySelector('.sort-field'),
    document.getElementById('reset-filters'),
  ];
  const controlSlots = secondaryControls.map(control => {
    const slot = document.createComment('Responsive filter position');
    control.before(slot); return slot;
  });
  const mobileFilters = document.createElement('details');
  mobileFilters.className = 'mobile-benchmark-filters';
  mobileFilters.innerHTML = '<summary>Filters &amp; sort<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h14M10 3v14"/></svg></summary><div class="filter-fields"></div>';
  document.querySelector('.explorer-search').after(mobileFilters);
  for(const field of document.querySelectorAll('.explorer-search .field')){
    const label=field.firstChild;if(label?.nodeType===Node.TEXT_NODE){const span=document.createElement('span');span.className='filter-label';span.textContent=label.textContent;label.replaceWith(span);}
  }
  const responsiveSearch=document.createElement('div');responsiveSearch.className='responsive-search';
  document.querySelector('.explorer-search').before(responsiveSearch);responsiveSearch.append(document.querySelector('.explorer-search'),mobileFilters);
  const phoneLayout = matchMedia('(max-width:700px)');
  const arrangeControls = () => {
    mobileFilters.hidden = !phoneLayout.matches;
    secondaryControls.forEach((control,index) => phoneLayout.matches
      ? mobileFilters.querySelector('.filter-fields').append(control)
      : controlSlots[index].after(control));
  };
  phoneLayout.addEventListener('change', arrangeControls);
  arrangeControls();
  for (const [id, key] of [
    ["kind", "kind"],
    ["provider", "creator"],
    ["metric", "sort"],
  ])
    document.getElementById(id).value = state[key];
  const render = () => {
    const active = document.activeElement;
    const focusInspect = active?.dataset?.inspect;
    const filtered = filterModels(data.models, state),
      models =
        state.sort === "score" && state.direction === "desc"
          ? leaderboardOrder(filtered)
          : sortModels(filtered, state.sort, state.direction);
    document.getElementById("result-count").textContent =
      `${models.length} of ${data.models.length} entries · ${METRICS[state.sort].label} ${state.direction === "asc" ? "ascending" : "descending"}`;
    const visual = document.getElementById('visual-results');
    visual.innerHTML = resultExplorer(data,models,state,value);
    bindResultExplorer(visual,{
      inspect:(id,pointer,source)=>{
        state.inspect=id;state.page=Math.floor(models.findIndex(m=>m.id===id)/PAGE_SIZE);update();
        const target=source==='select'?document.getElementById('inspect-model'):source==='scatter'?document.querySelector(`[data-plot-select="${CSS.escape(id)}"]`):document.querySelector(`[data-inspect="${CSS.escape(id)}"]`);target?.focus({preventScroll:true});
        if (pointer && !matchMedia('(prefers-reduced-motion:reduce)').matches) document.getElementById('result-inspector')?.animate([{transform:'translateY(6px)'},{transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.2,0,0,1)'});
      },
      page:(page,direction)=>{state.page=page;update();(document.querySelector(`.chart-pagination button[aria-label^="${direction==='next'?'Next':'Previous'}"]:not([disabled])`)||document.querySelector('.chart-pagination button:not([disabled])'))?.focus({preventScroll:true});},
    });
    if (focusInspect) document.querySelector(`[data-inspect="${CSS.escape(focusInspect)}"]`)?.focus({preventScroll:true});
  };
  const update = () => {
    const p = new URLSearchParams({
      q: state.query,
      view: state.view,
      kind: state.kind,
      provider: state.creator,
      metric: state.sort,
      direction: state.direction,
      ...(state.inspect ? {model:state.inspect} : {}),
      ...(state.page!==null ? {page:String(state.page)} : {}),
    });
    history.replaceState(null, "", `?${p}`);
    render();
  };
  for (const button of document.querySelectorAll('[data-metric-view]')) button.addEventListener('click', () => {
    state.view = button.dataset.metricView;state.page=null;
    if (state.view === 'people') {state.sort='evacuated';state.direction='desc';}
    if (state.view === 'api') {state.sort='cost';state.direction='asc';}
    if (state.view === 'scores') {state.sort='score';state.direction='desc';}
    document.getElementById('metric').value=state.sort;
    document.querySelectorAll('[data-metric-view]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    update();
  });
  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value;state.page=null;
    update();
  });
  for (const [id, key] of [
    ["kind", "kind"],
    ["provider", "creator"],
    ["metric", "sort"],
  ])
    document.getElementById(id).addEventListener("change", (e) => {
      state[key] = e.target.value;state.page=null;
      if (key === "sort")
        state.direction =
          METRICS[state.sort].direction === "higher" ? "desc" : "asc";
      update();
    });
  document.getElementById("reset-filters").addEventListener("click", () => {
    state.query = "";state.page=null;
    state.view = "scores";
    document.querySelectorAll('[data-metric-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.metricView==='scores')));
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
  render();
}
main().catch(errorPage);
