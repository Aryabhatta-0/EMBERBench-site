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
} from "./common.js?v=20261031-dawn-3";
import {
  METRICS,
  filterModels,
  sortModels,
  finite,
  leaderboardOrder,
} from "./analytics.js?v=20261031-dawn-3";
import {resultExplorer, bindResultExplorer} from './result-explorer.js?v=20261031-dawn-3';

const columns = [
  ["score", "EMBER Score"],
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
  // Three headline numbers answer the first questions before any chart: who leads, against what, on how much.
  const decisions=data.models.filter(m=>m.kind==='Decision model'),references=data.models.filter(m=>m.kind==='Reference agent');
  const topModel=leaderboardOrder(decisions)[0],topReference=leaderboardOrder(references)[0],scenarioCount=new Set(data.models.flatMap(m=>m.scenarios.map(s=>s.name))).size;
  const kinds=[['Decision model','AI models'],['Reference agent','Hand-coded agents'],['all','All']];
  const glance=(label,value,note)=>`<div><dt>${label}</dt><dd><strong>${value}</strong><span>${note}</span></dd></div>`;
  document.getElementById("main").innerHTML =
    `<header class="benchmark-heading"><h1>EMBERBench</h1><p>Can AI guide people to safety as a fire spreads?</p></header>
    <dl class="benchmark-glance">${topModel?glance('Best AI model',esc(fmt(topModel.score)),esc(topModel.name)):''}${topReference?glance('Best hand-coded agent',esc(fmt(topReference.score)),esc(topReference.name)):''}${glance('Tested',esc(String(decisions.length)),`AI models · ${esc(String(scenarioCount))} fire scenarios · ${esc(String(data.world_count))} worlds`)}</dl>
    <p class="evaluation-scope"><strong>Public development snapshot</strong>, one trial per model. Models may train on this public set, so scores are not contamination-resistant. <a href="docs/evaluation-boundary.html">About this evaluation</a></p>
    <section class="leaderboard-workspace" aria-label="Model explorer">
      <h2 class="sr-only">Filter and compare models</h2>
      <div class="filter-bar">
        <label class="filter-field filter-search" for="search"><span class="filter-label">Search</span><input id="search" type="search" placeholder="Model or provider" autocomplete="off" value="${esc(state.query)}"></label>
        <fieldset class="filter-field filter-kind"><legend class="filter-label">Show</legend><div class="segmented">${kinds.map(([value,label])=>`<label><input type="radio" name="kind" value="${esc(value)}"><span>${label}</span></label>`).join('')}</div></fieldset>
        <label class="filter-field" for="provider"><span class="filter-label">Provider</span><select id="provider"></select></label>
        <label class="filter-field" for="metric"><span class="filter-label">Rank by</span><select id="metric">${columns.map(([key,label]) => `<option value="${key}">${label}</option>`).join('')}</select></label>
        <button class="filter-reset" id="reset-filters" type="button">Reset filters</button>
      </div>
      <div class="filter-foot"><p id="result-count" class="filter-status" aria-live="polite"></p><details class="filter-help"><summary>How filters work</summary><ul><li><b>Search</b>, <b>Show</b> and <b>Provider</b> choose the entries in every chart.</li><li><b>Rank by</b> changes the first chart only. Each other chart keeps its own measure.</li><li>Official ranks, the 1, 2 and 3 marks, never change.</li><li>The page address keeps your choices, so you can share the view.</li></ul></details></div>
      <div id="visual-results"></div>
      <details class="evidence-detail"><summary>How to read these results<span aria-hidden="true">+</span></summary><div class="evidence-copy"><p><b>AI models</b> choose each action through a model API. <b>Hand-coded agents</b> follow fixed rules. They give context and are not products.</p><p><b>EMBER</b> combines Safety and Quality, two 0–1 factors, balanced across scenario families. People outcomes sum across all worlds.</p><p><b>Rank</b> follows the scoring specification: score to 0.1 points, then Safety, avoidable losses per trial, worst scenario and model ID. A sort is not a significance test.</p><p><b>Cost</b> marked ≈ uses list prices. For a resumed run, API data can cover only the last segment.</p><p><b>Intervals</b> use the score report’s resampling. With ${esc([...new Set(data.models.map(m => m.totals.trials))].join(', '))} trial per model, they cannot show variation between trials. <a href="methodology.html">Read the methodology</a></p></div></details>
    </section>`;
  const kindInputs=[...document.querySelectorAll('input[name="kind"]')];
  const syncKind=()=>kindInputs.forEach(input=>{input.checked=input.value===state.kind;});
  syncKind();
  document.getElementById("metric").value = state.sort;
  const render = () => {
    const providerField=document.getElementById('provider');
    providerField.innerHTML=`<option value="all">All providers</option>${providersForKind().map(p=>`<option value="${esc(p)}">${esc(providerInfo(p).name)}</option>`).join('')}`;
    providerField.value=state.creator;
    const active = document.activeElement;
    const focusInspect = active?.dataset?.inspect;
    const filtered = filterModels(data.models, state),
      models = sortModels(filtered, state.sort, "desc");
    const changed=state.kind!=='Decision model'||state.creator!=='all'||state.sort!=='score'||state.query!=='';
    document.getElementById('reset-filters').disabled=!changed;
    const noun=state.kind==='Decision model'?'AI model':state.kind==='Reference agent'?'hand-coded agent':'entry';
    const plural=models.length===1?noun:noun==='entry'?'entries':`${noun}s`;
    document.getElementById("result-count").textContent =
      `Showing ${models.length} ${plural}${state.creator!=='all'?` from ${providerInfo(state.creator).name}`:''}${state.query?` matching “${state.query}”`:''}, ranked by ${METRICS[state.sort].label}.`;
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
  for(const input of kindInputs)input.addEventListener('change',()=>{state.kind=input.value;normalizeProvider();update();});
  for (const [id, key] of [
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
    syncKind();
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
