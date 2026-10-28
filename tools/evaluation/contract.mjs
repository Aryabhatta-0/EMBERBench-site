// Public aggregate contract. Unknown fields fail closed at every public level.
export const BATCH='b20261028a';
export const ARTIFACT='data/evaluation.json';
export const METHOD='paired-family-stratified-bootstrap';
export function check(condition,message){if(!condition)throw new Error(message);}
export function keys(value,names,label){check(value&&typeof value==='object'&&!Array.isArray(value),`${label}: object required`);check(Object.keys(value).sort().join('|')===[...names].sort().join('|'),`${label}: unexpected or missing fields`);}
export const finite=value=>typeof value==='number'&&Number.isFinite(value);
export const number=(value,low,high)=>finite(value)&&value>=low&&value<=high;
export const digest=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
export const date=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
export const id=value=>typeof value==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/.test(value);
const version=value=>typeof value==='string'&&/^\d+\.\d+(?:\.\d+)?$/.test(value);
const optional=(value,integer=false)=>value===null||(number(value,0,Number.MAX_SAFE_INTEGER)&&(!integer||Number.isSafeInteger(value)));
export function validateEvaluation(data){
 keys(data,['batch_label','manifest_hash','harness_version','scoring_version','run_date','models','adjacent_pairs'],'release');
 check(data.batch_label===BATCH,'Unapproved evaluation batch');
 check(digest(data.manifest_hash),'Invalid manifest hash');
 check(version(data.harness_version)&&version(data.scoring_version),'Invalid harness/scoring versions');
 check(date(data.run_date),'Invalid run date');
 check(Array.isArray(data.models)&&data.models.length>0&&data.models.length<=100,'Expected 1–100 models');
 const ids=new Set();let previous=Infinity;
 for(const model of data.models){
  keys(model,['id','name','official_score','ci95','zero_score_share','refusal_rate','usd_suite','calls','tokens','wall_time_s','run_date'],'model');
  check(id(model.id)&&!ids.has(model.id),'Invalid or duplicate model ID');ids.add(model.id);
  check(typeof model.name==='string'&&/^[a-z0-9][a-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.:+-]{0,127}$/.test(model.name),'Expected a resolved provider/model name');
  check(number(model.official_score,0,100)&&model.official_score<=previous,'Scores must be finite, highest to lowest');previous=model.official_score;
  check(Array.isArray(model.ci95)&&model.ci95.length===2&&model.ci95.every(v=>number(v,0,100))&&model.ci95[0]<=model.ci95[1],'Invalid 95% CI');
  check(number(model.zero_score_share,0,1)&&number(model.refusal_rate,0,1),'Invalid failure/refusal share');
  check(model.zero_score_share+.0001>=model.refusal_rate,'Refusals must remain scored zero');
  check(optional(model.usd_suite)&&optional(model.calls,true)&&optional(model.wall_time_s),'Invalid operational metric');
  keys(model.tokens,['input','output'],'tokens');check(optional(model.tokens.input,true)&&optional(model.tokens.output,true),'Invalid token count');
  check(model.tokens.input===null||model.tokens.output===null||Number.isSafeInteger(model.tokens.input+model.tokens.output),'Total token count exceeds safe integer precision');
  check(date(model.run_date)&&model.run_date<=data.run_date,'Invalid model run date');
 }
 check(new Set(data.models.map(m=>m.name)).size===data.models.length,'Duplicate resolved model');
 check(data.run_date===data.models.map(m=>m.run_date).sort().at(-1),'Run date must be the latest completed model date');
 check(Array.isArray(data.adjacent_pairs)&&data.adjacent_pairs.length===data.models.length-1,'Every adjacent pair requires a result');
 data.adjacent_pairs.forEach((pair,index)=>{
  keys(pair,['model_a','model_b','separates'],'adjacent pair');
  check(pair.model_a===data.models[index].id&&pair.model_b===data.models[index+1].id&&typeof pair.separates==='boolean','Invalid adjacent model pair');
 });
 return data;
}
