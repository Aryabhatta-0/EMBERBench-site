import worlds from './data/preview-worlds.js';
import {esc} from './common.js';

const copy = [
  {label:'Bottleneck',title:'Eight people. One way out.',description:'Fire closes in. Every route shares the same corridor.',name:'Narrow corridor bottleneck'},
  {label:'Two exits',title:'Two exits. Which route is safer?',description:'Five people, two exits, and a fire spreading from below.',name:'Multiple exits, unequal distance'},
];

function map(world) {
  const size=32, {width,height}=world.grid, blocked=new Set(world.obstacles.map(p=>p.join(',')));
  const cell=(row,column,kind)=>`<rect x="${column*size+1}" y="${row*size+1}" width="30" height="30" rx="3" class="map-${kind}"/>`;
  const floor=Array.from({length:height},(_,r)=>Array.from({length:width},(_,c)=>cell(r,c,blocked.has(`${r},${c}`)?'wall':'floor')).join('')).join('');
  const people=world.people.map(p=>`<circle cx="${p.position[1]*size+16}" cy="${p.position[0]*size+16}" r="7" class="map-person"/>`).join('');
  const exits=world.exits.map(e=>{const x=e.position[1]*size,y=e.position[0]*size;return `<rect x="${x+2}" y="${y+2}" width="28" height="28" rx="4" class="map-exit"/><path class="exit-arrow" d="M${x+8} ${y+16}h14m-5-5 5 5-5 5"/>`;}).join('');
  const fire=world.ignitions.map(([r,c])=>{const x=c*size+16,y=r*size+16;return `<g class="map-fire"><circle cx="${x}" cy="${y}" r="13" class="fire-halo"/><path d="M${x} ${y-13}c2 7 8 9 8 15a8 8 0 0 1-16 0c0-4 3-6 4-9l4 5z"/></g>`;}).join('');
  const route=world.scenario_id.includes('bottleneck') ? '<path class="map-route" d="M176 112H464"/>' : '';
  return `<svg class="evacuation-map" role="img" viewBox="0 0 ${width*size} ${height*size}" aria-label="Initial public scenario: ${world.people.length} people, ${world.exits.length} exits and ${world.ignitions.length} fire source. This is not a model replay.">${floor}${route}${exits}${people}${fire}</svg>`;
}

export function setupWorldPreview(showcase,onChange) {
  const panel=showcase.querySelector('[data-panel="environment"]');
  const figure=panel.querySelector('figure');
  const chooser=document.createElement('div');
  chooser.className='world-choices';chooser.setAttribute('role','group');chooser.setAttribute('aria-label','Preview a public world');
  chooser.innerHTML=copy.map((item,i)=>`<button type="button" data-world="${i}" aria-pressed="${i===0}">${esc(item.label)}</button>`).join('');
  figure.before(chooser);
  const legend=document.createElement('div');legend.className='map-key';legend.setAttribute('aria-hidden','true');
  legend.innerHTML='<span><i class="person-key"></i>People</span><span><i class="fire-key"></i>Fire</span><span><i class="exit-key"></i>Exit</span>';
  figure.append(legend);
  chooser.addEventListener('click',event=>{
    const button=event.target.closest('[data-world]');
    if (!button || button.getAttribute('aria-pressed')==='true') return;
    const index=Number(button.dataset.world),world=worlds[index],text=copy[index];
    chooser.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    panel.querySelector('h3').textContent=text.title;
    panel.querySelector('.panel-copy p').textContent=text.description;
    figure.querySelector('svg').outerHTML=map(world);
    figure.querySelector('figcaption span').textContent=text.name;
    panel.querySelector('.panel-link').href=`scenarios.html?scenario=${encodeURIComponent(world.scenario_id)}`;
    onChange(event.detail===0);
  });
}
