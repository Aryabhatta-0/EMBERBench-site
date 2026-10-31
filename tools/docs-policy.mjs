export const groups=[
 ['Start here',[
  ['quickstart','Overview & setup','The open task, public development results and first steps.'],
  ['cli','Command line','Public generation, evaluation, replay and scoring commands.'],
  ['model-interface','Model interface','Observations, actions and the decision-model contract.'],
  ['site-data','Published site data','How this site is generated and what its snapshot establishes.'],
 ]],
 ['The open task',[
  ['simulation-contract','Simulation contract','Movement, collisions, exits and fire semantics.'],
  ['scenario-schema','Scenario schema','Public scenario fields and validation rules.'],
  ['scenario-suite','Public scenarios','The diagnostic scenarios available for training and development.'],
  ['baselines','Reference agents','Public hand-coded agents and planning references.'],
  ['development-generator','Development generator','Open training worlds, separate from the official distribution.'],
 ]],
 ['Evaluation & scoring',[
  ['scoring','EMBER scoring','The full formula, weights, gates, aggregation and failure handling.'],
  ['metrics','Episode metrics','Raw outcomes and authenticated measurements.'],
  ['crowd-diagnostics','Crowd diagnostics','Observed congestion and throughput signals; no crowd score.'],
  ['evaluation','Running evaluations','Public paired schedules, records and result handling.'],
  ['environment-pack','Frozen environments','Public pack identity, digests and matched fire worlds.'],
  ['statistics','Statistical analysis','Intervals, resampling and paired comparisons.'],
  ['v1-fairness-spec','Fairness contract','Model-visible information and simulator fairness.'],
 ]],
 ['Scope & verification',[
  ['evaluation-boundary','Evaluation boundary','What this site publishes, and how it differs from the official test.'],
  ['replay-verification','Replay verification','Public verification rules and safe artifact publication.'],
  ['versioning','Versions & identity','Public contract versions and what they identify.'],
 ]],
];
export const docs=groups.flatMap(([group,items])=>items.map(([id,title,description])=>({id,title,description,group})));
export const upstreamIds=new Set(['cli','model-interface','scoring','metrics','crowd-diagnostics','scenario-suite','evaluation','environment-pack','simulation-contract','v1-fairness-spec','baselines','statistics','scenario-schema']);
export const retired={
 'benchmark-methodology':'evaluation-boundary','scoring-study-results':'evaluation-boundary','archived-validation':'evaluation-boundary',
 'procedural-generation':'development-generator','generator':'development-generator',
 'evaluation-suite-design':'evaluation-boundary','difficulty-calibration':'evaluation-boundary',
 'suite-design-results':'evaluation-boundary','generator-coverage-results':'evaluation-boundary',
 'integrity':'replay-verification','replay-visualization':'replay-verification',
 'release-checklist':'evaluation-boundary','changelog':'versioning',
};
export const constructionTokens=[/\bINITIAL_POOL_SIZE\b/,/\bTOP_UP_BATCH_SIZE\b/,/\bPOOL_CAP\b/,/\bV1_RECIPES\b/,/\bV1_INITIAL_PLAN\b/,/\bV1_TOP_UP\b/,/\bV1_DESIGN\b/,/src\/emberbench\/composition\.py/,/tools\/analyze_suite_design\.py/];

// Upstream contracts stay hash-reviewed. These passages about the private official test are removed before publication;
// a missing target stops the build so an upstream change is reviewed again.
export const publicRedactions={
 evaluation:[
  ['held-out integrity and provenance','integrity and provenance'],
  ['## 3. Public development manifests and private scored manifests','## 3. Public development manifests and scored manifests'],
  ['- **Scored manifests** use high-entropy seeds chosen by the evaluator (for\n  example 64-bit values from `secrets.randbits(64)`). The evaluator keeps the\n  seed schedule outside this repository and publishes the manifest, if at all,\n  only after the evaluation.','- **Scored manifests** use seeds chosen by the evaluator. They are not published here.'],
 ],
 'environment-pack':[
  ['A pack contains the evaluator seeds and, for a held-out generated suite,\nthe private scenarios. It is a **private asset** until the evaluation ends\n(see [integrity.md](integrity.md)). Publish the pack digest first, as a\ncommitment.','A scored pack stays private until its evaluation ends. Publish the pack digest first, as a\ncommitment.'],
 ],
 cli:[[' The private generator seed is not in the freeze record, so it\nis never shown.','']],
};
// Nothing on the site may describe how the private official test is built or what it contains.
export const privateEvaluationTokens=[/secrets\.randbits/i,/held-out generated suite/i,/candidate[- ]pool/i,/top-up recipe/i,/mixture weights/i,/membership threshold/i,/research holdout/i,/b20261028/i,/private (?:policy|recipe|generator seed|distribution|scenarios|assets)\b/i,/evaluator-private (?:famil|distribution|workspace|material)/i,/construction (?:recipe|parameters|metadata)/i,/rotation schedule/i,/adversarial templates/i];
