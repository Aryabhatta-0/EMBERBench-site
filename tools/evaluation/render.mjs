import {BATCH,validateEvaluation} from './contract.mjs';
import {providerInfo} from '../../site/analytics.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const value=(v,{percent=false,money=false,integer=false}={})=>v===null?'Not reported':percent?`${(v*100).toFixed(2)}%`:money?`$${v.toFixed(4)}`:integer?v.toLocaleString('en-US'):v.toLocaleString('en-US',{maximumFractionDigits:3});
export const EVALUATION_METRICS=[
 {key:'official_score',title:'Official EMBER Score',unit:'Points out of 100',direction:'Higher is better',maximum:100,ci:true},
 {key:'zero_score_share',title:'Zero-score share',unit:'Share of scheduled episodes',direction:'Lower is better',maximum:1,percent:true},
 {key:'refusal_rate',title:'Refusal rate',unit:'Share of scheduled episodes',direction:'Lower is better',maximum:1,percent:true},
 {key:'usd_suite',title:'Cost per suite',unit:'USD for the complete suite',direction:'Lower is better',money:true},
 {key:'calls',title:'Calls per suite',unit:'All attempts, including refusals and retries',direction:'Lower is better',integer:true},
 {key:'tokens',title:'Tokens per suite',unit:'Input plus output tokens',direction:'Lower is better',integer:true},
 {key:'wall_time_s',title:'Wall time per suite',unit:'Seconds across every run segment',direction:'Lower is better'},
];
const get=(model,key)=>key==='tokens'?(model.tokens.input===null||model.tokens.output===null?null:model.tokens.input+model.tokens.output):model[key];
export function evaluationSection(snapshot=null,{download=false}={}){
 if(snapshot===null)return `<section class="evaluation-section evaluation-pending" aria-labelledby="evaluation-title"><h2 id="evaluation-title">Private evaluation</h2><p class="evaluation-intro">No results published yet.</p><p>Batch <code>${BATCH}</code> is awaiting verified model results.</p></section>`;
 const data=validateEvaluation(snapshot);
 const charts=EVALUATION_METRICS.map(metric=>{
  const models=[...data.models].sort((a,b)=>{const av=get(a,metric.key),bv=get(b,metric.key);return av===null?(bv===null?0:1):bv===null?-1:bv-av;});
  const max=metric.maximum||Math.max(1,...models.map(m=>get(m,metric.key)).filter(v=>v!==null));
  return `<section class="evaluation-chart" data-evaluation-metric="${metric.key}" aria-labelledby="evaluation-${metric.key}"><header><h3 id="evaluation-${metric.key}">${metric.title}</h3><p>${metric.unit}. ${metric.direction}. Highest to lowest.</p></header><ol class="evaluation-columns">${models.map(model=>{
   const v=get(model,metric.key),brand=providerInfo({name:model.name,kind:'Decision model'}),tokenNote=metric.key==='tokens'?`<span class="evaluation-detail">Input ${value(model.tokens.input,{integer:true})}<br>Output ${value(model.tokens.output,{integer:true})}</span>`:'';
   const ci=metric.ci?`<span class="evaluation-ci" style="--ci-low:${model.ci95[0]/max};--ci-high:${model.ci95[1]/max}" aria-hidden="true"></span>`:'';
   return `<li class="evaluation-column" data-value="${v??''}" style="--value:${v===null?0:v/max};--evaluation-brand:${brand.color}"><div class="evaluation-well" aria-hidden="true">${v===null?'':`<span class="evaluation-bar"></span>${ci}`}</div><strong>${value(v,metric)}</strong>${metric.ci?`<span class="evaluation-detail">95% CI ${value(model.ci95[0])}–${value(model.ci95[1])}</span>`:''}<span class="evaluation-model">${brand.logo?`<img src="assets/providers/${esc(brand.logo)}" width="20" height="20" alt="${esc(brand.name)}" loading="lazy">`:''}<span>${esc(model.name)}</span></span>${tokenNote}${metric.ci?`<span class="evaluation-detail">Run date ${model.run_date}</span>`:''}</li>`;
  }).join('')}</ol></section>`;
 }).join('');
 const byId=new Map(data.models.map(m=>[m.id,m.name]));
 return `<section class="evaluation-section" aria-labelledby="evaluation-title"><header class="evaluation-heading"><h2 id="evaluation-title">Private evaluation</h2><p class="evaluation-intro">One matched batch. Official scores, uncertainty and complete-suite usage.</p><dl class="evaluation-meta"><div><dt>Batch</dt><dd>${data.batch_label}</dd></div><div><dt>Latest run date</dt><dd>${data.run_date}</dd></div><div><dt>Harness</dt><dd>${data.harness_version}</dd></div><div><dt>Scoring</dt><dd>${data.scoring_version}</dd></div><div class="evaluation-manifest"><dt>Manifest hash</dt><dd><code>${data.manifest_hash}</code></dd></div></dl></header>${charts}<section class="evaluation-pairs" aria-labelledby="evaluation-pairs-title"><h3 id="evaluation-pairs-title">Do adjacent models separate?</h3><p>Paired, family-stratified bootstrap at 95% confidence. This is evaluated directly; overlap between individual score intervals does not answer it.</p>${data.adjacent_pairs.length?`<ul>${data.adjacent_pairs.map(pair=>`<li><span>${esc(byId.get(pair.model_a))} / ${esc(byId.get(pair.model_b))}</span><strong>${pair.separates?'Difference detected':'Not resolved'}</strong></li>`).join('')}</ul>`:'<p>At least two evaluated models are needed for an adjacent-pair comparison.</p>'}</section>${download?'<p class="evaluation-download"><a href="data/evaluation.json">Download aggregate results</a></p>':''}</section>`;
}
