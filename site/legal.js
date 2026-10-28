import {shell} from './common.js?v=20261028-production-1';
import {remembersComparisons,saveStorageChoice,clearWebsiteStorage} from './preferences.js?v=20261028-production-1';
shell(null,'legal');
const input=document.getElementById('remember-comparisons'),status=document.getElementById('preference-status');
if(input){
 input.checked=remembersComparisons();
 status.textContent=input.checked?'Comparison memory is enabled on this device.':'Comparison memory is off. You can enable it for this device.';
 document.getElementById('save-preferences').addEventListener('click',()=>{
  const ok=saveStorageChoice(input.checked);
  status.textContent=ok?(input.checked?'Saved. Comparison memory is enabled on this device.':'Saved. Comparison memory is off; saved model selections were removed.'):'Your browser could not save this choice. Comparisons still work without device memory.';
 });
 document.getElementById('clear-website-data').addEventListener('click',()=>{
  const ok=clearWebsiteStorage();input.checked=false;
  status.textContent=ok?'This website’s saved preferences were cleared. Comparison memory is off.':'Your browser blocked access to site storage. You can clear it in your browser’s site-data settings.';
 });
}
