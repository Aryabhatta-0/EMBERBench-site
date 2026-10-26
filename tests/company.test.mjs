import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
import {createRequire} from 'node:module';
import data from '../site/data/results.js';
const require=createRequire(import.meta.url),base=process.env.ANANTAM_BASE_URL||'http://127.0.0.1:8917/';
const out=resolve('work/experience');await mkdir(out,{recursive:true});
const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const browser=await chromium.launch();const checks=[],audits=[],errors=[];
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);};
const audit=async(page,label)=>{await page.evaluate(axe);audits.push({label,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});};
const go=async(page,route='')=>{await page.goto(new URL(route,base).href);await page.locator('.site-footer').waitFor();await page.evaluate(()=>document.fonts.ready);};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme:'dark'});page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('ember-theme','dark'));
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:width<700?844:1000});await go(page);await page.locator('.outcome-card').first().waitFor();
  check(`${width}px light only`,await page.locator('html').getAttribute('data-theme')==='light'&&await page.locator('.theme-toggle').count()===0);
  check(`${width}px centered company identity and action`,await page.locator('.company-hero').evaluate(el=>{const h=el.getBoundingClientRect(),s=el.querySelector('.company-signature').getBoundingClientRect(),a=el.querySelector('a').getBoundingClientRect();return Math.abs(s.x+s.width/2-h.x-h.width/2)<2&&Math.abs(a.x+a.width/2-h.x-h.width/2)<2;}));
  check(`${width}px hero action fits the first screen`,await page.locator('.hero-action').evaluate(el=>el.getBoundingClientRect().bottom<innerHeight));
  check(`${width}px hero fills the window below navigation`,await page.locator('.company-hero').evaluate(el=>Math.abs(el.getBoundingClientRect().bottom-innerHeight)<2&&document.querySelector('#contributions').getBoundingClientRect().top>=innerHeight-1));
  check(`${width}px all product substance visible without rails`,await page.locator('.world-map,.demo-controls,#ember-demo').count()===0&&await page.locator('.outcome-card').count()===2&&await page.locator('.benchmark-showcase').count()===0);
  check(`${width}px no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await audit(page,`Home ${width}px`);
 }
 await page.setViewportSize({width:1440,height:1000});await go(page);
 check('Hero opens actual published results directly',await page.locator('.hero-action').getAttribute('href')==='benchmark.html');
 await page.locator('.hero-action').click();await page.locator('.result-chart').waitFor();
 check('Hero action reaches the benchmark chart',await page.locator('.result-chart').isVisible());
 await go(page);
 const card=page.locator('.outcome-card').first();const model=data.models.find(m=>m.id.includes('typesafe_jev-1.14'));
 check('Pictograph counts equal published people outcomes',await card.locator('[data-outcome="evacuated"]').count()===model.totals.evacuated&&await card.locator('[data-outcome="casualty"]').count()===model.totals.avoidable_casualties&&await card.locator('[data-outcome="stranded"]').count()===model.totals.avoidable_stranded);
 await page.mouse.move(2,2);await card.scrollIntoViewIfNeeded();await page.waitForTimeout(800);const dot=card.locator('.outcome-person').nth(190),before=await dot.evaluate(el=>getComputedStyle(el).transform);const box=await card.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.waitForTimeout(180);const during=await dot.evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(600);const after=await dot.evaluate(el=>getComputedStyle(el).transform);
 check('Card hover visibly separates outcomes through an intermediate state '+JSON.stringify({before,during,after,grouped:await card.getAttribute('data-grouped'),media:await page.evaluate(()=>({fine:matchMedia('(hover:hover) and (pointer:fine)').matches,reduced:matchMedia('(prefers-reduced-motion:reduce)').matches}))}),before!==during&&during!==after&&await card.getAttribute('data-grouped')==='true');
 await audit(page,'Grouped outcome card');await page.locator('.outcome-feature').screenshot({path:resolve(out,'home-hover.png')});
 await page.getByRole('button',{name:'Simulate',exact:true}).click();
 check('Evaluation explanation responds to a selected stage',(await page.locator('.loop-explanation').textContent()).includes('movement conflicts'));
 await page.getByRole('button',{name:'Simulate',exact:true}).focus();await page.keyboard.press('ArrowRight');
 check('Evaluation stages are keyboard navigable',await page.getByRole('button',{name:'Verify',exact:true}).getAttribute('aria-pressed')==='true');
 await page.setViewportSize({width:390,height:844});await go(page);await page.locator('.outcome-card').first().waitFor();await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('[data-group-outcomes]').first().click();check('Phone has an explicit grouping action',await page.locator('.outcome-card').first().getAttribute('data-grouped')==='true');
 await audit(page,'Phone outcome grouping');
 await page.setViewportSize({width:1440,height:1000});await go(page,'scenarios.html?scenario=v1-pub-06-threatened-exit&model=openrouter-typesafe_jev-1.14-choice-r1');
 check('Scenario page has descriptions and published evidence without a simulation',await page.locator('.scenario-description').isVisible()&&await page.locator('.world-map,.demo-stage,[data-play],#scenario-world-stage').count()===0);
 check('Scenario retains selected model evidence',(await page.locator('#world-model-result').textContent()).includes('typesafe/jev-1.14'));
 for(const choice of await page.locator('[data-challenge]').all()){
  await choice.click();check('Every selected scenario stays free of replay UI',await page.locator('.world-map,.demo-controls,[aria-label="Reference agent"]').count()===0);
 }
 await page.locator('[data-challenge="v1-pub-06-threatened-exit"]').click();
 await page.locator('#world-model-result a').click();await page.locator('.breadcrumb').waitFor();
 check('Model profile returns to the exact world',(await page.locator('.breadcrumb').getAttribute('href')).includes('v1-pub-06-threatened-exit&model=openrouter-typesafe_jev-1.14'));
 await page.getByRole('tab',{name:'Scenarios',exact:true}).click();
 check('Per-scenario evidence links retain the selected model',(await page.locator('#scenarios .table-wrap a[href^="scenarios.html"]').first().getAttribute('href')).includes('model=openrouter-typesafe_jev-1.14'));
 await go(page,'methodology.html');await page.getByRole('button',{name:'Verify',exact:true}).click();
 check('Methodology teaches the connected evaluation loop',(await page.locator('.loop-explanation').textContent()).includes('reproduce exactly'));
 await audit(page,'Methodology loop');
 const noGSAP=await browser.newPage();await noGSAP.route('**/gsap.min.js',r=>r.abort());await go(noGSAP);await noGSAP.locator('[data-group-outcomes]').first().click();
 check('Without GSAP, grouping and navigation still work',await noGSAP.locator('.outcome-card').first().getAttribute('data-grouped')==='true');
 const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();await fallback.goto(base);
 check('No-JavaScript company and source remain available',await fallback.getByRole('heading',{name:'Anantam',exact:true}).isVisible()&&await fallback.locator('.hero-action').isVisible());await nojs.close();
 for(const [label,width] of [['desktop',1440],['mobile',390]]){
  await page.setViewportSize({width,height:width<700?844:1000});await go(page);await page.locator('.outcome-card').first().waitFor();
  await page.screenshot({path:resolve(out,`home-${label}.png`),fullPage:true});
  if(width===1440)await page.screenshot({path:resolve(out,'hero-desktop.png')});
  await go(page,'scenarios.html?scenario=v1-pub-06-threatened-exit');
  await page.screenshot({path:resolve(out,`world-${label}.png`),fullPage:true});await audit(page,`Scenarios ${width}px`);
 }
 check('No runtime errors in real visitor journeys',errors.length===0);
}finally{await writeFile(resolve(out,'company-report.json'),JSON.stringify({checks,audits,errors},null,2));await browser.close();}
console.log(`${checks.length} company experience checks passed; ${audits.length} accessibility scans.`);
if(audits.some(a=>a.violations.length)){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
