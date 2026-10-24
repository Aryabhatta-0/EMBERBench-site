// The emblem is the loading indicator. Never hold content for a brand sequence.
const main = document.getElementById('main');
if (main && document.body.dataset.page === 'index') {
  main.innerHTML = `<section class="loading-shell" aria-label="Loading Anantam"><div class="loading-center"><div class="cosmos-emblem loading-emblem"><img src="assets/anantam-logo.png" width="1254" height="1254" alt="Anantam’s infinity emblem" fetchpriority="high"><canvas class="cosmos-sky" aria-hidden="true" hidden></canvas></div><h1 class="loading-name">Anantam</h1><p class="loading-copy" role="status">Opening Anantam.</p><div class="loading-actions"><button class="cosmos-toggle" type="button" hidden>Pause motion</button><button class="button loading-retry" type="button" hidden>Reload page</button></div></div></section>`;
}
if (main?.querySelector('.loading-shell')) {
  const shell = main.querySelector('.loading-shell');
  let stopMotion;
  main.setAttribute('aria-busy','true');
  import('./cosmos.js').then(({animateCosmos}) => {
    if (shell.isConnected) stopMotion = animateCosmos(shell.querySelector('.cosmos-emblem'));
  }).catch(() => { /* The supplied still emblem remains available. */ });
  const timer = setTimeout(() => {
    const status = main.querySelector('.loading-copy');
    if (status) status.textContent = 'This is taking longer than usual. You can reload to try again.';
    const retry = main.querySelector('.loading-retry');
    if (retry) retry.hidden = false;
  }, 8000);
  main.querySelector('.loading-retry')?.addEventListener('click', () => location.reload());
  const observer = new MutationObserver(() => {
    if (!shell.isConnected) { clearTimeout(timer); stopMotion?.(); main.removeAttribute('aria-busy'); observer.disconnect(); }
  });
  observer.observe(main, {childList:true});
}
