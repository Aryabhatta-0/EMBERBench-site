import {siteHeader} from './chrome.js?v=20261031-dawn-1';
import {readComparisonSelection,saveComparisonSelection} from './preferences.js?v=20261031-dawn-1';
import {siteFooter,revealCompanyFooter} from './footer.js?v=20261031-dawn-1';
import {
  provider,
  providerInfo,
  rankOf,
  selectedIds,
  leaderboardOrder,
} from "./analytics.js?v=20261031-dawn-1";

export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const fmt = (v, digits = 2) =>
  Number.isFinite(v) ? v.toFixed(digits) : "—";
export const count = (v) =>
  Number.isFinite(v) ? v.toLocaleString("en-US") : "—";
export const money = (v, estimated = false) =>
  Number.isFinite(v)
    ? `${estimated ? "≈ " : ""}$${v.toFixed(v < 0.01 ? 4 : 2)}`
    : "—";
export const duration = (v) =>
  Number.isFinite(v)
    ? v < 1
      ? `${Math.round(v * 1000)} ms`
      : `${fmt(v, 2)} s`
    : "—";
export const isDecision = (m) => m.kind === "Decision model";
export const ratio = (v) => (Number.isFinite(v) ? fmt(v, 3) : "—");
export const modelLink = (m) =>
  `<a class="model-name" href="model.html?id=${encodeURIComponent(m.id)}">${esc(m.name)}</a>`;
export const providerChip = (m) => {
  const info = providerInfo(m);
  return `<span class="provider-chip" style="--provider-color:${info.color}">${info.logo?`<img class="provider-mark" src="assets/providers/${esc(info.logo)}" width="20" height="20" alt="">`:`<span class="provider-mark" aria-hidden="true">${esc(info.mark)}</span>`}<span>${esc(info.name)}</span></span>`;
};
export const kindBadge = (m) =>
  `<span class="badge ${isDecision(m) ? "decision" : "reference"}">${esc(m.kind)}</span>`;
export const ciText = (m) =>
  m.ci?.every(Number.isFinite) ? `${fmt(m.ci[0])}–${fmt(m.ci[1])}` : "—";
export const costText = (m) =>
  money(m.api?.cost_usd, m.api?.cost_source === "list price");
export const scenarioName = (id) =>
  id
    .replace(/^v1-pub-\d+-/, "")
    .replaceAll("-", " ")
    .replace(/^./, (c) => c.toUpperCase());
export const COMPONENTS = {
  evacuation: "Evacuation",
  casualty: "Casualty penalty",
  stranding: "Stranding penalty",
  time: "Time efficiency",
  hazard: "Hazard avoidance",
  path: "Path efficiency",
  replanning: "Replanning",
};
export const REPO = "https://github.com/Aryabhatta-0/EMBERBench";

export function evaluatedModelName(model) {
  if (!/^(?:typesafe\/)?jev-latest$/.test(model.name)) return model.name;
  const resolved = model.api?.resolved_models;
  const version = resolved?.length === 1 && typeof resolved[0] === 'string'
    ? resolved[0].match(/^(?:typesafe\/)?(jev-\d+\.\d+)(?:\.(\d+))?$/) : null;
  return version ? `typesafe/${version[1]}${version[2] && version[2] !== '0' ? `.${version[2]}` : ''}` : model.name;
}
export async function loadResults() {
  const snapshot = (await import("./data/results.js")).default;
  // Legacy run aliases remain in source evidence and IDs; show the resolved version.
  const data = {...snapshot, models:snapshot.models?.map(m=>({...m,name:evaluatedModelName(m)}))};
  if (!data.models?.length || !data.pack_digest || !data.scoring_version)
    throw new Error("Results data is incomplete.");
  // New builds carry full-precision report ranks. Legacy snapshots predate
  // that field; their safe, unambiguous values use the scoring tie policy.
  if (!data.models.every((m) => Number.isInteger(m.rank)))
    leaderboardOrder(data.models).forEach((m, i) => {
      m.rank = i + 1;
    });
  return data;
}
export function getSelection(data) {
  return selectedIds(readComparisonSelection(), data.models);
}
export function setSelection(ids) {
  saveComparisonSelection(ids);
}
export function selectionBar(data) {
  const ids = getSelection(data);
  return `<div class="selection-bar" data-count="${ids.length}" aria-live="polite"><span><b>${ids.length} of 4</b> selected for comparison</span><a class="button primary" href="compare.html?models=${encodeURIComponent(ids.join(","))}" ${ids.length < 2 ? 'aria-disabled="true" tabindex="-1"' : ""}>Compare models</a><button class="button small" id="clear-selection" type="button">Clear</button><span class="muted">Select 2–4. Ranks refer to this public pack.</span></div>`;
}
export function bindSelection(data, rerender = () => {}) {
  for (const input of document.querySelectorAll("[data-select-model]"))
    input.addEventListener("change", () => {
      let ids = getSelection(data);
      if (input.checked && !ids.includes(input.value)) {
        if (ids.length === 4) {
          input.checked = false;
          document.getElementById("selection-status").textContent =
            "Four models selected. Remove one to choose another.";
          return;
        }
        ids.push(input.value);
      } else ids = ids.filter((id) => id !== input.value);
      setSelection(ids);
      rerender();
    });
  document.getElementById("clear-selection")?.addEventListener("click", () => {
    setSelection([]);
    rerender();
  });
}
export function metricCard(label, value, note = "") {
  return `<div class="metric"><span class="metric-label">${esc(label)}</span><strong class="metric-value">${esc(value)}</strong><span class="metric-note">${esc(note)}</span></div>`;
}
export function section(title, note, body, extra = "") {
  return `<section class="panel ${extra}"><div class="section-head"><div><h2>${esc(title)}</h2>${note ? `<p class="muted">${esc(note)}</p>` : ""}</div></div>${body}</section>`;
}
export function table(headers, rows, caption = "", cls = "") {
  return `<div class="table-wrap" role="region" aria-label="${esc(caption || "Results table")}" tabindex="0"><table class="${cls}">${caption ? `<caption class="sr-only">${esc(caption)}</caption>` : ""}<thead><tr>${headers.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
export function provenance(data, m = null) {
  const fields = [
    ["EnvironmentPack", data.pack_id],
    ["Pack digest", data.pack_digest],
    ["Suite ID", data.suite_id],
    ["Scoring version", data.scoring_version],
    ["Constants digest", data.constants_digest],
    ["Evaluation manifest", data.evaluation_manifest_hash],
    ["Suite hash", data.suite_hash],
    ["Data generator", "tools/build_results_site.py"],
    ["Evaluation date", null],
  ];
  if (m)
    fields.push(
      ["Model ID", m.id],
      ["Trials", m.totals?.trials],
      ["Result digests", m.provenance?.result_digests?.join(", ")],
    );
  return `<dl class="provenance">${fields.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd><code>${esc(v ?? "—")}</code></dd></div>`).join("")}</dl><p class="note">Generated public-development report data. Missing fields are shown as —. No evaluation timestamp is recorded in this data snapshot. Scoring and benchmark results are unchanged.</p>`;
}
export function shell(data, active) {
  if (active === "model") active = "leaderboard";
  const company = active === 'company';
  const main = document.querySelector('main');
  main.classList.add('container');
  if(!document.querySelector('.site-header'))document.body.insertAdjacentHTML('afterbegin',siteHeader(active));
  if(document.body.dataset.footer!=='none'&&!document.querySelector('.site-footer'))main.insertAdjacentHTML('afterend',siteFooter());
  if(['methodology','scenarios','compare','model'].includes(document.body.dataset.page)&&!document.querySelector('.public-evaluation-notice'))main.insertAdjacentHTML('beforebegin','<p class="public-evaluation-notice"><strong>Public development results.</strong> Models may train or tune on these environments. No official hidden-test results are published here. <a href="docs/evaluation-boundary.html">Evaluation scope</a></p>');
  requestAnimationFrame(revealCompanyFooter);addEventListener('hashchange',revealCompanyFooter);
  const header=document.querySelector('.site-header');
  if(header.dataset.bound==='true')return;
  header.dataset.bound='true';
  const navButton = document.querySelector(".nav-toggle");
  const updateOffset = () => {
    const height = Math.ceil(document.querySelector('.site-header').getBoundingClientRect().height);
    document.documentElement.style.setProperty(
      "--header-offset",
      `${height + 14}px`,
    );
    document.documentElement.style.setProperty('--site-header-height', `${height}px`);
    if(main.dataset.loading==='pending')document.documentElement.style.setProperty('--loading-start',`${Math.ceil(main.getBoundingClientRect().top+scrollY)}px`);
  };
  const toggleNav = (expanded) => {
    navButton.setAttribute("aria-expanded", String(expanded));
    navButton.textContent = expanded ? "Close" : "Menu";
    document.getElementById("site-nav").classList.toggle("open", expanded);
    updateOffset();
    syncMenuInert();
  };
  navButton.addEventListener("click", () =>
    toggleNav(navButton.getAttribute("aria-expanded") !== "true"),
  );
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navButton.getAttribute("aria-expanded") === "true") {
      toggleNav(false);
      navButton.focus();
    }
  });
  document.getElementById("site-nav").addEventListener("click", e => {
    if (e.target.closest("a")) toggleNav(false);
  });
  // The dimmed backdrop is the header's ::after, so a tap on it targets the header itself.
  header.addEventListener("click", e => {
    if (e.target === header && navButton.getAttribute("aria-expanded") === "true") toggleNav(false);
  });
  document
    .querySelector(".skip-link")
    .addEventListener("click", () => toggleNav(false));
  new ResizeObserver(() => { updateOffset(); syncMenuInert(); }).observe(
    document.querySelector(".site-header"),
  );
  updateOffset();
  installTooltip();
}
// While the phone menu covers the screen, the page behind it leaves the tab order and accessibility tree.
function syncMenuInert() {
  const nav = document.getElementById("site-nav");
  const sheet = nav.classList.contains("open") && getComputedStyle(nav).position === "fixed";
  for (const el of document.body.children) {
    if (el.matches(".site-header, .skip-link, script")) continue;
    if (sheet && !el.inert) { el.inert = true; el.dataset.menuInert = ""; }
    else if (!sheet && "menuInert" in el.dataset) { el.inert = false; delete el.dataset.menuInert; }
  }
}
export function installTooltip() {
  const tip = document.createElement("div");
  tip.id = "tip";
  tip.role = "tooltip";
  tip.hidden = true;
  document.body.append(tip);
  let target = null;
  let hideTimer = null;
  const hide = () => {
    clearTimeout(hideTimer);
    target?.removeAttribute("aria-describedby");
    target = null;
    tip.classList.remove("on");
    tip.hidden = true;
  };
  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 180);
  };
  const show = (el, x, y) => {
    clearTimeout(hideTimer);
    if (target !== el) target?.removeAttribute("aria-describedby");
    target = el;
    tip.textContent = el.dataset.tip;
    tip.hidden = false;
    el.setAttribute("aria-describedby", "tip");
    tip.classList.add("on");
    tip.style.left = `${Math.max(8, Math.min(x + 12, innerWidth - tip.offsetWidth - 8))}px`;
    tip.style.top = `${Math.max(8, Math.min(y + 14, innerHeight - tip.offsetHeight - 8))}px`;
  };
  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest?.("[data-tip]");
    if (e.target.closest?.("#tip")) {
      clearTimeout(hideTimer);
      return;
    }
    if (el) show(el, e.clientX, e.clientY);
    else scheduleHide();
  });
  document.addEventListener("focusin", (e) => {
    const el = e.target.closest?.("[data-tip]");
    if (el) {
      const r = el.getBoundingClientRect();
      show(el, r.left, r.bottom);
    } else hide();
  });
  document.addEventListener("focusout", hide);
  document.addEventListener("pointerout", (e) => {
    if (!e.relatedTarget?.closest?.("[data-tip], #tip")) scheduleHide();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
  addEventListener("scroll", hide, true);
}
export function errorPage(error) {
  document.querySelector("main").innerHTML =
    `<div class="empty"><h1>Results unavailable</h1><p>The interactive results could not be loaded. Reload to try again, or read the <a href="benchmark.md">published results</a> and <a href="docs.html">documentation</a>.</p><a href="index.html">Return to overview</a></div>`;
}
export { provider, providerInfo, rankOf };
