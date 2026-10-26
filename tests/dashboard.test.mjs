import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import data from '../site/data/results.js';
import {leaderboardOrder} from '../site/analytics.js';
const base=process.env.ANANTAM_BASE_URL||'http://127.0.0.1:8917/',require=createRequire(import.meta.url);
const out=resolve('work/dashboard');await mkdir(out,{recursive:true});
const browser=await chromium.launch();const page=await browser.newPage();const checks=[],audits=[],errors=[];
const check=(name,v)=>{assert.ok(v,name);checks.push(name);};
const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
page.on('pageerror',e=>errors.push(e.message));
const go=async route=>{await page.goto(new URL(route,base).href);await page.locator('.site-footer').waitFor();await page.evaluate(()=>document.fonts.ready);};
const audit=async label=>{await page.evaluate(axe);audits.push({label,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});};
const models=leaderboardOrder(data.models.filter(m=>m.kind==='Decision model'));
try{
 for(const [width,height] of [[1280,800],[1440,900],[1920,1080],[768,1024],[390,844],[320,844]]){
  await page.setViewportSize({width,height});await go('benchmark.html');
  check(`${width}px four distinct charts are visible`,await page.locator('.dashboard-panel').count()===4);
  check(`${width}px chart overview never scrolls horizontally`,await page.locator('.benchmark-dashboard').evaluate(el=>el.scrollWidth<=el.clientWidth)&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width>=1280)check(`${width}px all four charts fit the initial viewport`,await page.locator('.benchmark-dashboard').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight));
  await audit(`Four-chart overview ${width}px`);
  await page.screenshot({path:resolve(out,`benchmark-${width}.png`),fullPage:width<700});
 }
 await page.setViewportSize({width:1280,height:800});await go('benchmark.html');
 const height=await page.locator('.rank-panel').evaluate(el=>el.getBoundingClientRect().height),seen=new Set();
 do{
  (await page.locator('[data-inspect]').evaluateAll(els=>els.map(e=>e.dataset.inspect))).forEach(id=>seen.add(id));
  if(await page.getByRole('button',{name:'Next five models',exact:true}).isDisabled())break;
  await page.getByRole('button',{name:'Next five models',exact:true}).click();
  check('Paging never lengthens the chart',await page.locator('.rank-panel').evaluate(el=>el.getBoundingClientRect().height)===height);
 }while(true);
 check('Every model is reachable without lengthening the chart',seen.size===models.length);
 await page.locator('#inspect-model').selectOption(models[12].id);
 check('One model selection updates all four charts',await page.locator('.column-model.is-inspected').getAttribute('data-inspect')===models[12].id&&await page.locator('.factor-point.is-selected').getAttribute('data-plot-select')===models[12].id&&(await page.locator('.outcome-donut svg').getAttribute('aria-label')).includes(models[12].name)&&(await page.locator('.heat-model').first().getAttribute('title'))===models[12].name);
 const selected=models[12];
 check('Donut categories preserve exact published counts',(await page.locator('.donut-key dd').allTextContents()).join('|')===[selected.totals.evacuated,selected.totals.avoidable_casualties,selected.totals.avoidable_stranded].join('|'));
 await page.locator('[data-scenario-page="1"]').click();
 check('Second scenario page contains exact selected-model evidence',Number(await page.locator('.heat-row').nth(1).locator('a').first().textContent())===Number(selected.scenarios.find(s=>s.name==='v1-pub-06-threatened-exit').score.toFixed(1)));
 check('Scenario cells preserve both world and model context',(await page.locator('.mini-heat-cell').first().getAttribute('href')).includes(`scenario=v1-pub-06-threatened-exit&model=${encodeURIComponent(selected.id)}`));
 await page.reload();await page.locator('.benchmark-dashboard').waitFor();
 check('Reload preserves model and scenario page',await page.locator('#inspect-model').inputValue()===selected.id&&await page.locator('[data-scenario-page="1"]').getAttribute('aria-pressed')==='true');
 await page.locator('#inspect-model').selectOption(models[1].id);
 const point=page.locator(`[data-plot-select="${models[2].id}"]`);await point.focus();await page.keyboard.press('Enter');
 check('A keyboard-activated scatter point updates the whole view',await page.locator('#inspect-model').inputValue()===models[2].id&&await page.locator('.factor-point.is-selected').evaluate(el=>document.activeElement===el));
 await page.getByRole('button',{name:'API usage',exact:true}).click();await page.locator('#kind').selectOption('Reference agent');
 check('Missing API costs are omitted rather than plotted as zero',await page.locator('.column-missing').count()===5&&await page.locator('.column-model b').allTextContents().then(v=>v.every(t=>t==='—')));
 await audit('Reference data missing API values');
 await page.locator('#search').fill('no-such-model');check('Empty chart filters offer recovery',await page.getByRole('heading',{name:'No matching models.',exact:true}).isVisible());
 await go('index.html');await page.locator('[data-motion-toggle]:not([hidden])').waitFor();
 const current=page.locator('.ribbon-current').first();const initial=await current.evaluate(el=>getComputedStyle(el).strokeDashoffset);await page.waitForTimeout(250);
 check('Hero current visibly advances along the brand ribbon',await current.evaluate(el=>getComputedStyle(el).strokeDashoffset)!==initial);
 await page.getByRole('button',{name:'Pause motion',exact:true}).click();const paused=await current.evaluate(el=>getComputedStyle(el).strokeDashoffset);await page.waitForTimeout(250);
 check('Pause holds the animation state',await current.evaluate(el=>getComputedStyle(el).strokeDashoffset)===paused&&await page.locator('.company-hero').getAttribute('data-motion')==='paused');
 await page.getByRole('button',{name:'Play motion',exact:true}).click();
 await page.mouse.move(2,2);await page.waitForTimeout(150);const before=await page.locator('.brand-ribbon').evaluate(el=>getComputedStyle(el).transform);await page.mouse.move(1100,300);await page.waitForTimeout(450);
 check('Fine pointer input changes the hero ribbon position',await page.locator('.brand-ribbon').evaluate(el=>getComputedStyle(el).transform)!==before);
 await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.company-hero').dataset.motion==='paused');
 check('Hero animation pauses offscreen',await page.locator('.company-hero').getAttribute('data-motion')==='paused');
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 check('Reduced motion leaves a static visible hero',await page.locator('[data-motion-toggle]').isHidden()&&await page.locator('.company-hero').getAttribute('data-motion')==='paused'&&await page.locator('.hero-action').isVisible());
 await audit('Reduced-motion company hero');
 const fallback=await browser.newPage();await fallback.route('**/gsap.min.js',r=>r.abort());await fallback.goto(new URL('index.html',base).href);
 check('Without GSAP the logo, static ribbon and action remain',await fallback.locator('.hero-action').isVisible()&&await fallback.locator('.brand-ribbon').isVisible()&&await fallback.locator('[data-motion-toggle]').isHidden());
 check('No runtime errors in dashboard and motion journeys',errors.length===0);
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify({checks,audits,errors},null,2));await browser.close();}
console.log(`${checks.length} dashboard and hero checks passed; ${audits.length} accessibility scans.`);
if(audits.some(a=>a.violations.length)){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
