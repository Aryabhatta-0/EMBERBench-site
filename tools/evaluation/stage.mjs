// Offline projection only. No scorer, simulator, provider client or directory copy.
import {readFile,writeFile,lstat,realpath} from 'node:fs/promises';
import {resolve,relative,isAbsolute,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {BATCH,METHOD,check,keys,digest,number,date,validateEvaluation} from './contract.mjs';
import {sha256} from './publication.mjs';
const repository=fileURLToPath(new URL('../../',import.meta.url));
const inside=(base,path)=>{const rel=relative(base,path);return rel===''||(!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..'+sep));};
function parse(bytes){try{return JSON.parse(bytes.toString('utf8'));}catch{throw new Error('Invalid source JSON; contents withheld');}}
async function readSource(root,file,expected){
 check(typeof file==='string'&&!isAbsolute(file)&&!file.split(/[\\/]/).some(p=>!p||p==='.'||p==='..')&&extname(file)==='.json','Unsafe source reference');
 let target=root;
 for(const part of file.split(/[\\/]/)){target=resolve(target,part);check(!(await lstat(target)).isSymbolicLink(),'Source symlinks are not accepted');}
 check(inside(root,await realpath(target))&&!inside(repository,target),'Source reference escaped the private folder');
 const info=await lstat(target);check(info.isFile()&&info.size<=10*1024*1024,'Source file missing or too large');
 const bytes=await readFile(target);if(expected!==undefined)check(digest(expected)&&sha256(bytes)===expected,'Source digest mismatch');
 return parse(bytes);
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);
export async function stageEvaluation(source){
 const supplied=resolve(source);check(!(await lstat(supplied)).isSymbolicLink(),'Source folder must not be a symlink');
 const root=await realpath(supplied);check(!inside(repository,root),'Private input must stay outside this repository');
 const review=await readSource(root,'release-review.json');
 keys(review,['batch_label','manifest_hash','harness_version','scoring_version','scheduled_episodes','statement','analysis','models'],'private review');
 check(review.batch_label===BATCH&&digest(review.manifest_hash),'Unapproved batch or manifest');
 check(Number.isSafeInteger(review.scheduled_episodes)&&review.scheduled_episodes>0,'Missing scheduled episode count');
 keys(review.statement,['file','sha256'],'statement reference');
 keys(review.analysis,['file','sha256','method','confidence'],'analysis reference');
 check(review.analysis.method===METHOD&&review.analysis.confidence===.95,'Requires a paired family-stratified 95% bootstrap');
 const statement=await readSource(root,review.statement.file,review.statement.sha256);
 check(statement.batch_label===BATCH&&digest(statement.commitment)&&statement.episodes===review.scheduled_episodes,'Candidate statement does not match');
 const analysis=await readSource(root,review.analysis.file,review.analysis.sha256);
 check(analysis.tool==='emberbench-validity/1.0'&&analysis.episodes===review.scheduled_episodes&&Number.isSafeInteger(analysis.resamples)&&analysis.resamples>=2,'Incomplete or unsupported validity analysis');
 check(Array.isArray(review.models)&&review.models.length>0,'No verified models supplied');
 const models=[],seen=new Set();let cohort;
 for(const entry of review.models){
  keys(entry,['run','replay_verified','complete','accounting'],'model review');keys(entry.run,['file','sha256'],'run reference');
  check(entry.replay_verified===true&&entry.complete===true,'Evaluator must verify replay and completion first');
  const run=await readSource(root,entry.run.file,entry.run.sha256),suite=run.suite,model=run.model;
  check(run.private===true&&model?.kind==='remote'&&run.metrics?.official===true,'Requires a private remote run with an official score');
  check(suite?.commitment?.verified===true&&suite.commitment.commitment===statement.commitment&&suite.manifest_hash===review.manifest_hash&&suite.episodes===review.scheduled_episodes,'Run belongs to another batch, manifest or schedule');
  check(run.benchmark_versions?.harness===review.harness_version&&run.benchmark_versions?.scoring===review.scoring_version,'Mixed harness/scoring versions');
  check(digest(model.harness_sha256)&&model.harness_protocol&&digest(suite.pack_digest),'Missing protocol or pack provenance');
  const identity=[suite.pack_digest,model.harness_sha256,canonical(model.harness_protocol)];if(cohort)check(same(identity,cohort),'Mixed pack or harness protocols');else cohort=identity;
  check(analysis.pack_digest===suite.pack_digest,'Stale validity analysis');
  check(!seen.has(model.model_id),'Duplicate model input');seen.add(model.model_id);
  const agents=analysis.agents?.filter(a=>a.agent===model.model_id);check(agents?.length===1,'Model missing or duplicated in validity analysis');const agent=agents[0];
  check(agent.score===run.metrics.score&&same(agent.ci95,run.metrics.ci95),'Official score/CI disagree with analysis');
  check(Array.isArray(model.resolved_models)&&model.resolved_models.length===1,'A single resolved model identity is required');
  check(typeof run.finished_utc==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(run.finished_utc)&&!Number.isNaN(Date.parse(run.finished_utc)),'Missing completion time');
  const runDate=run.finished_utc.slice(0,10);check(date(runDate),'Invalid completion date');
  check(Number.isSafeInteger(run.refusals?.count)&&run.refusals.count>=0&&run.refusals.count<=review.scheduled_episodes&&number(run.refusals.rate,0,1),'Missing refusal accounting');
  check(Math.abs(run.refusals.rate-run.refusals.count/review.scheduled_episodes)<=.000001,'Refusal count/rate mismatch');
  const ops=entry.accounting;
  keys(ops,['coverage','billing_basis','usd_suite','calls','tokens','wall_time_s'],'full-suite accounting');
  keys(ops.tokens,['input','output'],'accounting tokens');
  check(['full-suite','unavailable'].includes(ops.coverage)&&['reported','unavailable'].includes(ops.billing_basis),'Unsupported accounting coverage');
  if(ops.coverage!=='full-suite')check([ops.usd_suite,ops.calls,ops.tokens.input,ops.tokens.output,ops.wall_time_s].every(v=>v===null),'Partial accounting must not look like suite totals');
  if(ops.billing_basis!=='reported')check(ops.usd_suite===null,'Estimated cost must not be presented as billed cost');
  // Select fields individually: diagnostics, traces, identifiers and private maps never cross.
  models.push({id:model.model_id,name:model.resolved_models[0],official_score:agent.score,ci95:agent.ci95,zero_score_share:agent.zero_score_share,refusal_rate:run.refusals.rate,usd_suite:ops.usd_suite,calls:ops.calls,tokens:{input:ops.tokens.input,output:ops.tokens.output},wall_time_s:ops.wall_time_s,run_date:runDate});
 }
 const order=analysis.models_only?.models;
 if(models.length>1)check(Array.isArray(order)&&order.length===models.length&&new Set(order).size===models.length&&order.every(id=>seen.has(id)),'Paired analysis must cover exactly this model cohort');
 else check(!order||same(order,[models[0].id]),'Unexpected model cohort');
 const ordered=order?order.map(id=>models.find(m=>m.id===id)):models;
 const sourcePairs=analysis.models_only?.adjacent_pairs||[];
 check(sourcePairs.length===ordered.length-1,'Missing adjacent-pair results');
 const adjacent_pairs=sourcePairs.map((pair,index)=>{
  check(pair.higher===ordered[index].id&&pair.lower===ordered[index+1].id&&typeof pair.separated==='boolean','Invalid adjacent-pair order');
  check(Array.isArray(pair.ci95)&&pair.ci95.length===2&&pair.ci95.every(v=>number(v,-100,100))&&pair.ci95[0]<=pair.ci95[1],'Missing paired interval');
  check(pair.separated===(pair.ci95[0]>0||pair.ci95[1]<0),'Ambiguous rounded paired interval; evaluator must provide consistent precision');
  return {model_a:pair.higher,model_b:pair.lower,separates:pair.separated};
 });
 return validateEvaluation({batch_label:BATCH,manifest_hash:review.manifest_hash,harness_version:review.harness_version,scoring_version:review.scoring_version,run_date:ordered.map(m=>m.run_date).sort().at(-1),models:ordered,adjacent_pairs});
}
export async function writeStagedEvaluation(source,out){
 const target=resolve(out),parent=await realpath(dirname(target)),root=await realpath(source);
 check(extname(target)==='.json'&&!inside(repository,target)&&!inside(repository,parent)&&!inside(root,target)&&!inside(root,parent),'Staged output must be outside the source folder and repository');
 const data=await stageEvaluation(source);await writeFile(target,JSON.stringify(data,null,2)+'\n',{flag:'wx'});return data;
}
