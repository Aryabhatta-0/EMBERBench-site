import assert from 'node:assert/strict';
import {readFile,readdir,lstat} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {createHash} from 'node:crypto';
import {docs,upstreamIds,retired,constructionTokens} from './docs-policy.mjs';
const root=resolve(process.argv[2]||'site'),ids=new Set(docs.map(d=>d.id)),hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const rootInfo=await lstat(root);assert(rootInfo.isDirectory()&&!rootInfo.isSymbolicLink(),'Publication root must be a real directory');
const reviewed=JSON.parse(await readFile(new URL('./docs-reviewed-hashes.json',import.meta.url),'utf8'));
const manifest=JSON.parse(await readFile(resolve(root,'docs/source-manifest.json'),'utf8'));
assert.equal(manifest.policy,'reviewed-public-contracts-v1');assert.equal(manifest.documents.length,ids.size);
for(const entry of manifest.documents){
 assert(ids.has(entry.id),`Unreviewed manifest entry: ${entry.id}`);
 assert.equal(hash(await readFile(resolve(root,'docs',entry.id+'.html'),'utf8')),entry.htmlSha256,`Changed rendered guide: ${entry.id}`);
 const source=await readFile(resolve(root,'docs/source',entry.id+'.md'),'utf8');assert.equal(hash(source),entry.sha256,`Changed source: ${entry.id}`);
 if(upstreamIds.has(entry.id))assert.equal(hash(source),reviewed[entry.id],`Unreviewed upstream change: ${entry.id}`);
}
const publication=JSON.parse(await readFile(new URL('./site-publication-policy.json',import.meta.url),'utf8'));
assert.equal(hash(await readFile(resolve(root,'data/results.js'),'utf8')),publication.snapshotSha256,'Published data requires an explicit public-development provenance review');
const activeHtml=new Set([...ids,...Object.keys(retired)].map(id=>id+'.html'));
for(const name of await readdir(resolve(root,'docs')))if(name.endsWith('.html'))assert(activeHtml.has(name),`Unreviewed documentation page: ${name}`);
const sourceNames=(await readdir(resolve(root,'docs/source'))).filter(n=>n.endsWith('.md')).sort();assert.deepEqual(sourceNames,[...ids].map(id=>id+'.md').sort(),'Raw source downloads must match the allowlist exactly');
assert.equal(hash(await readFile(resolve(root,'docs/search-index.json'),'utf8')),manifest.searchSha256,'Changed search artifact');
assert.equal(hash(await readFile(resolve(root,'docs.html'),'utf8')),manifest.indexSha256,'Changed documentation index');
const index=JSON.parse(await readFile(resolve(root,'docs/search-index.json'),'utf8'));assert.deepEqual(index.map(d=>d.id).sort(),[...ids].sort(),'Search contains unreviewed documents');
let checked=0;
async function walk(dir){for(const name of await readdir(dir)){const path=resolve(dir,name),stat=await lstat(path),rel=relative(root,path).replaceAll('\\','/');assert(!stat.isSymbolicLink(),`Symlink in publication: ${rel}`);assert(!/(^|\/)(?:private|secret|hidden|official-policy)(?:[/.\-_]|$)/i.test(rel),`Private path in publication: ${rel}`);if(stat.isDirectory()){await walk(path);continue;}if(rel.startsWith('docs/')){const docAllowed=rel==='docs/SOURCE-LICENSE.txt'||rel==='docs/search-index.json'||rel==='docs/source-manifest.json'||(rel==='docs/source/'+name&&sourceNames.includes(name))||(rel.startsWith('docs/')&&!rel.slice(5).includes('/')&&activeHtml.has(name));assert(docAllowed,`Unreviewed documentation artifact: ${rel}`);}else assert(publication.staticFiles.includes(rel),`Unreviewed static artifact: ${rel}`);assert(!/\.(?:zip|whl|tar|gz|py|pkl|pickle|sqlite|db|log|seed|seeds|pem|key)$/i.test(name),`Non-public artifact in publication: ${rel}`);if(name.endsWith('.json'))assert(publication.jsonPaths.includes(rel),`Unreviewed JSON artifact: ${rel}`);if(name.endsWith('.html')&&!rel.includes('/'))assert(publication.rootHtml.includes(rel),`Unreviewed page: ${rel}`);if(!/\.(?:html|md|json|js|txt)$/i.test(name))continue;const text=await readFile(path,'utf8');for(const token of constructionTokens)assert(!token.test(text),`Construction material in ${rel}`);checked++;}}
await walk(root);
assert.equal(manifest.retiredPages.length,Object.keys(retired).length);
for(const entry of manifest.retiredPages){assert.equal(retired[entry.id],entry.target);assert.equal(hash(await readFile(resolve(root,'docs',entry.id+'.html'),'utf8')),entry.sha256,`Changed retired guide: ${entry.id}`);}
for(const id of Object.keys(retired)){const text=await readFile(resolve(root,'docs',id+'.html'),'utf8');assert(text.includes('docs-retired')&&text.includes('noindex'),`Retired guide was republished: ${id}`);}
console.log(`Public-site boundary passed: ${ids.size} reviewed guides; ${checked} text artifacts checked; no construction recipes or private paths.`);
