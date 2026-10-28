// The emblem is the loading indicator. Never hold content for a brand sequence.
const main = document.getElementById('main');
// Static navigation must work even when a larger results import is delayed.
if(document.querySelector('.site-header'))import('./common.js?v=20261028-production-1').then(({shell})=>shell(null,document.body.dataset.page)).catch(()=>{});
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
