import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),base=process.env.ANANTAM_BASE_URL||'http://127.0.0.1:8917/';
const axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8'),browser=await chromium.launch(),checks=[],audits=[],errors=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
const context=await browser.newContext(),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
const go=async path=>{await page.goto(new URL(path,base).href);await page.evaluate(()=>document.fonts.ready);};
try{
 for(const width of [320,390,1440]){
  await page.setViewportSize({width,height:900});
  for(const id of ['about','contact','privacy','terms','cookies','accessibility']){
   await go(id+'.html');
   check(`${width}px ${id}: readable policy and shared links`,await page.locator('h1').count()===1&&await page.locator('.legal-article').innerText().then(t=>t.length>500)&&await page.locator('.legal-index a').count()===6&&await page.locator('.site-footer').count()===0);
   check(`${width}px ${id}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.evaluate(axe);audits.push({name:`${id} ${width}`,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))});
  }
 }
 await go('compare.html');await page.locator('[data-model-slot="0"]').waitFor();
 const option=await page.locator('[data-model-slot="0"] option:not([disabled])').evaluateAll(es=>es.find(e=>e.value&&!e.selected).value);
 await page.locator('[data-model-slot="0"]').selectOption(option);
 check('Comparison works before consent without saving optional data',await page.evaluate(()=>localStorage.getItem('ember-compare')===null&&localStorage.getItem('anantam-preferences')===null));
 await go('cookies.html');check('Device memory defaults to off',!await page.locator('#remember-comparisons').isChecked());
 await page.locator('#remember-comparisons').check();await page.getByRole('button',{name:'Save preferences',exact:true}).click();
 check('Explicit choice enables optional memory',await page.evaluate(()=>localStorage.getItem('anantam-preferences')==='remember-comparisons')&&(await page.getByRole('status').innerText()).includes('enabled'));
 await go('compare.html');await page.locator('[data-model-slot="0"]').waitFor();
 const next=await page.locator('[data-model-slot="0"] option:not([disabled])').evaluateAll(es=>es.find(e=>e.value&&!e.selected).value);
 await page.locator('[data-model-slot="0"]').selectOption(next);
 check('Selections persist only after the explicit choice',await page.evaluate(()=>JSON.parse(localStorage.getItem('ember-compare')).length>=2));
 await go('cookies.html');await page.locator('#remember-comparisons').uncheck();await page.getByRole('button',{name:'Save preferences',exact:true}).click();
 check('Withdrawing memory removes saved selections',await page.evaluate(()=>localStorage.getItem('ember-compare')===null&&localStorage.getItem('anantam-preferences')==='off'));
 await page.evaluate(()=>{localStorage.setItem('unrelated-app-sentinel','preserve');localStorage.setItem('ember-theme','dark');});
 await page.getByRole('button',{name:'Clear saved website data',exact:true}).click();
 check('Clear removes only this website’s known keys',await page.evaluate(()=>localStorage.getItem('anantam-preferences')===null&&localStorage.getItem('ember-theme')===null&&localStorage.getItem('unrelated-app-sentinel')==='preserve'));
 check('The application sets no cookies',(await context.cookies()).length===0);
 const blocked=await browser.newPage();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked');}}));await blocked.goto(new URL('cookies.html',base).href);
 await blocked.locator('#remember-comparisons').check();await blocked.getByRole('button',{name:'Save preferences',exact:true}).click();
 check('Blocked storage reports failure without pretending to save',await blocked.getByRole('status').innerText().then(t=>t.includes('could not save')));await blocked.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await nojs.newPage();
 for(const path of ['index.html','benchmark.html','methodology.html','scenarios.html','privacy.html','terms.html','cookies.html','about.html','contact.html','docs/scoring.html']){
  await plain.goto(new URL(path,base).href);
  check(`${path} works as readable HTML without JavaScript`,await plain.locator('h1').count()===1&&await plain.locator('main').innerText().then(t=>t.length>300)&&await plain.locator('h1').isVisible());
 }
 await nojs.close();
 check('Policies identify a real contact and no invented registration',await page.locator('.legal-article').innerText().then(t=>t.includes('arsathvik48@gmail.com')));
 check('Production privacy journeys have no runtime errors',errors.length===0);
}finally{await mkdir('work/production',{recursive:true});await writeFile('work/production/browser-report.json',JSON.stringify({checks,audits,errors},null,2));await browser.close();}
console.log(`${checks.length} production/privacy checks passed; ${audits.length} accessibility scans.`);
if(audits.some(a=>a.violations.length)){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
