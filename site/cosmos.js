// A forward journey through space, clipped to the supplied emblem's alpha.
// The original image remains the no-JS, reduced-motion and canvas fallback.
export function animateCosmos(root) {
  const canvas = root?.querySelector('canvas');
  const toggle = root?.parentElement.querySelector('.cosmos-toggle');
  if (!canvas || !toggle || !CSS.supports('mask-image', 'url("assets/anantam-logo.png")')) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  // One fixed field, one vanishing point, one camera velocity. No wandering
  // or randomly changing direction: nearer stars pass faster and leave trails.
  const stars = Array.from({length:480}, () => ({x:Math.random()*2-1, y:Math.random()*2-1, z:.12+Math.random()*1.6, size:.35+Math.random()*.45}));
  let paused = false, visible = false, frame = 0, previous = 0, size = 405;
  const listeners = new AbortController();
  const resize = () => {
    size = root.getBoundingClientRect().width;
    const density = Math.min(devicePixelRatio || 1, 2);
    canvas.width = canvas.height = Math.round(size * density);
    ctx.setTransform(density,0,0,density,0,0);
    paint(0);
  };
  const paint = dt => {
    // Transparent overlay keeps the supplied artwork and its palette intact.
    ctx.clearRect(0,0,size,size);
    for (const star of stars) {
      star.z -= dt*.22;
      if (star.z <= .12) star.z += 1.6;
      const x = size*(.5+star.x*.36/star.z), y = size*(.46+star.y*.36/star.z);
      if (x<0 || y<0 || x>size || y>size) continue;
      const tailX = size*(.5+star.x*.36/(star.z+.055));
      const tailY = size*(.46+star.y*.36/(star.z+.055));
      const opacity = Math.min(.8,(1.72-star.z)*2,(star.z-.12)*5);
      const radius = Math.min(1.15,star.size/star.z)*size/405;
      const trail = ctx.createLinearGradient(tailX,tailY,x,y);
      trail.addColorStop(0,'rgba(150,191,240,0)');
      trail.addColorStop(1,`rgba(204,225,255,${opacity*.65})`);
      ctx.strokeStyle = trail; ctx.lineWidth = Math.max(.45,radius*.9);
      ctx.beginPath(); ctx.moveTo(tailX,tailY); ctx.lineTo(x,y); ctx.stroke();
      ctx.fillStyle = `rgba(220,233,255,${opacity})`;
      ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fill();
    }
  };
  const tick = now => {
    frame = requestAnimationFrame(tick);
    if (previous && now-previous<1000/30) return;
    paint(previous ? Math.min((now-previous)/1000,.08) : 0);
    previous = now;
  };
  const sync = () => {
    cancelAnimationFrame(frame); frame = 0; previous = 0;
    canvas.hidden = preference.matches;
    toggle.hidden = preference.matches;
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    root.dataset.motion = preference.matches ? 'reduced' : paused ? 'paused' : visible && !document.hidden ? 'running' : 'idle';
    if (!preference.matches && !paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  };
  toggle.addEventListener('click', () => { paused = !paused; sync(); }, {signal:listeners.signal});
  preference.addEventListener('change',sync, {signal:listeners.signal});
  document.addEventListener('visibilitychange',sync, {signal:listeners.signal});
  const sizing = new ResizeObserver(resize);
  const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, {threshold:.05});
  sizing.observe(root); visibility.observe(root);
  resize(); sync();
  return () => { cancelAnimationFrame(frame); listeners.abort(); sizing.disconnect(); visibility.disconnect(); };
}
