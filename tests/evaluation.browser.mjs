// Synthetic rendering checks only. Never reads private evaluation inputs.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {chromium} from 'playwright';
import {evaluationSection} from '../tools/evaluation/render.mjs';
import {BATCH} from '../tools/evaluation/contract.mjs';
const require=createRequire(import.meta.url),axe=await readFile(require.resolve('axe-core/axe.min.js'),'utf8');
const providers=['openai','anthropic','google','deepseek','mistral','qwen'];
const models=Array.from({length:12},(_,i)=>({id:`synthetic-${i}`,name:`${providers[i%providers.length]}/synthetic-${i}`,official_score:96-i*8,ci95:[Math.max(0,86-i*8),Math.min(100,99-i*8)],zero_score_share:i/20,refusal_rate:i/40,usd_suite:i===11?null:i/100,calls:i===11?null:i*20,tokens:{input:i===11?null:i*100,output:i===11?null:i*10},wall_time_s:i===11?null:i*30,run_date:'2026-10-28'}));
const snapshot={batch_label:BATCH,manifest_hash:'a'.repeat(64),harness_version:'1.0',scoring_version:'1.1',run_date:'2026-10-28',models,adjacent_pairs:models.slice(1).map((m,i)=>({model_a:models[i].id,model_b:m.id,separates:i%2===0}))};
const html=ready=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Local synthetic evaluation preview</title><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="anantam.css"><link rel="stylesheet" href="__evaluation.css"></head><body><main style="max-width:none;margin:0;padding:0"><header style="padding:24px 32px"><h1 style="font:500 18px var(--font-body)">LOCAL SYNTHETIC TEST PREVIEW — not benchmark results</h1></header>${evaluationSection(ready?snapshot:null)}</main></body></html>`;
const server=createServer(async(req,res)=>{
 try{
  const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/__pending'||path==='/__ready'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, nofollow'});res.end(html(path==='/__ready'));return;}
  if(path==='/__evaluation.css'){res.writeHead(200,{'Content-Type':'text/css'});res.end(await readFile('design/evaluation-section.css'));return;}
  if(!/^\/(?:style\.css|anantam\.css|assets\/(?:fonts|providers)\/[A-Za-z0-9_.-]+)$/.test(path)){res.writeHead(404);res.end();return;}
  const type=path.endsWith('.css')?'text/css':path.endsWith('.svg')?'image/svg+xml':'font/woff2';
  res.writeHead(200,{'Content-Type':type});res.end(await readFile(resolve('site',path.slice(1))));
 }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`,browser=await chromium.launch(),checks=[],audits=[],errors=[];
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
await mkdir('work/evaluation',{recursive:true});
try{
 for(const width of [1440,390,320]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  for(const state of ['pending','ready']){
   await page.goto(`${base}/__${state}`);await page.evaluate(()=>document.fonts.ready);
   check(`${width}px ${state}: no horizontal page scrolling`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   check(`${width}px ${state}: synthetic preview never indexable`,await page.locator('meta[name=robots]').getAttribute('content')==='noindex,nofollow');
   if(state==='pending'){
    check(`${width}px pending: truthful and has no model scores`,await page.getByText('No results published yet.').isVisible()&&await page.locator('.evaluation-chart,.evaluation-model').count()===0);
   }else{
    check(`${width}px ready: all seven charts contain every model`,await page.locator('.evaluation-chart').count()===7&&(await page.locator('.evaluation-columns').evaluateAll(plots=>plots.every(p=>p.children.length===12))));
    check(`${width}px ready: each series descends independently with missing last`,await page.locator('.evaluation-columns').evaluateAll(plots=>plots.every(plot=>{let previous=Infinity,missing=false;return [...plot.children].every(column=>{const raw=column.dataset.value;if(raw===''){missing=true;return true;}const n=Number(raw),ok=!missing&&n<=previous;previous=n;return ok;});})));
    check(`${width}px ready: bars are vertical, share a zero baseline and use readable bands`,await page.locator('.evaluation-columns').evaluateAll(plots=>plots.every(plot=>{const columns=[...plot.children],wells=columns.map(c=>c.querySelector('.evaluation-well'));return wells.every(w=>{const bar=w.querySelector('.evaluation-bar');return w.getBoundingClientRect().height>=200&&w.clientWidth>=75&&(!bar||(getComputedStyle(bar).bottom==='0px'&&bar.clientWidth<bar.parentElement.clientWidth));})&&new Set(wells.map(w=>Math.round(w.getBoundingClientRect().top))).size>1;})));
    check(`${width}px ready: every score has a readable 95% interval and run date`,await page.locator('.evaluation-ci').count()===12&&await page.getByText(/^95% CI /).count()===12&&await page.getByText('Run date 2026-10-28',{exact:true}).count()===12);
    check(`${width}px ready: actual provider artwork and zero values remain distinct from missing`,await page.locator('.evaluation-model img').count()>0&&await page.locator('[data-evaluation-metric=usd_suite] strong').allTextContents().then(values=>values.includes('$0.0000')&&values.includes('Not reported')));
    check(`${width}px ready: paired decisions include resolved and unresolved results`,await page.getByText('Difference detected',{exact:true}).count()===6&&await page.getByText('Not resolved',{exact:true}).count()===5);
    check(`${width}px ready: no comparison tables, drill-downs or zoom controls`,await page.locator('table,a,button,input,select').count()===0);
   }
   await page.evaluate(axe);
   const violations=await page.evaluate(async()=>(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
   audits.push({name:`${state} ${width}px`,violations});check(`${width}px ${state}: WCAG AA scan`,violations.length===0);
   await page.screenshot({path:`work/evaluation/${state}-${width}.png`});
  }
  await context.close();
 }
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:900}}),page=await context.newPage();
 await page.goto(`${base}/__ready`);
 check('All aggregate evidence remains readable without JavaScript',await page.locator('.evaluation-chart').count()===7&&await page.getByText('Not resolved',{exact:true}).count()===5);
 await context.close();check('No browser runtime errors',errors.length===0);
 await writeFile('work/evaluation/report.json',JSON.stringify({synthetic:true,checks,audits,errors},null,2)+'\n');
 console.log(`Evaluation preparation: ${checks.length} browser checks and ${audits.length} accessibility scans passed using synthetic data only.`);
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
