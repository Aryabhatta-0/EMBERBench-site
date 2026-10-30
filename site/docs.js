// Enhancement only: every guide and link is already present in static HTML.
const root=document.body.dataset.root||'';
const menu=document.querySelector('.nav-toggle'),nav=document.querySelector('#site-nav');
// While the phone menu covers the screen, the page behind it leaves the tab order and accessibility tree.
const syncMenuInert=()=>{const sheet=nav.classList.contains('open')&&getComputedStyle(nav).position==='fixed';for(const el of document.body.children){if(el.matches('.site-header,.skip-link,script'))continue;if(sheet&&!el.inert){el.inert=true;el.dataset.menuInert='';}else if(!sheet&&'menuInert' in el.dataset){el.inert=false;delete el.dataset.menuInert;}}};
const toggle=expanded=>{menu.setAttribute('aria-expanded',String(expanded));menu.textContent=expanded?'Close':'Menu';nav.classList.toggle('open',expanded);syncMenuInert();};
menu.addEventListener('click',()=>toggle(menu.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){toggle(false);menu.focus();}});
nav.addEventListener('click',e=>{if(e.target.closest('a'))toggle(false);});
const header=document.querySelector('.site-header');
// The dimmed backdrop is the header's ::after, so a tap on it targets the header itself.
header.addEventListener('click',e=>{if(e.target===header&&menu.getAttribute('aria-expanded')==='true')toggle(false);});
new ResizeObserver(()=>{const height=Math.ceil(header.getBoundingClientRect().height);document.documentElement.style.setProperty('--header-offset',`${height+14}px`);document.documentElement.style.setProperty('--site-header-height',`${height}px`);syncMenuInert();}).observe(header);
if(matchMedia('(max-width:760px)').matches){document.querySelector('.docs-navigation').open=false;const toc=document.querySelector('.docs-toc details');if(toc)toc.open=false;}
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const input=document.querySelector('#docs-search'),clear=document.querySelector('#clear-docs-search'),status=document.querySelector('#docs-search-status'),results=document.querySelector('.docs-search-results'),content=document.querySelector('.docs-page-content');
let indexPromise,request=0;
document.querySelector('.docs-search').addEventListener('submit',e=>e.preventDefault());
async function search(){
 const turn=++request,query=input.value.trim().toLowerCase();clear.hidden=!query;
 if(!query){results.hidden=true;content.hidden=false;document.querySelector('.docs-toc')?.removeAttribute('hidden');status.textContent='';document.querySelectorAll('[data-doc-id],.docs-nav-group').forEach(el=>el.hidden=false);return;}
 status.textContent='Searching guides…';
 try{
  indexPromise??=fetch(root+'docs/search-index.json').then(r=>{if(!r.ok)throw new Error('Search unavailable');return r.json();}).catch(e=>{indexPromise=null;throw e;});
  const index=await indexPromise;if(turn!==request)return;
  const terms=query.split(/\s+/),matches=index.filter(d=>terms.every(t=>(d.title+' '+d.description+' '+d.text).toLowerCase().includes(t)));
  matches.sort((a,b)=>Number(b.title.toLowerCase().includes(query))-Number(a.title.toLowerCase().includes(query)));
  status.textContent=`${matches.length} ${matches.length===1?'guide':'guides'} found`;
  const ids=new Set(matches.map(d=>d.id));document.querySelectorAll('[data-doc-id]').forEach(a=>a.hidden=!ids.has(a.dataset.docId));
  document.querySelectorAll('.docs-nav-group').forEach(g=>g.hidden=![...g.querySelectorAll('a')].some(a=>!a.hidden));
  results.innerHTML=`<h1>Search results</h1>${matches.length?`<ul>${matches.map(d=>{const at=d.text.toLowerCase().indexOf(terms[0]),start=Math.max(0,at-65),snippet=d.text.slice(start,start+210);return `<li><a href="${root}docs/${d.id}.html">${escape(d.title)}</a><p>${start?'…':''}${escape(snippet)}${d.text.length>start+210?'…':''}</p></li>`;}).join('')}</ul>`:'<p>No guides match this search. Try “scoring”, “model interface” or “evaluation”.</p>'}`;
  results.hidden=false;content.hidden=true;document.querySelector('.docs-toc')?.setAttribute('hidden','');
 }catch{if(turn!==request)return;status.textContent='Search is unavailable. Browse the guides below.';}
}
input.addEventListener('input',search);clear.addEventListener('click',()=>{input.value='';search();input.focus();});
for(const pre of document.querySelectorAll('.docs-article pre')){
 const code=pre.querySelector('code');if(!code)continue;
 const button=document.createElement('button');button.type='button';button.className='docs-code-copy';button.textContent='Copy code';button.setAttribute('aria-live','polite');
 pre.prepend(button);button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code.textContent);button.textContent='Copied';}catch{button.textContent='Select code to copy';}setTimeout(()=>button.textContent='Copy code',1800);});
}
