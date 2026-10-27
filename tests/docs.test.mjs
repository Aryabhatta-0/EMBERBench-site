import assert from 'node:assert/strict';
import {readFile,readdir,access,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
const require=createRequire(import.meta.url),base=process.env.ANANTAM_BASE_URL||'http://127.0.0.1:8917/';
const out=resolve('work/docs');await mkdir(out,{recursive:true});
const checks=[],audits=[],errors=[];
const check=(name,condition)=>{assert.ok(condition,name);checks.push(name);};
const {docs,retired}=await import('../tools/docs-policy.mjs');
const files=docs.map(d=>d.id+'.html');
check('Only the 20 reviewed public guides are hosted and searchable',files.length===20);
for(const old of Object.keys(retired)){const html=await readFile('site/docs/'+old+'.html','utf8');check(old+' is a local explanatory retirement page',html.includes('docs-retired')&&html.includes('noindex'));}
const linkErrors=[];
for(const file of ['docs.html',...files.map(f=>'docs/'+f)]){
 const url=new URL('../site/'+file,import.meta.url),html=await readFile(url,'utf8');
 for(const [,href] of html.matchAll(/(?:href|src)="([^\"]+)"/g)){
  if(/^(?:https?:|data:)/.test(href))continue;
  const target=new URL(href.replace(/&amp;/g,'&'),url);
  try{
   const hash=decodeURIComponent(target.hash.slice(1));target.hash='';target.search='';await access(target);
   if(hash&&target.pathname.endsWith('.html')){
    const content=await readFile(target,'utf8');if(!content.includes(`id="${hash}"`))linkErrors.push(`${file}: missing #${hash} in ${target.pathname}`);
   }
  }catch(e){linkErrors.push(`${file}: ${href}: ${e.message}`);}
 }
}
if(linkErrors.length)console.log(linkErrors);
check('Every local documentation asset, guide and section link resolves',linkErrors.length===0);
const browser=await chromium.launch(),page=await browser.newPage();
page.on('pageerror',e=>errors.push(e.message));
const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const go=async route=>{await page.goto(new URL(route,base).href);await page.evaluate(()=>document.fonts.ready);};
const audit=async label=>{await page.evaluate(axe);audits.push({label,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});};
try{
 for(const width of [320,390,768,1440,1920]){
  await page.setViewportSize({width,height:width<700?844:1000});
  for(const route of ['docs.html','docs/scoring.html','docs/cli.html']){
   await go(route);
   check(`${width}px ${route} fits the page`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(`${width}px ${route} has one visible document title`,await page.locator('h1').count()===1&&await page.locator('h1').isVisible());
   if([390,1440].includes(width))await audit(`${width}px ${route}`);
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 for(const file of files){await go('docs/'+file);check(`${file} contains full documentation`,await page.locator('.docs-article').innerText().then(t=>t.length>(files.includes(file)&&['quickstart','site-data','development-generator','evaluation-boundary','replay-verification','archived-validation','versioning'].includes(file.slice(0,-5))?500:2000)));}
 await go('docs.html');await page.locator('#docs-search').fill('bootstrap');
 check('Hosted documentation uses the same complete company footer',await page.locator('.company-footer').evaluate(el=>el.querySelector('.footer-tagline').textContent==='Boundless Possibilities'&&el.querySelector('.footer-bottom').getBoundingClientRect().top>=el.querySelector('.footer-grid').getBoundingClientRect().bottom));
 await page.waitForFunction(()=>document.querySelector('#docs-search-status').textContent.includes('found'));
 check('Local full-text search finds concepts inside guides',await page.locator('.docs-search-results li').count()>0&&await page.locator('.docs-search-results').textContent().then(t=>t.toLowerCase().includes('bootstrap')));
 await audit('Documentation full-text search');
 await page.locator('#docs-search').fill('nothing-matches-anantam');await page.waitForFunction(()=>document.querySelector('#docs-search-status').textContent.startsWith('0 '));
 check('Search has a clear empty state',await page.locator('.docs-search-results').innerText().then(t=>t.includes('No guides match')));
 await page.locator('#clear-docs-search').click();check('Clearing search restores the complete library',await page.locator('.docs-intro').isVisible()&&await page.locator('.docs-nav-group:not([hidden])').count()===4);
 await page.getByRole('link',{name:'EMBER scoring',exact:true}).first().click();
 check('Guide selection stays on the website',new URL(page.url()).pathname.endsWith('/docs/scoring.html'));
 await page.locator('.docs-toc a[href="#6-aggregation"]').click();
 await page.waitForFunction(()=>{const r=document.getElementById('6-aggregation').getBoundingClientRect();return r.top>=0&&r.top<innerHeight/2;});
 check('Table of contents opens the actual section',await page.locator('[id="6-aggregation"]').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.top<innerHeight/2;}));
 await page.getByRole('link',{name:'benchmark-methodology.md',exact:true}).first().click();
 check('Cross-guide documentation links stay local',new URL(page.url()).pathname.endsWith('/docs/archived-validation.html'));
 await go('methodology.html');await page.getByRole('link',{name:'Normative scoring definition',exact:true}).click();
 check('Methodology protocol links open hosted guides',new URL(page.url()).pathname.endsWith('/docs/scoring.html'));
 await go('benchmark.html');await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name:'Docs',exact:true}).click();
 check('Results navigation opens the dedicated documentation page',new URL(page.url()).pathname.endsWith('/docs.html'));
 await page.route('**/data/results.js',r=>r.abort());await go('docs/scoring.html');
 check('Documentation does not depend on loading benchmark results',await page.locator('.docs-article').isVisible());
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),fallback=await nojs.newPage();
 await fallback.goto(new URL('docs/scoring.html',base).href);
 check('Full guide and local navigation work without JavaScript',await fallback.locator('.docs-article').isVisible()&&await fallback.locator('.docs-article').innerText().then(t=>t.includes('Safety'))&&await fallback.locator('.docs-nav-group a').count()===20);
 await nojs.close();
 await page.setViewportSize({width:390,height:844});await go('docs.html');
 await page.getByRole('button',{name:'Menu',exact:true}).click();await page.keyboard.press('Escape');
 check('Documentation mobile menu closes with focus restoration',await page.locator('.nav-toggle').getAttribute('aria-expanded')==='false'&&await page.locator('.nav-toggle').evaluate(el=>el===document.activeElement));
 await page.screenshot({path:resolve('..','Anantam-docs-phone.png')});
 check('Documentation journeys have no runtime errors',errors.length===0);
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify({checks,audits,errors},null,2));await browser.close();}
console.log(`${checks.length} documentation checks passed; ${audits.length} accessibility scans.`);
if(audits.some(a=>a.violations.length)){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
