// No artificial delay: the skeleton disappears as soon as real content is ready.
const main = document.getElementById('main');
if (main?.querySelector('.loading-shell')) {
  main.setAttribute('aria-busy','true');
  const timer = setTimeout(() => {
    const status = main.querySelector('.loading-copy');
    if (status) status.textContent = 'This is taking longer than usual. You can reload to try again.';
    const retry = main.querySelector('.loading-retry');
    if (retry) retry.hidden = false;
  }, 8000);
  main.querySelector('.loading-retry')?.addEventListener('click', () => location.reload());
  const observer = new MutationObserver(() => {
    if (!main.querySelector('.loading-shell')) { clearTimeout(timer); main.removeAttribute('aria-busy'); observer.disconnect(); }
  });
  observer.observe(main, {childList:true});
}
