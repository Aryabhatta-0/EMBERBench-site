// Dependency-free release checks: run after the stricter publication boundary.
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {searchIdentity,verificationMeta,verificationFile} from './search-identity.mjs';
const root=resolve(process.argv[2]||'site'),origin='https://anantam-labs.vercel.app';
const read=path=>readFile(resolve(root,path),'utf8');
const verificationConfig=JSON.parse(await readFile(new URL('./search-verification.json',import.meta.url),'utf8')),googleFile=verificationFile(verificationConfig);
const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));
assert(!config.rewrites&&!config.headers,'Advanced routes must not be mixed with competing routing systems');
assert(config.routes.some(r=>r.handle==='filesystem'),'Static files must retain normal delivery');
assert.equal(config.routes.at(-1).status,404,'Missing HTML must not become a soft 404');
assert(config.routes.some(r=>r.status===404&&r.dest==='/404.md'&&r.headers?.['Content-Type']?.startsWith('text/markdown')),'Missing Markdown needs a real 404');
const headers=config.routes[0].headers;
for(const key of ['Content-Security-Policy','X-Content-Type-Options','X-Frame-Options','Referrer-Policy','Permissions-Policy','Strict-Transport-Security'])assert(headers[key],`Missing ${key}`);
assert(headers['Content-Security-Policy'].includes("frame-ancestors 'none'"));
assert(!/script-src[^;]*'unsafe-(?:inline|eval)'/.test(headers['Content-Security-Policy']));
assert.equal(headers['X-Content-Type-Options'],'nosniff');
assert(config.routes.some(r=>r.src==='/'&&r.dest==='/index.md'&&r.has?.[0]?.key==='accept'),'Explicit Markdown negotiation is missing');
const files=[...(await readdir(root)).filter(n=>n.endsWith('.html')&&n!==googleFile?.file),...(await readdir(resolve(root,'docs'))).filter(n=>n.endsWith('.html')).map(n=>'docs/'+n)];
if(googleFile){
 assert.equal(await read(googleFile.file),googleFile.content,'Google ownership file must retain its exact body');
 assert(!((await read('sitemap.xml')).includes(googleFile.file)),'Ownership file must not enter the sitemap');
 assert(config.routes.some(r=>r.src==='/'+googleFile.file.replaceAll('.','\\.')&&r.continue===true&&r.headers?.['X-Robots-Tag']==='noindex'&&!r.dest&&!r.status),'Ownership file must be served directly');
}
const indexable=new Set();let pages=0;
for(const file of files){
 const html=await read(file),head=html.match(/<head>([\s\S]*?)<\/head>/)?.[1];assert(head,`Missing head: ${file}`);
 assert.equal((head.match(/<title>/g)||[]).length,1,`Duplicate title: ${file}`);
 assert.equal((head.match(/name="description"/g)||[]).length,1,`Missing/duplicate description: ${file}`);
 assert.equal((head.match(/name="robots"/g)||[]).length,1,`Missing/duplicate robots: ${file}`);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`Main heading: ${file}`);
 assert.equal((html.match(/class="site-header"/g)||[]).length,1,`Shared navigation: ${file}`);
 const noFooter=file.startsWith('docs/')||['docs.html','methodology.html','about.html','contact.html','privacy.html','terms.html','cookies.html','accessibility.html'].includes(file);
 assert.equal((html.match(/class="site-footer company-footer"/g)||[]).length,noFooter?0:1,`Footer scope: ${file}`);
 assert(html.includes('consent.js?')&&html.includes('consent.css?'),`Consent entry point: ${file}`);
 assert(html.includes('about.html'),`About navigation: ${file}`);
 if(!noFooter)for(const name of ['privacy','terms','cookies','accessibility'])assert(html.includes(`/${name}.html`)||html.includes(`"${name}.html"`),`Missing policy link ${name} in ${file}`);
 const canonical=head.match(/rel="canonical" href="([^"]+)"/)?.[1];
 if(file!=='404.html')assert(canonical?.startsWith(origin+'/'),`Wrong canonical: ${file}`);
 const noindex=/name="robots" content="noindex/.test(head);if(!noindex)indexable.add(canonical);
 for(const key of ['og:title','og:description','og:url','og:image','og:image:alt'])assert(head.includes(`property="${key}"`),`Missing social ${key}: ${file}`);
 for(const [,json] of head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(json);assert.equal(data['@context'],'https://schema.org');
  const digest="'sha256-"+createHash('sha256').update(json).digest('base64')+"'";assert(headers['Content-Security-Policy'].includes(digest),`CSP blocks schema: ${file}`);
  const org=data['@graph'].find(x=>x['@type']==='Organization');assert.equal(org.name,'Anantam');assert.equal(org.contactPoint.email,'arsathvik48@gmail.com');
  assert.equal(org.alternateName,searchIdentity.alternateName);assert.deepEqual(org.sameAs,[searchIdentity.profile]);
  assert.equal(data['@graph'].find(x=>x['@type']==='WebSite').alternateName,searchIdentity.alternateName);
  for(const field of ['address','legalName','taxID','foundingDate','aggregateRating'])assert(!(field in org),`Invented identity field: ${field}`);
 }
 assert(head.includes('application/ld+json'),`No structured identity: ${file}`);
 const alternate=head.match(/rel="alternate" type="text\/markdown" href="([^"]+)"/)?.[1];if(alternate){assert(alternate.startsWith(origin+'/'));assert((await stat(resolve(root,new URL(alternate).pathname.slice(1)))).isFile(),`Broken Markdown: ${file}`);}
 assert(!/(?:href|src)="\/EMBERBench-site\//.test(html),`Retired hosting path in ${file}`);pages++;
}
const sitemap=await read('sitemap.xml'),urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,urls.length,'Duplicate sitemap entries');assert.deepEqual([...indexable].sort(),urls.sort(),'Sitemap must match indexable canonical HTML');
assert((await read('robots.txt')).includes('Sitemap: '+origin+'/sitemap.xml'));
const data=JSON.parse(await read('data/leaderboard.json'));
const raw=await read('data/results.js'),source=JSON.parse(raw.replace(/^\/\/[^\n]*\n/,'').trim().slice('export default '.length).replace(/;\s*$/,''));
assert.equal(data.source.sha256,createHash('sha256').update(raw.replace(/\r\n/g,'\n')).digest('hex'));
assert.equal(data.models.length,source.models.length);assert(data.scope.includes('not official hidden-test'));
for(const m of data.models){const original=source.models.find(x=>x.id===m.id);assert(original);assert.equal(m.ember_score,original.score);assert.equal(m.published_rank,original.rank);assert.equal(m.safety,original.safety);assert.equal(m.execution_quality,original.quality);assert.deepEqual(m.confidence_interval,original.ci);}
const benchmark=await read('benchmark.html');assert(benchmark.includes('data-static-results')&&benchmark.includes('data-page-loader'),'Benchmark keeps static results and a progressive emblem loader');
const home=await read('index.html'),about=await read('about.html');
assert(home.includes('<title>Anantam Labs |')&&home.includes('Anantam Labs’ first contribution'),'Search name must match visible homepage content');
assert(about.includes('also known as Anantam Labs'),'About must establish the same name');
const verification=verificationMeta(verificationConfig);
assert.equal((home.match(/name="google-site-verification"/g)||[]).length,verification?1:0,'Unexpected or duplicate verification tag');
if(verification)assert(home.includes(verification),'Owner verification must survive rebuilds');
for(const m of data.models.filter(x=>x.kind==='Decision model'))assert(benchmark.includes(m.ember_score.toFixed(2)),`Missing initial score: ${m.id}`);
for(const path of ['index.md','benchmark.md','docs.md','llms.txt','privacy.html','terms.html','cookies.html','about.html','contact.html'])assert((await read(path)).length>500,`Empty discovery/policy page: ${path}`);
const llms=await read('llms.txt');assert(llms.includes('one trial')&&llms.includes('not an inference API')&&llms.includes('sole published contribution'));
const security=await read('.well-known/security.txt');assert(security.includes('Contact: mailto:arsathvik48@gmail.com'));assert(new Date(security.match(/Expires: ([^\n]+)/)[1])>new Date(),'Expired security contact');
console.log(`Production checks passed: ${pages} HTML pages, ${urls.length} indexable URLs, ${data.models.length} unaltered model records, policies, schema, Markdown and security routes.`);
