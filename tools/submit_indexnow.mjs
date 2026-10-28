// One-off notification of public canonical URLs, after production promotion.
// https://www.indexnow.org/documentation — acceptance does not mean indexing.
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const config=JSON.parse(await readFile(new URL('./indexnow.json',import.meta.url),'utf8'));
const origin='https://anantam-labs.vercel.app';
assert.equal(config.host,new URL(origin).host);assert.match(config.key,/^[a-f0-9]{32}$/);
assert.equal(config.keyLocation,`${origin}/${config.key}.txt`);
assert.equal((await readFile('site/'+config.key+'.txt','utf8')).trim(),config.key);
const sitemap=await readFile('site/sitemap.xml','utf8'),urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert(urls.length>0&&urls.length<=10000&&new Set(urls).size===urls.length);
assert(urls.every(url=>new URL(url).origin===origin&&!new URL(url).search&&!new URL(url).hash));
const body={...config,urlList:urls};
if(!process.argv.includes('--submit')){console.log(`Ready to notify IndexNow of ${urls.length} canonical public URLs. Use --submit only after these artifacts are live.`);process.exit(0);}
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
const receipt={submitted_at:new Date().toISOString(),endpoint:'https://api.indexnow.org/indexnow',host:config.host,url_count:urls.length,http_status:response.status,response:(await response.text()).slice(0,2000),meaning:'Receipt/acceptance only; indexing and ranking are decided by each search engine.'};
await mkdir('work/production',{recursive:true});await writeFile('work/production/indexnow-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));if(![200,202].includes(response.status))process.exitCode=1;
