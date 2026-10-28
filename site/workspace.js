// Shared structure for analytical routes. Existing evidence nodes retain their IDs.
import { esc } from './common.js?v=20261028-mobile-1';
import {profileReadout} from './evidence-readout.js';

export function workspaceTabs(root, groups, key = 'workspace', initialView) {
  const current = initialView || root.querySelector(`[data-workspace="${key}"] [aria-selected="true"]`)?.dataset.view;
  const frame = document.createElement('div');
  frame.className = 'evidence-workspace';
  frame.dataset.workspace = key;
  frame.innerHTML = `<div class="workspace-tabs" role="tablist" aria-label="Evidence views">${groups.map(([id, label]) => `<button type="button" role="tab" id="${key}-tab-${id}" data-view="${id}" aria-controls="${key}-panel-${id}" aria-selected="false" tabindex="-1">${esc(label)}</button>`).join('')}</div>`;
  for (const [id, label, nodes] of groups) {
    const panel = document.createElement('div');
    panel.className = 'workspace-panel';
    panel.id = `${key}-panel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${key}-tab-${id}`);
    panel.tabIndex = 0;
    for (const node of nodes.filter(Boolean)) panel.append(node);
    frame.append(panel);
  }
  root.append(frame);
  const tabs = [...frame.querySelectorAll('[role="tab"]')];
  const select = tab => {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
      frame.querySelector(`#${item.getAttribute('aria-controls')}`).hidden = !active;
    }
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      const next = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : e.key === 'ArrowLeft' ? tabs[(i + tabs.length - 1) % tabs.length] : e.key === 'Home' ? tabs[0] : e.key === 'End' ? tabs.at(-1) : null;
      if (next) { e.preventDefault(); select(next); next.focus(); }
    });
  });
  select(tabs.find(t => t.dataset.view === current) || tabs[0]);
  const revealHash = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    const panel = target?.closest('[role="tabpanel"]');
    if (panel && frame.contains(panel)) {
      select(tabs.find(t => t.getAttribute('aria-controls') === panel.id));
      for (let parent = target.parentElement; parent && parent !== panel; parent = parent.parentElement) if (parent.tagName === 'DETAILS') parent.open = true;
      requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
    }
  };
  addEventListener('hashchange', revealHash, {signal: pageSignal()});
  revealHash();
  return frame;
}

let controller;
function pageSignal() { controller?.abort(); controller = new AbortController(); return controller.signal; }

export function disclosure(node, title, open = false) {
  const detail = document.createElement('details'); detail.className = 'evidence-detail'; detail.open = open;
  detail.innerHTML = `<summary>${esc(title)}<span aria-hidden="true">+</span></summary>`;
  if (node.parentNode) node.before(detail);
  detail.append(node);
  return detail;
}

export function editorHeader(title, description, aside = '') {
  return `<header class="page-head editorial-head"><div><h1>${title}</h1><p>${description}</p></div>${aside ? `<div class="editorial-aside">${aside}</div>` : ''}</header>`;
}

export function redesignProfile(model) {
  const main = document.getElementById('main');
  const nav = main.querySelector('.profile-nav');
  nav?.remove();
  const get = id => main.querySelector(`#${id}`);
  const people = get('people'), robustness = get('robustness');
  const grid = people?.parentElement;
  const metrics = main.querySelector(':scope > .metrics');
  metrics?.classList.add('profile-key-facts');
  metrics?.classList.remove('metrics');
  if (metrics) [...metrics.children].slice(2,5).forEach(node=>node.remove());
  const top = get('performance');
  if (top) disclosure(top, 'Position in the full evaluation');
  const components = get('components');
  const coverage = components?.querySelector('.table-wrap');
  if (coverage) disclosure(coverage, 'Component coverage and exact factors');
  if (people) disclosure(people, 'All people outcomes');
  const readout=document.createElement('div');
  readout.innerHTML=profileReadout(model);
  const componentDetails=components ? disclosure(components,'Inspect all seven score components') : null;
  const groups = [
    ['overview','Overview',[readout, componentDetails, people?.parentElement, top?.parentElement]],
    ['scenarios','Scenarios',[get('scenarios'), disclosure(get('worlds'), 'Inspect every evaluated world')]],
    ['diagnostics','Diagnostics',[get('api'), robustness, get('congestion')]],
    ['sources','Sources',[get('provenance')]],
  ];
  workspaceTabs(main, groups, 'profile');
  if (grid?.classList.contains('grid2')) grid.remove();
}

export function redesignMethodology() {
  const main = document.getElementById('main');
  main.querySelector('.page-head').outerHTML = editorHeader('How decisions<br>become evidence.', 'The worlds, the scoring, and the limits behind every result.');
  const article = document.createElement('article'); article.className = 'method-article';
  const sections = [...main.querySelectorAll('section.panel')];
  const aside = document.createElement('nav'); aside.className = 'method-contents'; aside.setAttribute('aria-label','On this page');
  const labels = ['The evaluation loop','Frozen environments','Replay verification','The score','Reading uncertainty','Scope & limitations','Sources & identity'];
  aside.innerHTML = `<span>In this guide</span>${sections.map((s,i)=> { const h = s.querySelector('h2'); return `<a href="#${h.id}">${esc(labels[i] || h.textContent)}</a>`; }).join('')}`;
  sections.forEach(s => article.append(s));
  main.querySelectorAll(':scope > .grid2').forEach(g => g.remove());
  const layout = document.createElement('div'); layout.className = 'method-layout'; layout.append(aside,article); main.append(layout);
  article.querySelectorAll('.table-wrap').forEach((node,i) => disclosure(node, i === 0 ? 'Explore all seven score components' : 'Inspect evaluation identity'));
}
