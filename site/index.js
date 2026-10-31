import {shell} from './common.js?v=20261031-unslop-1';
import {mountHeroMotion,mountRibbon} from './hero-motion.js?v=20261031-unslop-1';

shell(null,'company');
const hero=document.querySelector('.company-hero');
const destroyRibbon=mountRibbon(hero),destroyHero=mountHeroMotion(hero);
addEventListener('pagehide',event=>{if(!event.persisted){destroyRibbon();destroyHero?.();}});
