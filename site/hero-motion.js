// Fine decorative dust in a continuous, slow upward current.
function particleField(count) {
  let seed=271027;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const normal=()=>Math.sqrt(-2*Math.log(Math.max(random(),.000001)))*Math.cos(2*Math.PI*random());
  const points=[];
  while(points.length<count){
    const side=points.length%2,y=.5+normal()*.24,x=(side?.87:.13)+normal()*.105+.035*Math.sin(y*6+(side?2:0));
    if(x<-.02||x>1.02||y<.025||y>.975||(x>.31&&x<.69&&y>.17&&y<.87))continue;
    points.push({x,y,r:.55+random()*.55,phase:random()*Math.PI*2,speed:12+random()*14,bucket:Math.floor(random()*5)});
  }
  return points;
}

export function mountHeroMotion(hero) {
  const canvas=hero.querySelector('.particle-canvas');
  let context;
  try{context=canvas?.getContext('2d',{alpha:true});}catch{/* Static SVG remains available. */}
  if(!context){hero.dataset.motion='static';return;}
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const abort=new AbortController();
  let width=0,height=0,points=[],frame=0,previous=0,lastPaint=0,elapsed=0,visible=true,disposed=false;
  let ink=getComputedStyle(hero).getPropertyValue('--particle-ink').trim();
  const paint=time=>{
    context.clearRect(0,0,width,height);
    context.fillStyle=ink;
    for(let bucket=0;bucket<5;bucket++){
      context.globalAlpha=.28+bucket*.095;context.beginPath();
      for(const point of points){
        if(point.bucket!==bucket)continue;
        const x=point.x*width+Math.sin(point.phase+time*.45)*18;
        const span=height+80;
        const y=((point.y*height-time*point.speed+40)%span+span)%span-40;
        if(Math.abs(x-width*.5)<width*(width<=700?.29:.21))continue;
        context.moveTo(x+point.r,y);context.arc(x,y,point.r,0,Math.PI*2);
      }
      context.fill();
    }
    context.globalAlpha=1;
  };
  const resize=()=>{
    const box=hero.getBoundingClientRect(),density=Math.min(devicePixelRatio||1,1.5);
    width=box.width;height=box.height;canvas.width=Math.round(width*density);canvas.height=Math.round(height*density);
    context.setTransform(density,0,0,density,0,0);ink=getComputedStyle(hero).getPropertyValue('--particle-ink').trim();
    points=particleField(width<=700?360:1100);canvas.dataset.particles=String(points.length);paint(elapsed);
  };
  const tick=now=>{
    if(disposed)return;
    if(previous)elapsed+=Math.min((now-previous)/1000,.08);
    previous=now;
    if(now-lastPaint>=1000/30){paint(elapsed);lastPaint=now;}
    frame=requestAnimationFrame(tick);
  };
  const sync=()=>{
    cancelAnimationFrame(frame);frame=0;previous=0;
    if(reduced.matches){paint(0);hero.dataset.motion='reduced';}
    else if(document.hidden||!visible)hero.dataset.motion='paused';
    else{hero.dataset.motion='playing';frame=requestAnimationFrame(tick);}
  };
  const sizing=new ResizeObserver(()=>{const box=hero.getBoundingClientRect();if(Math.abs(box.width-width)>.5||Math.abs(box.height-height)>.5)resize();});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.05});
  resize();canvas.hidden=false;hero.classList.add('particles-ready');
  sync();
  sizing.observe(hero);observer.observe(hero);
  reduced.addEventListener('change',sync,{signal:abort.signal});document.addEventListener('visibilitychange',sync,{signal:abort.signal});
  return ()=>{disposed=true;cancelAnimationFrame(frame);abort.abort();sizing.disconnect();observer.disconnect();};
}
