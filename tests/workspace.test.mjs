import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import data from '../site/data/results.js';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.ANANTAM_PLAYWRIGHT_PATH || 'playwright');
const axe = await readFile(process.env.ANANTAM_AXE_PATH || require.resolve('axe-core/axe.min.js'),'utf8');
const out = resolve(process.env.ANANTAM_QA_DIR || 'work/browser');
const base = process.env.ANANTAM_BASE_URL || 'http://127.0.0.1:8917/';
await mkdir(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const checks = [], errors = [], audits = [];
page.on('pageerror',e => errors.push(e.message));
const check = (name, condition) => {assert.ok(condition,name); checks.push(name);};
const go = async route => {await page.goto(new URL(route,base).href); await page.locator('.site-footer').waitFor(); await page.evaluate(()=>document.fonts.ready);};
const audit = async name => {
  await page.evaluate(axe);
  const violations = await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
  audits.push({name,violations});
};
const profile = data.models.filter(m=>m.kind === 'Decision model').sort((a,b)=>b.score-a.score)[0];
const routes = [['leaderboard','leaderboard.html'],['compare','compare.html'],['model',`model.html?id=${encodeURIComponent(profile.id)}`],['scenarios','scenarios.html'],['methodology','methodology.html']];
const openFilters=async()=>{if(!(await page.locator('.results-options').getAttribute('open')!==null))await page.locator('.results-options>summary').click();};
try {
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:width < 700 ? 844 : 1000});
    for (const [name,route] of routes) {
      await go(route);
      check(`${name} ${width}px: no page overflow`,await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth));
      if ([390,1440].includes(width)) await page.screenshot({path:resolve(out,`${name}-${width}.png`),fullPage:true,animations:'disabled'});
      if (width === 1440 || width === 390) await audit(`${name} ${width}px light`);
    }
  }
  await go('leaderboard.html?display=table');
  check('Legacy table URLs open chart-only results',await page.locator('main table').count()===0&&await page.locator('.column-chart').isVisible());
  await openFilters();await page.locator('#metric').selectOption('cost');
  check('API view plots cost',await page.locator('#metric').inputValue()==='cost'&&await page.locator('#rank-plot-title').textContent()==='API cost');
  check('API view retains people and safety charts',await page.locator('.scatter-panel,.outcome-panel').count()===2);
  await page.reload(); await page.locator('.site-footer').waitFor();
  check('Measurement lens survives reload',await page.locator('#metric').inputValue()==='cost');
  check('All eleven measured metrics remain available to plot',await page.locator('#metric option').count()===11);
  await openFilters();await page.locator('#metric').selectOption('safety');
  check('Metric selection updates the ranking chart',await page.locator('#rank-plot-title').textContent()==='Safety');
  await page.keyboard.press('Escape');
  check('Escape closes filter options and restores focus',await page.locator('.results-options').evaluate(el=>!el.open&&document.activeElement===el.querySelector('summary')));
  await openFilters();await page.locator('.benchmark-heading h1').click();
  check('Clicking outside dismisses filter options',await page.locator('.results-options').evaluate(el=>!el.open));
  await go('compare.html');
  await page.getByRole('tab',{name:'Outcomes',exact:true}).focus(); await page.keyboard.press('ArrowRight');
  check('Comparison keyboard view navigation',await page.getByRole('tab',{name:'Scenarios & worlds',exact:true}).getAttribute('aria-selected') === 'true');
  await audit('Comparison scenarios view');
  await page.getByRole('tab',{name:'Diagnostics',exact:true}).click();
  check('Comparison diagnostics accessible',await page.getByRole('tabpanel',{name:'Diagnostics',exact:true}).isVisible());
  await audit('Comparison diagnostics view');
  const replacement = await page.locator('[data-model-slot="0"] option:not([disabled])').evaluateAll(options=>options.find(o=>o.value && !o.selected).value);
  await page.locator('[data-model-slot="0"]').selectOption(replacement);
  check('Comparison retains evidence view after model change',await page.getByRole('tab',{name:'Diagnostics',exact:true}).getAttribute('aria-selected') === 'true');
  await page.locator('.optional-models summary').click();
  check('Additional model controls open on demand',await page.locator('[data-model-slot="2"]').isVisible());
  await go(`model.html?id=${encodeURIComponent(profile.id)}#worlds`);
  check('Profile hash reveals correct evidence view',await page.getByRole('tab',{name:'Scenarios',exact:true}).getAttribute('aria-selected') === 'true');
  check('Profile hash expands world records',await page.locator('#worlds').isVisible());
  await page.getByRole('tab',{name:'Diagnostics',exact:true}).click(); await audit('Profile diagnostics');
  await page.getByRole('tab',{name:'Sources',exact:true}).click(); await audit('Profile sources');
  await go('scenarios.html');
  check('Scenarios use a guide index without dashboard tabs or extra top navigation',await page.locator('.scenario-studio').evaluate(el=>getComputedStyle(el).display==='grid'&&getComputedStyle(el.querySelector('.challenge-nav')).flexDirection==='column')&&await page.locator('.benchmark-subnav,main [role="tablist"],.editorial-aside').count()===0);
  const picker = page.locator('[data-challenge]').nth(2);
  const id = await picker.getAttribute('data-challenge');
  await picker.click();
  check('Challenge picker changes underlying scenario',await page.locator('#scenario-select').inputValue() === id);
  check('Challenge picker updates shared URL',new URL(page.url()).searchParams.get('scenario') === id);
  await page.locator('summary').filter({hasText:'Across all scenarios'}).click();
  check('Scenario matrix expands within the continuous guide',await page.locator('#scenario-matrix').isVisible());
  await audit('Scenario matrix');
  await page.locator('summary').filter({hasText:'The full diagnostic suite'}).click();
  await page.locator('[data-scenario]').nth(4).click();
  check('Catalogue choice reveals evidence below sticky header',await page.locator('#scenario-summary').evaluate(el=>{const top=el.getBoundingClientRect().top,header=document.querySelector('.site-header').getBoundingClientRect().bottom;return top>=header+16 && top<innerHeight/2;}));
  await page.setViewportSize({width:390,height:844});
  await page.locator('#scenario-ranking').scrollIntoViewIfNeeded();
  check('Phone scenario score stays within viewport',await page.locator('#scenario-ranking tbody tr').first().locator('td').nth(3).evaluate(el=>el.getBoundingClientRect().right<=innerWidth));
  await page.getByRole('button',{name:'More columns',exact:true}).click();
  check('Phone can reveal all scenario measurements',await page.locator('#scenario-ranking').getAttribute('data-expanded') === 'true');
  await page.setViewportSize({width:1440,height:1000});
  await go('methodology.html');
  check('Methodology has no benchmark sub-navigation or results CTA',await page.locator('.benchmark-subnav,.editorial-aside').count()===0&&await page.getByRole('link',{name:'Explore the results',exact:true}).count()===0);
  await page.getByRole('link',{name:'The score',exact:true}).click();
  check('Guide links point to retained source anchors',new URL(page.url()).hash === '#score-title');
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({colorScheme:'dark'});
  for (const [name,route] of routes) {
    await go(route);
    check(`${name}: light-only under dark OS preference`,await page.locator('html').getAttribute('data-theme') === 'light' && await page.locator('.theme-toggle').count() === 0);
    await audit(`${name} forced light`);
  }
  for (const [name,route] of routes) {
    const pending = await browser.newContext({viewport:{width:1440,height:1000}});
    const loading = await pending.newPage(); let release;
    const gate = new Promise(r=>release=r);
    await loading.route('**/data/results.js',async request=>{await gate; await request.continue();});
    await loading.goto(new URL(route,base).href,{waitUntil:'domcontentloaded'});
    check(`${name}: emblem loader visible while real data is pending`,await loading.locator('.loading-shell').isVisible());
    check(`${name}: loading marks content busy`,await loading.locator('main').getAttribute('aria-busy') === 'true');
    if (name === 'leaderboard') {
      await loading.screenshot({path:resolve(out,'loading-desktop.png'),animations:'disabled'});
      await loading.setViewportSize({width:390,height:844});
      await loading.emulateMedia({reducedMotion:'reduce'});
      await loading.waitForFunction(()=>document.querySelector('.loading-emblem')?.dataset.motion === 'reduced');
      check('Loading respects reduced motion',await loading.locator('.loading-emblem canvas').isHidden());
      await loading.screenshot({path:resolve(out,'loading-mobile.png'),animations:'disabled'});
      await loading.getByRole('button',{name:'Reload page',exact:true}).waitFor({state:'visible',timeout:12000});
      check('Slow loading exposes a recovery action',await loading.locator('.loading-copy').textContent().then(text=>text.includes('longer than usual')));
    }
    release(); await loading.locator('.site-footer').waitFor();
    check(`${name}: emblem loader removed when content resolves`,await loading.locator('.loading-shell').count() === 0);
    check(`${name}: loading clears busy state`,await loading.locator('main').getAttribute('aria-busy') === null);
    await pending.close();
  }
  check('No JavaScript errors',errors.length === 0);
} finally {
  await writeFile(resolve(out,'workspace-report.json'),JSON.stringify({checks,errors,audits},null,2));
  await browser.close();
}
console.log(`${checks.length} workspace checks passed; ${audits.length} accessibility scans.`);
const violations = audits.filter(a=>a.violations.length);
if (violations.length) {console.log(JSON.stringify(violations,null,2)); process.exitCode=1;}
