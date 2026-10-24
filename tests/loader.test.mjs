import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.ANANTAM_PLAYWRIGHT_PATH || 'playwright');
const axe=await readFile(process.env.ANANTAM_AXE_PATH || require.resolve('axe-core/axe.min.js'),'utf8');
const out=resolve(process.env.ANANTAM_QA_DIR || 'work/browser');
const base=process.env.ANANTAM_BASE_URL || 'http://127.0.0.1:8917/';
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const checks=[],audits=[];
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);};
try {
  for (const [name,theme,width,height,reduced] of [['desktop','light',1440,1000,false],['phone-dark','dark',390,844,false],['sidebar-dark','dark',543,750,false],['small-reduced','light',320,568,true],['landscape','dark',844,390,false]]) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'});
    await context.addInitScript(theme=>localStorage.setItem('ember-theme',theme),theme);
    const page=await context.newPage(); let release;
    const gate=new Promise(r=>release=r);
    await page.route('**/data/results.js',async r=>{await gate;await r.continue();});
    await page.goto(base,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(reduced=>document.querySelector('.loading-emblem')?.dataset.motion===(reduced?'reduced':'running'),reduced);
    await page.evaluate(()=>document.fonts.ready);
    check(`${name}: real emblem and concise identity`,await page.locator('.loading-emblem img').getAttribute('src')==='assets/anantam-logo.png' && await page.locator('h1').textContent()==='Anantam');
    check(`${name}: no skeleton or card`,await page.locator('.loading-shell .skeleton-rows,.loading-shell .panel,.loading-shell .loading-canvas').count()===0);
    check(`${name}: original artwork colour`,await page.locator('.loading-emblem img').evaluate(el=>getComputedStyle(el).filter==='none'));
    check(`${name}: fits viewport`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth && document.documentElement.scrollHeight<=innerHeight+1));
    check(`${name}: loading state described`,await page.getByRole('status').textContent()==='Opening Anantam.');
    if (reduced) check('Reduced motion keeps still logo and status',await page.locator('.cosmos-sky').isHidden() && await page.locator('.cosmos-toggle').isHidden());
    if (name==='desktop') {
      const pixels=()=>page.locator('.loading-emblem canvas').evaluate(el=>el.toDataURL());
      const initial=await pixels(); await page.waitForTimeout(180);
      check('Logo loading has moving depth',initial!==await pixels());
      await page.getByRole('button',{name:'Pause motion',exact:true}).click();
      const still=await pixels(); await page.waitForTimeout(180);
      check('Loading motion can pause',still===await pixels());
      await page.getByRole('button',{name:'Play motion',exact:true}).press('Enter');
      await page.waitForTimeout(180); check('Keyboard resumes loading motion',still!==await pixels());
      await page.locator('.loading-emblem canvas').evaluate(el=>{window.detachedLoader=el;});
    }
    await page.screenshot({path:resolve(out,`logo-loader-${name}.png`),animations:'disabled'});
    await page.evaluate(axe);
    const violations=await page.evaluate(async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
    audits.push({name,violations});
    release(); await page.locator('.site-footer').waitFor();
    await page.waitForFunction(()=>!document.querySelector('.loading-shell') && !document.querySelector('main').hasAttribute('aria-busy'));
    check(`${name}: real content replaces loader`,await page.getByRole('heading',{name:'Intelligence, measured.',exact:true}).isVisible());
    if (name==='desktop') {
      const frozen=await page.evaluate(()=>window.detachedLoader.toDataURL()); await page.waitForTimeout(180);
      check('Detached loader stops rendering',frozen===await page.evaluate(()=>window.detachedLoader.toDataURL()));
      await page.waitForFunction(()=>document.querySelector('.hero-art .cosmos-emblem')?.dataset.motion==='running');
      check('Home logo animation starts after loader cleanup',await page.getByRole('button',{name:'Pause motion',exact:true}).isVisible());
    }
    await context.close();
  }
  const failed=await browser.newPage();
  await failed.route('**/data/results.js',r=>r.abort());
  await failed.goto(base); await failed.getByRole('heading',{name:'Results unavailable',exact:true}).waitFor();
  await failed.waitForFunction(()=>!document.querySelector('main').hasAttribute('aria-busy'));
  check('Data failure clears loading and exposes recovery',await failed.getByRole('link',{name:'Return to overview',exact:true}).isVisible() && await failed.locator('.loading-shell').count()===0);
} finally {
  await writeFile(resolve(out,'loader-report.json'),JSON.stringify({checks,audits},null,2));
  await browser.close();
}
console.log(`${checks.length} logo-loader checks passed; ${audits.length} accessibility scans.`);
if (audits.some(a=>a.violations.length)) {console.log(JSON.stringify(audits.filter(a=>a.violations.length),null,2));process.exitCode=1;}
