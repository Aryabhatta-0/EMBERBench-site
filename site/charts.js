import {
  esc,
  fmt,
  modelLink,
  scenarioName,
  table,
  COMPONENTS,
  ratio,
} from "./common.js?v=20261027-boundless-1";
import { finite, METRICS, paretoFrontier, provider, providerInfo } from "./analytics.js";

export const legend = () =>
  `<div class="chart-legend"><span><i class="legend-dot decision"></i>Decision model</span><span><i class="legend-dot reference"></i>Reference agent (square)</span><span>Hover or focus marks for values. Select a name to open its profile.</span></div>`;
export function scoreBars(models, selected = "") {
  return `<div class="bar-chart">${models.map((m) => `<a class="bar-row ${m.kind === "Reference agent" ? "reference" : "decision"} ${m.id === selected ? "selected" : ""}" style="--provider-color:${providerInfo(m).color}" href="model.html?id=${encodeURIComponent(m.id)}" data-tip="${esc(`${m.name}: EMBER ${fmt(m.score)}; 95% CI ${m.ci?.map((v) => fmt(v)).join("–") ?? "—"}. ${m.kind}.`)}"><span class="bar-label">${esc(m.name)}</span><span class="bar-track"><span class="bar-fill" style="width:${finite(m.score) ? m.score : 0}%"></span>${m.ci?.every(finite) ? `<span class="ci-range" style="left:${m.ci[0]}%;width:${m.ci[1] - m.ci[0]}%"></span>` : ""}</span><strong class="bar-value">${fmt(m.score)}</strong></a>`).join("")}</div><div class="bar-axis"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div><p class="note">EMBER Score ↑ · 0–100 points. Whiskers show reported 95% CIs, where available.</p>`;
}
export function providerComparison(models, key = "score") {
  const settings = {
    score: { label: "Best EMBER Score", better: "higher", value: (m) => m.score, format: (m) => fmt(m.score) },
    cost: { label: "Lowest recorded API cost", better: "lower", value: (m) => m.api?.cost_usd, format: (m) => `$${fmt(m.api?.cost_usd, 4)}${m.api?.cost_source === "list price" ? " ≈" : ""}` },
    latency: { label: "Lowest mean decision latency", better: "lower", value: (m) => m.api?.mean_act_latency_s, format: (m) => `${fmt(m.api?.mean_act_latency_s)} s` },
  }[key] ?? { label: "Best EMBER Score", better: "higher", value: (m) => m.score, format: (m) => fmt(m.score) };
  const groups = new Map();
  for (const model of models.filter((m) => m.kind === "Decision model")) {
    const id = provider(model);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(model);
  }
  const rows = [...groups].map(([id, entries]) => {
    const available = entries.filter((m) => finite(settings.value(m)));
    if (!available.length) return null;
    available.sort((a, b) => settings.better === "higher" ? settings.value(b) - settings.value(a) : settings.value(a) - settings.value(b));
    return { id, entries, best: available[0], value: settings.value(available[0]), brand: providerInfo(id) };
  }).filter(Boolean).sort((a, b) => settings.better === "higher" ? b.value - a.value : a.value - b.value);
  if (!rows.length) return '<p class="empty">No providers have a recorded value for this metric.</p>';
  const scale = key === "score" ? 100 : Math.max(...rows.map((row) => row.value), 1e-9) * 1.08;
  return `<div class="provider-chart" role="list" aria-label="${esc(settings.label)} by provider">${rows.map((row) => {
    const width = Math.max(1, (row.value / scale) * 100);
    const tip = `${row.brand.name}: ${settings.format(row.best)} for ${row.best.name}; ${row.entries.length} evaluated ${row.entries.length === 1 ? "model" : "models"}.`;
    return `<a class="provider-row" role="listitem" href="leaderboard.html?provider=${encodeURIComponent(row.id)}" style="--provider-color:${row.brand.color}" data-tip="${esc(tip)}"><span class="provider-mark" aria-hidden="true">${esc(row.brand.mark)}</span><span class="provider-name">${esc(row.brand.name)}<small>${row.entries.length} ${row.entries.length === 1 ? "model" : "models"}</small></span><span class="provider-track"><i style="width:${width}%"></i></span><b>${esc(settings.format(row.best))}</b></a>`;
  }).join("")}</div><p class="note">${key === "score" ? "Higher is better." : "Lower is better; bars show the recorded value on a shared scale."} Best recorded model per provider in this public snapshot. Provider counts and coverage differ; this is not a provider-wide estimate.</p>`;
}

export function metricBars(models, key) {
  const metric = {
    latency: {
      label: "Mean decision latency",
      get: (m) => m.api?.mean_act_latency_s,
      format: (value) => value < 1 ? `${Math.round(value * 1000)} ms` : `${fmt(value, 2)} s`,
      note: "Mean time for one API act call. Lower is faster; this is not total run time.",
    },
    wall: {
      label: "Recorded wall time",
      get: (m) => m.api?.wall_clock_s,
      format: (value) => {
        const seconds = Math.round(value);
        const minutes = Math.floor(seconds / 60);
        return minutes ? `${minutes}m ${String(seconds % 60).padStart(2, "0")}s` : `${seconds}s`;
      },
      note: "End-to-end time recorded for the run. It can include provider waits; resumed runs may cover only the final segment.",
    },
  }[key];
  if (!metric) return "";
  const rows = models
    .filter((m) => finite(metric.get(m)))
    .sort((a, b) => metric.get(a) - metric.get(b) || a.id.localeCompare(b.id));
  if (!rows.length) return '<p class="empty">No recorded values for this metric.</p>';
  const max = Math.max(...rows.map(metric.get), 1e-9);
  return `<div class="bar-chart metric-bars" role="list" aria-label="${esc(metric.label)} ranked from lowest to highest">${rows.map((m) => {
    const value = metric.get(m);
    const tip = `${m.name}: ${metric.format(value)} ${metric.note}`;
    return `<a class="bar-row decision" role="listitem" style="--provider-color:${providerInfo(m).color}" href="model.html?id=${encodeURIComponent(m.id)}" data-tip="${esc(tip)}"><span class="bar-label">${esc(m.name)}</span><span class="bar-track"><i class="bar-fill" style="width:${Math.max(1, (value / max) * 100)}%"></i></span><strong class="bar-value">${metric.format(value)}</strong></a>`;
  }).join("")}</div><p class="note">${esc(metric.note)} Bars share a linear scale.</p>`;
}

export function scoreCostQuadrant(models) {
  const rows = models.filter((m) => finite(m.score) && finite(m.api?.cost_usd));
  if (!rows.length) return '<p class="empty">No models have both a score and a recorded API cost.</p>';
  const median = (values) => {
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  };
  const xMax = Math.max(...rows.map((m) => m.api.cost_usd)) * 1.08;
  const yMin = 0;
  const yMax = 100;
  const xLeft = 76, xRight = 628, yTop = 46, yBottom = 278;
  const medianCost = median(rows.map((m) => m.api.cost_usd));
  const medianScore = median(rows.map((m) => m.score));
  const X = (v) => xLeft + (v / xMax) * (xRight - xLeft);
  const Y = (v) => yBottom - ((v - yMin) / (yMax - yMin)) * (yBottom - yTop);
  const midX = X(medianCost), midY = Y(medianScore);
  let body = `<rect class="quadrant-ideal" x="${xLeft}" y="${yTop}" width="${midX - xLeft}" height="${midY - yTop}" rx="5"/><line class="chart-grid" x1="${xLeft}" x2="${xRight}" y1="${yBottom}" y2="${yBottom}"/><line class="chart-grid" x1="${xLeft}" x2="${xRight}" y1="${yTop}" y2="${yTop}"/><line class="quadrant-cut" x1="${midX}" x2="${midX}" y1="${yTop}" y2="${yBottom}"/><line class="quadrant-cut" x1="${xLeft}" x2="${xRight}" y1="${midY}" y2="${midY}"/><text class="quadrant-label ideal-label" text-anchor="middle" x="${(xLeft + midX) / 2}" y="${yTop + 18}"><tspan x="${(xLeft + midX) / 2}">IDEAL</tspan><tspan x="${(xLeft + midX) / 2}" dy="12">higher score</tspan><tspan x="${(xLeft + midX) / 2}" dy="12">lower cost</tspan></text><text class="quadrant-label" text-anchor="middle" x="${(midX + xRight) / 2}" y="${yTop + 18}"><tspan x="${(midX + xRight) / 2}">HIGHER SCORE</tspan><tspan x="${(midX + xRight) / 2}" dy="12">higher cost</tspan></text><text class="quadrant-label" text-anchor="middle" x="${(xLeft + midX) / 2}" y="${yBottom - 18}"><tspan x="${(xLeft + midX) / 2}">LOWER SCORE</tspan><tspan x="${(xLeft + midX) / 2}" dy="12">lower cost</tspan></text><text class="quadrant-label" text-anchor="middle" x="${(midX + xRight) / 2}" y="${yBottom - 18}"><tspan x="${(midX + xRight) / 2}">LOWER SCORE</tspan><tspan x="${(midX + xRight) / 2}" dy="12">higher cost</tspan></text>`;
  for (let i = 0; i <= 4; i++) {
    const x = xLeft + (i / 4) * (xRight - xLeft);
    const y = yBottom - (i / 4) * (yBottom - yTop);
    body += `<text class="chart-axis" x="${x}" y="${yBottom + 18}" text-anchor="middle">$${fmt((xMax * i) / 4, 2)}</text><text class="chart-axis" x="${xLeft - 10}" y="${y + 4}" text-anchor="end">${fmt((yMax * i) / 4, 0)}</text>`;
  }
  body += rows.map((m) => {
    const x = X(m.api.cost_usd), y = Y(m.score), brand = providerInfo(m);
    const tip = `${m.name}: EMBER Score ${fmt(m.score)}; API cost $${fmt(m.api.cost_usd, 4)}${m.api.cost_source === "list price" ? " (estimated from list price)" : ""}.`;
    return `<a class="chart-point decision" style="--provider-color:${brand.color}" href="model.html?id=${encodeURIComponent(m.id)}" data-tip="${esc(tip)}" aria-label="${esc(tip)}"><circle cx="${x}" cy="${y}" r="6"/></a>`;
  }).join("");
  return `<div class="chart-scroll"><svg class="chart-svg quadrant-svg" viewBox="0 0 680 340" role="group" aria-label="Four quadrant comparison of EMBER score versus API cost; upper left is ideal for high score and low cost">${body}<text class="chart-axis axis-title" x="352" y="326" text-anchor="middle">API cost per recorded run · lower is better</text><text class="chart-axis axis-title" transform="translate(17 158) rotate(-90)" text-anchor="middle">EMBER Score · higher is better</text></svg></div><div class="chart-legend"><span><i class="legend-dot decision"></i>Decision model, colored by provider</span><span><i class="legend-zone"></i>Ideal quadrant</span><span>Dashed dividers show the median score and cost for this snapshot.</span></div><p class="note">${rows.length} models with both values. ≈ marks costs estimated from list prices; API cost reflects recorded usage and may cover only a resumed run’s final segment.</p>`;
}

const chartValue = (v, key) =>
  key === "cost"
    ? `$${fmt(v, 4)}`
    : key === "latency"
      ? `${fmt(v)} s`
      : fmt(
          v,
          key === "safety" || key === "quality" || key === "congestion" ? 3 : 2,
        );
export function scatter(models, xKey, yKey = "score", selected = "") {
  const xMetric = METRICS[xKey],
    yMetric = METRICS[yKey];
  const rows = models.filter(
    (m) => finite(xMetric.get(m)) && finite(yMetric.get(m)),
  );
  if (!rows.length)
    return '<p class="empty">No models have both recorded metrics.</p>';
  const xMax = ["safety", "quality", "congestion"].includes(xKey)
    ? 1
    : Math.max(...rows.map(xMetric.get), 1e-6) * 1.12;
  const yMax = ["safety", "quality"].includes(yKey) ? 1 : 100;
  const X = (v) => 64 + (v / xMax) * 560,
    Y = (v) => 270 - (v / yMax) * 230;
  let body = "";
  for (let i = 0; i <= 4; i++) {
    const x = 64 + i * 140,
      y = 270 - i * 57.5;
    body += `<line class="chart-grid" x1="64" x2="624" y1="${y}" y2="${y}"/><text class="chart-axis" x="54" y="${y + 4}" text-anchor="end">${fmt((yMax * i) / 4, yMax === 1 ? 2 : 0)}</text><text class="chart-axis" x="${x}" y="291" text-anchor="middle">${xKey === "cost" ? "$" : ""}${fmt((xMax * i) / 4, xMax < 1 ? 3 : xMax < 10 ? 2 : 0)}</text>`;
  }
  if (
    xKey === "cost" &&
    rows.filter((m) => m.kind === "Decision model").length >= 3
  ) {
    const frontier = paretoFrontier(rows);
    body += `<polyline class="pareto-line" points="${frontier.map((m) => `${X(xMetric.get(m))},${Y(m.score)}`).join(" ")}"/>`;
  }
  body += rows
    .map((m) => {
      const x = X(xMetric.get(m)),
        y = Y(yMetric.get(m)),
        isRef = m.kind === "Reference agent",
        brand = providerInfo(m),
        tip = `${m.name} · ${m.kind}\n${xMetric.label}: ${chartValue(xMetric.get(m), xKey)}\n${yMetric.label}: ${chartValue(yMetric.get(m), yKey)}${xKey === "cost" ? `\nCost source: ${m.api?.cost_source ?? "—"}` : ""}`;
      return `<a href="model.html?id=${encodeURIComponent(m.id)}" class="chart-point ${isRef ? "reference" : "decision"} ${m.id === selected ? "selected" : ""}" style="--provider-color:${brand.color}" data-tip="${esc(tip)}" aria-label="${esc(tip)}">${m.id === selected ? `<circle class="selection-ring" cx="${x}" cy="${y}" r="11"/>` : ""}${isRef ? `<rect x="${x - 5}" y="${y - 5}" width="10" height="10"/>` : `<circle cx="${x}" cy="${y}" r="6"/>`}</a>`;
    })
    .join("");
  return `<div class="chart-scroll"><svg class="chart-svg" viewBox="0 0 680 340" role="group" aria-label="${esc(`${yMetric.label} versus ${xMetric.label}`)}">${body}<text class="chart-axis axis-title" x="344" y="328" text-anchor="middle">${esc(xMetric.label)} ${xMetric.direction === "higher" ? "↑ higher" : "↓ lower"} is better</text><text class="chart-axis axis-title" transform="translate(16 155) rotate(-90)" text-anchor="middle">${esc(yMetric.label)} ↑ higher is better</text></svg></div>${legend()}<p class="note">${rows.length} of ${models.length} entries have both metrics. ${xKey === "cost" ? "Line connects the descriptive score/cost Pareto frontier among decision models. Reported and estimated costs may differ in scope; this is not a price guarantee." : ""}</p><details><summary>View chart data</summary>${table(
    ["Model", xMetric.label, yMetric.label],
    rows.map((m) => [
      modelLink(m),
      esc(chartValue(xMetric.get(m), xKey)),
      esc(chartValue(yMetric.get(m), yKey)),
    ]),
    "Scatter plot values",
  )}</details>`;
}
export function heatmap(models, scenarios = null) {
  const ids = scenarios ?? [
    ...new Set(models.flatMap((m) => m.scenarios.map((s) => s.name))),
  ];
  return table(
    ["Model", ...ids.map(scenarioName)],
    models.map((m) => [
      modelLink(m),
      ...ids.map((id) => {
        const s = m.scenarios.find((s) => s.name === id);
        return finite(s?.score)
          ? `<span class="heat-cell" style="--heat:${s.score / 100}" tabindex="0" data-tip="${esc(`${m.name} · ${scenarioName(id)}: ${fmt(s.score)} points`)}">${fmt(s.score, 1)}</span>`
          : "—";
      }),
    ]),
    "Scenario × model EMBER Score. Higher is better.",
    "heatmap",
  );
}
export function componentChart(models) {
  return `<div class="component-group">${Object.entries(COMPONENTS)
    .map(
      ([key, label]) =>
        `<div><h3>${label}</h3><div class="group-bars">${models
          .map((m, i) => {
            const v = m.components[key]?.value;
            return `<div class="component-bar" tabindex="0" data-tip="${esc(`${m.name}: ${ratio(v)}; defined ${m.components[key]?.defined ?? "—"} of ${m.components[key]?.total ?? "—"} episode trials`)}"><span>${esc(m.name)}</span><span class="bar-track"><span class="bar-fill series-${i}" style="--provider-color:${providerInfo(m).color};width:${finite(v) ? v * 100 : 0}%"></span></span><b>${ratio(v)}</b></div>`;
          })
          .join("")}</div></div>`,
    )
    .join(
      "",
    )}</div><p class="note">All seven component factors are 0–1; higher is better. Undefined components are shown as —, not zero.</p>`;
}
export function differenceChart(paired, a, b) {
  const max = Math.max(1, ...paired.worlds.map((w) => Math.abs(w.difference)));
  return `<p class="note">${esc(a.name)} minus ${esc(b.name)}. Positive favors the first model. This is an unweighted descriptive mean over matched world scores, not the family-balanced EMBER difference or an official paired inference.</p><div class="world-diff">${paired.worlds.map((w) => `<div class="diff-row" tabindex="0" data-tip="${esc(`${scenarioName(w.scenario_id)}, seed ${w.seed}: ${fmt(w.a)} − ${fmt(w.b)} = ${fmt(w.difference)} points`)}"><span>${esc(scenarioName(w.scenario_id))}<small>seed ${esc(w.seed)}</small></span><span class="diff-track"><i class="${w.difference >= 0 ? "positive" : "negative"}" style="left:${w.difference >= 0 ? 50 : 50 - (Math.abs(w.difference) / max) * 49}%;width:${(Math.abs(w.difference) / max) * 49}%"></i></span><b>${w.difference > 0 ? "+" : ""}${fmt(w.difference)}</b></div>`).join("")}</div>`;
}
