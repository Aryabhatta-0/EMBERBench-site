// Encode the supplied artwork for small on-screen marks; do not generate new art.
import {chromium} from 'playwright';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const map=JSON.parse(await readFile('tools/asset-map.json','utf8').catch(()=>'{"fonts":{}}'));
const original=await readFile('site/assets/anantam-logo.png'),browser=await chromium.launch();
try{
 const page=await browser.newPage();
 for(const [role,size,type] of [['mark',480,'image/webp'],['favicon',48,'image/png'],['touch',180,'image/png']]){
  const data=await page.evaluate(async({base64,size,type})=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const c=document.createElement('canvas');c.width=c.height=size;c.getContext('2d').drawImage(image,0,0,size,size);return c.toDataURL(type,.9).split(',')[1];},{base64:original.toString('base64'),size,type});
  const bytes=Buffer.from(data,'base64'),hash=createHash('sha256').update(bytes).digest('hex').slice(0,12),path=`assets/anantam-${role}.${hash}.${type==='image/webp'?'webp':'png'}`;
  await writeFile('site/'+path,bytes);map[role]=path;console.log(role,original.length,'→',bytes.length);
 }
}finally{await browser.close();}
await writeFile('tools/asset-map.json',JSON.stringify(map,null,2)+'\n');
