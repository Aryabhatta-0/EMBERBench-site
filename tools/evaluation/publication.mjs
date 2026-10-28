import {readFile,lstat,realpath} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {BATCH,ARTIFACT,check,keys,digest,validateEvaluation} from './contract.mjs';
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function readApprovedEvaluation(root,policyPath=new URL('../evaluation-publication.json',import.meta.url)){
 const policy=JSON.parse(await readFile(policyPath,'utf8'));
 keys(policy,['batch_label','artifact','sha256'],'publication policy');
 check(policy.batch_label===BATCH&&policy.artifact===ARTIFACT,'Unexpected evaluation publication policy');
 const target=resolve(root,ARTIFACT);let info;
 try{info=await lstat(target);}catch(error){if(error.code!=='ENOENT')throw error;}
 if(policy.sha256===null){check(!info,'Unreviewed evaluation artifact cannot be published');return null;}
 check(digest(policy.sha256)&&info?.isFile()&&!info.isSymbolicLink(),'Missing or unsafe approved evaluation artifact');
 const base=await realpath(root),canonical=await realpath(target);
 check(!relative(base,canonical).startsWith('..'+sep)&&canonical.startsWith(base+sep),'Evaluation artifact escaped publication root');
 check(info.size<=1024*1024,'Evaluation export exceeds size limit');
 const bytes=await readFile(target);check(sha256(bytes)===policy.sha256,'Approved evaluation digest mismatch');
 return validateEvaluation(JSON.parse(bytes.toString('utf8')));
}
