import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const base=process.env.ANANTAM_BASE_URL||'http://127.0.0.1:8917/';
const browser=await chromium.launch(),checks=[],audits=[],errors=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
await mkdir('work/navigation',{recursive:true});
try{
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&/Content Security Policy|violates/i.test(m.text()))errors.push(m.text());});
  await page.goto(new URL('about.html',base).href);
  await page.locator('.cookie-notice').waitFor();
  check(`${width}px notice text stays opaque throughout its entrance`,await page.locator('.cookie-notice').evaluate(el=>el.getAnimations().every(animation=>animation.effect.getKeyframes().every(frame=>frame.opacity===undefined||Number(frame.opacity)===1))));
  check(`${width}px first visit offers both choices without saving`,await page.getByRole('button',{name:'Accept optional',exact:true}).isVisible()&&await page.getByRole('button',{name:'Reject optional',exact:true}).isVisible()&&await page.evaluate(()=>localStorage.getItem('anantam-preferences')===null));
  await page.evaluate(axe);audits.push({name:`First visit ${width}`,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))});
  await page.screenshot({path:`work/navigation/about-notice-${width}.png`});
  await page.evaluate(()=>{window.noticeIndex=document.querySelector('.legal-index');});
  await page.locator('.cookie-notice').getByRole('link',{name:'Preferences',exact:true}).click();
  await page.waitForURL('**/cookies.html');
  check(`${width}px the notice Preferences link also keeps the actual sidebar`,await page.evaluate(()=>noticeIndex===document.querySelector('.legal-index')));
  await page.locator('.legal-index').getByRole('link',{name:'About',exact:true}).click();await page.waitForURL('**/about.html');
  await page.getByRole('button',{name:'Reject optional',exact:true}).click();
  check(`${width}px decline is remembered and notice closes`,await page.locator('.cookie-notice').count()===0&&await page.evaluate(()=>localStorage.getItem('anantam-preferences')==='off'));
  await page.evaluate(()=>{window.savedIndex=document.querySelector('.legal-index');window.savedHeader=document.querySelector('.site-header');});
  const before=await page.locator('.legal-index').boundingBox();
  await page.locator('.legal-index').getByRole('link',{name:'Cookies & preferences',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.legal-article h1')?.textContent==='Cookies and preferences');
  const after=await page.locator('.legal-index').boundingBox();
  check(`${width}px switching preserves the actual sidebar and header nodes`,await page.evaluate(()=>savedIndex===document.querySelector('.legal-index')&&savedHeader===document.querySelector('.site-header')));
  check(`${width}px switching does not shift the sidebar`,Math.abs(before.x-after.x)<1&&Math.abs(before.y-after.y)<1&&Math.abs(before.width-after.width)<1);
  check(`${width}px URL/title/canonical and keyboard focus follow the article`,page.url().endsWith('/cookies.html')&&(await page.title()).startsWith('Cookies')&&await page.locator('link[rel=canonical]').getAttribute('href').then(s=>s.endsWith('/cookies.html'))&&await page.evaluate(()=>document.activeElement===document.querySelector('.legal-article h1')));
  await page.locator('#remember-comparisons').check();await page.getByRole('button',{name:'Save preferences',exact:true}).click();
  check(`${width}px article controls remain bound after switching`,await page.evaluate(()=>localStorage.getItem('anantam-preferences')==='remember-comparisons'));
  await page.goBack();await page.waitForFunction(()=>document.querySelector('.legal-article h1')?.textContent==='About Anantam');
  await page.goForward();await page.waitForFunction(()=>document.querySelector('.legal-article h1')?.textContent==='Cookies and preferences');
  check(`${width}px Back and Forward preserve the shell and preference state`,await page.evaluate(()=>savedIndex===document.querySelector('.legal-index'))&&await page.locator('#remember-comparisons').isChecked());
  await page.screenshot({path:`work/navigation/cookies-${width}.png`});
  await page.reload();await page.locator('#remember-comparisons').waitFor();
  check(`${width}px refresh keeps the chosen preference without another notice`,await page.locator('#remember-comparisons').isChecked()&&await page.locator('.cookie-notice').count()===0);
  check(`${width}px no sideways overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(axe);audits.push({name:`Cookie controls ${width}`,violations:await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))});
  {
   await page.locator('.legal-index').getByRole('link',{name:'Privacy',exact:true}).click();await page.waitForURL('**/privacy.html');
   await page.evaluate(()=>scrollTo({top:400,behavior:'instant'}));
   const scrolled=await page.locator('.legal-index').boundingBox();
   await page.locator('.legal-index').getByRole('link',{name:'About',exact:true}).click();await page.waitForURL('**/about.html');
   const top=await page.locator('.legal-index').boundingBox();
   check(`${width}px changing a scrolled article keeps the index stationary`,Math.abs(scrolled.y-top.y)<1);
   await page.goBack();await page.waitForURL('**/privacy.html');
   check(`${width}px Back restores the previous reading position`,await page.evaluate(()=>Math.abs(scrollY-400)<2));
  }
  await context.close();
 }
 const cold=await browser.newPage({viewport:{width:1440,height:900}});let releaseCommon;const commonGate=new Promise(r=>releaseCommon=r);
 await cold.route('**/common.js*',async route=>{await commonGate;await route.continue();});
 await cold.goto(new URL('about.html',base).href,{waitUntil:'commit'});await cold.locator('.legal-index').waitFor();
 await cold.evaluate(()=>{window.coldIndex=document.querySelector('.legal-index');});
 await cold.locator('.legal-index').getByRole('link',{name:'Cookies & preferences',exact:true}).click();await cold.waitForFunction(()=>location.pathname.endsWith('/cookies.html'));
 check('A cold click retains the index before shared modules have loaded',await cold.evaluate(()=>window.coldIndex===document.querySelector('.legal-index')));
 releaseCommon();await cold.waitForFunction(()=>document.querySelector('.site-header')?.dataset.bound==='true');
 await cold.locator('#remember-comparisons').check();await cold.getByRole('button',{name:'Save preferences',exact:true}).click();
 check('Late preference enhancement binds the currently selected article',await cold.evaluate(()=>localStorage.getItem('anantam-preferences')==='remember-comparisons'));
 await cold.close();
 const page=await browser.newPage();await page.goto(new URL('index.html',base).href);
 await page.getByRole('button',{name:'Accept optional',exact:true}).click();
 check('Accept enables only the named comparison preference',await page.evaluate(()=>localStorage.getItem('anantam-preferences')==='remember-comparisons'&&localStorage.getItem('ember-compare')===null));
 for(const path of ['methodology.html','docs.html','docs/scoring.html','about.html','privacy.html']){
  await page.goto(new URL(path,base).href);await page.locator('.site-header').waitFor();
  check(`${path}: About stays available with no footer`,await page.locator('.site-nav').getByRole('link',{name:'About',exact:true}).count()===1&&await page.locator('.site-footer').count()===0);
 }
 const blocked=await browser.newPage();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Blocked');}}));await blocked.goto(new URL('about.html',base).href);
 await blocked.getByRole('button',{name:'Accept optional',exact:true}).click();
 check('Blocked storage gives truthful feedback without claiming consent was saved',await blocked.locator('.cookie-status').innerText().then(t=>t.includes('blocks storage')));
 await blocked.getByRole('button',{name:'Continue without saving',exact:true}).click();
 check('A blocked-store visitor can dismiss for the current visit',await blocked.locator('.cookie-notice').count()===0);
 const nojs=await browser.newContext({javaScriptEnabled:false}),plain=await nojs.newPage();await plain.goto(new URL('about.html',base).href);
 await plain.locator('.legal-index').getByRole('link',{name:'Privacy',exact:true}).click();
 check('Native links and reading still work without JavaScript',plain.url().endsWith('/privacy.html')&&await plain.locator('h1').isVisible());
 check('Navigation and consent have no runtime or CSP errors',errors.length===0);
}finally{await writeFile('work/navigation/report.json',JSON.stringify({checks,audits,errors},null,2));await browser.close();}
console.log(`${checks.length} navigation/consent checks passed; ${audits.length} accessibility scans.`);
if(audits.some(a=>a.violations.length)){console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
