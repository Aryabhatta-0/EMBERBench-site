// Optional device memory is disabled until the visitor saves an explicit choice.
const choiceKey='anantam-preferences',selectionKey='ember-compare';
let visitSelection=[];
export function storageChoice(){try{const choice=localStorage.getItem(choiceKey);return ['remember-comparisons','off'].includes(choice)?choice:null;}catch{return null;}}
export function remembersComparisons(){try{return localStorage.getItem(choiceKey)==='remember-comparisons';}catch{return false;}}
export function readComparisonSelection(){
 if(!remembersComparisons())return visitSelection;
 try{const value=JSON.parse(localStorage.getItem(selectionKey)||'[]');return Array.isArray(value)?value.filter(v=>typeof v==='string').slice(0,4):[];}catch{return visitSelection;}
}
export function saveComparisonSelection(ids){
 visitSelection=[...new Set(ids)].filter(v=>typeof v==='string').slice(0,4);
 try{if(remembersComparisons())localStorage.setItem(selectionKey,JSON.stringify(visitSelection));else localStorage.removeItem(selectionKey);}catch{/* A blocked store does not block comparison. */}
}
export function saveStorageChoice(remember){
 try{
  localStorage.setItem(choiceKey,remember?'remember-comparisons':'off');
  if(remember&&visitSelection.length)localStorage.setItem(selectionKey,JSON.stringify(visitSelection));
  if(!remember)localStorage.removeItem(selectionKey);
  window.dispatchEvent(new Event('anantam:preferenceschange'));
  return true;
 }catch{return false;}
}
export function clearWebsiteStorage(){
 visitSelection=[];
 try{for(const key of [choiceKey,selectionKey,'ember-theme'])localStorage.removeItem(key);window.dispatchEvent(new Event('anantam:preferenceschange'));return true;}catch{return false;}
}
