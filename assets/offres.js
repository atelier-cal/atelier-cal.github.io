(() => {
  'use strict';
  const dialog = document.getElementById('cal-promo-dialog');
  const select = document.getElementById('offre-modele');
  const models = {pastille:'Bronze Pastille', perle:'Bronze Perle 15 mm'};
  if (select) {
    const requested = new URLSearchParams(location.search).get('modele');
    if (Object.hasOwn(models, requested)) select.value = models[requested];
    document.querySelectorAll('[data-offer-model]').forEach(link => {
      link.addEventListener('click', () => {
        const chosen = link.dataset.offerModel;
        if (Object.hasOwn(models, chosen)) select.value = models[chosen];
      });
    });
  }
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const sessionKey = 'atelier-cal-bronze-offers-2026-v2';
  let shown = false;
  let timer;
  let previousFocus;
  const hasSeen = () => {
    try { return sessionStorage.getItem(sessionKey) === 'shown'; }
    catch (_) { return false; }
  };
  const isBusy = () => document.hidden ||
    document.querySelector('.cal-consent:not([hidden]), dialog[open], .viewer-overlay.open, details[open]') ||
    document.activeElement?.matches('input, textarea, select, [contenteditable="true"]');
  const show = () => {
    if (shown || hasSeen()) return;
    if (isBusy()) { timer = setTimeout(show, 2000); return; }
    previousFocus = document.activeElement;
    dialog.showModal();
    document.documentElement.classList.add('cal-promo-open');
    shown = true;
    try { sessionStorage.setItem(sessionKey, 'shown'); } catch (_) {}
    dialog.querySelector('[data-promo-close]').focus({preventScroll:true});
  };
  const close = () => dialog.close();
  dialog.querySelector('[data-promo-close]').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('cal-promo-open');
    if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({preventScroll:true});
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  if (!document.body.hasAttribute('data-offers-page') && !location.hash.includes('devis') && !hasSeen()) {
    timer = setTimeout(show, 5000);
  }
  window.addEventListener('pagehide', () => clearTimeout(timer));
})();
