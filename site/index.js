import {shell} from './common.js?v=20261028-production-1';
import {mountHeroMotion} from './hero-motion.js?v=20261028-production-1';

shell(null,'company');
const destroyHero=mountHeroMotion(document.querySelector('.company-hero'));
addEventListener('pagehide',event=>{if(!event.persisted)destroyHero?.();});
