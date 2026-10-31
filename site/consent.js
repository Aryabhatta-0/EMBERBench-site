import {storageChoice,saveStorageChoice} from './preferences.js?v=20261031-dawn-3';

// First-visit, non-modal choice. No optional memory is written before consent.
// Storage practices: docs/legal/cookies.md. No analytics or advertising cookies.
const root=document.body.dataset.root|| (location.pathname.includes('/docs/')?'../':location.pathname.endsWith('/404.html')?'/':'');
let notice,sizing,dismissed=false;
function removeNotice(){notice?.remove();notice=null;sizing?.disconnect();document.documentElement.style.removeProperty('--cookie-notice-space');}
function sync(){
 if(storageChoice()!==null){removeNotice();return;}
 if(notice?.isConnected||dismissed)return;
 notice=document.createElement('section');notice.className='cookie-notice';
 notice.setAttribute('aria-labelledby','cookie-notice-title');
 notice.innerHTML=`<h2 id="cookie-notice-title">Cookies & preferences</h2><p>We don’t use advertising or analytics cookies. Allow this device to remember your model comparisons?</p><div class="cookie-actions"><button type="button" class="button" data-cookie-choice="accept">Accept optional</button><button type="button" class="button" data-cookie-choice="reject">Reject optional</button><a href="${root}cookies.html">Preferences</a></div><p class="cookie-status" role="status" hidden></p>`;
 notice.addEventListener('click',event=>{
  const button=event.target.closest('[data-cookie-choice]');if(!button)return;
  const current=notice;
  if(saveStorageChoice(button.dataset.cookieChoice==='accept'))removeNotice();
  else{
   const status=current.querySelector('.cookie-status');status.hidden=false;
   status.textContent='Your browser blocks storage. Optional memory remains off.';
   if(!current.querySelector('[data-dismiss-cookie]')){
    const close=document.createElement('button');close.type='button';close.className='button';close.dataset.dismissCookie='';close.textContent='Continue without saving';
    close.onclick=()=>{dismissed=true;removeNotice();};current.querySelector('.cookie-actions').append(close);
   }
  }
 });
 document.body.append(notice);
 sizing=new ResizeObserver(()=>{if(notice?.isConnected)document.documentElement.style.setProperty('--cookie-notice-space',`${Math.ceil(innerHeight-notice.getBoundingClientRect().top+16)}px`);});
 sizing.observe(notice);
}
sync();
addEventListener('anantam:preferenceschange',sync);
addEventListener('storage',event=>{if(event.key==='anantam-preferences'||event.key===null)sync();});
// A bottom notice must not cover a keyboard user's next focused control.
document.addEventListener('focusin',event=>{
 // Keyboard focus only: scrolling during a pointer press moves the target away and the tap is lost.
 if(!notice?.isConnected||notice.contains(event.target)||!(event.target instanceof HTMLElement)||!event.target.matches(':focus-visible'))return;
 const rect=event.target.getBoundingClientRect(),panel=notice.getBoundingClientRect();
 if(rect.bottom>panel.top-12&&rect.right>panel.left&&rect.left<panel.right)event.target.scrollIntoView({block:'center',behavior:'instant'});
});
