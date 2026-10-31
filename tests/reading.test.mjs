import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import data from '../site/data/results.js';
import {leaderboardOrder,sortModels} from '../site/analytics.js';
import {evaluatedModelName} from '../site/common.js';

const require=createRequire(import.meta.url),base=process.env.ANANTAM_BASE_URL || 'http://127.0.0.1:8917/';
const out=resolve('work/browser/reading');await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const checks=[],audits=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
const go=async route=>{await page.goto(new URL(route,base).href);await page.locator('.site-header').waitFor();await page.waitForFunction(()=>!document.querySelector('main .loading-shell,main [data-static-results],main [data-static-reading]'));await page.evaluate(()=>document.fonts.ready);};
const ai=leaderboardOrder(data.models.filter(m=>m.kind==='Decision model').map(m=>({...m,name:evaluatedModelName(m)})));
const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const audit=async label=>{
  await page.evaluate(axe);
  audits.push({label,violations:await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));})});
};
const openFilters=async()=>{if(!(await page.locator('.results-options').getAttribute('open')!==null))await page.locator('.results-options>summary').click();};
try {
  await go('benchmark.html');
  check('Entry begins with real AI model charts without comparison tables',await page.locator('.result-chart').isVisible() && await page.locator('main table').count()===0 && await page.locator('#kind').inputValue()==='Decision model');
  check('Leading chart uses official scientific order',await page.locator('[data-inspect]').first().getAttribute('data-inspect')===ai[0].id);
  check('Chart uses fixed 0–100 scale',Math.abs(await page.locator('.chart-fill').first().evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).d)-ai[0].score/100)<.00001);
  check('Overview has no preselected model',await page.locator('#result-inspector').count()===0);
  await page.locator('[data-inspect]').first().click();
  check('Inspector reports actual outcomes',await page.locator('.result-inspector .people-legend dd').allTextContents().then(v=>v.join('|')===[ai[0].totals.evacuated,ai[0].totals.avoidable_casualties,ai[0].totals.avoidable_stranded].join('|')));
  check('Visible explanation distinguishes score from survival percentage',(await page.locator('.plot-note').textContent()).includes('not the percentage'));
  await audit('Visual score results desktop');
  await page.screenshot({path:resolve(out,'results-desktop.png'),fullPage:true});
  await page.locator('[data-inspect]').nth(1).click();
  check('Selecting a row updates evidence at full text opacity',await page.locator('#inspector-title').textContent()===ai[1].name && await page.locator('.result-inspector').evaluate(el=>getComputedStyle(el).opacity==='1'));
  check('Reading choice is shareable',new URL(page.url()).searchParams.get('model')===ai[1].id);
  const pair=[ai[1].id,data.models.find(m=>m.kind==='Reference agent').id];
  check('Comparison tools are absent from results',await page.locator('.quick-compare,#compare-against,#scenario-compare').count()===0);
  await page.reload();await page.locator('#inspector-title').waitFor();
  check('Reload restores selected model',await page.locator('#inspector-title').textContent()===ai[1].name);
  await openFilters();await page.locator('#metric').selectOption('evacuated');
  const people=sortModels(ai,'evacuated','desc');
  check('People lens displays actual counts and sorts for that question',await page.locator('[data-inspect]').first().getAttribute('data-inspect')===people[0].id && await page.locator('.rank-panel .dashboard-panel-head').innerText().then(t=>t.includes('people')));
  await openFilters();await page.locator('#metric').selectOption('cost');
  check('API chart makes measurement limits visible',(await page.locator('.plot-note').textContent()).includes('Missing data is not zero'));
  await page.locator('#kind').selectOption('Reference agent');
  check('Reference agents have no invented zero API cost',await page.locator('.chart-model b').allTextContents().then(v=>v.every(t=>t==='—')));
  await audit('Missing API reference results');
  await openFilters();await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  await openFilters();await page.locator('#metric').selectOption('score');
  await page.locator('#search').fill('nothing-matches');
  check('Visual search has a recovery state',await page.getByRole('heading',{name:'No matching models',exact:true}).isVisible());
  await openFilters();await page.getByRole('button',{name:'Reset filters',exact:true}).click();
  check('All decision models appear together without chart pagination',await page.locator('[data-inspect]').count()===ai.length&&await page.locator('[data-chart-page]').count()===0);
  await go('benchmark.html');
  await page.locator('[data-inspect]').first().focus();await page.keyboard.press('ArrowDown');
  check('Arrow navigation selects and focuses the next model',await page.locator('#inspector-title').textContent()===ai[1].name && await page.locator('[data-inspect]').nth(1).evaluate(el=>el===document.activeElement));
  check('Keyboard navigation has no entrance animation',await page.locator('.result-inspector').evaluate(el=>el.getAnimations().length===0));
  check('Results remain chart-only after keyboard selection',await page.locator('main table,[data-display]').count()===0);
  await page.getByRole('link',{name:'Inspect this model',exact:true}).click();await page.locator('.profile-readout').waitFor();
  check('Profile leads with human outcomes and difficult worlds',await page.getByRole('heading',{name:'What happened to the people?',exact:true}).isVisible() && await page.locator('.scenario-score-list li').count()===5);
  check('Technical factors remain available on demand',!(await page.locator('#components').isVisible()));
  await audit('Readable model profile');
  await page.screenshot({path:resolve(out,'profile-desktop.png'),fullPage:true});
  await go(`compare.html?models=${encodeURIComponent(pair.join(','))}`);
  check('Comparison leads with real people outcomes',await page.locator('.comparison-readout').isVisible() && await page.locator('.comparison-people .people-readout').count()===2);
  check('Comparison reaches labeled outcome bars within the first desktop viewport',await page.locator('.comparison-people .people-strip').first().evaluate(el=>el.getBoundingClientRect().bottom<800));
  await audit('People comparison');
  await page.screenshot({path:resolve(out,'comparison-desktop.png'),fullPage:true});
  for (const width of [320,390,768,1440,1920]) {
    await page.setViewportSize({width,height:width<700?844:1000});await go('benchmark.html');
    check(`${width}px visual results fit`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('[data-inspect]').nth(1).click();
    check(`${width}px selected model is explained`,await page.locator('#inspector-title').textContent()===ai[1].name);
    if(width<700) check(`${width}px selected evidence follows the complete chart overview`,await page.locator('.selected-evidence').evaluate(el=>el.getBoundingClientRect().top>=document.querySelector('.benchmark-dashboard').getBoundingClientRect().bottom));
    await audit(`Visual results ${width}px`);
    if(width===390) {await page.evaluate(()=>{document.activeElement?.blur();scrollTo({top:0,behavior:'instant'});});await page.screenshot({path:resolve(out,'results-mobile.png'),fullPage:true});}
  }
  await page.setViewportSize({width:1440,height:1000});await go('index.html');
  check('Home introduces the benchmark without results or evacuation maps',await page.locator('.contribution-description').isVisible()&&await page.locator('.outcome-card,.result-chart,.world-map,[data-play]').count()===0);
  await page.locator('.hero-action').click();await page.locator('.result-chart').waitFor();
  check('Centered hero action opens published results directly',await page.locator('.result-chart').isVisible());
  await go('scenarios.html?scenario=v1-pub-04-unequal-exits');
  check('Scenario remains useful without replay controls',await page.locator('.scenario-description').textContent().then(t=>t.includes('different path distances'))&&await page.locator('#scenario-ranking table').isVisible()&&await page.locator('.world-map,.demo-controls').count()===0);
  await audit('Scenario evidence without simulation');
  check('No page errors across visitor journeys',errors.length===0);
} finally {
  await writeFile(resolve(out,'report.json'),JSON.stringify({checks,audits,errors},null,2));await browser.close();
}
console.log(`${checks.length} reading journey checks passed; ${audits.length} accessibility scans.`);
const violations=audits.flatMap(a=>a.violations);if(violations.length){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
