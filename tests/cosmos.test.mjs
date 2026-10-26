import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
const base=new URL('benchmark.html',process.env.ANANTAM_BASE_URL || 'http://127.0.0.1:8917/').href;
const out=resolve(process.env.ANANTAM_QA_DIR || 'work/browser');await mkdir(out,{recursive:true});
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
const checks=[];const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);};
let release;const gate=new Promise(r=>release=r);
try{
  await page.route('**/data/results.js',async r=>{await gate;await r.continue();});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.loading-emblem')?.dataset.motion==='running');
  const pixels=()=>page.locator('.loading-emblem canvas').evaluate(el=>el.toDataURL());
  const first=await pixels();await page.waitForTimeout(250);
  check('Pending benchmark data has moving logo feedback',first!==await pixels());
  check('Original artwork stays unfiltered',await page.locator('.loading-emblem img').evaluate(el=>getComputedStyle(el).filter==='none'));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.loading-emblem')?.dataset.motion==='reduced');
  check('Reduced motion preserves still artwork',await page.locator('.loading-emblem canvas').isHidden() && await page.locator('.loading-emblem img').isVisible());
  release();await page.locator('#leaderboard table').waitFor();
  check('Data resolves into actual results, with no secondary hero',await page.locator('.loading-shell,.anantam-hero').count()===0);
}finally{release?.();await writeFile(resolve(out,'cosmos-report.json'),JSON.stringify({checks},null,2));await browser.close();}
console.log(`${checks.length} loading-motion checks passed.`);
