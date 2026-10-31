// Render the site's actual typography and supplied emblem as a social preview.
import {chromium} from 'playwright';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const assets=JSON.parse(await readFile('tools/asset-map.json','utf8')),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const embed=async path=>(await readFile('site/'+path)).toString('base64');
 const [sans,serif,logo]=await Promise.all([embed(assets.fonts['dm-sans']),embed(assets.fonts['instrument-serif']),embed(assets.mark)]);
 await page.setContent(`<style>@font-face{font-family:DM;src:url(data:font/woff2;base64,${sans})}@font-face{font-family:Instrument;src:url(data:font/woff2;base64,${serif})}*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#142e51;background:radial-gradient(ellipse at 100% 100%,#cbdcf0,transparent 65%),radial-gradient(ellipse at 0 100%,#f3eee4,transparent 65%),#faf3e8;font-family:DM}img{width:120px;height:120px}h1{font:128px/.95 Instrument;margin:12px 0 20px;letter-spacing:-.03em}p{font-size:25px;margin:0}small{font-size:18px;margin-top:40px;color:#445671}</style><img src="data:image/webp;base64,${logo}" alt=""><h1>Anantam</h1><p>Boundless Possibilities</p><small>Introducing EMBERBench</small>`);
 await page.evaluate(()=>document.fonts.ready);const bytes=await page.screenshot({type:'jpeg',quality:88}),hash=createHash('sha256').update(bytes).digest('hex').slice(0,12),path=`assets/anantam-social.${hash}.jpg`;
 await writeFile('site/'+path,bytes);assets.social=path;await writeFile('tools/asset-map.json',JSON.stringify(assets,null,2)+'\n');console.log(path,bytes.length);
}finally{await browser.close();}
