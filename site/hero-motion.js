// A brand ribbon, not an evidence visualization. The supplied emblem stays intact.
export function mountHeroMotion(hero) {
  const gsap=window.gsap, toggle=hero.querySelector('[data-motion-toggle]');
  if(!gsap)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
  const ribbon=hero.querySelector('.brand-ribbon'),emblem=hero.querySelector('.hero-emblem');
  let context,flow,entrance,paused=false,inView=true,bounds=hero.getBoundingClientRect(),xTo,yTo,rotateTo;
  const clamp=gsap.utils.clamp(-1,1),mapX=gsap.utils.mapRange(-1,1,-16,16),mapY=gsap.utils.mapRange(-1,1,-9,9);
  function sync(){
    const running=!paused&&!reduced.matches&&inView&&!document.hidden;
    flow?.paused(!running);entrance?.paused(!running);
    hero.dataset.motion=running?'playing':'paused';
    toggle.textContent=paused?'Play motion':'Pause motion';
    toggle.hidden=reduced.matches;
  }
  function build(){
    context?.revert();flow=null;entrance=null;xTo=null;yTo=null;rotateTo=null;
    if(!reduced.matches){
      context=gsap.context(()=>{
        xTo=gsap.quickTo(ribbon,'x',{duration:.8,ease:'power3.out'});
        yTo=gsap.quickTo(ribbon,'y',{duration:.8,ease:'power3.out'});
        rotateTo=gsap.quickTo(emblem,'rotation',{duration:.7,ease:'power3.out'});
        entrance=gsap.timeline().from('.ribbon-contour',{strokeDashoffset:1,autoRound:false,duration:1.9,stagger:.12,ease:'power2.inOut'},0)
          .from(emblem,{scale:.82,rotation:-20,duration:1.5,ease:'power3.out'},.15)
          .from('.company-hero h1',{y:20,duration:1.2,ease:'power3.out'},.3);
        flow=gsap.timeline({repeat:-1}).to('.ribbon-current',{strokeDashoffset:-1,autoRound:false,duration:7,ease:'none',stagger:.6},0);
      },hero);
    }
    sync();
  }
  function move(e){if(!fine.matches||reduced.matches||paused)return;
    const x=clamp((e.clientX-bounds.left)/bounds.width*2-1),y=clamp((e.clientY-bounds.top)/bounds.height*2-1);
    xTo(mapX(x));yTo(mapY(y));rotateTo(x*7);
  }
  const reset=()=>{xTo?.(0);yTo?.(0);rotateTo?.(0);};
  const resize=new ResizeObserver(()=>{bounds=hero.getBoundingClientRect();});resize.observe(hero);
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:.05});observer.observe(hero);
  const refreshBounds=()=>{bounds=hero.getBoundingClientRect();};
  hero.addEventListener('pointerenter',refreshBounds);hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',reset);
  const click=()=>{paused=!paused;reset();sync();};toggle.addEventListener('click',click);
  reduced.addEventListener('change',build);document.addEventListener('visibilitychange',sync);
  build();
  return ()=>{context?.revert();resize.disconnect();observer.disconnect();hero.removeEventListener('pointerenter',refreshBounds);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);toggle.removeEventListener('click',click);reduced.removeEventListener('change',build);document.removeEventListener('visibilitychange',sync);};
}
