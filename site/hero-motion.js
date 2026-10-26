// A brand ribbon, not an evidence visualization. The supplied emblem stays intact.
export function mountHeroMotion(hero) {
  const gsap=window.gsap;
  if(!gsap)return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const emblem=hero.querySelector('.hero-emblem');
  let context,flow,entrance,inView=true;
  function sync(){
    const running=!reduced.matches&&inView&&!document.hidden;
    flow?.paused(!running);entrance?.paused(!running);
    hero.dataset.motion=flow?.progress()===1?'complete':running?'playing':'paused';
  }
  function build(){
    context?.revert();flow=null;entrance=null;
    if(!reduced.matches){
      context=gsap.context(()=>{
        entrance=gsap.timeline().from('.ribbon-contour',{strokeDashoffset:1,autoRound:false,duration:1.9,stagger:.12,ease:'power2.inOut'},0)
          .from(emblem,{scale:.82,rotation:-20,duration:1.5,ease:'power3.out'},.15)
          .from('.company-hero h1',{y:20,duration:1.2,ease:'power3.out'},.3);
        flow=gsap.timeline({onComplete:()=>{hero.dataset.motion='complete';}}).to('.ribbon-current',{strokeDashoffset:-1,autoRound:false,duration:3.8,ease:'power1.inOut',stagger:.35},0);
      },hero);
    }
    sync();
  }
  const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;sync();},{threshold:.05});observer.observe(hero);
  reduced.addEventListener('change',build);document.addEventListener('visibilitychange',sync);
  build();
  return ()=>{context?.revert();observer.disconnect();reduced.removeEventListener('change',build);document.removeEventListener('visibilitychange',sync);};
}
