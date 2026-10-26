import {siteFooter} from '../site/footer.js';
// Build a static, self-contained documentation library. No runtime GitHub dependency.
import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import {resolve,posix} from 'node:path';
import {execFileSync} from 'node:child_process';
import {marked} from 'marked';
import sanitizeHtml from 'sanitize-html';

const root=resolve('site'),out=resolve(root,'docs'),sources=resolve(out,'source');
const version='20261027-boundless-1';
const groups=[
 ['Start here',[
  ['quickstart','Overview & setup','What EMBERBench measures, installation and a first evaluation.'],
  ['cli','Command line','Commands, arguments and repeatable workflows.'],
  ['model-interface','Model interface','Observations, actions and the decision-model contract.'],
  ['site-data','Published site data','How this site is generated and how to interpret API measurements.'],
 ]],
 ['Evaluation & scoring',[
  ['scoring','EMBER scoring','The complete score definition, aggregation and ranking rules.'],
  ['metrics','Episode metrics','Raw outcomes, timing, paths and authenticated measurements.'],
  ['scenario-suite','Public scenarios','The ten diagnostic scenarios and their design intent.'],
  ['evaluation','Running evaluations','Paired evaluation schedules, records and result handling.'],
  ['environment-pack','Frozen environments','EnvironmentPack construction, digests and matched fire worlds.'],
  ['simulation-contract','Simulation contract','Movement, collisions, exits and fire semantics.'],
  ['v1-fairness-spec','Fairness specification','Information boundaries and the frozen V1 protocol.'],
  ['integrity','Integrity & provenance','Validation, replay authentication and held-out evaluation.'],
  ['baselines','Reference agents','Hand-coded agents and planning references.'],
  ['statistics','Statistical analysis','Intervals, resampling and paired comparisons.'],
 ]],
 ['Research & design',[
  ['benchmark-methodology','Benchmark methodology','The scientific rationale behind the benchmark.'],
  ['crowd-diagnostics','Crowd diagnostics','Coordination and congestion diagnostics.'],
  ['procedural-generation','Procedural generation','Scenario families and generated environments.'],
  ['generator','Generator specification','Generation constraints, configuration and validation.'],
  ['evaluation-suite-design','Evaluation suite design','Suite composition, coverage and hidden evaluation.'],
  ['difficulty-calibration','Difficulty calibration','Calibrating generated-world difficulty.'],
  ['scoring-study-results','Scoring study','Published score sensitivity and validation results.'],
  ['suite-design-results','Suite design study','Published suite coverage and interval analysis.'],
  ['generator-coverage-results','Generator coverage','Published procedural coverage results.'],
 ]],
 ['Reference',[
  ['scenario-schema','Scenario schema','Scenario fields and validation rules.'],
  ['versioning','Versioning','Simulation, metric, scoring and package versions.'],
  ['replay-visualization','Replay audit tools','Command-line replay audit and visualization documentation.'],
  ['release-checklist','Release checklist','Protocol and release validation requirements.'],
  ['changelog','Changelog','Recorded benchmark changes.'],
 ]],
];
const docs=groups.flatMap(([group,items])=>items.map(([id,title,description])=>({id,title,description,group})));
await mkdir(sources,{recursive:true});
const sourceArg=process.argv.indexOf('--source');
if(sourceArg!==-1){
 const checkout=resolve(process.argv[sourceArg+1]);
 for(const name of await readdir(resolve(checkout,'docs')))if(name.endsWith('.md'))await copyFile(resolve(checkout,'docs',name),resolve(sources,name));
 await copyFile(resolve(checkout,'README.md'),resolve(sources,'quickstart.md'));
 await copyFile(resolve('docs/SITE_DATA.md'),resolve(sources,'site-data.md'));
 await copyFile(resolve(checkout,'LICENSE'),resolve(out,'SOURCE-LICENSE.txt'));
 await mkdir(resolve(out,'figures'),{recursive:true});
 await copyFile(resolve(checkout,'docs/figures/suite-ci-width.svg'),resolve(out,'figures/suite-ci-width.svg'));
 const revision=execFileSync('git',['-C',checkout,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
 const manifest={repository:'Aryabhatta-0/EMBERBench',revision,license:'Apache-2.0',documents:[]};
 for(const doc of docs.filter(d=>d.id!=='site-data')){
  const path=doc.id==='quickstart'?'README.md':`docs/${doc.id}.md`;
  manifest.documents.push({id:doc.id,path,blob:execFileSync('git',['-C',checkout,'hash-object',path],{encoding:'utf8'}).trim()});
 }
 await writeFile(resolve(out,'source-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>sanitizeHtml(s,{allowedTags:[],allowedAttributes:{}}).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const docIds=new Set(docs.map(d=>d.id));
function localLink(href,doc){
 if(href.startsWith('#'))return href;
 let path=href;
 const remote=path.match(/^https:\/\/(?:github\.com\/Aryabhatta-0\/EMBERBench\/blob\/[^/]+\/|raw\.githubusercontent\.com\/Aryabhatta-0\/EMBERBench\/[^/]+\/)(.*)$/i);
 if(remote)path=remote[1];
 if(/^[a-z][a-z\d+.-]*:/i.test(path))return path;
 const [file,hash]=path.split('#');
 const base=file.split('/').pop();
 const id=base==='README.md'?'quickstart':base?.replace(/\.md$/,'');
 if(docIds.has(id)&&(/\.md$/.test(file)))return `${id}.html${hash?'#'+hash:''}`;
 if(file.includes('figures/'))return `figures/${base}`;
 if(file==='../data/results.js')return file;
 if(base==='LICENSE')return 'SOURCE-LICENSE.txt';
 // These links explicitly reference implementation files, not documentation.
 if(file){
  const parent=['quickstart','site-data'].includes(doc.id)?'':'docs/';
  const repo=doc.id==='site-data'?'EMBERBench-site':'EMBERBench';
  return `https://github.com/Aryabhatta-0/${repo}/blob/main/${posix.normalize(parent+file)}${hash?'#'+hash:''}`;
 }
 return href;
}
function renderMarkdown(markdown,doc){
 let html=sanitizeHtml(marked.parse(markdown,{gfm:true}),{
  allowedTags:[...sanitizeHtml.defaults.allowedTags,'img','sup','sub','details','summary'],
  allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes,a:['href','title'],img:['src','alt','width','height'],code:['class'],input:[]},
  transformTags:{a:(tag,attr)=>({tagName:tag,attribs:{...attr,href:localLink(attr.href||'',doc)}}),img:(tag,attr)=>({tagName:tag,attribs:{...attr,src:localLink(attr.src||'',doc)}})},
 });
 const headings=[],seen=new Map();
 html=html.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g,(_,level,body)=>{
  const label=plain(body),base=label.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}_\-\s]/gu,'').replace(/ /g,'-');
  const n=seen.get(base)||0;seen.set(base,n+1);const id=base+(n?'-'+n:'');
  if(Number(level)===2)headings.push({id,label});
  return `<h${level} id="${esc(id)}">${body}</h${level}>`;
 });
 html=html.replace(/<table>/g,'<div class="docs-table" tabindex="0" role="region" aria-label="Documentation table"><table>').replace(/<\/table>/g,'</table></div>');
 html=html.replace(/<pre>/g,'<pre tabindex="0" aria-label="Code example">');
 return {html,headings};
}
const icon=prefix=>`<img src="${prefix}assets/anantam-logo.png" width="38" height="38" alt="">`;
function chrome(prefix){return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a href="${prefix}index.html" class="brand" aria-label="Anantam home">${icon(prefix)}<span>Anantam</span></a><button class="nav-toggle button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav class="site-nav" id="site-nav" aria-label="Main navigation"><a href="${prefix}index.html#contributions">Our work</a><a href="${prefix}benchmark.html">EMBERBench</a><a href="${prefix}methodology.html">Methodology</a><a href="${prefix}docs.html" class="active" aria-current="page">Docs</a></nav><div class="header-actions"><a class="repo-link" href="https://github.com/Aryabhatta-0/EMBERBench">GitHub</a></div></header>`;}
function sidebar(prefix,active){return `<aside class="docs-sidebar"><details class="docs-navigation" open><summary>Browse documentation</summary><div class="docs-nav-body"><form class="docs-search" role="search"><label for="docs-search">Find a guide</label><div><input id="docs-search" type="search" placeholder="Search documentation" autocomplete="off"><button type="button" id="clear-docs-search" hidden>Clear</button></div></form><p id="docs-search-status" class="docs-search-status" role="status"></p><nav aria-label="Documentation guides">${groups.map(([group,items])=>`<section class="docs-nav-group"><h2>${group}</h2>${items.map(([id,title])=>`<a href="${prefix}docs/${id}.html" data-doc-id="${id}" ${active===id?'aria-current="page"':''}>${esc(title)}</a>`).join('')}</section>`).join('')}</nav></div></details></aside>`;}
function template({title,description,body,prefix='',active='',toc=''}){return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#f8f9fc"><meta name="description" content="${esc(description)}"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"><title>${esc(title)} | Anantam</title><link rel="canonical" href="https://aryabhatta-0.github.io/EMBERBench-site/${active?'docs/'+active+'.html':'docs.html'}"><link rel="icon" href="${prefix}assets/anantam-logo.png"><link rel="stylesheet" href="${prefix}style.css?v=${version}"><link rel="stylesheet" href="${prefix}anantam.css?v=${version}"><link rel="stylesheet" href="${prefix}docs.css?v=${version}"><link rel="stylesheet" href="${prefix}footer.css?v=20261027-guide-footer-1"></head><body data-page="docs" data-root="${prefix}">${chrome(prefix)}<main id="main" tabindex="-1"><div class="docs-layout">${sidebar(prefix,active)}<div class="docs-reading"><section class="docs-search-results" aria-label="Search results" hidden></section><div class="docs-page-content">${body}</div></div>${toc}</div></main>${siteFooter(prefix,{documentation:true})}<script type="module" src="${prefix}docs.js?v=${version}"></script></body></html>\n`;}

const search=[];
for(const [i,doc] of docs.entries()){
 const markdown=await readFile(resolve(sources,doc.id+'.md'),'utf8');
 const {html,headings}=renderMarkdown(markdown,doc);
 search.push({...doc,text:plain(html).replace(/\s+/g,' ')});
 const toc=`<aside class="docs-toc"><details open><summary>On this page</summary><nav aria-label="On this page">${headings.map(h=>`<a href="#${esc(h.id)}">${esc(h.label)}</a>`).join('')}</nav></details></aside>`;
 const body=`<nav class="docs-breadcrumb" aria-label="Breadcrumb"><a href="../docs.html">Docs</a><span aria-hidden="true">/</span><span>${esc(doc.title)}</span></nav><article class="docs-article">${html}</article><nav class="docs-paging" aria-label="Adjacent guides">${i?`<a href="${docs[i-1].id}.html"><span>Previous</span>${esc(docs[i-1].title)}</a>`:'<span></span>'}${i<docs.length-1?`<a href="${docs[i+1].id}.html"><span>Next</span>${esc(docs[i+1].title)}</a>`:''}</nav><p class="docs-source-note">${doc.id==='site-data'?'Site operations guide.':'Benchmark documentation. Apache License 2.0.'} <a href="source/${doc.id}.md" download>Download Markdown</a></p>`;
 await writeFile(resolve(out,doc.id+'.html'),template({title:doc.title,description:doc.description,body,prefix:'../',active:doc.id,toc}));
}
const body=`<header class="docs-intro"><h1>EMBERBench docs</h1><p>Understand the benchmark. Read the protocol. Run an evaluation.</p><a class="button primary" href="docs/quickstart.html">Get started</a></header><div class="docs-index">${groups.map(([group,items])=>`<section><h2>${group}</h2><ul>${items.map(([id,title,description])=>`<li><a href="docs/${id}.html"><strong>${esc(title)}</strong><span>${esc(description)}</span></a></li>`).join('')}</ul></section>`).join('')}</div>`;
await writeFile(resolve(root,'docs.html'),template({title:'EMBERBench docs',description:'The EMBERBench documentation library: scoring, scenarios, evaluation, model integration and research.',body}));
await writeFile(resolve(out,'search-index.json'),JSON.stringify(search));
const missingPath=resolve(root,'404.html');
let missing=await readFile(missingPath,'utf8');
missing=missing.replace(/\n?<!-- Shared company footer -->[\s\S]*?<\/footer>\n?/,'\n');
if(!missing.includes('/footer.css?'))missing=missing.replace('</head>','  <link rel="stylesheet" href="/EMBERBench-site/footer.css?v=20261027-guide-footer-1">\n</head>');
await writeFile(missingPath,missing.replace('</body>',`<!-- Shared company footer -->\n${siteFooter('/EMBERBench-site/')}\n</body>`));
console.log(`Built ${docs.length} complete guides, documentation index and local full-text search.`);
