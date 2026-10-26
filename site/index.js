import {shell, loadResults, esc, fmt, isDecision} from './common.js';
import {leaderboardOrder} from './analytics.js';
import {setupWorldPreview} from './world-preview.js';

shell(null, 'company');
const showcase = document.querySelector('.benchmark-showcase');
const tabs = [...showcase.querySelectorAll('[role="tab"]')];
const panels = [...showcase.querySelectorAll('[role="tabpanel"]')];
const preference = matchMedia('(prefers-reduced-motion: reduce)');
const hover = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 701px)');
const abort = new AbortController();
let scene;
let expansion;
const weights = {environment:1, results:.08, method:.08};

function expand(id, instant = false) {
  if (!window.gsap) return;
  const narrow = matchMedia('(max-width:900px)').matches ? .11 : .08;
  showcase.classList.add('motion-ready');
  const tracks = Object.fromEntries(['environment','results','method'].map(key => [key, key === id ? 1 : narrow]));
  expansion?.kill();
  expansion = window.gsap.to(weights, {...tracks,duration:instant || preference.matches || !hover.matches ? 0 : .65,ease:'power3.out',onUpdate:() => {
    for (const key of ['environment','results','method']) showcase.style.setProperty(`--track-${key}`,`${weights[key]}fr`);
  }});
}

const animateScene = id => {
  scene?.revert();
  scene = undefined;
  if (preference.matches || !window.gsap) return;
  scene = window.gsap.context(() => {
    const tl = window.gsap.timeline({defaults:{ease:'power3.out'}});
    if (id === 'environment') {
      const route = showcase.querySelector('.map-route');
      if (route) tl.fromTo(route, {strokeDasharray:route.getTotalLength(),strokeDashoffset:route.getTotalLength()}, {strokeDashoffset:0,duration:1.3}, .25);
      tl.from('.map-person', {scale:.7,transformOrigin:'50% 50%',duration:.4,stagger:.055}, .2)
        .to('.fire-halo', {opacity:.2,duration:.65,repeat:1,yoyo:true,ease:'sine.inOut'}, .1);
    } else if (id === 'results') {
      tl.from('.preview-result', {x:18,duration:.5,stagger:.075,clearProps:'transform'}, .2)
        .from('.preview-score-fill',{scaleX:0,duration:.6,stagger:.075},.25);
    } else {
      tl.from('.method-visual > div', {y:14,duration:.5,stagger:.11,clearProps:'transform'}, .2);
    }
  }, showcase);
};
setupWorldPreview(showcase,keyboard=>{
  if (keyboard) {scene?.revert();scene=undefined;} else animateScene('environment');
});

function activate(id, keyboard = false) {
  if (showcase.dataset.active === id) return;
  showcase.classList.toggle('keyboard-switch', keyboard);
  showcase.dataset.active = id;
  expand(id, keyboard);
  tabs.forEach(tab => {
    const selected = tab.dataset.preview === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => {
    const selected = panel.dataset.panel === id;
    panel.classList.toggle('is-active', selected);
    panel.setAttribute('aria-hidden', String(!selected));
    panel.querySelector('.panel-content').inert = !selected;
  });
  if (keyboard) {scene?.revert();scene=undefined;} else animateScene(id);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', event => activate(tab.dataset.preview, event.detail === 0), {signal:abort.signal});
  tab.addEventListener('pointerenter', () => {
    // Pointer entry chooses a panel; it never continuously tracks or tilts content.
    if (hover.matches && !(showcase.contains(document.activeElement) && document.activeElement.matches(':focus-visible'))) activate(tab.dataset.preview);
  }, {signal:abort.signal});
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? tabs[(index + 1) % tabs.length] : event.key === 'ArrowLeft' ? tabs[(index + tabs.length - 1) % tabs.length] : event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : null;
    if (!next) return;
    event.preventDefault(); activate(next.dataset.preview, true); next.focus();
  }, {signal:abort.signal});
});
preference.addEventListener('change', () => {scene?.revert();scene=undefined;expand(showcase.dataset.active,true);}, {signal:abort.signal});
window.addEventListener('resize', () => expand(showcase.dataset.active,true), {signal:abort.signal});
activate('environment', true);
showcase.classList.remove('keyboard-switch');

// Play the environment once when the contribution enters view, without hiding it.
const observer = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) {animateScene(showcase.dataset.active);observer.disconnect();}
}, {threshold:.35});
observer.observe(showcase);

loadResults().then(data => {
  const models = leaderboardOrder(data.models).filter(isDecision).slice(0,4);
  document.getElementById('contribution-results').innerHTML = models.map(model => `<a class="preview-result" href="benchmark.html?model=${encodeURIComponent(model.id)}"><span>${esc(model.name)}</span><span class="preview-score">${fmt(model.score)}</span><span class="preview-score-track" aria-hidden="true"><span class="preview-score-fill" style="transform:scaleX(${model.score/100})"></span></span></a>`).join('');
}).catch(() => {
  document.querySelector('.preview-scope').textContent = 'The preview is unavailable. Open the benchmark to try again.';
});

window.addEventListener('pagehide', event => {
  if (!event.persisted) {scene?.revert();expansion?.kill();abort.abort();observer.disconnect();}
});
