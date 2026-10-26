// Particles assemble into the supplied emblem's actual alpha silhouette.
export function mountHeroMotion(hero) {
  const canvas=hero.querySelector('.particle-canvas'),image=hero.querySelector('.hero-emblem');
  let context;
  try{context=canvas?.getContext('2d',{alpha:true});}catch{}
  if(!context){hero.dataset.motion='static';return;}
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),abort=new AbortController();
  let width=0,height=0,points=[],frame=0,previous=0,lastPaint=0,elapsed=0,visible=true,disposed=false,ready=false;
  const ink=getComputedStyle(hero).getPropertyValue('--particle-ink').trim();
  function particles(){
    const sample=document.createElement('canvas');sample.width=sample.height=220;
    const sampler=sample.getContext('2d',{willReadFrequently:true});sampler.drawImage(image,0,0,220,220);
    const pixels=sampler.getImageData(0,0,220,220).data,targets=[];
    for(let y=1;y<220;y+=2)for(let x=1;x<220;x+=2){const p=(y*220+x)*4;if(pixels[p+3]>100&&pixels[p]+pixels[p+1]+pixels[p+2]<650)targets.push({x:x/220,y:y/220});}
    if(!targets.length)throw new Error('Emblem silhouette unavailable');
    let seed=271027;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const box=hero.getBoundingClientRect(),mark=image.getBoundingClientRect(),cx=mark.x-box.x+mark.width/2,cy=mark.y-box.y+mark.height/2;
    const short=height<400,rx=short?mark.width*1.3:Math.min(width*.4,480),ry=short?mark.height:Math.min(150,height*.19);
    const count=Math.min(width<=700?1000:1800,targets.length);points=[];
    for(let i=0;i<count;i++){
      const target=targets[Math.floor(i*targets.length/count)],angle=random()*Math.PI*2,distance=.35+random()*.65;
      points.push({tx:mark.x-box.x+target.x*mark.width,ty:mark.y-box.y+target.y*mark.height,
        sx:cx+Math.cos(angle)*rx*distance,sy:Math.max(10,cy+Math.sin(angle)*(Math.sin(angle)>0?mark.height*.42:ry)*distance),
        delay:random()*.35,bend:(random()-.5)*24,r:.52+random()*.18,bucket:Math.floor(random()*4)});
    }
    canvas.dataset.particles=String(points.length);
  }
  function paint(time){
    let amount=Math.min(1,time/3);
    if(reduced.matches)amount=1;
    hero.dataset.particlePhase=amount===1?'assembled':'assembling';
    context.clearRect(0,0,width,height);context.fillStyle=ink;
    for(let bucket=0;bucket<4;bucket++){
      context.globalAlpha=.62+bucket*.12;context.beginPath();
      for(const p of points){if(p.bucket!==bucket)continue;
        const raw=Math.max(0,Math.min(1,(amount-p.delay*.22)/(1-p.delay*.22))),mix=1-(1-raw)**3;
        const x=p.sx+(p.tx-p.sx)*mix,y=p.sy+(p.ty-p.sy)*mix-Math.sin(mix*Math.PI)*p.bend;
        context.moveTo(x+p.r,y);context.arc(x,y,p.r,0,Math.PI*2);
      }
      context.fill();
    }
    context.globalAlpha=1;
  }
  function resize(){
    if(!ready)return;
    const box=hero.getBoundingClientRect(),density=Math.min(devicePixelRatio||1,1.5);width=box.width;height=box.height;
    canvas.width=Math.round(width*density);canvas.height=Math.round(height*density);context.setTransform(density,0,0,density,0,0);
    particles();paint(elapsed);
  }
  const tick=now=>{if(disposed)return;if(previous)elapsed+=Math.min((now-previous)/1000,.08);previous=now;if(elapsed>=3){elapsed=3;paint(3);frame=0;hero.dataset.motion='complete';return;}if(now-lastPaint>=1000/30){paint(elapsed);lastPaint=now;}frame=requestAnimationFrame(tick);};
  function sync(){
    cancelAnimationFrame(frame);frame=0;previous=0;hero.dataset.animationVisible=String(!document.hidden&&visible);if(!ready)return;
    if(reduced.matches){elapsed=3;paint(3);hero.dataset.motion='reduced';}
    else if(elapsed>=3){paint(3);hero.dataset.motion='complete';}
    else if(document.hidden||!visible)hero.dataset.motion='paused';
    else{hero.dataset.motion='playing';frame=requestAnimationFrame(tick);}
  }
  function start(){
    if(ready||disposed)return;
    try{ready=true;resize();canvas.hidden=false;hero.classList.add('particles-ready');sync();}
    catch{ready=false;canvas.hidden=true;hero.classList.remove('particles-ready');hero.dataset.motion='static';}
  }
  const sizing=new ResizeObserver(()=>{const b=hero.getBoundingClientRect();if(Math.abs(b.width-width)>.5||Math.abs(b.height-height)>.5)resize();});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{threshold:.05});
  sizing.observe(hero);observer.observe(hero);
  reduced.addEventListener('change',sync,{signal:abort.signal});document.addEventListener('visibilitychange',sync,{signal:abort.signal});
  if(image.complete&&image.naturalWidth)start();else image.addEventListener('load',start,{once:true,signal:abort.signal});
  return ()=>{disposed=true;cancelAnimationFrame(frame);abort.abort();sizing.disconnect();observer.disconnect();};
}
