// Synthetic import fixtures only. This file never runs a model or the evaluator.
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,sep} from 'node:path';
import assert from 'node:assert/strict';
import {BATCH,METHOD} from '../tools/evaluation/contract.mjs';
import {sha256} from '../tools/evaluation/publication.mjs';
export async function evaluationFixture(t){
 const base=resolve(tmpdir()),root=await mkdtemp(resolve(base,'anantam-aggregate-test-'));
 t.after(async()=>{assert(root.startsWith(base+sep)&&root.includes('anantam-aggregate-test-'));await rm(root,{recursive:true,force:true});});
 const privateRoot=resolve(root,'external-input');await mkdir(privateRoot);
 const hash='a'.repeat(64),commit='b'.repeat(64),pack='c'.repeat(64),protocol='d'.repeat(64);
 const models=[['model-one','fixture/model-one',80,[60,95],.05,0],['model-two','fixture/model-two',70,[65,85],.1,0]];
 const put=async(file,value)=>{const path=resolve(privateRoot,file);await writeFile(path,JSON.stringify(value));return {file,sha256:sha256(await readFile(path))};};
 const statement=await put('statement.json',{batch_label:BATCH,commitment:commit,episodes:20});
 const analysis={tool:'emberbench-validity/1.0',pack_digest:pack,episodes:20,resamples:2000,
  families:{RESTRICTED_SENTINEL:20},variance_shares:{secret:'RESTRICTED_SENTINEL'},
  agents:models.map(([id,,score,ci95,zero_score_share])=>({agent:id,score,ci95,zero_score_share,families:{RESTRICTED_SENTINEL:score}})),
  models_only:{models:models.map(m=>m[0]),adjacent_pairs:[{higher:'model-one',lower:'model-two',ci95:[2,15],separated:true,p_higher_gt_lower:.99}]}};
 const review={batch_label:BATCH,manifest_hash:hash,harness_version:'1.0',scoring_version:'1.1',scheduled_episodes:20,statement,analysis:{...await put('analysis.json',analysis),method:METHOD,confidence:.95},models:[]};
 for(const [index,[id,name,score,ci95,,refusal]] of models.entries()){
  const run={private:true,suite:{manifest_hash:hash,pack_digest:pack,episodes:20,commitment:{verified:true,commitment:commit},seeds:[999],private_parameters:'RESTRICTED_SENTINEL'},
   model:{kind:'remote',model_id:id,resolved_models:[name],harness_sha256:protocol,harness_protocol:{name:'synthetic-test-only'},endpoint:'https://example.invalid/RESTRICTED_SENTINEL'},
   benchmark_versions:{harness:'1.0',scoring:'1.1'},finished_utc:'2026-10-28T10:00:00Z',
   metrics:{official:true,score,ci95,families:{RESTRICTED_SENTINEL:score}},refusals:{count:refusal*20,rate:refusal,episodes:[]},runtime_s:1,
   accounting:{total_cost:999999,per_episode:[{secret:'RESTRICTED_SENTINEL'}]}};
  review.models.push({run:await put(`record-${index}.json`,run),replay_verified:true,complete:true,
   accounting:{coverage:'full-suite',billing_basis:'reported',usd_suite:index===0?0:.2,calls:index===0?0:100,tokens:{input:index===0?0:1000,output:index===0?0:200},wall_time_s:index===0?0:120}});
 }
 await put('release-review.json',review);
 return {root,privateRoot,review,analysis,put,saveReview:()=>put('release-review.json',review),out:resolve(root,'approved.json')};
}
