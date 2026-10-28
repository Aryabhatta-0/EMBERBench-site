// Repeatable cold-load lab measurements; not field Core Web Vitals.
import {chromium} from 'playwright';
import {writeFile,mkdir} from 'node:fs/promises';
const base=process.env.ANANTAM_BASE_URL||'http://127.0.0.1:8937/';
const browser=await chromium.launch(),runs=[];
try{for(let i=0;i<3;i++){
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.addInitScript(()=>{
  window.lab={lcp:0,cls:0,longTasks:0};
  new PerformanceObserver(list=>{for(const e of list.getEntries())window.lab.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.lab.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{window.lab.longTasks+=list.getEntries().length;}).observe({type:'longtask',buffered:true});
 });
 await page.goto(base,{waitUntil:'load',timeout:60000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(3500);
 runs.push(await page.evaluate(()=>({...window.lab,load:performance.getEntriesByType('navigation')[0].loadEventEnd,bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.encodedBodySize,0),requests:performance.getEntriesByType('resource').length})));
 await context.close();
}}finally{await browser.close();}
const median=key=>[...runs].map(r=>r[key]).sort((a,b)=>a-b)[1];
const result={conditions:'390×844, cold cache, 1.6 Mbps, 150 ms latency, 4× CPU slowdown, 3 Chromium runs',base,runs,median:Object.fromEntries(['lcp','cls','load','bytes','requests','longTasks'].map(k=>[k,median(k)]))};
await mkdir('work',{recursive:true});await writeFile(process.argv[2]||'work/performance.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.median));
