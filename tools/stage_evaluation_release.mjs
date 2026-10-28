import {stageEvaluation,writeStagedEvaluation} from './evaluation/stage.mjs';
const args=process.argv.slice(2);
if(args.length===0||args.includes('--help')){
 console.log('Offline preparation only. No model calls, evaluation runs or automatic publication.\nnode tools/stage_evaluation_release.mjs --source EXTERNAL_FOLDER [--out EXTERNAL_NEW_FILE.json]\nSee docs/production/EVALUATION-RELEASE.md for the private release-review.json contract.');
}else{
 try{
  if(args.length%2||args.some((v,i)=>i%2===0&&!['--source','--out'].includes(v)))throw Error('Expected --source and optional --out');
  const flags=args.filter((_,i)=>i%2===0);
  if(new Set(flags).size!==flags.length)throw Error('Duplicate options are not accepted');
  const options=Object.fromEntries(Array.from({length:args.length/2},(_,i)=>[args[i*2],args[i*2+1]]));
  if(!options['--source'])throw Error('An explicit external source folder is required');
  const data=options['--out']?await writeStagedEvaluation(options['--source'],options['--out']):await stageEvaluation(options['--source']);
  console.log(`Validated ${data.models.length} models for ${data.batch_label}. ${options['--out']?'Wrote the approved-field projection only.':'Check only; no file written.'} Nothing was published.`);
 }catch(error){console.error(`Evaluation release refused: ${error.code?'Source/output unavailable; details withheld':error.message}`);process.exitCode=1;}
}
