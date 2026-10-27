import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtemp,mkdir,cp,writeFile,readFile,rm} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {spawnSync} from 'node:child_process';
const base=resolve('work/docs-policy-tests');await mkdir(base,{recursive:true});
async function fixture(t){const dir=await mkdtemp(resolve(base,'case-'));await cp('site/docs',resolve(dir,'docs'),{recursive:true});await cp('site/docs.html',resolve(dir,'docs.html'));await mkdir(resolve(dir,'data'));await cp('site/data/results.js',resolve(dir,'data/results.js'));t.after(async()=>{assert(dir.startsWith(base+sep));await rm(dir,{recursive:true,force:true});});return dir;}
const run=root=>spawnSync(process.execPath,['tools/check_public_site.mjs',root],{encoding:'utf8'});
test('publication guard accepts the reviewed public site',()=>{const r=run('site');assert.equal(r.status,0,r.stderr);});
test('raw construction source cannot be reintroduced without publication review',async t=>{const root=await fixture(t);await writeFile(resolve(root,'docs/source/generator.md'),'Unreviewed construction material');assert.notEqual(run(root).status,0);});
test('a modified upstream contract fails the reviewed content pin',async t=>{const root=await fixture(t);const file=resolve(root,'docs/source/scoring.md');await writeFile(file,(await readFile(file,'utf8'))+'\nUnreviewed change.');assert.notEqual(run(root).status,0);});
test('an unlisted HTML guide cannot bypass the source allowlist',async t=>{const root=await fixture(t);await writeFile(resolve(root,'docs/unlisted.html'),'<h1>Unreviewed guide</h1>');assert.notEqual(run(root).status,0);});
test('a private JSON artifact under an innocent path cannot be published',async t=>{const root=await fixture(t);await writeFile(resolve(root,'data/helper.json'),'{}');assert.notEqual(run(root).status,0);});
test('the immutable public snapshot cannot silently become a different evaluation',async t=>{const root=await fixture(t);await writeFile(resolve(root,'data/results.js'),'export default {};');assert.notEqual(run(root).status,0);});

test('a nested source filename cannot bypass the reviewed download paths',async t=>{const root=await fixture(t);await mkdir(resolve(root,'docs/source/extra'));await cp(resolve(root,'docs/source/scoring.md'),resolve(root,'docs/source/extra/scoring.md'));assert.notEqual(run(root).status,0);});

test('a stale or tampered rendered guide cannot diverge from its reviewed build',async t=>{const root=await fixture(t);await writeFile(resolve(root,'docs/scoring.html'),'<h1>Unexpected content</h1>');assert.notEqual(run(root).status,0);});
