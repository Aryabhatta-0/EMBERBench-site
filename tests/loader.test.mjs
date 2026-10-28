import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const require=createRequire(import.meta.url),axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const base=new URL('benchmark.html',process.env.ANANTAM_BASE_URL||'http://127.0.0.1:8917/').href,out=resolve('work/browser');
await mkdir(out,{recursive:true});const browser=await chromium.launch(),checks=[],audits=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
try{
 for(const [name,width,height,reduced] of [['desktop',1440,1000,false],['phone',390,844,false],['sidebar',543,750,false],['small-reduced',320,568,true],['landscape',844,390,false]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'}),page=await context.newPage();
  let release;const pending=new Promise(resolve=>release=resolve);
  await page.route('**/data/results.js',async route=>{await pending;await route.continue();});
  await page.goto(base,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);
  check(`${name}: results are readable before the interactive import`,await page.getByRole('heading',{name:'EMBERBench',exact:true}).isVisible()&&await page.locator('.static-models').first().locator('li').count()===19);
  check(`${name}: published scope is present during loading`,(await page.locator('[data-static-results]').innerText()).includes('not contamination-resistant'));
  check(`${name}: no brand loader obscures the data`,await page.locator('.loading-shell').count()===0&&await page.locator('main').getAttribute('aria-busy')===null);
  check(`${name}: static evidence has no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(axe);audits.push({name,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))});
  release();await page.locator('.result-chart').waitFor();
  check(`${name}: charts enhance the readable snapshot`,await page.locator('[data-static-results]').count()===0&&await page.locator('.column-model').count()===19);
  await context.close();
 }
 const nojs=await browser.newContext({javaScriptEnabled:false}),staticPage=await nojs.newPage();await staticPage.goto(base);
 check('Without JavaScript all published models remain in HTML',await staticPage.locator('.static-models li').count()===27&&await staticPage.getByRole('heading',{name:'EMBERBench',exact:true}).isVisible());await nojs.close();
 const failed=await browser.newPage();await failed.route('**/data/results.js',r=>r.abort());await failed.goto(base);
 await failed.getByRole('status').filter({hasText:'Interactive charts are unavailable'}).waitFor();
 check('An interactive-data failure preserves readable results and recovery',await failed.locator('.static-models').first().locator('li').count()===19&&await failed.getByRole('link',{name:'Download public results as JSON'}).isVisible());
}finally{await writeFile(resolve(out,'loader-report.json'),JSON.stringify({checks,audits},null,2));await browser.close();}
console.log(`${checks.length} resilient benchmark startup checks passed; ${audits.length} accessibility scans.`);
if(audits.some(a=>a.violations.length)){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
