import {evaluatedModelName} from '../site/common.js';
import {providerInfo} from '../site/analytics.js';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const original=await readFile(new URL('../site/data/results.js',import.meta.url),'utf8');
const sourceHash=createHash('sha256').update(original.replace(/\r\n/g,'\n')).digest('hex');
const policy=JSON.parse(await readFile(new URL('./site-publication-policy.json',import.meta.url),'utf8'));
assert.equal(sourceHash,policy.snapshotSha256,'Machine-readable results require the reviewed public snapshot');
// Parse the generated JSON payload as data, never execute a data artifact.
const payload=original.replace(/^\/\/[^\n]*\n/,'').trim();
assert(payload.startsWith('export default '));
const source=JSON.parse(payload.slice('export default '.length).replace(/;$/,''));
export const publicScenarioNames=[...new Set(source.models.flatMap(m=>m.scenarios.map(s=>s.name)))].sort();
export const publicResults={
 schema_version:'1.0',name:'EMBERBench public-development results',url:'https://anantam-labs.vercel.app/benchmark.html',
 scope:'Public development; not official hidden-test results',
 limitations:['Models may train or tune on this public environment.','One trial per model; no statistically significant winner is established.','EMBER is a family-balanced composite out of 100, not a survival percentage.','This is simulated research, not guidance for an actual evacuation.','No evaluation timestamp is recorded in the source snapshot.'],
 scoring_version:source.scoring_version,world_count:source.world_count,
 source:{url:'https://anantam-labs.vercel.app/data/results.js',sha256:sourceHash},
 methodology:'https://anantam-labs.vercel.app/methodology.html',
 rank_note:'published_rank preserves the original source snapshot rank. Charts order the displayed series highest to lowest; that does not redefine scientific ranks.',
 models:source.models.map(m=>({id:m.id,name:evaluatedModelName(m),kind:m.kind,provider:providerInfo(m).name,published_rank:m.rank,ember_score:m.score,confidence_interval:m.ci,safety:m.safety,execution_quality:m.quality,trials:m.totals.trials,
  people:{evacuated:m.totals.evacuated,avoidable_deaths:m.totals.avoidable_casualties,avoidable_stranded:m.totals.avoidable_stranded,unavoidable_losses:m.totals.unavoidable_losses??null},
  profile_url:`https://anantam-labs.vercel.app/model.html?id=${encodeURIComponent(m.id)}`})),
};
