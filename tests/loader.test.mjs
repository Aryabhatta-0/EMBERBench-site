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
  check(`${name}: supplied logo is visible during the pending import`,await page.locator('[data-page-loader]').isVisible()&&await page.locator('.loading-emblem img').evaluate(i=>i.complete&&i.naturalWidth>0));
  check(`${name}: public scope remains in the source fallback`,(await page.locator('[data-static-results]').textContent()).includes('not contamination-resistant'));
  check(`${name}: only the actual loader is presented while waiting`,!await page.locator('[data-static-results]').isVisible()&&await page.locator('main').getAttribute('aria-busy')==='true');
  check(`${name}: the cookie notice does not cover the loading logo`,await page.locator('.loading-emblem').evaluate(el=>{const logo=el.getBoundingClientRect(),notice=document.querySelector('.cookie-notice')?.getBoundingClientRect();return !notice||logo.bottom<=notice.top||logo.right<=notice.left||logo.left>=notice.right;}));
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
 for(const path of ['methodology.html','benchmark.html']){
  const slow=await browser.newPage();let release;const pending=new Promise(r=>release=r);
  await slow.route('**/data/results.js',async route=>{await pending;await route.continue();});
  await slow.goto(new URL(path,base).href,{waitUntil:'domcontentloaded'});
  check(`${path}: logo is centered in the available window`,await slow.locator('[data-page-loader]').isVisible()&&await slow.locator('.loading-emblem').evaluate(el=>{const r=el.getBoundingClientRect();return Math.abs(r.left+r.width/2-innerWidth/2)<2;}));
  await slow.waitForFunction(()=>!document.querySelector('[data-page-loader]'),{timeout:12000});
  check(`${path}: slow imports reveal useful static content after the timeout`,await slow.locator('[data-static-results],[data-static-reading]').isVisible()&&await slow.locator('h1').isVisible());
  release();await slow.close();
 }
}finally{await writeFile(resolve(out,'loader-report.json'),JSON.stringify({checks,audits},null,2));await browser.close();}
console.log(`${checks.length} resilient benchmark startup checks passed; ${audits.length} accessibility scans.`);
if(audits.some(a=>a.violations.length)){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
