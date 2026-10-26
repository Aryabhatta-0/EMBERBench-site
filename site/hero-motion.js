// Fine decorative dust; one batched Canvas sequence, then a static field.
function particleField(count) {
  let seed=271027;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const normal=()=>Math.sqrt(-2*Math.log(Math.max(random(),.000001)))*Math.cos(2*Math.PI*random());
  const points=[];
  while(points.length<count){
    const side=points.length%2,y=.5+normal()*.24,x=(side?.87:.13)+normal()*.105+.035*Math.sin(y*6+(side?2:0));
    if(x<-.02||x>1.02||y<.025||y>.975||(x>.31&&x<.69&&y>.17&&y<.87))continue;
    points.push({x,y,r:.35+random()*.4,phase:random()*Math.PI*2,travel:12+random()*18,bucket:Math.floor(random()*5)});
  }
  return points;
}

export function mountHeroMotion(hero) {
  const canvas=hero.querySelector('.particle-canvas');
  let context;
  try{context=canvas?.getContext('2d',{alpha:true});}catch{/* Static SVG remains available. */}
  if(!context){hero.dataset.motion='static';return;}
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const duration=4000,abort=new AbortController();
  let width=0,height=0,points=[],frame=0,start=null,lastPaint=0,progress=0,settled=false,disposed=false;
  let ink=getComputedStyle(hero).getPropertyValue('--particle-ink').trim();
  const paint=p=>{
    context.clearRect(0,0,width,height);
    const remaining=(1-p)**3;
    context.fillStyle=ink;
    for(let bucket=0;bucket<5;bucket++){
      context.globalAlpha=(.16+bucket*.065)*(.72+.28*p);context.beginPath();
      for(const point of points){
        if(point.bucket!==bucket)continue;
        const x=point.x*width+Math.cos(point.phase+p*1.8)*point.travel*remaining;
        const y=point.y*height+Math.sin(point.phase+p*1.2)*point.travel*remaining;
        context.moveTo(x+point.r,y);context.arc(x,y,point.r,0,Math.PI*2);
      }
      context.fill();
    }
    context.globalAlpha=1;
  };
  const settle=()=>{cancelAnimationFrame(frame);frame=0;settled=true;progress=1;paint(1);hero.dataset.motion=reduced.matches?'reduced':'complete';};
  const resize=()=>{
    const box=hero.getBoundingClientRect(),density=Math.min(devicePixelRatio||1,1.5);
    width=box.width;height=box.height;canvas.width=Math.round(width*density);canvas.height=Math.round(height*density);
    context.setTransform(density,0,0,density,0,0);ink=getComputedStyle(hero).getPropertyValue('--particle-ink').trim();
    points=particleField(width<=700?360:1100);canvas.dataset.particles=String(points.length);paint(progress);
    if(start!==null&&!settled)settle();
  };
  const tick=now=>{
    if(disposed||settled)return;
    if(start===null)start=now;
    progress=Math.min(1,(now-start)/duration);
    if(progress===1){settle();return;}
    if(now-lastPaint>=1000/30){paint(progress);lastPaint=now;}
    frame=requestAnimationFrame(tick);
  };
  const preference=()=>settle();
  const visibility=()=>{if(document.hidden)settle();};
  const sizing=new ResizeObserver(()=>{const box=hero.getBoundingClientRect();if(Math.abs(box.width-width)>.5||Math.abs(box.height-height)>.5)resize();});
  const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)settle();},{threshold:.05});
  resize();canvas.hidden=false;hero.classList.add('particles-ready');
  if(reduced.matches||document.hidden)settle();
  else{hero.dataset.motion='playing';frame=requestAnimationFrame(tick);}
  sizing.observe(hero);observer.observe(hero);
  reduced.addEventListener('change',preference,{signal:abort.signal});document.addEventListener('visibilitychange',visibility,{signal:abort.signal});
  return ()=>{disposed=true;cancelAnimationFrame(frame);abort.abort();sizing.disconnect();observer.disconnect();};
}
