import {shell} from './common.js?v=20261028-reading-3';
import {mountHeroMotion} from './hero-motion.js?v=20261028-reading-3';

shell(null,'company');
const destroyHero=mountHeroMotion(document.querySelector('.company-hero'));
addEventListener('pagehide',event=>{if(!event.persisted)destroyHero?.();});
