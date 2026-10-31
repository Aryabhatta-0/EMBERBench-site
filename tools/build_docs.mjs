import {siteFooter} from '../site/footer.js';
import {siteHeader} from '../site/chrome.js';
// Build a static, self-contained documentation library. No runtime GitHub dependency.
import {readFile,writeFile,mkdir,readdir,copyFile,unlink,lstat,realpath} from 'node:fs/promises';
import {resolve,posix,relative,isAbsolute} from 'node:path';
import {createHash} from 'node:crypto';
import {groups,docs,upstreamIds,retired,constructionTokens,publicRedactions,privateEvaluationTokens} from './docs-policy.mjs';
import {execFileSync} from 'node:child_process';
import {marked} from 'marked';
import sanitizeHtml from 'sanitize-html';

const root=resolve('site'),out=resolve(root,'docs'),sources=resolve(out,'source');
const version='20261027-public-boundary-1';
async function rejectSymlinks(dir){const info=await lstat(dir);if(info.isSymbolicLink())throw new Error('Symlinks are not allowed in the publication tree');if(info.isDirectory())for(const name of await readdir(dir))await rejectSymlinks(resolve(dir,name));}
await rejectSymlinks(root);

const hash=text=>createHash('sha256').update(text.replace(/\r\n/g,'\n')).digest('hex');
const reviewed=JSON.parse(await readFile('tools/docs-reviewed-hashes.json','utf8'));
const sourceArg=process.argv.indexOf('--source'),checkout=sourceArg===-1?null:resolve(process.argv[sourceArg+1]);
const previous=JSON.parse(await readFile(resolve(out,'source-manifest.json'),'utf8'));
const manifest={repository:'Aryabhatta-0/EMBERBench',revision:checkout?execFileSync('git',['-C',checkout,'rev-parse','HEAD'],{encoding:'utf8'}).trim():previous.revision,license:'Apache-2.0',policy:'reviewed-public-contracts-v1',documents:[]};
const contents=new Map();
for(const doc of docs){
 const upstream=upstreamIds.has(doc.id),path=upstream?`docs/${doc.id}.md`:doc.id==='site-data'?'docs/SITE_DATA.md':`docs/public/${doc.id}.md`;
 const input=upstream?(checkout?resolve(checkout,path):resolve('docs/upstream',doc.id+'.md')):resolve(path);
 const canonicalInput=await realpath(input),inputRoot=await realpath(upstream&&checkout?checkout:resolve('.')),inside=relative(inputRoot,canonicalInput);
 if((await lstat(input)).isSymbolicLink()||isAbsolute(inside)||inside==='..'||inside.startsWith('..\\')||inside.startsWith('../'))throw new Error('Document source crosses the reviewed input boundary');
 const markdown=(await readFile(input,'utf8')).replace(/\r\n/g,'\n'),digest=hash(markdown);
 if(upstream&&digest!==reviewed[doc.id])throw new Error(`Unreviewed upstream document: ${doc.id}. Publication stopped.`);
 let published=markdown;
 for(const [find,replace] of publicRedactions[doc.id]||[]){if(!published.includes(find))throw new Error(`Redaction target missing in ${doc.id}. Review the upstream change.`);published=published.split(find).join(replace);}
 if(constructionTokens.some(pattern=>pattern.test(published)))throw new Error(`Construction material rejected: ${doc.id}`);
 if(privateEvaluationTokens.some(pattern=>pattern.test(published)))throw new Error(`Private evaluation detail rejected: ${doc.id}`);
 contents.set(doc.id,published);manifest.documents.push({id:doc.id,path,origin:upstream?'reviewed-upstream':'curated-site',sha256:hash(published),...(upstream?{upstreamSha256:digest}:{})});
}
// No writes happen until every input passes the explicit publication policy.
await mkdir(sources,{recursive:true});
for(const name of await readdir(sources))if(name.endsWith('.md')&&!contents.has(name.slice(0,-3)))await unlink(resolve(sources,name));
for(const [id,markdown] of contents)await writeFile(resolve(sources,id+'.md'),markdown);
for(const name of await readdir(out))if(name.endsWith('.html')&&!docs.some(d=>d.id+'.html'===name)&&!Object.hasOwn(retired,name.slice(0,-5)))await unlink(resolve(out,name));
const figures=resolve(out,'figures');
try{for(const name of await readdir(figures))if(name==='suite-ci-width.svg')await unlink(resolve(figures,name));}catch(e){if(e.code!=='ENOENT')throw e;}
if(checkout)await copyFile(resolve(checkout,'LICENSE'),resolve(out,'SOURCE-LICENSE.txt'));

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=s=>sanitizeHtml(s,{allowedTags:[],allowedAttributes:{}}).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const docIds=new Set(docs.map(d=>d.id));
function localLink(href,doc){
 if(href.startsWith('#'))return href;
 let path=href;
 const remote=path.match(/^https:\/\/(?:github\.com\/Aryabhatta-0\/EMBERBench\/blob\/[^/]+\/|raw\.githubusercontent\.com\/Aryabhatta-0\/EMBERBench\/[^/]+\/)(.*)$/i);
 if(remote)path=remote[1];
 if(/^[a-z][a-z\d+.-]*:/i.test(path))return path;
 const [file,fragment]=path.split('#'),base=file.split('/').pop(),id=base==='README.md'?'quickstart':base?.replace(/\.md$/,'');
 if(docIds.has(id)&&/\.md$/.test(file))return `${id}.html${fragment&&upstreamIds.has(id)?'#'+fragment:''}`;
 if(Object.hasOwn(retired,id))return `${retired[id]}.html`;
 if(file==='../data/results.js')return file;
 if(base==='LICENSE')return 'SOURCE-LICENSE.txt';
 if(/\.md$/.test(file))return 'evaluation-boundary.html';
 const safeCode=new Set(['scoring.py','metrics.py','simulator.py','observation.py','agent.py','evaluation.py','environment_pack.py','statistics.py','scenario.py','movement.py','fire.py','rng.py','replay.py','cli.py']);
 if(safeCode.has(base))return `https://github.com/anantamlab/EMBERBench/blob/main/src/emberbench/${base}${fragment?'#'+fragment:''}`;
 if(file.startsWith('../scenarios/public/'))return `https://github.com/anantamlab/EMBERBench/tree/main/${file.slice(3)}`;
 if(file)return 'evaluation-boundary.html';
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
const chrome=prefix=>siteHeader('docs',prefix);
// Phones show the sidebar as a switcher bar: the current guide sits under the label.
function sidebar(prefix,active){const current=groups.flatMap(([,items])=>items).find(([id])=>id===active);return `<aside class="docs-sidebar"><details class="docs-navigation" open><summary><span class="docs-switch-icon" aria-hidden="true"></span><span class="docs-switch-text"><b>Browse documentation</b><small>${current?esc(current[1]):'All guides'}</small></span></summary><div class="docs-nav-body"><form class="docs-search" role="search"><label for="docs-search">Find a guide</label><div><input id="docs-search" type="search" placeholder="Search docs" autocomplete="off"><kbd class="docs-search-key" aria-hidden="true">/</kbd><button type="button" id="clear-docs-search" hidden>Clear</button></div></form><p id="docs-search-status" class="docs-search-status" role="status"></p><nav aria-label="Documentation guides">${groups.map(([group,items])=>`<section class="docs-nav-group"><h2>${group}</h2>${items.map(([id,title])=>`<a href="${prefix}docs/${id}.html" data-doc-id="${id}" ${active===id?'aria-current="page"':''}>${esc(title)}</a>`).join('')}</section>`).join('')}</nav></div></details></aside>`;}
function template({title,description,body,prefix='',active='',toc=''}){return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#faf3e8"><meta name="description" content="${esc(description)}"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'"><title>${esc(title)} | Anantam</title><link rel="canonical" href="https://anantam-labs.vercel.app/${active?'docs/'+active+'.html':'docs.html'}"><link rel="icon" href="${prefix}assets/anantam-logo.png"><link rel="stylesheet" href="${prefix}style.css?v=${version}"><link rel="stylesheet" href="${prefix}anantam.css?v=${version}"><link rel="stylesheet" href="${prefix}docs.css?v=${version}"><link rel="stylesheet" href="${prefix}footer.css?v=20261027-guide-footer-1"></head><body data-page="docs" data-root="${prefix}">${chrome(prefix)}<main id="main" tabindex="-1"><div class="docs-layout">${sidebar(prefix,active)}<div class="docs-reading"><section class="docs-search-results" aria-label="Search results" hidden></section><div class="docs-page-content">${body}</div></div>${toc}</div></main><script type="module" src="${prefix}docs.js?v=${version}"></script></body></html>\n`;}

const search=[];
for(const [i,doc] of docs.entries()){
 const markdown=contents.get(doc.id);
 const {html,headings}=renderMarkdown(markdown,doc);
 search.push({...doc,text:plain(html).replace(/\s+/g,' ')});
 const toc=`<aside class="docs-toc"><details open><summary>On this page</summary><nav aria-label="On this page">${headings.map(h=>`<a href="#${esc(h.id)}">${esc(h.label)}</a>`).join('')}</nav></details></aside>`;
 const body=`<nav class="docs-breadcrumb" aria-label="Breadcrumb"><a href="../docs.html">Docs</a><span aria-hidden="true">/</span><span>${esc(doc.title)}</span></nav><p class="docs-scope-note">Public task and development documentation. <a href="evaluation-boundary.html">Official evaluation boundary</a>.</p><article class="docs-article">${html}</article><nav class="docs-paging" aria-label="Adjacent guides">${i?`<a href="${docs[i-1].id}.html"><span>Previous</span>${esc(docs[i-1].title)}</a>`:'<span></span>'}${i<docs.length-1?`<a href="${docs[i+1].id}.html"><span>Next</span>${esc(docs[i+1].title)}</a>`:''}</nav><p class="docs-source-note">${upstreamIds.has(doc.id)?'Reviewed public benchmark contract. Apache License 2.0.':'Curated public guide. No private evaluation recipe is included.'} <a href="source/${doc.id}.md" download>Download Markdown</a></p>`;
 const page=template({title:doc.title,description:doc.description,body,prefix:'../',active:doc.id,toc});
 await writeFile(resolve(out,doc.id+'.html'),page);
 manifest.documents.find(entry=>entry.id===doc.id).htmlSha256=hash(page);
}
manifest.retiredPages=[];
for(const [oldId,target] of Object.entries(retired)){
 const body=`<article class="docs-article docs-retired"><h1>This guide has moved</h1><p>This website hosts reviewed public contracts and curated development guides. Its content now lives in another guide.</p><p><a href="${target}.html">Read the current guide</a></p></article>`;
 const page=template({title:'Documentation update',description:'Read the current reviewed public guide.',body,prefix:'../',active:oldId}).replace('<meta name="description"','<meta name="robots" content="noindex"><meta name="description"');
 await writeFile(resolve(out,oldId+'.html'),page);manifest.retiredPages.push({id:oldId,target,sha256:hash(page)});
}
const body=`<header class="docs-intro"><p class="docs-kicker">EMBERBench documentation</p><h1>EMBERBench docs</h1><p>The open task, transparent scoring and public development workflow.</p><div class="docs-intro-actions"><a class="button primary" href="docs/quickstart.html">Get started</a><a class="button" href="docs/scoring.html">Read the scoring</a></div></header><div class="docs-index">${groups.map(([group,items])=>`<section><div class="docs-index-head"><h2>${group}</h2><span>${items.length} guides</span></div><ul>${items.map(([id,title,description])=>`<li><a href="docs/${id}.html"><strong>${esc(title)}</strong><span>${esc(description)}</span></a></li>`).join('')}</ul></section>`).join('')}</div>`;
const indexPage=template({title:'EMBERBench docs',description:'Reviewed public EMBERBench contracts, development guides, scoring and evaluation boundaries.',body});
await writeFile(resolve(root,'docs.html'),indexPage);manifest.indexSha256=hash(indexPage);
const searchText=JSON.stringify(search);await writeFile(resolve(out,'search-index.json'),searchText);manifest.searchSha256=hash(searchText);
await writeFile(resolve(out,'source-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const missingPath=resolve(root,'404.html');
let missing=(await readFile(missingPath,'utf8')).replace(/\r\n/g,'\n');
missing=missing.replace(/\s*<!-- Shared company footer -->[\s\S]*?<\/footer>\s*(?=<\/body>)/,'\n');
if(!missing.includes('/footer.css?'))missing=missing.replace('</head>','  <link rel="stylesheet" href="/footer.css?v=20261027-guide-footer-1">\n</head>');
await writeFile(missingPath,missing.replace('</body>',`<!-- Shared company footer -->\n${siteFooter('/')}\n</body>`));
console.log(`Built ${docs.length} reviewed public guides, documentation index and local full-text search.`);
