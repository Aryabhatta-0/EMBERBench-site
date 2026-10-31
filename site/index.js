import {shell} from './common.js?v=20261031-dawn-3';
import {mountHeroMotion} from './hero-motion.js?v=20261031-dawn-3';

shell(null,'company');
const destroyHero=mountHeroMotion(document.querySelector('.company-hero'));
addEventListener('pagehide',event=>{if(!event.persisted)destroyHero();});

// A soft light follows a fine pointer across each founder arch.
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  for(const card of document.querySelectorAll('.founder-card')){
    card.addEventListener('pointermove',event=>{
      const box=card.getBoundingClientRect();
      card.style.setProperty('--mx',`${event.clientX-box.left}px`);
      card.style.setProperty('--my',`${event.clientY-box.top}px`);
    });
  }
}
