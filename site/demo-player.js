import worlds from './data/worlds.js';
import demos from './data/demo-index.js';
import {esc} from './common.js';

export const WORLD_NAMES={
  'v1-pub-03-corridor-bottleneck':'The bottleneck',
  'v1-pub-04-unequal-exits':'Two exits',
  'v1-pub-06-threatened-exit':'An exit under threat',
};
const descriptions={
  'v1-pub-03-corridor-bottleneck':'Eight people share one narrow way out. Every blocked move costs time.',
  'v1-pub-04-unequal-exits':'Five people begin at different distances from two exits.',
  'v1-pub-06-threatened-exit':'The nearest exit can burn. A route that is short can become unsafe.',
};
const icon=(type)=>`<svg viewBox="0 0 20 20" aria-hidden="true">${type==='play'?'<path d="m7 4 9 6-9 6z"/>':type==='pause'?'<path d="M7 4v12M13 4v12"/>':type==='arrow'?'<path d="M4 10h12m-5-5 5 5-5 5"/>':'<path d="M4 7a7 7 0 1 1-1 5M4 2v5h5"/>'}</svg>`;
const cache=new Map();

export function worldSVG(world,frame=null){
  const {width,height}=world.grid,size=32;
  const walls=new Set(world.obstacles.map(p=>p.join(',')));
  let cells='';
  for(let row=0;row<height;row++)for(let col=0;col<width;col++)cells+=`<rect x="${col*size+1}" y="${row*size+1}" width="30" height="30" rx="3" class="world-${walls.has(`${row},${col}`)?'wall':'floor'}"/>`;
  const burning=frame?.burning||world.ignitions;
  const fire=burning.map(([r,c])=>`<g class="world-fire" transform="translate(${c*size+16} ${r*size+16})"><rect x="-13" y="-13" width="26" height="26" rx="4"/><path d="M0-8C2-3 6-2 6 3A6 6 0 0 1-6 3c0-3 2-5 3-7L0 0z"/></g>`).join('');
  const exits=world.exits.map(e=>`<g class="world-exit" transform="translate(${e.position[1]*size+16} ${e.position[0]*size+16})"><rect x="-14" y="-14" width="28" height="28" rx="4"/><path d="M${e.position[1]===0?'7 0H-7m5-5-5 5 5 5':'-7 0H7m-5-5 5 5-5 5'}"/></g>`).join('');
  const people=(frame?.people||world.people).filter(p=>!p.status||p.status==='active').map(p=>`<g class="world-person" data-person="${esc(p.id)}" transform="translate(${p.position[1]*size+16} ${p.position[0]*size+16})"><title>${esc(p.id)}</title><circle r="8"/><circle r="2" class="person-center"/></g>`).join('');
  return `<svg viewBox="0 0 ${width*size} ${height*size}" role="img" aria-label="${frame?`Reference replay at step ${frame.step}`:'Initial public layout'}: ${world.people.length} people, ${world.exits.length} exits" class="world-map">${cells}${exits}<g class="world-fire-layer">${fire}</g><g class="world-person-layer">${people}</g></svg>`;
}

export function mountDemo(root,{scenario='v1-pub-03-corridor-bottleneck',chooseWorld=true,onWorldChange,onInspect}={}){
  const motion=matchMedia('(prefers-reduced-motion:reduce)'), abort=new AbortController();
  let world=worlds.find(w=>w.scenario_id===scenario)||worlds[2],animation=null,policyIndex=0,step=0,playing=false,timer=0,generation=0;
  const stop=()=>{playing=false;clearTimeout(timer);const b=root.querySelector('[data-play]');if(b){b.innerHTML=`${icon('play')}<span>${step===animation?.episode_steps?'Replay':'Play example'}</span>`;b.setAttribute('aria-label',step===animation?.episode_steps?'Replay example':'Play example');}};
  const frame=()=>animation?.frames[step]||null;
  const paint=(animate=false)=>{
    const f=frame();
    const diagram=root.querySelector('.demo-diagram');
    const positions=new Map([...diagram.querySelectorAll('[data-person]')].map(el=>[el.dataset.person,el.getAttribute('transform')]));
    diagram.innerHTML=worldSVG(world,f);
    if(animate&&!motion.matches&&window.gsap)diagram.querySelectorAll('[data-person]').forEach(el=>{
      const previous=positions.get(el.dataset.person);if(previous){const old=previous.match(/[-\d.]+/g).map(Number),next=el.getAttribute('transform').match(/[-\d.]+/g).map(Number);window.gsap.fromTo(el,{x:old[0],y:old[1]},{x:next[0],y:next[1],duration:.22,ease:'power2.out'});}
    });
    const evacuated=f?.people.filter(p=>p.status==='evacuated').length||0,dead=f?.people.filter(p=>p.status==='casualty').length||0;
    root.querySelector('[data-active]').textContent=world.people.length-evacuated-dead;
    root.querySelector('[data-evacuated]').textContent=evacuated;
    root.querySelector('[data-casualties]').textContent=dead;
    root.querySelector('[data-step]').textContent=`${step} / ${animation?.episode_steps||'—'}`;
    root.querySelector('[data-scrubber]').value=step;
    root.querySelector('[data-demo-event]').textContent=f?.terminated ? `${evacuated} reached an exit. ${dead} died.${world.people.length-evacuated-dead?` ${world.people.length-evacuated-dead} remained active.`:''}` : step===0?'Press play, then watch the routes and fire change.':f?.evacuations?.length?`${f.evacuations.length} ${f.evacuations.length===1?'person reaches':'people reach'} an exit at this step.`:f?.casualties?.length?`${f.casualties.length} ${f.casualties.length===1?'person is':'people are'} caught by fire.`:f?.congestion?.blocked?.length?'People are waiting for occupied cells to clear.':'The agent chooses another move for every active person.';
  };
  const tick=()=>{if(!playing)return;if(step>=animation.episode_steps){stop();return;}step++;paint(true);timer=setTimeout(tick,430);};
  const load=async()=>{
    stop();animation=null;step=0;const revision=++generation;
    const demo=demos.find(d=>d.id===world.scenario_id);
    const controls=root.querySelector('.demo-controls');
    const sourceRecord=root.querySelector('[data-record-link]');sourceRecord.hidden=true;sourceRecord.removeAttribute('href');
    root.querySelector('[data-world-title]').textContent=WORLD_NAMES[world.scenario_id]||'Public environment';
    root.querySelector('[data-world-copy]').textContent=descriptions[world.scenario_id]||'Initial public environment. Recorded model results are available below.';
    root.querySelector('[data-scenario-link]').href=onInspect?'#ranking-title':`scenarios.html?scenario=${encodeURIComponent(world.scenario_id)}`;
    if(onInspect)root.querySelector('[data-scenario-link]').innerHTML=`View published results ${icon('arrow')}`;
    root.querySelector('[data-policy]').hidden=!demo;
    root.querySelector('[data-demo-note]').textContent=demo?'Illustrative hand-coded reference replay. Independently generated; not a published AI-model run.':'Public scenario, initial state. No replay is available for this example.';
    controls.hidden=!demo;paint();
    if(!demo)return;
    const policy=demo.policies[policyIndex];
    root.querySelector('[data-play]').disabled=true;
    try{
      if(!cache.has(policy.file))cache.set(policy.file,fetch(policy.file).then(r=>{if(!r.ok)throw Error('Replay unavailable');return r.json();}).catch(e=>{cache.delete(policy.file);throw e;}));
      const result=await cache.get(policy.file);if(revision!==generation)return;animation=result;
      root.querySelector('[data-scrubber]').max=animation.episode_steps;
      root.querySelector('[data-record-link]').href=policy.record;
      root.querySelector('[data-record-link]').hidden=false;
      root.querySelector('[data-play]').disabled=false;paint();
    }catch{if(revision===generation){root.querySelector('[data-demo-event]').textContent='The replay could not load. You can still inspect the initial world and published results.';root.querySelector('[data-record-link]').hidden=true;}}
  };
  root.classList.add('demo-stage');
  root.innerHTML=`<div class="demo-toolbar">${chooseWorld?`<div class="demo-worlds" role="group" aria-label="Choose an example world">${demos.map(d=>`<button type="button" data-demo-world="${d.id}" aria-pressed="${d.id===world.scenario_id}">${WORLD_NAMES[d.id]}</button>`).join('')}</div>`:'<span class="demo-world-caption">The public environment</span>'}<label class="demo-policy" data-policy>Reference agent<select aria-label="Reference agent"><option value="0">Shortest path</option><option value="1">Avoid current fire</option></select></label></div><div class="demo-scene"><div class="demo-diagram"></div><div class="demo-readout"><h3 data-world-title></h3><p data-world-copy></p><dl class="demo-counts"><div><dt><i class="active-dot"></i>Active</dt><dd data-active></dd></div><div><dt><i class="safe-dot"></i>Evacuated</dt><dd data-evacuated></dd></div><div><dt><i class="loss-dot"></i>Casualties</dt><dd data-casualties></dd></div></dl><p class="demo-event" data-demo-event role="status" aria-live="off"></p><a class="text-action" data-scenario-link href="scenarios.html">Inspect this scenario ${icon('arrow')}</a></div></div><div class="demo-controls"><button type="button" data-play>${icon('play')}<span>Play example</span></button><button type="button" data-restart aria-label="Restart example">${icon('restart')}</button><label class="demo-timeline">Step <input type="range" data-scrubber min="0" max="1" value="0" aria-label="Replay step"><output data-step>0 / —</output></label></div><div class="demo-provenance"><p data-demo-note></p><a data-record-link hidden download>Download source record</a></div>`;
  root.addEventListener('click',e=>{
    if(e.target.closest('[data-scenario-link]')&&onInspect){e.preventDefault();onInspect();return;}
    const choice=e.target.closest('[data-demo-world]');
    if(choice){world=worlds.find(w=>w.scenario_id===choice.dataset.demoWorld);root.querySelectorAll('[data-demo-world]').forEach(b=>b.setAttribute('aria-pressed',String(b===choice)));onWorldChange?.(world.scenario_id);load();}
    if(e.target.closest('[data-play]')){if(!animation)return;if(playing)stop();else{if(step>=animation.episode_steps)step=0;playing=true;root.querySelector('[data-play]').innerHTML=`${icon('pause')}<span>Pause</span>`;root.querySelector('[data-play]').setAttribute('aria-label','Pause example');tick();}}
    if(e.target.closest('[data-restart]')){stop();step=0;paint();}
  },{signal:abort.signal});
  root.querySelector('select').addEventListener('change',e=>{policyIndex=Number(e.target.value);load();},{signal:abort.signal});
  root.querySelector('[data-scrubber]').addEventListener('input',e=>{stop();step=Number(e.target.value);paint();},{signal:abort.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:abort.signal});
  motion.addEventListener('change',stop,{signal:abort.signal});
  load();
  return {setWorld:id=>{const next=worlds.find(w=>w.scenario_id===id);if(next&&next!==world){world=next;load();}},destroy:()=>{stop();generation++;abort.abort();root.querySelectorAll('.world-person').forEach(el=>window.gsap?.killTweensOf(el));}};
}
