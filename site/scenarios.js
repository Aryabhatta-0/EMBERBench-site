import { editorHeader, disclosure } from "./workspace.js?v=20261028-mobile-2";
import {
  loadResults,
  shell,
  esc,
  fmt,
  count,
  ratio,
  modelLink,
  kindBadge,
  metricCard,
  table,
  errorPage,
  REPO,
  scenarioName,
} from "./common.js?v=20261028-mobile-2";
import { filterModels, finite, worldKey } from "./analytics.js?v=20261028-mobile-2";
import { heatmap } from "./charts.js";

// Descriptions and fire-model labels come from docs/scenario-suite.md.
// Populations, world counts, scores, and ranks come only from generated results.
const SCENARIO_METADATA = {
  "v1-pub-01-single-exit-sparse": {
    title: "One exit, few people",
    fire: "Deterministic",
    description:
      "Walk each person to the only exit before a slow fire arrives. This control scenario diagnoses basic movement, valid actions, and shortest-path navigation.",
  },
  "v1-pub-02-single-exit-dense": {
    title: "One exit, crowded room",
    fire: "Deterministic",
    description:
      "Drain a packed room through one exit as fire approaches from behind the crowd. The challenge is queue ordering, collision avoidance, and using the exit’s one-person-per-step capacity.",
  },
  "v1-pub-03-corridor-bottleneck": {
    title: "Narrow corridor bottleneck",
    fire: "Deterministic",
    description:
      "Feed the crowd into a one-cell-wide corridor before fire reaches its entrance. Every route shares the same cells, so sequencing through restricted geometry decides the outcome.",
  },
  "v1-pub-04-unequal-exits": {
    title: "Exits at unequal distances",
    fire: "Deterministic",
    description:
      "Choose between exits with substantially different path distances. This isolates exit selection by path distance without a queue or fire trap.",
  },
  "v1-pub-05-central-ignition": {
    title: "Fire starts in the middle",
    fire: "Deterministic",
    description:
      "Move around a central fire front that grows toward people in every direction. This diagnoses hazard-aware routing around an expanding front.",
  },
  "v1-pub-06-threatened-exit": {
    title: "The nearest exit is threatened",
    fire: "Deterministic",
    description:
      "Judge who can still reach the nearest exit before it burns and send others to the far exit. The challenge is predicting exit loss and deciding when to commit or switch.",
  },
  "v1-pub-07-multiple-ignitions": {
    title: "Several fires at once",
    fire: "Deterministic",
    description:
      "Pass between separate growing fire fronts before they merge. This diagnoses reasoning about several hazard sources at the same time.",
  },
  "v1-pub-08-maze-deceptive-exit": {
    title: "Maze with a misleading exit",
    fire: "Deterministic",
    description:
      "Route through a serpentine maze where the straight-line-nearest exit is far away by path. This separates navigation around walls from straight-line heuristics.",
  },
  "v1-pub-09-crowd-100-split-flow": {
    title: "Large crowd, split flow",
    fire: "Deterministic",
    description:
      "Distribute a large crowd across the available exits. Most people start nearest to one exit, where waiting takes longer than walking to another. This diagnoses coordination at scale and flow allocation.",
  },
  "v1-pub-10-route-invalidation": {
    title: "A planned route becomes unsafe",
    fire: "Stochastic",
    description:
      "Use or abandon a short corridor that stochastic fire may cut after people commit to it. A longer route stays open. This diagnoses replanning after route invalidation and decisions under stochastic spread.",
  },
};

const metadata = (id) =>
  SCENARIO_METADATA[id] ?? {
    title: scenarioName(id),
    fire: "Not documented",
    description: "No public scenario description is included in this portal.",
  };
const scenarioScore = (model, id) => model.scenarios.find((s) => s.name === id);
const sourceLink = (id) =>
  `docs/scenario-suite.html#${encodeURIComponent(id)}`;

function numericOrder(a, b, direction = "desc") {
  if (!finite(a) && !finite(b)) return 0;
  if (!finite(a)) return 1;
  if (!finite(b)) return -1;
  return (direction === "asc" ? 1 : -1) * (a - b);
}

async function main() {
  const data = await loadResults();
  shell(data, "scenarios");
  const ids = [
    ...new Set(data.models.flatMap((m) => m.scenarios.map((s) => s.name))),
  ].sort();
  if (!ids.length)
    throw new Error("No scenario results are present in the generated data.");

  const episodes = data.models.flatMap((m) => m.episodes ?? []);
  const populations = (id) =>
    [
      ...new Set(
        episodes
          .filter((e) => e.scenario_id === id)
          .map((e) => e.population)
          .filter(finite),
      ),
    ].sort((a, b) => a - b);
  const populationText = (id) => populations(id).map(count).join(" / ") || "—";
  const populationValue = (id) =>
    populations(id).length === 1 ? populations(id)[0] : null;
  const worldCount = (id) =>
    new Set(episodes.filter((e) => e.scenario_id === id).map(worldKey)).size;
  const params = new URLSearchParams(location.search);
  const state = {
    model:data.models.some(m=>m.id===params.get('model'))?params.get('model'):null,
    scenario: ids.includes(params.get("scenario"))
      ? params.get("scenario")
      : ids[0],
    kind: ["Decision model", "Reference agent"].includes(params.get("kind"))
      ? params.get("kind")
      : "all",
    query: params.get("q") ?? "",
    sort: "score",
    direction: "desc",
    modelOrder: "scenario",
    scenarioOrder: "canonical",
  };

  document.getElementById("main").innerHTML = `
    ${editorHeader('Scenarios', `${ids.length} public challenges, one shared evaluation protocol.`)}
    <div class="scenario-studio"><nav class="challenge-nav" aria-label="Choose a challenge"><span class="guide-nav-label">Public scenarios</span>${ids.map((id,i) => `<button type="button" data-challenge="${esc(id)}" aria-pressed="${id === state.scenario}">${esc(metadata(id).title)}</button>`).join('')}</nav><div class="scenario-canvas">
    <section class="scenario-introduction" aria-labelledby="explore-title">
      <div class="section-head"><h2 id="explore-title">Explore a scenario</h2><span class="badge">Public development suite</span></div>
      <div class="toolbar">
        <label class="field">Scenario<select id="scenario-select">${ids.map((id) => `<option value="${esc(id)}">${esc(metadata(id).title)}</option>`).join("")}</select></label>
        <label class="field">Entry type<select id="scenario-kind"><option value="all">All entries</option><option>Decision model</option><option>Reference agent</option></select></label>
        <label class="field">Search models<input type="search" id="scenario-search" placeholder="Model name or provider" value="${esc(state.query)}"></label>
      </div>
      <div id="scenario-summary" aria-live="polite"></div>
    </section>
    <section class="panel" aria-labelledby="ranking-title">
      <div class="section-head"><div><h2 id="ranking-title">Scenario ranking</h2><p class="muted" id="ranking-description"></p></div><span class="badge">EMBER Score ↑</span></div>
      <div id="scenario-ranking"></div>
      <p class="note">Select a column heading to sort. Scenario ranks compare the displayed entries on the selected scenario; equal scores share a rank. Differences are descriptive and do not establish statistical significance. Safety is a 0–1 factor; higher is better.</p>
    </section>
    <section class="panel" aria-labelledby="matrix-title">
      <div class="section-head"><div><h2 id="matrix-title">Scenario × model performance</h2><p class="muted">All public challenges side by side. Darker cells indicate higher EMBER Scores; exact values remain visible.</p></div></div>
      <div class="toolbar">
        <label class="field">Order models<select id="matrix-model-order"><option value="scenario">Selected scenario score ↓</option><option value="overall">Overall EMBER Score ↓</option><option value="name">Model name A–Z</option></select></label>
        <label class="field">Order scenarios<select id="matrix-scenario-order"><option value="canonical">Suite order</option><option value="name">Scenario name A–Z</option><option value="population">Population ↓</option><option value="mean">Displayed models’ mean score ↑</option></select></label>
      </div>
      <p id="matrix-count" class="muted" aria-live="polite"></p>
      <div id="scenario-matrix"></div>
      <p class="note">Scenario scores average the applicable worlds for that scenario. The overall score additionally balances primary families, so the matrix’s cells are not an alternative overall ranking. Missing scores are shown as —.</p>
    </section>
    <section class="panel" aria-labelledby="catalogue-title">
      <div class="section-head"><div><h2 id="catalogue-title">The public diagnostic suite</h2><p class="muted">Descriptions and fire-model labels follow the public scenario documentation. Populations and scheduled world counts come from generated episode evidence.</p></div></div>
      <div id="scenario-catalogue"></div>
      <p class="note">Population counts people once within each scenario, not once per world, trial, or model. Several fire worlds reuse the same starting population. A deterministic environment does not imply that a model’s actions are deterministic.</p>
    </section></div></div>`;

  const canvas = document.querySelector(".scenario-canvas");
  const intro=canvas.querySelector('.scenario-introduction');
  const focusResult=document.createElement('div');focusResult.id='world-model-result';document.getElementById('scenario-summary').after(focusResult);
  intro.append(intro.querySelector('.toolbar'));
  document.getElementById('scenario-select').closest('.field').classList.add('scenario-phone-choice');
  document.getElementById('scenario-summary').before(document.getElementById('scenario-select').closest('.field'));
  const filters=disclosure(intro.querySelector('.toolbar'),'Filter models');filters.classList.add('scenario-filters');intro.append(filters);
  const ranking = canvas.querySelector("[aria-labelledby=ranking-title]");
  ranking.querySelector('.section-head').insertAdjacentHTML('beforeend', '<button type="button" class="button scenario-columns" aria-pressed="false">More columns</button>');
  document.querySelector('.scenario-columns').addEventListener('click', e => {
    const expanded = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed',String(expanded)); e.currentTarget.textContent = expanded ? 'Fewer columns' : 'More columns';
    document.getElementById('scenario-ranking').dataset.expanded = String(expanded);
  });
  const matrix = canvas.querySelector("[aria-labelledby=matrix-title]");
  const catalogue = canvas.querySelector("[aria-labelledby=catalogue-title]");
  canvas.append(disclosure(matrix,'Across all scenarios'));
  canvas.append(disclosure(catalogue,"The full diagnostic suite"));
  document.querySelectorAll("[data-challenge]").forEach(button => button.addEventListener("click", () => {
    document.getElementById("scenario-select").value = button.dataset.challenge;
    document.getElementById("scenario-select").dispatchEvent(new Event("change",{bubbles:true}));
  }));
  document.getElementById("scenario-select").value = state.scenario;
  document.getElementById("scenario-kind").value = state.kind;

  const meanScore = (models, id) => {
    const values = models
      .map((m) => scenarioScore(m, id)?.score)
      .filter(finite);
    return values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : null;
  };
  const sortByScenario = (models) =>
    [...models].sort(
      (a, b) =>
        numericOrder(
          scenarioScore(a, state.scenario)?.score,
          scenarioScore(b, state.scenario)?.score,
        ) ||
        a.name.localeCompare(b.name) ||
        a.id.localeCompare(b.id),
    );
  const scenarioOrder = (models) =>
    [...ids].sort((a, b) => {
      if (state.scenarioOrder === "name")
        return metadata(a).title.localeCompare(metadata(b).title);
      if (state.scenarioOrder === "population")
        return (
          numericOrder(populationValue(a), populationValue(b)) ||
          a.localeCompare(b)
        );
      if (state.scenarioOrder === "mean")
        return (
          numericOrder(meanScore(models, a), meanScore(models, b), "asc") ||
          a.localeCompare(b)
        );
      return a.localeCompare(b);
    });

  function render() {
    const models = filterModels(data.models, {
      query: state.query,
      kind: state.kind,
    });
    const selected = metadata(state.scenario);
    document.querySelectorAll('[data-challenge]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.challenge === state.scenario)));
    const choices=document.querySelector('.challenge-nav'),chosen=choices.querySelector('[aria-pressed="true"]');
    if(chosen&&choices.offsetParent&&choices.scrollHeight>choices.clientHeight){if(chosen.offsetTop<choices.scrollTop)choices.scrollTop=chosen.offsetTop;else if(chosen.offsetTop+chosen.offsetHeight>choices.scrollTop+choices.clientHeight)choices.scrollTop=chosen.offsetTop+chosen.offsetHeight-choices.clientHeight;}
    const byScore = sortByScenario(models);
    const best = byScore.find((m) =>
      finite(scenarioScore(m, state.scenario)?.score),
    );
    const focused=data.models.find(m=>m.id===state.model)||byScore.find(m=>m.kind==='Decision model');
    document.getElementById("scenario-summary").innerHTML = `
      <div class="section-head"><h2>${esc(selected.title)}</h2><span class="badge">${esc(selected.fire)} fire</span></div>
      <p class="scenario-description">${esc(selected.description)}</p>
      <p class="scenario-world-facts">${esc(populationText(state.scenario))} people · ${count(worldCount(state.scenario))} scheduled ${worldCount(state.scenario)===1?'world':'worlds'} · <a href="${sourceLink(state.scenario)}">Source definition</a></p>`;
    focusResult.innerHTML=focused?`<div><span>${focused.kind === 'Decision model' ? 'Published AI-model evidence' : 'Published reference-agent evidence'}</span><p>${esc(focused.name)} <strong>${fmt(scenarioScore(focused,state.scenario)?.score)}</strong><span>EMBER / 100 on this scenario</span></p></div><a class="text-action" href="model.html?id=${encodeURIComponent(focused.id)}&scenario=${encodeURIComponent(state.scenario)}">Inspect this result<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a>`:'';

    document.getElementById("ranking-description").textContent =
      `${selected.title}. Higher scores are better; ranks refer to this scenario and the current filters.`;
    const sortValue = (model) =>
      state.sort === "name"
        ? model.name
        : scenarioScore(model, state.scenario)?.[state.sort];
    const ranked = [...models].sort((a, b) => {
      if (state.sort === "name")
        return (
          (state.direction === "asc" ? 1 : -1) * a.name.localeCompare(b.name) ||
          a.id.localeCompare(b.id)
        );
      return (
        numericOrder(sortValue(a), sortValue(b), state.direction) ||
        a.name.localeCompare(b.name) ||
        a.id.localeCompare(b.id)
      );
    });
    const rank = (model) => {
      const score = scenarioScore(model, state.scenario)?.score;
      return finite(score)
        ? 1 +
            models.filter(
              (m) =>
                finite(scenarioScore(m, state.scenario)?.score) &&
                scenarioScore(m, state.scenario).score > score,
            ).length
        : null;
    };
    document.getElementById("scenario-ranking").innerHTML = models.length
      ? table(
          [
            "Scenario rank",
            "Model",
            "Type",
            "EMBER ↑",
            "Safety ↑",
            "Worst world ↑",
            "Worlds",
          ],
          ranked.map((model) => {
            const result = scenarioScore(model, state.scenario);
            return [
              esc(rank(model) ?? "—"),
              modelLink(model),
              kindBadge(model),
              fmt(result?.score),
              ratio(result?.safety),
              fmt(result?.worst),
              count(result?.episodes),
            ];
          }),
          `${selected.title}: descriptive scenario ranking`,
        )
      : '<div class="empty"><h3>No matching models</h3><p>Change the entry type or search text to see scenario results.</p></div>';

    const sortable = [
      [1, "name", "Model"],
      [3, "score", "EMBER ↑"],
      [4, "safety", "Safety ↑"],
      [5, "worst", "Worst world ↑"],
    ];
    const headers = document.querySelectorAll("#scenario-ranking thead th");
    for (const [index, key, label] of sortable) {
      const header = headers[index];
      if (!header) continue;
      header.setAttribute(
        "aria-sort",
        state.sort === key
          ? state.direction === "asc"
            ? "ascending"
            : "descending"
          : "none",
      );
      header.innerHTML = `<button type="button" data-scenario-sort="${key}">${esc(label)}${state.sort === key ? (state.direction === "asc" ? " ▴" : " ▾") : ""}</button>`;
      header.querySelector("button").addEventListener("click", () => {
        state.direction =
          state.sort === key
            ? state.direction === "asc"
              ? "desc"
              : "asc"
            : key === "name"
              ? "asc"
              : "desc";
        state.sort = key;
        render();
        document
          .querySelector(`[data-scenario-sort="${key}"]`)
          ?.focus({ preventScroll: true });
      });
    }

    const orderedScenarios = scenarioOrder(models);
    const matrixModels =
      state.modelOrder === "name"
        ? [...models].sort(
            (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
          )
        : state.modelOrder === "overall"
          ? [...models].sort(
              (a, b) =>
                numericOrder(a.score, b.score) || a.id.localeCompare(b.id),
            )
          : byScore;
    document.getElementById("matrix-count").textContent =
      `${models.length} entries × ${ids.length} scenarios. Model and scenario orders are descriptive.`;
    document.getElementById("scenario-matrix").innerHTML = models.length
      ? heatmap(matrixModels, orderedScenarios)
      : '<p class="empty">No models match the current filters.</p>';
    document.getElementById("scenario-catalogue").innerHTML = table(
      [
        "Scenario",
        "Diagnostic challenge",
        "Population",
        "Fire model",
        "Frozen worlds",
        "Mean displayed score ↑",
      ],
      orderedScenarios.map((id) => [
        `<a data-scenario="${esc(id)}" href="?scenario=${encodeURIComponent(id)}" ${id === state.scenario ? 'aria-current="true"' : ""}>${esc(metadata(id).title)}</a><small class="model-provider"><code>${esc(id)}</code></small>`,
        `${esc(metadata(id).description)} <a href="${sourceLink(id)}">Source ↗</a>`,
        esc(populationText(id)),
        esc(metadata(id).fire),
        count(worldCount(id)),
        fmt(meanScore(models, id)),
      ]),
      "Public scenario definitions, generated populations, and descriptive mean model scores",
    );
    document.querySelectorAll("[data-scenario]").forEach((link) =>
      link.addEventListener("click", (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        state.scenario = link.dataset.scenario;
        document.getElementById("scenario-select").value = state.scenario;
        update();
        const choice=matchMedia('(max-width:700px)').matches?document.getElementById('scenario-select'):document.querySelector(`[data-challenge="${CSS.escape(state.scenario)}"]`);
        choice?.focus({preventScroll:true});
        document
          .getElementById("scenario-summary")
          .scrollIntoView({ block: "start", behavior: "instant" });
      }),
    );
  }

  function update() {
    const query = new URLSearchParams({ scenario: state.scenario });
    if(state.model)query.set('model',state.model);
    if (state.kind !== "all") query.set("kind", state.kind);
    if (state.query) query.set("q", state.query);
    history.replaceState(null, "", `?${query}`);
    render();
  }
  document
    .getElementById("scenario-select")
    .addEventListener("change", (event) => {
      state.scenario = event.target.value;
      update();
    });
  document
    .getElementById("scenario-kind")
    .addEventListener("change", (event) => {
      state.kind = event.target.value;
      update();
    });
  document
    .getElementById("scenario-search")
    .addEventListener("input", (event) => {
      state.query = event.target.value;
      update();
    });
  document
    .getElementById("matrix-model-order")
    .addEventListener("change", (event) => {
      state.modelOrder = event.target.value;
      render();
    });
  document
    .getElementById("matrix-scenario-order")
    .addEventListener("change", (event) => {
      state.scenarioOrder = event.target.value;
      render();
    });
  render();
  const revealHash=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=document.getElementById(id);if(!target)return;for(let node=target;node&&node!==canvas;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));};
  addEventListener('hashchange',revealHash);revealHash();
}

main().catch(errorPage);
