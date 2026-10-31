// Dawn hero: CSS owns the sunrise; this adds lamp-ember motes and pauses everything offscreen.
export function mountHeroMotion(hero) {
  const canvas=hero.querySelector('.dawn-motes'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),abort=new AbortController();
  let context=null,visible=true,frame=0,previous=0,width=0,height=0,motes=[],sprite=null,disposed=false;
  try{context=canvas?.getContext('2d',{alpha:true})??null;}catch{}
  let seed=310526;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  function spawn(mote,anywhere){
    mote.x=random()*width;mote.y=height*(anywhere?.18+random()*.7:.62+random()*.3);
    mote.speed=7+random()*11;mote.sway=6+random()*14;mote.phase=random()*Math.PI*2;
    mote.size=1.6+random()*3.2;mote.peak=.28+random()*.5;mote.age=anywhere?random():0;mote.life=7+random()*9;
    return mote;
  }
  function makeSprite(){
    sprite=document.createElement('canvas');sprite.width=sprite.height=32;
    const s=sprite.getContext('2d'),g=s.createRadialGradient(16,16,0,16,16,16);
    g.addColorStop(0,'rgba(255,246,222,1)');g.addColorStop(.28,'rgba(236,178,92,.9)');g.addColorStop(1,'rgba(217,162,76,0)');
    s.fillStyle=g;s.fillRect(0,0,32,32);
  }
  function resize(){
    const box=hero.getBoundingClientRect(),density=Math.min(devicePixelRatio||1,2);width=box.width;height=box.height;
    canvas.width=Math.round(width*density);canvas.height=Math.round(height*density);context.setTransform(density,0,0,density,0,0);
    const count=width<=700?26:46;
    while(motes.length<count)motes.push(spawn({},true));
    motes.length=count;
  }
  function paint(){
    context.clearRect(0,0,width,height);
    for(const m of motes){
      const t=m.age,y=m.y-m.speed*t*m.life,x=m.x+Math.sin(m.phase+t*5)*m.sway,alpha=Math.sin(Math.min(1,t)*Math.PI)*m.peak;
      context.globalAlpha=alpha;context.drawImage(sprite,x-m.size,y-m.size,m.size*2,m.size*2);
    }
    context.globalAlpha=1;
  }
  const tick=now=>{
    if(disposed)return;
    const step=previous?Math.min((now-previous)/1000,.05):0;previous=now;
    for(const m of motes){m.age+=step/m.life;if(m.age>=1)spawn(m,false);}
    paint();frame=requestAnimationFrame(tick);
  };
  function sync(){
    cancelAnimationFrame(frame);frame=0;previous=0;
    const active=visible&&!document.hidden;
    hero.dataset.animationVisible=String(active);
    hero.dataset.motion=reduced.matches?'reduced':active?'playing':'paused';
    if(!context)return;
    canvas.hidden=reduced.matches;
    if(!reduced.matches&&active)frame=requestAnimationFrame(tick);
  }
  if(context){makeSprite();resize();}
  const sizing=new ResizeObserver(()=>{if(!context)return;const b=hero.getBoundingClientRect();if(Math.abs(b.width-width)>.5||Math.abs(b.height-height)>.5){resize();paint();}});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.02});
  sizing.observe(hero);observer.observe(hero);
  reduced.addEventListener('change',sync,{signal:abort.signal});document.addEventListener('visibilitychange',sync,{signal:abort.signal});
  sync();
  return ()=>{disposed=true;cancelAnimationFrame(frame);abort.abort();sizing.disconnect();observer.disconnect();};
}
