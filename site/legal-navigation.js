// Small dependency-free navigation binds at interactive, before deferred modules.
// The classic head script installs this listener before company links can paint.
(()=>{
function mountReadingNavigation(){
// Keep the actual sidebar/header mounted. Normal links still work without JS.
// https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API
const article=document.querySelector('.legal-article'),index=document.querySelector('.legal-index');
if(!article||!index)return;
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
  document.dispatchEvent(new Event('anantam:articlechange'));scrollTo({top:y,behavior:'instant'});
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
if(document.readyState==='loading'){
 const ready=()=>{if(document.readyState!=='loading'){document.removeEventListener('readystatechange',ready);mountReadingNavigation();}};
 document.addEventListener('readystatechange',ready);
}else mountReadingNavigation();
})();
