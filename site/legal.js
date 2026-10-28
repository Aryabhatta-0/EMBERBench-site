import {shell} from './common.js?v=20261028-navigation-2';
import {remembersComparisons,saveStorageChoice,clearWebsiteStorage} from './preferences.js?v=20261028-navigation-2';
shell(null,location.pathname.endsWith('/about.html')?'about':'legal');
function bindPreferences(){
 const input=document.getElementById('remember-comparisons'),status=document.getElementById('preference-status');
 if(!input)return;
 input.checked=remembersComparisons();
 status.textContent=input.checked?'Comparison memory is enabled on this device.':'Comparison memory is off. You can enable it for this device.';
 document.getElementById('save-preferences').onclick=()=>{
  const remember=input.checked;
  const ok=saveStorageChoice(remember);
  status.textContent=ok?(remember?'Saved. Comparison memory is enabled on this device.':'Saved. Comparison memory is off; saved model selections were removed.'):'Your browser could not save this choice. Comparisons still work without device memory.';
 };
 document.getElementById('clear-website-data').onclick=()=>{
  const ok=clearWebsiteStorage();input.checked=false;
  status.textContent=ok?'This website’s saved preferences were cleared. Comparison memory is off.':'Your browser blocked access to site storage. You can clear it in your browser’s site-data settings.';
 };
}
bindPreferences();
addEventListener('anantam:preferenceschange',()=>{const input=document.getElementById('remember-comparisons');if(input)input.checked=remembersComparisons();});

// Keep the actual sidebar/header mounted. Normal links still work without JS.
// https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API
const article=document.querySelector('.legal-article'),index=document.querySelector('.legal-index');
if(article&&index){
const cache=new Map([[location.pathname,document.cloneNode(true)]]);
let pending,turn=0;
history.scrollRestoration='manual';
history.replaceState({...history.state,legal:true,y:scrollY},'');
addEventListener('pagehide',()=>{history.scrollRestoration='auto';});
addEventListener('pageshow',()=>{history.scrollRestoration='manual';});
function rememberScroll(){history.replaceState({...history.state,legal:true,y:scrollY},'');}
async function navigate(url,{pop=false,y=0}={}){
 pending?.abort();pending=new AbortController();const request=++turn;
 article.setAttribute('aria-busy','true');
 try{
  let next=cache.get(url.pathname);
  if(!next){
   const response=await fetch(url,{headers:{Accept:'text/html'},signal:pending.signal});
   if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error('Page unavailable');
   next=new DOMParser().parseFromString(await response.text(),'text/html');
   if(!next.querySelector('.legal-article'))throw Error('Not a company page');
   cache.set(url.pathname,next);
  }
  if(request!==turn)return;
  if(!pop){rememberScroll();history.pushState({legal:true,y:0},'',url);}
  article.replaceChildren(...[...next.querySelector('.legal-article').childNodes].map(node=>document.importNode(node,true)));
  document.title=next.title;
  for(const selector of ['meta[name="description"]','meta[name="robots"]','meta[property^="og:"]','meta[name^="twitter:"]','link[rel="canonical"]','link[rel="alternate"]','script[type="application/ld+json"]']){
   document.head.querySelectorAll(selector).forEach(node=>node.remove());
   next.head.querySelectorAll(selector).forEach(node=>document.head.append(document.importNode(node,true)));
  }
  for(const link of index.querySelectorAll('a')){
   if(new URL(link.href).pathname===url.pathname)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  }
  const about=document.querySelector('.site-nav a[href="about.html"]'),isAbout=url.pathname.endsWith('/about.html');
  about.classList.toggle('active',isAbout);if(isAbout)about.setAttribute('aria-current','page');else about.removeAttribute('aria-current');
  bindPreferences();scrollTo({top:y,behavior:'instant'});
  const heading=article.querySelector('h1');heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
 }catch(error){if(error.name!=='AbortError'&&request===turn)location.assign(url.href);}
 finally{if(request===turn)article.removeAttribute('aria-busy');}
}
const companyPaths=new Set([...index.querySelectorAll('a')].map(link=>new URL(link.href).pathname));
document.addEventListener('click',event=>{
 const link=event.target.closest('a[href]');
 if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target||link.hasAttribute('download'))return;
 const url=new URL(link.href);if(url.origin!==location.origin||!companyPaths.has(url.pathname)||url.hash)return;
 event.preventDefault();if(url.pathname===location.pathname)return;
 navigate(url);
});
addEventListener('popstate',event=>{if(event.state?.legal)navigate(new URL(location.href),{pop:true,y:event.state.y||0});});
let scrollFrame;
addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;rememberScroll();});},{passive:true});
}
