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
  await page.goto(new URL(route, base).href);
  await page.locator('.site-footer').waitFor();
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
try {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    for (const route of ['index.html','leaderboard.html','compare.html','scenarios.html','methodology.html',`model.html?id=${encodeURIComponent(data.models[0].id)}`]) {
      await go(route);
      await overflow(`${width}px ${route}`);
      check(`${width}px ${route}: heading`, (await page.locator('h1').count()) === 1);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await go('index.html');
  await page.screenshot({ animations: "disabled", path: resolve(out,'home-desktop.png'), fullPage: true });
  await audit('Home light desktop');
  await page.getByRole('tab', {name:'Rankings',exact:true}).focus();
  await page.keyboard.press('ArrowRight');
  check('Keyboard tabs select trade-offs', await page.locator('#tab-tradeoffs').getAttribute('aria-selected') === 'true');
  check('Trade-offs panel visible', await page.locator('#view-tradeoffs').isVisible());
  for (const metric of ['quality','casualties','congestion','latency','cost']) await page.locator('#analysis-metric').selectOption(metric);
  await page.locator('#highlight-model').selectOption(data.models[0].id);
  await page.screenshot({ animations: "disabled", path: resolve(out,'tradeoffs-desktop.png'), fullPage: true });
  await page.getByRole('tab', {name:'Scenarios',exact:true}).click();
  check('Scenarios panel visible', await page.locator('#view-scenarios').isVisible());
  await page.getByRole('tab', {name:'Rankings',exact:true}).click();
  await page.locator('.analysis-disclosure').first().locator('summary').click();
  await page.locator('#top-kind').selectOption('Reference agent');
  check('Chart type filter', (await page.locator('#top-chart .bar-row').count()) === data.models.filter(m => m.kind === 'Reference agent').length);
  await go('leaderboard.html');
  await audit('Leaderboard light');
  await page.locator('#search').fill('no-such-model-anantam');
  check('Search empty state', (await page.locator('#leaderboard').innerText()).includes('No matching models'));
  await page.getByRole('button', { name:'Reset filters',exact:true }).click();
  check('Filters reset', (await page.locator('[data-select-model]').count()) === data.models.length);
  const selected = page.locator('[data-select-model]');
  for (let i = 0; i < 4; i++) await selected.nth(i).check();
  await selected.nth(4).click();
  check('Comparison selection capped at four', !(await selected.nth(4).isChecked()));
  await page.locator('#clear-selection').click();
  await selected.nth(0).check(); await selected.nth(1).check();
  await page.getByRole('link', {name:'Compare models',exact:true}).click();
  await page.locator('.page-head').waitFor();
  check('Two-model comparison opens', (await page.locator('main').innerText()).includes(data.models[0].name));
  await page.screenshot({ animations: "disabled",path:resolve(out,'compare-desktop.png'),fullPage:true});
  await go('index.html');
  await page.getByRole('button', {name:'Switch to dark theme',exact:true}).click();
  await page.reload(); await page.locator('.site-footer').waitFor();
  check('Theme persists on reload', await page.locator('html').getAttribute('data-theme') === 'dark');
  await page.screenshot({ animations: "disabled",path:resolve(out,'home-dark.png'),fullPage:true});
  await audit('Home dark desktop');
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button', {name:'Switch to light theme',exact:true}).click();
  await page.screenshot({ animations: "disabled",path:resolve(out,'home-mobile.png'),fullPage:true});
  await audit('Home light mobile');
  await page.getByRole('button', {name:'Menu',exact:true}).click();
  check('Mobile menu expands', await page.locator('.nav-toggle').getAttribute('aria-expanded') === 'true');
  await page.keyboard.press('Escape');
  check('Escape closes mobile menu', await page.locator('.nav-toggle').getAttribute('aria-expanded') === 'false');
  check('Escape returns menu focus', await page.locator('.nav-toggle').evaluate(el => el === document.activeElement));
  await page.emulateMedia({reducedMotion:'reduce'});
  check('Reduced motion disables emblem animation', await page.locator('.hero-art').evaluate(el=>getComputedStyle(el).animationName === 'none'));
  const nojs = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const fallback = await nojs.newPage(); await fallback.goto(base);
  check('No-JavaScript introduction visible', await fallback.locator('h1').isVisible());
  await nojs.close();
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
