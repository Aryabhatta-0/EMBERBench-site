import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import data from '../site/data/results.js';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.ANANTAM_PLAYWRIGHT_PATH || 'playwright');
const base = process.env.ANANTAM_BASE_URL || 'http://127.0.0.1:8917/';
const out = resolve(process.env.ANANTAM_QA_DIR || 'work/browser');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [], checks = [], accessibility = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const go = async route => {
  const target=new URL(route,base);
  if (target.pathname.endsWith('/leaderboard.html')) {if(!target.searchParams.has('kind')) target.searchParams.set('kind','all');}
  await page.goto(target.href);
  await page.locator('.site-header').waitFor();await page.waitForFunction(()=>!document.querySelector('main .loading-shell,main [data-static-results],main [data-static-reading]'));
  await page.evaluate(() => document.fonts.ready);
};
const check = (name, value) => { assert.ok(value, name); checks.push(name); };
const overflow = async label => {
  check(`${label}: no page overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
};
const axeSource = await readFile(process.env.ANANTAM_AXE_PATH || require.resolve('axe-core/axe.min.js'), 'utf8');
const audit = async label => {
  if (!axeSource) return;
  await page.evaluate(axeSource);
  const result = await page.evaluate(async () => {
    const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } });
    return r.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) }));
  });
  accessibility.push({ label, violations: result });
};
const openFilters=async()=>{if(!(await page.locator('.results-options').getAttribute('open')!==null))await page.locator('.results-options>summary').click();};
try {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    for (const route of ['index.html','benchmark.html','leaderboard.html','compare.html','scenarios.html','methodology.html',`model.html?id=${encodeURIComponent(data.models[0].id)}`]) {
      await go(route);
      await overflow(`${width}px ${route}`);
      check(`${width}px ${route}: heading`, (await page.locator('h1').count()) === 1);
    }
    check(`${width}px shared company footer has full-width curve and separate bottom row`,await page.locator('.company-footer').evaluate(el=>{const r=el.getBoundingClientRect(),grid=el.querySelector('.footer-grid').getBoundingClientRect(),bottom=el.querySelector('.footer-bottom').getBoundingClientRect();return r.left===0&&Math.abs(r.right-document.documentElement.clientWidth)<1&&bottom.top>=grid.bottom&&el.querySelector('.footer-tagline').textContent==='Boundless Possibilities'&&getComputedStyle(el.querySelector('.footer-content')).display==='block';}));
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go('index.html');
  await page.screenshot({ animations: "disabled", path: resolve(out,'home-desktop.png'), fullPage: true });
  await audit('Home light desktop');
  await go('benchmark.html');
  check('Benchmark opens actual searchable results', await page.locator('#search').isVisible() && await page.locator('.result-chart').isVisible());
  await go('leaderboard.html');
  await audit('Leaderboard light');
  await page.locator('#search').fill('no-such-model-anantam');
  check('Search empty state', (await page.locator('#visual-results').innerText()).includes('No matching models'));
  await openFilters();await page.getByRole('button', { name:'Reset filters',exact:true }).click();
  check('Filters reset to AI decision models', (await page.locator('[data-inspect]').count()) === data.models.filter(m=>m.kind==='Decision model').length);
  check('Results do not embed comparison tables or selectors',await page.locator('main table,[data-select-model],.quick-compare').count()===0);
  await go(`compare.html?models=${encodeURIComponent(data.models.slice(0,2).map(m=>m.id).join(','))}`);
  check('Dedicated comparison page opens',await page.locator('.compare-card').count()===2);
  await page.screenshot({ animations: "disabled",path:resolve(out,'compare-desktop.png'),fullPage:true});
  await go('index.html#site-footer');await page.waitForFunction(()=>document.getElementById('site-footer').getBoundingClientRect().top<innerHeight);
  check('Company footer can be opened directly after homepage content loads',await page.locator('.company-footer').evaluate(el=>el.getBoundingClientRect().top<innerHeight));
  await go('index.html');
  await page.emulateMedia({colorScheme:'dark'});
  await page.reload(); await page.locator('.site-header').waitFor();await page.waitForFunction(()=>!document.querySelector('main .loading-shell,main [data-static-results],main [data-static-reading]'));
  check('Only light mode regardless of OS preference', await page.locator('html').getAttribute('data-theme') === 'light' && await page.locator('.theme-toggle').count() === 0);
  await audit('Home forced light');
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({ animations: "disabled",path:resolve(out,'home-mobile.png'),fullPage:true});
  await audit('Home light mobile');
  await page.getByRole('button', {name:'Menu',exact:true}).click();
  check('Mobile menu expands', await page.locator('.nav-toggle').getAttribute('aria-expanded') === 'true');
  await page.keyboard.press('Escape');
  check('Escape closes mobile menu', await page.locator('.nav-toggle').getAttribute('aria-expanded') === 'false');
  check('Escape returns menu focus', await page.locator('.nav-toggle').evaluate(el => el === document.activeElement));
  await page.emulateMedia({reducedMotion:'reduce'});
  check('Reduced motion keeps the benchmark introduction readable',await page.locator('.contribution-description').isVisible()&&await page.locator('.contribution-note').count()===1);
  const nojs = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const fallback = await nojs.newPage(); await fallback.goto(base);
  check('No-JavaScript introduction visible', await fallback.locator('h1').isVisible());
  await nojs.close();
  await go('benchmark.html');
  check('Benchmark opens with all decision models and no featured model',await page.locator('.column-model').count()===19&&await page.locator('#result-inspector').count()===0);
  await go('leaderboard.html?q=jev');
  check('Both evaluated JEV versions are searchable',await page.locator('[data-inspect]').count() === 2);
  check('Leaderboard replaces latest alias with evaluated 1.13',await page.locator('.column-model').evaluateAll(els=>els.map(el=>el.getAttribute('aria-label')).join('|')).then(t=>t.includes('typesafe/jev-1.13')&&!t.includes('jev-latest')));
  await go('compare.html?models=typesafe-jev-latest-choice-r1,openrouter-typesafe_jev-1.14-choice-r1');
  check('Version comparison retains both reports',await page.locator('.compare-card h2').allTextContents().then(names=>names.join('|') === 'typesafe/jev-1.13|typesafe/jev-1.14'));
  await go('model.html?id=typesafe-jev-latest-choice-r1');
  check('Legacy JEV profile link shows 1.13',await page.locator('h1').textContent().then(t=>t.includes('typesafe/jev-1.13')));
  await go('model.html?id=openrouter-typesafe_jev-1.14-choice-r1');
  check('JEV 1.14 profile exposes imported score',await page.locator('.score-hero').innerText().then(t=>t.includes('51.70')));
  await go('model.html?id=unknown-model');
  check('Unknown model recovery', /not found|unknown|unavailable|choose/i.test(await page.locator('main').innerText()));
  check('No browser JavaScript or resource errors', errors.length === 0);
} finally {
  await writeFile(resolve(out,'report.json'),JSON.stringify({checks,errors,accessibility},null,2));
  await browser.close();
}
console.log(`${checks.length} browser checks passed. ${accessibility.length} accessibility scans recorded.`);
const violations = accessibility.flatMap(a=>a.violations);
if (violations.length) { console.log(JSON.stringify(accessibility.filter(a=>a.violations.length),null,2)); process.exitCode=1; }
