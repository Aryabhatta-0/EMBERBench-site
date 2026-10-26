// A brand ribbon, not an evidence visualization. The supplied emblem stays intact.
export function mountHeroMotion(hero) {
  const gsap=window.gsap, toggle=hero.querySelector('[data-motion-toggle]');
  if(!gsap)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const emblem=hero.querySelector('.hero-emblem');
  let context,flow,entrance,paused=false,inView=true;
  function sync(){
    const running=!paused&&!reduced.matches&&inView&&!document.hidden;
    flow?.paused(!running);entrance?.paused(!running);
    hero.dataset.motion=running?'playing':'paused';
    toggle.textContent=paused?'Play motion':'Pause motion';
    toggle.hidden=reduced.matches;
  }
  function build(){
    context?.revert();flow=null;entrance=null;
    if(!reduced.matches){
      context=gsap.context(()=>{
        entrance=gsap.timeline().from('.ribbon-contour',{strokeDashoffset:1,autoRound:false,duration:1.9,stagger:.12,ease:'power2.inOut'},0)
          .from(emblem,{scale:.82,rotation:-20,duration:1.5,ease:'power3.out'},.15)
          .from('.company-hero h1',{y:20,duration:1.2,ease:'power3.out'},.3);
        flow=gsap.timeline({repeat:-1}).to('.ribbon-current',{strokeDashoffset:-1,autoRound:false,duration:7,ease:'none',stagger:.6},0);
      },hero);
    }
    sync();
  }
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:.05});observer.observe(hero);
  const click=()=>{paused=!paused;sync();};toggle.addEventListener('click',click);
  reduced.addEventListener('change',build);document.addEventListener('visibilitychange',sync);
  build();
  return ()=>{context?.revert();observer.disconnect();toggle.removeEventListener('click',click);reduced.removeEventListener('change',build);document.removeEventListener('visibilitychange',sync);};
}
