import { editorHeader } from "./workspace.js";
import {
  loadResults,
  shell,
  esc,
  fmt,
  count,
  duration,
  costText,
  modelLink,
  kindBadge,
  ciText,
  getSelection,
  selectionBar,
  bindSelection,
  provider,
  providerInfo,
  providerChip,
  rankOf,
  errorPage,
} from "./common.js";
import {
  METRICS,
  filterModels,
  sortModels,
  finite,
  leaderboardOrder,
} from "./analytics.js";

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
    view: ["scores", "people", "api", "all"].includes(params.get("view")) ? params.get("view") : "scores",
    kind: params.get("kind") ?? "all",
    creator: params.get("provider") ?? "all",
    sort: params.get("metric") ?? "score",
    direction: params.get("direction") ?? "desc",
  };
  if (!Object.hasOwn(METRICS, state.sort)) state.sort = "score";
  if (!["asc", "desc"].includes(state.direction)) state.direction = "desc";
  document.getElementById("main").innerHTML =
    `${editorHeader('Find your next model.', 'Compare decision policies on the same frozen worlds.', `<strong>${data.models.length}</strong><span>evaluated policies</span><a href="methodology.html">How to read the results</a>`)}
    <section class="leaderboard-workspace" aria-label="Model explorer">
      <div class="explorer-search"><label class="field search-field">Search the evaluation<input id="search" type="search" placeholder="Model name or provider" value="${esc(state.query)}"></label><label class="field">Entry type<select id="kind"><option value="all">All entries</option><option>Decision model</option><option>Reference agent</option></select></label><label class="field">Provider<select id="provider"><option value="all">All providers</option>${[...new Set(data.models.map(provider))].sort().map(p => `<option value="${esc(p)}">${esc(providerInfo(p).name)}</option>`).join('')}</select></label><button class="button small" id="reset-filters" type="button">Reset filters</button></div>
      <div class="explorer-views"><div class="metric-views" role="group" aria-label="Metrics displayed">${[['scores','Scores'],['people','People'],['api','API usage'],['all','All metrics']].map(([id,label]) => `<button type="button" data-metric-view="${id}" aria-pressed="${state.view === id}">${label}</button>`).join('')}</div><label class="field sort-field">Sort by<select id="metric">${columns.map(([key,label]) => `<option value="${key}">${label}</option>`).join('')}</select></label></div>
      <p id="result-count" class="muted" aria-live="polite"></p><div id="selection"></div><p id="selection-status" class="sr-only" role="status"></p><div id="leaderboard"></div>
      <div class="explorer-foot"><p>Select 2–4 models to compare. Scores run from 0 to 100; higher is better.</p><details class="evidence-detail"><summary>Reading the evidence<span aria-hidden="true">+</span></summary><div class="evidence-copy"><p>Rank follows the scoring specification: score rounded to 0.1 points, then Safety, avoidable losses per trial, worst scenario, and model ID. Custom sorts do not redefine rank. Sorting order is not statistical significance.</p><p>Safety / Quality: 0–1 factors. Evacuated and avoidable losses sum across worlds and trials. ≈ marks list-price API cost estimates. API metadata may cover only the recorded invocation of a resumed run; missing API data is never ranked as zero.</p><p>Reported 95% CIs use the score report’s resampling procedure. Each published model has ${esc([...new Set(data.models.map(m => m.totals.trials))].join(', '))} trial in this snapshot; these CIs cannot capture unobserved between-trial variability.</p></div></details></div>
    </section>`;
  for (const [id, key] of [
    ["kind", "kind"],
    ["provider", "creator"],
    ["metric", "sort"],
  ])
    document.getElementById(id).value = state[key];
  const render = () => {
    const oldScroll = document.querySelector(".leaderboard-scroll");
    const scroll = {
      left: oldScroll?.scrollLeft ?? 0,
      top: oldScroll?.scrollTop ?? 0,
    };
    const active = document.activeElement;
    const focusSort = active?.dataset?.sort;
    const focusModel = active?.hasAttribute("data-select-model")
      ? active.value
      : null;
    const filtered = filterModels(data.models, state),
      models =
        state.sort === "score" && state.direction === "desc"
          ? leaderboardOrder(filtered)
          : sortModels(filtered, state.sort, state.direction),
      ids = getSelection(data);
    document.getElementById("result-count").textContent =
      `${models.length} of ${data.models.length} entries · ${METRICS[state.sort].label} ${state.direction === "asc" ? "ascending" : "descending"}`;
    document.getElementById("selection").innerHTML = selectionBar(data);
    const visibleKeys = {scores:['score','safety','quality'],people:['score','evacuated','casualties','stranded','blocked'],api:['score','cost','latency','requests','input'],all:columns.map(([key]) => key)}[state.view];
    const shownColumns = columns.filter(([key]) => visibleKeys.includes(key));
    const th = (key, label) =>
      `<th scope="col" aria-sort="${state.sort === key ? (state.direction === "asc" ? "ascending" : "descending") : "none"}"><button data-sort="${key}" data-tip="${esc(METRICS[key].help)}">${esc(label)} <span>${METRICS[key].direction === "higher" ? "↑" : "↓"}</span></button></th>`;
    document.getElementById("leaderboard").innerHTML =
      `<div class="table-wrap leaderboard-scroll" role="region" aria-label="Sortable public development leaderboard" tabindex="0"><table class="leaderboard-table focused-table" data-lens="${state.view}"><caption class="sr-only">Public development results. Choose two to four models to compare. Confidence intervals are reported below each score.</caption><thead><tr><th scope="col"><span>Select</span></th><th scope="col">Rank</th><th scope="col">Model</th>${shownColumns.map(([key,label]) => th(key,label)).join('')}</tr></thead><tbody>${models.map(m => `<tr class="${ids.includes(m.id) ? 'selected' : ''}" style="--provider-color:${providerInfo(m).color}"><td><label class="compare-check"><input type="checkbox" data-select-model value="${esc(m.id)}" aria-label="Compare ${esc(m.name)}" ${ids.includes(m.id) ? 'checked' : ''}></label></td><td class="num rank">${rankOf(data.models,m)}</td><th scope="row" class="model-cell"><span class="mobile-rank">Rank ${rankOf(data.models,m)}</span>${modelLink(m)}<span class="model-provider">${providerChip(m)}<span class="model-kind">${esc(m.kind)}</span></span></th>${shownColumns.map(([key]) => `<td class="num ${key === 'score' ? 'score-cell' : ''}">${key === 'score' ? `<b>${value(m,key)}</b><small class="score-confidence">95% CI ${ciText(m)}</small>` : esc(value(m,key))}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${shownColumns.length + 3}"><div class="empty"><h2>No matching models.</h2><p>Try another search or reset filters to explore the full evaluation.</p></div></td></tr>`}</tbody></table></div>`;
    for (const b of document.querySelectorAll("[data-sort]"))
      b.addEventListener("click", () => {
        const key = b.dataset.sort;
        state.direction =
          state.sort === key
            ? state.direction === "desc"
              ? "asc"
              : "desc"
            : METRICS[key].direction === "higher"
              ? "desc"
              : "asc";
        state.sort = key;
        document.getElementById("metric").value = key;
        update();
      });
    bindSelection(data, render);
    const nextScroll = document.querySelector(".leaderboard-scroll");
    nextScroll.scrollLeft = scroll.left;
    nextScroll.scrollTop = scroll.top;
    if (focusSort)
      document
        .querySelector(`[data-sort="${CSS.escape(focusSort)}"]`)
        ?.focus({ preventScroll: true });
    if (focusModel)
      document
        .querySelector(`[data-select-model][value="${CSS.escape(focusModel)}"]`)
        ?.focus({ preventScroll: true });
  };
  const update = () => {
    const p = new URLSearchParams({
      q: state.query,
      view: state.view,
      kind: state.kind,
      provider: state.creator,
      metric: state.sort,
      direction: state.direction,
    });
    history.replaceState(null, "", `?${p}`);
    render();
  };
  for (const button of document.querySelectorAll('[data-metric-view]')) button.addEventListener('click', () => {
    state.view = button.dataset.metricView;
    document.querySelectorAll('[data-metric-view]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    update();
  });
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
      if (key === "sort")
        state.direction =
          METRICS[state.sort].direction === "higher" ? "desc" : "asc";
      update();
    });
  document.getElementById("reset-filters").addEventListener("click", () => {
    state.query = "";
    state.kind = "all";
    state.creator = "all";
    state.sort = "score";
    state.direction = "desc";
    document.getElementById("search").value = "";
    document.getElementById("kind").value = "all";
    document.getElementById("provider").value = "all";
    document.getElementById("metric").value = "score";
    update();
  });
  render();
}
main().catch(errorPage);
