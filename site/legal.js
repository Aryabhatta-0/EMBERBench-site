import {shell} from './common.js?v=20261031-unslop-1';
import {remembersComparisons,saveStorageChoice,clearWebsiteStorage} from './preferences.js?v=20261031-unslop-1';
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
// Contact page: show Copy address only where the clipboard is available.
function bindContact(){
 const copy=document.getElementById('copy-contact-email');
 if(!copy||!navigator.clipboard)return;
 const status=document.querySelector('.contact-action-status');copy.hidden=false;
 copy.onclick=async()=>{try{await navigator.clipboard.writeText(copy.dataset.email);status.textContent='Address copied.';}catch{status.textContent='Copy failed. Select the address above to copy it.';}};
}
bindContact();
document.addEventListener('anantam:articlechange',bindContact);
// Phones: the index is one scrolling row. Each page gets one fixed row position: from the start, scrolled only as far
// as needed to show the current chip, so the bar looks the same every time that page opens.
function showCurrentIndexLink(){
 const index=document.querySelector('.legal-index'),current=index?.querySelector('[aria-current="page"]');
 if(!current||index.scrollWidth<=index.clientWidth)return;
 index.scrollTo({left:Math.max(0,current.offsetLeft+current.offsetWidth+20-index.clientWidth),behavior:'instant'});
}
showCurrentIndexLink();
document.addEventListener('anantam:articlechange',showCurrentIndexLink);
addEventListener('anantam:preferenceschange',()=>{const input=document.getElementById('remember-comparisons');if(input)input.checked=remembersComparisons();});

document.addEventListener('anantam:articlechange',bindPreferences);
