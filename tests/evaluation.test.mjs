import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,symlink,cp,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {stageEvaluation,writeStagedEvaluation} from '../tools/evaluation/stage.mjs';
import {readApprovedEvaluation,sha256} from '../tools/evaluation/publication.mjs';
import {validateEvaluation,BATCH} from '../tools/evaluation/contract.mjs';
import {evaluationSection} from '../tools/evaluation/render.mjs';
import {evaluationFixture} from './evaluation.fixture.mjs';

test('projects only approved aggregates, and reads but never rewrites the external source',async t=>{
 const f=await evaluationFixture(t),before=await readFile(resolve(f.privateRoot,'record-0.json'));
 const data=await writeStagedEvaluation(f.privateRoot,f.out),text=await readFile(f.out,'utf8');
 assert.equal(data.models.length,2);assert(!text.includes('RESTRICTED_SENTINEL'));assert(!/families|seeds|endpoint|episodes|commitment|runtime_s|per_episode/.test(text));
 assert.deepEqual(await readFile(resolve(f.privateRoot,'record-0.json')),before);assert.equal(data.models[0].wall_time_s,0);assert.equal(data.models[0].usd_suite,0);
 assert.equal(data.models[1].wall_time_s,120);assert.equal(data.models[1].usd_suite,.2);
 assert.equal(data.adjacent_pairs[0].separates,true); // Individual CIs overlap: pair result is independent.
 await assert.rejects(writeStagedEvaluation(f.privateRoot,f.out));
});
test('unknown public fields are rejected recursively',async t=>{
 const f=await evaluationFixture(t),data=await stageEvaluation(f.privateRoot);
 for(const mutate of [d=>d.extra=1,d=>d.models[0].families={},d=>d.models[0].tokens.seeds=[],d=>d.adjacent_pairs[0].ci95=[1,2]]){const copy=structuredClone(data);mutate(copy);assert.throws(()=>validateEvaluation(copy));}
});
test('every unapproved batch is rejected',async t=>{
 const f=await evaluationFixture(t);f.review.batch_label='unapproved-batch';await f.saveReview();await assert.rejects(stageEvaluation(f.privateRoot),/batch/);
});
test('stale source digests, missing verification and incomplete runs fail closed',async t=>{
 for(const mutation of [f=>f.review.models[0].run.sha256='e'.repeat(64),f=>f.review.models[0].replay_verified=false,f=>f.review.models[0].complete=false]){
  const f=await evaluationFixture(t);mutation(f);await f.saveReview();await assert.rejects(stageEvaluation(f.privateRoot));
 }
});
test('batch commitments, manifests, packs and harness protocol must match',async t=>{
 for(const mutation of [r=>r.suite.manifest_hash='e'.repeat(64),r=>r.suite.commitment.commitment='e'.repeat(64),r=>r.suite.pack_digest='e'.repeat(64),r=>r.model.harness_protocol.name='different',r=>r.benchmark_versions.harness='2.0']){
  const f=await evaluationFixture(t),r=JSON.parse(await readFile(resolve(f.privateRoot,'record-1.json'),'utf8'));mutation(r);f.review.models[1].run=await f.put('record-1.json',r);await f.saveReview();await assert.rejects(stageEvaluation(f.privateRoot));
 }
});
test('refusal-excluded diagnostics and score/CI disagreements cannot replace official results',async t=>{
 for(const mutation of [r=>r.metrics.official=false,r=>r.metrics.score=100,r=>r.metrics.ci95=[0,100],r=>r.refusals.rate=.5]){
  const f=await evaluationFixture(t),r=JSON.parse(await readFile(resolve(f.privateRoot,'record-1.json'),'utf8'));mutation(r);f.review.models[1].run=await f.put('record-1.json',r);await f.saveReview();await assert.rejects(stageEvaluation(f.privateRoot));
 }
});
test('paired analysis requires the exact cohort, method, pairs and consistent precision',async t=>{
 for(const mutation of [f=>f.review.analysis.method='individual-CI-overlap',f=>f.analysis.models_only.models.reverse(),f=>f.analysis.models_only.adjacent_pairs=[],f=>f.analysis.models_only.adjacent_pairs[0].ci95=[0,15]]){
  const f=await evaluationFixture(t);mutation(f);f.review.analysis={...f.review.analysis,...await f.put('analysis.json',f.analysis)};await f.saveReview();await assert.rejects(stageEvaluation(f.privateRoot));
 }
});
test('partial or estimated operational totals cannot look like complete billed usage',async t=>{
 for(const mutation of [f=>f.review.models[1].accounting.coverage='partial',f=>f.review.models[1].accounting.billing_basis='estimated',f=>f.review.models[1].accounting.coverage='unavailable']){
  const f=await evaluationFixture(t);mutation(f);await f.saveReview();await assert.rejects(stageEvaluation(f.privateRoot));
 }
 const f=await evaluationFixture(t),ops=f.review.models[1].accounting;Object.assign(ops,{coverage:'unavailable',billing_basis:'unavailable',usd_suite:null,calls:null,tokens:{input:null,output:null},wall_time_s:null});await f.saveReview();
 const d=await stageEvaluation(f.privateRoot);assert.equal(d.models[1].usd_suite,null);assert(evaluationSection(d).includes('Not reported'));
});
test('unsafe references and repository/source outputs are rejected',async t=>{
 const f=await evaluationFixture(t);f.review.models[0].run.file='../outside.json';await f.saveReview();await assert.rejects(stageEvaluation(f.privateRoot),/Unsafe/);
 await assert.rejects(writeStagedEvaluation(f.privateRoot,resolve('work/forbidden-evaluation.json')));
 await assert.rejects(writeStagedEvaluation(f.privateRoot,resolve(f.privateRoot,'forbidden.json')));
});
test('a symlinked private source cannot be traversed',async t=>{
 const f=await evaluationFixture(t),link=resolve(f.root,'alias');
 try{await symlink(f.privateRoot,link,process.platform==='win32'?'junction':'dir');}catch(error){if(['EPERM','EACCES'].includes(error.code)){t.skip('Host does not permit symlink creation');return;}throw error;}
 await assert.rejects(stageEvaluation(link),/symlink/);
});
test('publication is disabled by default and requires both a digest pin and strict schema',async t=>{
 const f=await evaluationFixture(t),site=resolve(f.root,'site'),policy=resolve(f.root,'policy.json');await mkdir(resolve(site,'data'),{recursive:true});
 const p={batch_label:BATCH,artifact:'data/evaluation.json',sha256:null};await writeFile(policy,JSON.stringify(p));assert.equal(await readApprovedEvaluation(site,policy),null);
 const data=await stageEvaluation(f.privateRoot),bytes=JSON.stringify(data);await writeFile(resolve(site,'data/evaluation.json'),bytes);await assert.rejects(readApprovedEvaluation(site,policy),/Unreviewed/);
 p.sha256=sha256(bytes);await writeFile(policy,JSON.stringify(p));assert.deepEqual(await readApprovedEvaluation(site,policy),data);
 await writeFile(resolve(site,'data/evaluation.json'),bytes+' ');await assert.rejects(readApprovedEvaluation(site,policy),/digest/);
 data.seeds=[];const bad=JSON.stringify(data);p.sha256=sha256(bad);await writeFile(policy,JSON.stringify(p));await writeFile(resolve(site,'data/evaluation.json'),bad);await assert.rejects(readApprovedEvaluation(site,policy),/unexpected/);
});
test('pending state has no fabricated model scores or rankings',()=>{
 const html=evaluationSection();assert(html.includes('No results published yet'));assert(html.includes(BATCH));assert(!html.includes('evaluation-columns'));assert(!html.includes('evaluation-model'));
});
test('all charts stay vertical, descend independently, preserve CIs and avoid scenario/profile links',async t=>{
 const f=await evaluationFixture(t),html=evaluationSection(await stageEvaluation(f.privateRoot));
 assert.equal((html.match(/class="evaluation-chart"/g)||[]).length,7);assert.equal((html.match(/95% CI /g)||[]).length,2);
 assert(!html.includes('<table'));assert(!/model\.html|scenario|family name|RESTRICTED_SENTINEL/.test(html));
 assert(html.includes('Difference detected'));assert(html.includes('Input 0'));
});

test('CLI check-only and invalid arguments never create a release or expose source contents',async t=>{
 const f=await evaluationFixture(t),cli='tools/stage_evaluation_release.mjs';
 const run=args=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});
 assert.equal(run(['--source',f.privateRoot]).status,0);
 const duplicate=run(['--source',f.privateRoot,'--source',f.privateRoot]);assert.notEqual(duplicate.status,0);assert.match(duplicate.stderr,/Duplicate/);
 await writeFile(resolve(f.privateRoot,'release-review.json'),'{RESTRICTED_SENTINEL');const bad=run(['--source',f.privateRoot]);assert.notEqual(bad.status,0);assert(!bad.stderr.includes('RESTRICTED_SENTINEL'));assert(!bad.stderr.includes(f.privateRoot));
});

test('isolated static build adds only pinned aggregates, is idempotent, and can disable the section',async t=>{
 const f=await evaluationFixture(t),sandbox=resolve(f.root,'isolated-build');await mkdir(sandbox);
 // Copy website sources only, never the external input folder or its records.
 for(const name of ['site','tools','design','docs'])await cp(name,resolve(sandbox,name),{recursive:true});
 await cp('package.json',resolve(sandbox,'package.json'));
 await symlink(resolve('node_modules'),resolve(sandbox,'node_modules'),process.platform==='win32'?'junction':'dir');
 const data=await stageEvaluation(f.privateRoot),bytes=JSON.stringify(data,null,2)+'\n',artifact=resolve(sandbox,'site/data/evaluation.json'),policyPath=resolve(sandbox,'tools/evaluation-publication.json');
 const policy={batch_label:BATCH,artifact:'data/evaluation.json',sha256:sha256(bytes)};
 await writeFile(artifact,bytes);await writeFile(policyPath,JSON.stringify(policy));
 const original=await readFile(resolve(sandbox,'site/data/results.js'));
 const build=()=>{const result=spawnSync(process.execPath,['tools/build_production.mjs'],{cwd:sandbox,encoding:'utf8'});assert.equal(result.status,0,result.stderr);};
 build();
 for(const name of ['benchmark.html','leaderboard.html']){
  const html=await readFile(resolve(sandbox,'site',name),'utf8');assert.equal((html.match(/data-evaluation-metric=/g)||[]).length,7);assert(html.includes('data/evaluation.json'));assert(!html.includes('RESTRICTED_SENTINEL'));assert(!html.includes('record-0.json'));
 }
 assert.deepEqual(await readFile(resolve(sandbox,'site/data/results.js')),original);
 build();const html=await readFile(resolve(sandbox,'site/benchmark.html'),'utf8');assert.equal((html.match(/data-evaluation-metric=/g)||[]).length,7);
 const guard=spawnSync(process.execPath,['tools/check_public_site.mjs'],{cwd:sandbox,encoding:'utf8'});assert.equal(guard.status,0,guard.stderr);
 policy.sha256=null;await unlink(artifact);await writeFile(policyPath,JSON.stringify(policy));build();
 const disabled=await readFile(resolve(sandbox,'site/benchmark.html'),'utf8');assert(!disabled.includes('evaluation:section'));assert(!disabled.includes('evaluation-section.css'));
 const publication=JSON.parse(await readFile(resolve(sandbox,'tools/site-publication-policy.json'),'utf8'));assert(!publication.jsonPaths.includes('data/evaluation.json'));assert(!publication.staticFiles.includes('evaluation-section.css'));
});
