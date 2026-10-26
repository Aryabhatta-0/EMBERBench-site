import {shell, loadResults, esc, fmt, isDecision} from './common.js';
import {leaderboardOrder} from './analytics.js';
import {animateCosmos} from './cosmos.js';

shell(null, 'company');
const stopCosmos = animateCosmos(document.querySelector('.cosmos-emblem'));
const flightTimer = setTimeout(() => {
  stopCosmos?.();
  document.querySelector('.cosmos-emblem').dataset.motion = 'complete';
}, 4500);
const card = document.querySelector('.ember-contribution');
const evidence = card.querySelector('.ember-evidence');
const motion = window.gsap?.matchMedia();

// Static content survives an unavailable animation library or result snapshot.
motion?.add('(prefers-reduced-motion: no-preference)', () => {
  window.gsap.timeline({defaults: {duration: .55, ease: 'power3.out'}})
    .from('.company-intro', {opacity: .45, y: 12, clearProps: 'all'})
    .from('.hero-art', {opacity: .35, scale: .98, clearProps: 'all'}, '<.1');
});

// Reversible depth on one product surface, enabled only for a precise pointer.
motion?.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const tilt = window.gsap.quickTo(evidence, 'rotationY', {duration: .45, ease: 'power3.out'});
  const lift = window.gsap.quickTo(evidence, 'y', {duration: .45, ease: 'power3.out'});
  const move = event => {
    const box = card.getBoundingClientRect();
    tilt(window.gsap.utils.clamp(-3, 3, ((event.clientX - box.left) / box.width - .5) * 6));
    lift(-6);
  };
  const reset = () => {tilt(0); lift(0);};
  card.addEventListener('pointermove', move);
  card.addEventListener('pointerleave', reset);
  return () => {card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', reset);};
});

loadResults().then(data => {
  const models = leaderboardOrder(data.models).filter(isDecision).slice(0, 3);
  document.getElementById('contribution-results').innerHTML = models.map(model => `
    <a class="evidence-result" href="model.html?id=${encodeURIComponent(model.id)}">
      <span class="evidence-label"><span>${esc(model.name)}</span><span>${fmt(model.score)}</span></span>
      <span class="evidence-track" aria-hidden="true"><span style="transform:scaleX(${Math.max(0, Math.min(1, model.score / 100))})"></span></span>
    </a>`).join('');
}).catch(() => {
  document.querySelector('.evidence-heading').hidden = true;
  document.querySelector('.evidence-scope').textContent = 'The preview is unavailable. Open the benchmark to try again.';
});

window.addEventListener('pagehide', event => {
  if (!event.persisted) {clearTimeout(flightTimer); motion?.revert(); stopCosmos?.();}
});
